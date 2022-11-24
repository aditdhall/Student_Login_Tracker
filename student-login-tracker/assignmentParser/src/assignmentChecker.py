import mysql.connector
import logging
import time
import os
import paramiko
import json

def generate_ssh_conn():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(os.getenv("SOLACE_IP"), username=os.getenv("SOLACE_USERNAME", "root"), password=os.getenv("SOLACE_PASSWORD", "RITTigers123."))
    return ssh

# Returns array formatted as [fileSize, lineCount, done?]
def query_assignment(username, assignmentPath):
    ssh = generate_ssh_conn()

    results = []

    ssh_stdin, ssh_stdout, ssh_stderr = ssh.exec_command("du -sm /home/" + username + "/" + assignmentPath.strip("/"))

    results.append(ssh_stdout.read().split()[0])

    ssh_stdin, ssh_stdout, ssh_stderr = ssh.exec_command("cloc --json --quiet --sum-one /home/" + username + "/" + assignmentPath.strip("/"))

    results.append(json.loads("".join(ssh_stdout.readlines()))["SUM"]["code"])

    ssh_stdin, ssh_stdout, ssh_stderr = ssh.exec_command("ls /home/" + username + "/" + assignmentPath.strip("/"))

    if ssh_stdout.read():
        results.append(True)
    else:
        results.append(False)

    ssh.close()
    return results
    
dbconn = False

# Wait for the DB to connect
while not dbconn:
    try:
        dB = mysql.connector.connect(
            host=os.getenv("DB_HOST", "mysql"),
            port=int(os.getenv("DB_PORT", "3306")),
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD", "iste501team"),
            database=os.getenv("DB_DATABASE", "StudentLoginTracker")
        )
        dbconn = True
    except:
        logging.warning("DB not up yet")
        time.sleep(5) 


mycursor = dB.cursor()

while True:
    # Getting the usernames and student id from the database
    mycursor.execute("SELECT student.Id, user.username FROM user "+
                    "JOIN student ON student.UserId = user.Id")
    user = mycursor.fetchall()

    if user:
        # y[0] is studentID, y[1] is username
        for a in user:
            sid = a[0]
            username = a[1]
            
            # Getting all the course id in which the student is enrolled
            mycursor.execute("SELECT courseId FROM studentCourse "+
                            "WHERE StudentId = %s", (sid,))
            course = mycursor.fetchall()
            
            if course:
                for b in course:
                    cid = b[0]
                    
                    # Getting the assignments id and path for assignments
                    mycursor.execute("SELECT assignmentPath, Id FROM assignment "+
                                    "WHERE courseId = %s", (cid,))
                    assignmentInfo = mycursor.fetchall()
                    
                    if assignmentInfo:
                        for c in assignmentInfo:
                            submissionInfo = query_assignment(username, c[0])
                            
                            mycursor.execute("SELECT Id FROM assignmentSubmission WHERE studentId=%s AND assignmentId=%s AND doneTime IS NULL", (sid, c[1]))

                            if mycursor.fetchall():
                                if submissionInfo[2]:
                                    mycursor.execute("UPDATE assignmentSubmission SET fileSize=%s, lineCount=%s, doneTime=NOW() WHERE studentId=%s AND assignmentId=%s", (submissionInfo[0], submissionInfo[1], sid, c[1]))
                                else:
                                    mycursor.execute("UPDATE assignmentSubmission SET fileSize=%s, lineCount=%s WHERE studentId=%s AND assignmentId=%s", (submissionInfo[0], submissionInfo[1], sid, c[1]))

                                dB.commit()  
    # Runs every 31 minutes                            
    time.sleep(1860)
