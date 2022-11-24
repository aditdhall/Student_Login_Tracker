from datetime import datetime, timedelta
from pickletools import int4
from tabnanny import check
from typing import List, Union
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .userRoles import *
import logging
import mysql.connector
import os
import random
import requests
import string
import time

# Time for a session to expire in hours
EXPIRY_TIME = 4

# TODO: Move sessionTokens to query parameters for all endpoints and make the model classes match the DB exactly
class User(BaseModel):
    users: list
    sessionToken: str

class Course(BaseModel):
    courses: list
    sessionToken: str
    username: str

class Courses(BaseModel):
    name: str
    section: str
    semester: str
    professor: str

class StudentCourse(BaseModel):
    studentCourses: list
    sessionToken: str

class Assignment(BaseModel):
    Id: Union[int, None] = None
    assignmentName: str
    assignmentPath: str
    startTime: Union[str, datetime]
    endTime: Union[str, datetime]
    courseId: int

class AssignmentSubmission(BaseModel):
    Id: int
    fileSize: float
    lineCount: int
    doneTime: Union[datetime, None]
    studentId: int
    assignmentId: int

app = FastAPI()

origins = [
    "http://" + os.getenv("FRONTEND_HOST", "localhost"),
    "https://" + os.getenv("FRONTEND_HOST", "localhost")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

def generate_db():
    try:
        return mysql.connector.connect(
            host=os.getenv("DB_HOST", "mysql"),
            port=int(os.getenv("DB_PORT", "3306")),
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD", "iste501team"),
            database=os.getenv("DB_DATABASE", "StudentLoginTracker")
        )
    except:
        raise HTTPException(status_code=503, detail="DB not up yet.")

# Reusable function to generate new session expiry dates
def generate_expiry_date():
    # Seems to be adding double the expected time??
    exp = datetime.now() + timedelta(hours=EXPIRY_TIME)
    return exp.strftime('%Y-%m-%d %H:%M:%S')

# Refreshes the specified session's expiration date. Should be run after every authenticated API call
def refresh_session(sessionToken):
    db = generate_db()

    cursor = db.cursor()

    cursor.execute("UPDATE sessionKey SET expiration=%s WHERE authKey=%s", (generate_expiry_date(), sessionToken,))
    db.commit()
    cursor.close()
    db.close()

# Raises an HTTPException 403 Forbidden if the sessionToken is invalid optionally for specific role(s)
# Otherwise return a list with the User's ID in the first index and their role constant in the second index
def check_session(sessionToken, userRole=[]):
    db = generate_db()

    cursor = db.cursor()

    cursor.execute("SELECT expiration, userRole, UserId FROM sessionKey WHERE authKey=%s ORDER BY expiration DESC", (sessionToken,))

    sessionKey = cursor.fetchall()

    if not sessionKey or datetime.now() > sessionKey[0][0] or (sessionKey[0][1] not in userRole and userRole != []):
        cursor.close()
        db.close()
        logging.info("Failing there")
        raise HTTPException(status_code=403, detail="Forbidden")
    
    cursor.close()
    db.close()
    return [sessionKey[0][2], sessionKey[0][1]]

@app.get("/auth")
async def read_auth(authCode: str):
    db = generate_db()

    response = requests.post("https://oauth2.googleapis.com/token", data={
        "code": authCode,
        "client_id": "353611842605-13fs4mq0qla4hd9mn3cu62d9ls85kh8u.apps.googleusercontent.com",
        "client_secret": "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",
        "redirect_uri": "http://" + os.getenv("FRONTEND_HOST", "localhost") + "/loginSuccess.html",
        "grant_type": "authorization_code"
    })

    googleResponse = response.json()

    logging.info(googleResponse)

    response = requests.get("https://www.googleapis.com/oauth2/v3/userinfo", params={
        "access_token": googleResponse["access_token"]
    })

    username = response.json()["email"].split("@")[0]

    cursor = db.cursor()

    cursor.execute("SELECT Id from user WHERE Username=%s", (username,))

    result = cursor.fetchall()

    if not result:
        cursor.close()
        db.close()
        raise HTTPException(status_code=401, detail="User does not exist")

    UserID = result[0][0]
    UserRole = ""

    # Check to see what role the user has
    cursor.execute("SELECT * FROM student WHERE UserId=%s", (UserID,))

    if cursor.fetchall():
        UserRole = STUD
    else:
        cursor.execute("SELECT * FROM professor WHERE UserId=%s", (UserID,))

        if cursor.fetchall():
            UserRole = PROF
        else:
            cursor.execute("SELECT * FROM systemAdmin WHERE UserId=%s", (UserID,))

            if cursor.fetchall():
                UserRole = SYS
            else:
                cursor.close()
                db.close
                raise HTTPException(status_code=401, detail="User exists but is not assigned a role")

    # Solution from https://stackoverflow.com/questions/2257441/random-string-generation-with-upper-case-letters-and-digits
    sessionToken = ''.join(random.choices(string.ascii_letters + string.digits, k=30))

    cursor.execute("INSERT INTO sessionKey (authKey, expiration, userRole, UserId) VALUES (%s, %s, %s, %s)", (sessionToken, generate_expiry_date(), UserRole, UserID))
    db.commit()
    cursor.close()
    db.close()

    return {
        "sessionToken": sessionToken,
        "userID": UserID,
        "username": username,
        "userRole": UserRole
    }

@app.delete("/logout")
async def delete_sessionToken(sessionToken: str):
    callerID = check_session(sessionToken)[0]

    db = generate_db()

    cursor = db.cursor()

    cursor.execute("DELETE FROM sessionKey WHERE UserId = %s", (callerID,))
    
    cursor.close()
    db.close()

@app.get("/studIDFromUserID")
async def read_studID(sessionToken: str, userID: Union[int, None] = None):
    userInfo = check_session(sessionToken, [SYS, STUD, PROF])

    db = generate_db()

    cursor = db.cursor()

    if userInfo[1] == STUD:
        cursor.execute("SELECT Id FROM student WHERE UserId = %s", (userInfo[0],))
    else:
        if userID:
            cursor.execute("SELECT Id FROM student WHERE UserId = %s", (userID,))
        else:
            raise HTTPException(status_code=400, detail="Must enter userID if not a Student")

    studID = cursor.fetchall()[0][0]

    cursor.close()
    db.close()
    refresh_session(sessionToken)

    return {
        "Student ID": studID
    }

# Returns a list of login attempts for the specified user as well as whether or not that user is flagged
@app.get("/student")
async def read_student(studentID: int, sessionToken: str):
    # Check that the user is an authenticated professor
    callerInfo = check_session(sessionToken, [PROF, SYS])

    db = generate_db()

    # Open a DB cursor and check whether or not the student is in one of the professor's classes or not
    cursor = db.cursor()

    if callerInfo[1] == PROF:
        cursor.execute("SELECT student.Flag FROM student JOIN (studentCourse, course, professor) " +
                    "ON (student.Id = studentCourse.StudentId AND studentCourse.CourseId = course.Id AND course.ProfId = professor.Id) " +
                    "WHERE professor.UserId = %s AND student.Id = %s", (callerInfo[0], studentID))

        flag = cursor.fetchall()
    else:
        flag = [[0]]

    # If the student wasn't in any of the professors courses throw a 403 forbidden
    if not flag and not SYS:
        cursor.close()
        db.close()
        raise HTTPException(status_code=403, detail="Forbidden")

    # Get the student's login attempts
    cursor.execute("SELECT LoginTime, Success FROM loginAttempt WHERE UserId=%s ORDER BY LoginTime DESC", (studentID,))
    loginAttempts = cursor.fetchall()
    dictLoginAttempts = []

    # If there weren't any login attempts throw 404 No Login Attempts Found
    if not loginAttempts:
        cursor.close()
        db.close()
        raise HTTPException(status_code=404, detail="No Login Attempts Found")

    # Convert the login attempts into a dictionary for ease of use on the frontend side
    for row in loginAttempts:
        dictLoginAttempts.append({
            "LoginTime": row[0],
            "Success": row[1]
        })

    # Close resources and refresh the user's session
    cursor.close()
    db.close()
    refresh_session(sessionToken)

    # Return login attempts and whether or not the student is flagged
    return {
        "LoginAttempts": dictLoginAttempts,
        "Flag": flag[0][0]
    }

@app.get("/studentCourses")
async def read_studentCourses(sessionToken: str, userID: int):
    # May need to have STUD added when student dashboard is implemented
    check_session(sessionToken, [SYS])

    db = generate_db()

    cursor = db.cursor()

    cursor.execute("SELECT course.Semester, course.SectionId, course.CourseName FROM course JOIN studentCourse ON course.Id = studentCourse.CourseId " +
                  "JOIN student ON studentCourse.StudentId = student.Id JOIN user ON student.UserId = user.Id WHERE user.Id = %s", (userID,))

    studentCourses = cursor.fetchall()
    transformedStudentCourses = []
    
    for i in studentCourses:
        transformedStudentCourses.append({
            "semester": i[0],
            "sectionID": i[1],
            "courseName": i[2]
        })

    cursor.close()
    db.close()
    refresh_session(sessionToken)

    return {
        "Courses": transformedStudentCourses
    }
    
@app.get("/course")
async def read_courses(sessionToken: str):
    # Check that the user is authenticated
    callerInfo = check_session(sessionToken)

    db = generate_db()

    cursor = db.cursor()

    course = []
    
    if callerInfo[1] == PROF:
        cursor.execute("SELECT course.Id, course.Semester, course.SectionId, course.CourseName FROM course JOIN professor " +
                    "ON (professor.Id = course.profId) " +
                    "WHERE professor.UserId = %s", (callerInfo[0],))
    elif callerInfo[1] == STUD:
        cursor.execute("SELECT course.Id, course.Semester, course.SectionId, course.CourseName FROM course JOIN studentCourse ON " +
                       "course.Id = studentCourse.CourseId JOIN student ON studentCourse.StudentId = student.Id WHERE student.UserId = %s", (callerInfo[0],))
    else:
        cursor.execute("SELECT Id, Semester, SectionId, CourseName FROM course")

    flag = cursor.fetchall()

    # If the professor has no courses
    if not flag:
        cursor.close()
        db.close()
        raise HTTPException(status_code=404, detail="Item not found")
    
    #Stores the course info into dictionary
    for row in flag:
        course.append({
            "Id": row[0],
            "Semester": row[1],
            "SectionId": row[2],
            "Name": row[3]
        })        
         
    cursor.close()
    db.close()
    refresh_session(sessionToken)

    #returns course information
    return{
        "Course": course
    }

@app.get("/notifications")
async def read_notifications(sessionToken: str):
    callerInfo = check_session(sessionToken, [PROF])

    db = generate_db()

    cursor = db.cursor()

    cursor.execute("SELECT professor.Id FROM professor JOIN user ON professor.UserId = user.Id WHERE user.Id = %s", (callerInfo[0],))

    profId = cursor.fetchall()[0][0]

    cursor.execute("SELECT user.Id, user.Username FROM user JOIN student ON user.Id = student.UserId " +
                   "JOIN studentCourse ON student.Id = studentCourse.StudentId JOIN course ON studentCourse.CourseId = course.Id " +
                   "JOIN professor ON course.ProfId = professor.Id WHERE student.Flag = 1 AND professor.Id = %s", (profId,))

    students = cursor.fetchall()

    if not students:
        cursor.close()
        db.close()
        raise HTTPException(status_code=404, detail="Item not found")
 
    transformedStudents = []

    for row in students:
        transformedStudents.append({
            "Id": row[0],
            "Student": row[1]
        }) 

    refresh_session(sessionToken)

    return {
        "Students": transformedStudents
    }

@app.get("/semester")
async def read_semester(sessionToken: str):
    # Check that the user is authenticated
    callerInfo = check_session(sessionToken)

    db = generate_db()

    cursor = db.cursor()

    semester = []
    
    if callerInfo[1] == PROF:
        cursor.execute("SELECT DISTINCT course.Semester FROM course JOIN professor " +
                    "ON (professor.Id = course.profId) " +
                    "WHERE professor.UserId = %s", (callerInfo[0],))
    elif callerInfo[1] == STUD:
        cursor.execute("SELECT DISTINCT course.Semester FROM course JOIN studentCourse " +
                       "ON course.Id = studentCourse.CourseId JOIN student ON studentCourse.StudentId = student.Id " +
                       "WHERE student.UserId = %s", (callerInfo[0],))
    else:
        cursor.execute("SELECT DISTINCT Semester FROM course")

    flag = cursor.fetchall()

    # If the professor has no courses
    if not flag:
        cursor.close()
        db.close()
        raise HTTPException(status_code=404, detail="Item not found")
    
    #Stores the course info into dictionary
    else:
        for row in flag:
            semester.append(row[0])        
         
    cursor.close()
    db.close()
    refresh_session(sessionToken)

    #returns course information
    return{
        "Semesters": semester
    }    

@app.get("/studentInCourse")
async def read_course(courseID: int, sessionToken: str):
    
    callerInfo = check_session(sessionToken, [PROF, SYS])

    db = generate_db()

    cursor = db.cursor()

    if (callerInfo[1] == PROF):
        cursor.execute("SELECT * FROM professor JOIN user on professor.UserId = user.Id WHERE user.Id = %s", (callerInfo[0],))

        profConf = cursor.fetchall()

        if not profConf:
            cursor.close()
            db.close()
            raise HTTPException(status_code=403, detail="Forbidden")

    studentsInCourse = []
    
    cursor.execute("SELECT student.Id, user.username FROM user " +
                   "JOIN student ON student.UserId = user.Id JOIN studentCourse ON studentCourse.StudentId = student.Id " + 
                   "JOIN course ON course.Id = studentCourse.CourseId WHERE course.Id = %s", (courseID,))

    flag = cursor.fetchall()

    # If no students found in course
    if not flag:
        cursor.close()
        db.close()
        raise HTTPException(status_code=404, detail="Item not found")
    
    #Stores the course info into dictionary    
    else:
        for row in flag:
            studentsInCourse.append({
            "Id": row[0],
            "Username": row[1]
        })        
         
    cursor.close()
    db.close()
    refresh_session(sessionToken)

    #returns course information
    return{
        "Students": studentsInCourse
    }
    
@app.get("/users")
async def read_users(sessionToken):
    check_session(sessionToken, [SYS])
        
    db = generate_db()

    cursor = db.cursor()

    cursor.execute("SELECT Id, username FROM user")

    users = cursor.fetchall()
    usersTransformed = []

    for i in users:
        # Check to see what role the user has
        cursor.execute("SELECT * FROM student WHERE UserId=%s", (i[0],))

        if cursor.fetchall():
            UserRole = STUD
        else:
            cursor.execute("SELECT * FROM professor WHERE UserId=%s", (i[0],))

            if cursor.fetchall():
                UserRole = PROF
            else:
                cursor.execute("SELECT * FROM systemAdmin WHERE UserId=%s", (i[0],))

                if cursor.fetchall():
                    UserRole = SYS
        
        usersTransformed.append({
            "id": i[0],
            "username": i[1],
            "userRole": UserRole
        })

    cursor.close()
    db.close()

    return {
        "Users": usersTransformed
    }

@app.post("/createUsers")
async def create_users(createUser: User):
    
    check_session(createUser.sessionToken, [SYS])

    db = generate_db()
    
    cursor = db.cursor()

    if not createUser.users:
        cursor.close()
        db.close()
        raise HTTPException(status_code=400, detail="Bad Request")
    
    for row in createUser.users:
        curUser = row[0]
        role = row[1]
            
        cursor.execute("INSERT INTO user (Username) VALUES (%s)", (curUser,))
        
        cursor.execute("SELECT Id FROM user " +
                       "WHERE Username = %s", (curUser,))
        Id = cursor.fetchall()[0][0]
        
        # Necessary to negate SQL injection attacks
        if role != PROF and role != SYS and role != STUD:
            cursor.close()
            db.close()
            raise HTTPException(status=400, detail="Illegal Role for " + curUser)

        # cursor.execute doesn't like using string interpolation for table names
        cursor.execute("INSERT INTO {role} (UserId) VALUES (%s)".format(role=role), (Id,))
        
    db.commit()
    
    cursor.close()
    db.close()
    refresh_session(createUser.sessionToken)
    
    
@app.post("/createCourse")
async def create_course(createCourse: Course):
    
    check_session(createCourse.sessionToken, [SYS])
    
    if not createCourse:
        raise HTTPException(status_code=400, detail="Bad Request")
    
    db = generate_db()

    cursor = db.cursor()
    
    cursor.execute("SELECT Id FROM user " +
                   "WHERE Username = %s", (createCourse.username,))
    Id = cursor.fetchall()[0][0]
    
    cursor.execute("SELECT Id FROM professor " +
                   "WHERE UserId = %s", (Id,))
    
    professorId = cursor.fetchall()[0][0]
    
    for row in createCourse.courses:
        sectionId = row[0]
        courseName = row[1]
        semester = row[2]
            
        cursor.execute("INSERT INTO course (ProfId, SectionId, CourseName, Semester) VALUES (%s, %s, %s, %s)", (professorId, sectionId, courseName, semester))
        
    db.commit()
    
    cursor.close()
    db.close()
    
    refresh_session(createCourse.sessionToken)

@app.post("/courses")
async def create_courses(courses: List[Courses], sessionToken: str):
    check_session(sessionToken, [SYS])
    
    db = generate_db()

    cursor = db.cursor()
    
    for row in courses:
        cursor.execute("SELECT Id FROM user " +
                   "WHERE Username = %s", (row.professor,))
        Id = cursor.fetchall()[0][0]
        
        cursor.execute("SELECT Id FROM professor " +
                    "WHERE UserId = %s", (Id,))
        
        professorId = cursor.fetchall()[0][0]
            
        cursor.execute("INSERT INTO course (ProfId, SectionId, CourseName, Semester) VALUES (%s, %s, %s, %s)", (professorId, row.section, row.name, row.semester))
        
    db.commit()
    
    cursor.close()
    db.close()
    
    refresh_session(sessionToken)
       
@app.post("/addStudentToCourse")
async def add_student_to_course(addStudentCourse: StudentCourse):
    
    check_session(addStudentCourse.sessionToken, [SYS])
    
    db = generate_db()

    cursor = db.cursor()
    
    for row in addStudentCourse.studentCourses:
            
            username = row[0]
            
            for r in row:
                
                if r != username:
                    info = r.split('|')
                    sectionId = info[0]
                    courseName = info[1]
                    semester = info[2]
        
                    cursor.execute("SELECT Id FROM user " +
                                   "WHERE Username = %s", (username,))
        
                    userId = cursor.fetchall()[0][0]

                    studentId = cursor.execute("SELECT Id FROM student " +
                            "WHERE UserId = %s", (userId,))
        
                    studentId = cursor.fetchall()[0][0]
        
                    cursor.execute("SELECT Id FROM course " +
                                   "WHERE SectionId = %s AND CourseName = %s AND Semester = %s", (sectionId, courseName, semester))
                    Id = cursor.fetchall()[0][0]
            
                    cursor.execute("INSERT INTO studentCourse (StudentId, CourseId) VALUES (%s, %s)", (studentId, Id))

    db.commit()
    
    cursor.close()
    db.close()
    
    refresh_session(addStudentCourse.sessionToken)

@app.delete("/removeCourse")
async def remove_course(courseID: int, sessionToken: str):
    check_session(sessionToken, [SYS])

    db = generate_db()

    cursor = db.cursor()

    cursor.execute("DELETE FROM course WHERE Id = %s", (courseID,))

    db.commit()
    cursor.close()
    db.close()

    refresh_session(sessionToken)

@app.delete("/user/{userID}")
async def remove_user(userID: int, sessionToken: str):
    check_session(sessionToken, [SYS])

    db = generate_db()
    cursor = db.cursor()

    cursor.execute("DELETE FROM user WHERE Id = %s", (userID,))

    db.commit()
    cursor.close()
    db.close()

    refresh_session(sessionToken)

@app.delete("/removeStudentCourse")
async def remove_student_from_class(removeStudentCourse: StudentCourse):
    
    check_session(removeStudentCourse.sessionToken, [SYS])
    
    db = generate_db()

    cursor = db.cursor()
    
    for row in removeStudentCourse.studentCourses:
        
        username = row[0]
        
        for r in row:
            
            if r != username:
        
                info = r.split('|')
                sectionId = info[0]
                courseName = info[1]
                semester = info[2]
        
                cursor.execute("SELECT Id FROM user " +
                               "WHERE Username = %s", (username,))

                userId = cursor.fetchall()[0][0]
        
                cursor.execute("SELECT Id FROM student " +
                               "WHERE UserId = %s", (userId,))
        
                studentId = cursor.fetchall()[0][0]
        
                cursor.execute("SELECT Id FROM course " +
                               "WHERE SectionId = %s AND CourseName = %s AND Semester = %s", (sectionId, courseName, semester))
                Id = cursor.fetchall()[0][0]
            
                cursor.execute("DELETE FROM studentCourse WHERE StudentId = %s AND CourseId = %s ", (studentId, Id))

    db.commit()
    
    cursor.close()
    db.close()
    
    refresh_session(removeStudentCourse.sessionToken)

@app.post("/assignment")
def create_assignment(assignment: Assignment, sessionToken: str):
    callerId = check_session(sessionToken, [PROF])[0]

    db = generate_db()

    cursor = db.cursor()

    cursor.execute("SELECT * FROM course JOIN professor ON course.ProfId = professor.Id WHERE professor.UserId = %s AND course.Id = %s", (callerId, assignment.courseId))

    if not cursor.fetchall():
        cursor.close()
        db.close()
        raise HTTPException(status_code=403, detail="Forbidden")

    # Solution for converting from JS time string found at: https://stackoverflow.com/questions/8153631/js-date-object-to-python-datetime
    assignment.startTime = datetime.strptime(str(assignment.startTime), "%a, %d %b %Y %H:%M:%S %Z")

    # Solution for converting from JS time string found at: https://stackoverflow.com/questions/8153631/js-date-object-to-python-datetime
    assignment.endTime = datetime.strptime(str(assignment.endTime), "%a, %d %b %Y %H:%M:%S %Z")

    cursor.execute("INSERT INTO assignment (assignmentName, assignmentPath, startTime, endTime, courseId) VALUES (%s, %s, %s, %s, %s)",
                  (assignment.assignmentName, assignment.assignmentPath, assignment.startTime, assignment.endTime, assignment.courseId))

    db.commit()
    cursor.close()
    db.close()

    refresh_session(sessionToken)

@app.post("/assignments")
def create_assignments(assignments: List[Assignment], sessionToken: str):
    callerId = check_session(sessionToken, [PROF])[0]

    db = generate_db()

    cursor = db.cursor()

    cursor.execute("SELECT course.Id FROM course JOIN professor ON course.ProfId = professor.Id WHERE professor.UserId = %s", (callerId,))

    result = cursor.fetchall()

    if not result:
        cursor.close()
        db.close()
        raise HTTPException(status_code=403, detail="Forbidden")

    cIds = []

    for i in result:
        cIds.append(i[0])

    for assignment in assignments:
        if assignment.courseId not in cIds:
            cursor.close()
            db.close()
            raise HTTPException(status_code=403, detail="You are not the professor of one or more of the specified courses")

        # Solution for converting from JS time string found at: https://stackoverflow.com/questions/8153631/js-date-object-to-python-datetime
        assignment.startTime = datetime.strptime(str(assignment.startTime), "%m/%d/%Y %H:%M:%S %Z")

        # Solution for converting from JS time string found at: https://stackoverflow.com/questions/8153631/js-date-object-to-python-datetime
        assignment.endTime = datetime.strptime(str(assignment.endTime), "%m/%d/%Y %H:%M:%S %Z")

        cursor.execute("INSERT INTO assignment (assignmentName, assignmentPath, startTime, endTime, courseId) VALUES (%s, %s, %s, %s, %s)",
                    (assignment.assignmentName, assignment.assignmentPath, assignment.startTime, assignment.endTime, assignment.courseId))

    db.commit()
    cursor.close()
    db.close()

    refresh_session(sessionToken)

@app.delete("/assignment/{assignmentId}")
def delete_assignment(assignmentId: int, sessionToken: str):
    callerId = check_session(sessionToken, [PROF])[0]

    db = generate_db()

    cursor = db.cursor()

    cursor.execute("SELECT * FROM course JOIN professor ON course.ProfId = professor.Id WHERE professor.UserId = %s", (callerId,))

    if not cursor.fetchall():
        cursor.close()
        db.close()
        raise HTTPException(status_code=403, detail="Forbidden")

    cursor.execute("SELECT * FROM assignment WHERE id = %s",
                   (assignmentId,))

    if not cursor.fetchall():
        cursor.close()
        db.close()
        raise HTTPException(status_code=404, detail="Assignment Not Found")

    cursor.execute("DELETE FROM assignment WHERE id = %s",
                  (assignmentId,))

    db.commit()
    cursor.close()
    db.close()

    refresh_session(sessionToken)

@app.get("/course/{courseId}/assignments")
def get_course_assignments(courseId: int, sessionToken: str):
    callerInfo = check_session(sessionToken, [PROF, STUD])

    db = generate_db()

    cursor = db.cursor()

    assignments = []

    if callerInfo[1] == PROF:
        cursor.execute("SELECT * FROM course JOIN professor ON course.ProfId = professor.Id WHERE professor.UserId = %s AND course.Id = %s", (callerInfo[0], courseId))
    else:
        cursor.execute("SELECT * FROM studentCourse JOIN student ON studentCourse.StudentId = student.Id WHERE student.UserId = %s AND studentCourse.CourseId = %s", (callerInfo[0], courseId))
    
    if not cursor.fetchall():
        cursor.close()
        db.close()
        raise HTTPException(status_code=403, detail="Forbidden")

    cursor.execute("SELECT * FROM assignment WHERE courseId = %s", (courseId,))

    for entry in cursor.fetchall():
        assignments.append(Assignment(
            Id = entry[0],
            assignmentName = entry[1],
            assignmentPath = entry[2],
            startTime = entry[3],
            endTime = entry[4],
            courseId = entry[5]
        ))

    if not assignments:
        cursor.close()
        db.close()
        raise HTTPException(status_code=404, detail="No Assignments Found")

    cursor.close()
    db.close()

    refresh_session(sessionToken)

    return {
        "Assignments": assignments
    }

@app.get("/assignment/{assignmentId}")
def get_assignment(assignmentId: int, sessionToken: str):
    callerInfo = check_session(sessionToken, [PROF, STUD])

    db = generate_db()

    cursor = db.cursor()

    if callerInfo[1] == PROF:
        cursor.execute("SELECT * FROM course JOIN professor ON course.ProfId = professor.Id JOIN assignment ON assignment.courseId = course.Id " +
                       "WHERE professor.UserId = %s AND assignment.Id = %s",
                       (callerInfo[0], assignmentId))
    else:
        cursor.execute("SELECT * FROM studentCourse JOIN assignment ON studentCourse.CourseId = assignment.courseId JOIN student ON studentCourse.StudentId = student.Id WHERE student.UserId = %s AND assignment.Id = %s",
                       (callerInfo[0], assignmentId))
    
    if not cursor.fetchall():
        cursor.close()
        db.close()
        raise HTTPException(status_code=403, detail="Forbidden")

    cursor.execute("SELECT * FROM assignment WHERE Id = %s", (assignmentId,))

    entry = cursor.fetchall()[0]

    if not entry:
        cursor.close()
        db.close()
        raise HTTPException(status_code=404, detail="Assignment Not Found")

    cursor.close()
    db.close()

    refresh_session(sessionToken)

    return {
        "Assignment": Assignment(
            Id = entry[0],
            assignmentName = entry[1],
            assignmentPath = entry[2],
            startTime = entry[3],
            endTime = entry[4],
            courseId = entry[5]
        )
    }

@app.get("/assignment/{assignmentId}/submissions")
def get_assignment_submissions(assignmentId: int, sessionToken: str):
    callerInfo = check_session(sessionToken, [PROF, STUD])

    db = generate_db()

    cursor = db.cursor()

    submissions = []

    if callerInfo[1] == PROF:
        cursor.execute("SELECT * FROM course JOIN professor ON course.ProfId = professor.Id JOIN assignment ON assignment.courseId = course.Id " +
                       "WHERE professor.UserId = %s AND assignment.Id = %s",
                       (callerInfo[0], assignmentId))
    else:
        cursor.execute("SELECT * FROM studentCourse JOIN assignment ON studentCourse.CourseId = assignment.courseId JOIN student ON studentCourse.StudentId = student.Id WHERE student.UserId = %s AND assignment.Id = %s",
                       (callerInfo[0], assignmentId))
    
    if not cursor.fetchall():
        cursor.close()
        db.close()
        raise HTTPException(status_code=403, detail="Forbidden")

    cursor.execute("SELECT * FROM assignmentSubmission WHERE assignmentId = %s", (assignmentId,))

    for entry in cursor.fetchall():
        submissions.append(AssignmentSubmission(
            Id = entry[0],
            fileSize = entry[1],
            lineCount = entry[2],
            doneTime = entry[3],
            studentId = entry[4],
            assignmentId = entry[5]
        ))

    if not submissions:
        cursor.close()
        db.close()
        raise HTTPException(status_code=404, detail="No Submissions Found")

    cursor.close()
    db.close()

    refresh_session(sessionToken)

    return {
        "Submissions": submissions
    }
