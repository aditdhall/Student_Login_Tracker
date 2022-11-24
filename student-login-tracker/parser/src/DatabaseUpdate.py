from datetime import datetime
import logging
import os
import re
import time

import mysql.connector

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

def line_split(l):
        chunk = l.split(' ')
        return(chunk)

while True:
        file = open('/log/auth.log')
        for line in file:
                success = 0
                data = line.split(' ')
                matchAccept = re.search("sshd\[[0-9]*\]\: Accepted password*",line) 
                matchFailed = re.search("sshd\[[0-9]*\]\: Failed*",line)
                if matchAccept:
                        success = 1
                if data[3] =='testsolace' and (matchAccept or matchFailed):
                        mycursor.execute("SELECT student.Id FROM user JOIN student ON student.UserId = user.Id WHERE user.Username LIKE '" + data[8] + "';")
                        user = mycursor.fetchall()
                        if user != []:
                                id = user[0][0]
                                sid = str(id)
                                loginTime = datetime.strptime(data[0] + " " + data[1] + " 2022 " + data[2], "%b %d %Y %H:%M:%S")
                                mycursor.execute("SELECT UserId, LoginTime FROM loginAttempt WHERE UserId = " + sid + ";")
                                logAttempt = mycursor.fetchall()
                                alreadyEx = 0
                                if logAttempt == []:
                                        print('not empty')
                                        sql = "INSERT INTO loginAttempt (UserId, LoginTime, Success, Msg) VALUES (%s, %s, %s, %s)" 
                                        val = (sid, loginTime, success, line)
                                        mycursor.execute(sql,val)
                                        dB.commit()     
                                else:
                                        for y in logAttempt:
                                                if y[1] == loginTime:
                                                        alreadyEx = 1
                                                        print('exists')
                                        if alreadyEx == 0:
                                               sql = "INSERT INTO loginAttempt (UserId, LoginTime, Success, Msg) VALUES (%s, %s, %s, %s)" 
                                               val = (sid, loginTime, success, line)
                                               mycursor.execute(sql,val)
                                               dB.commit()                               
        file.close()
        time.sleep(5)         
