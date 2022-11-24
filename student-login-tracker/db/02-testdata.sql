/*
 * Create testing accountstestAccStud3testAccProf
 */

INSERT INTO user (Username) VALUES ("emm4601");
INSERT INTO user (Username) VALUES ("testAccProf");
INSERT INTO user (Username) VALUES ("testAccStud");
INSERT INTO user (Username) VALUES ("testAccStud2");
INSERT INTO user (Username) VALUES ("testAccStud3");
INSERT INTO systemAdmin (UserId) SELECT Id FROM user WHERE Username="emm4601";                              /* testAccSys   */
INSERT INTO professor (UserId) SELECT Id FROM user WHERE Username="testAccProf";                            /* testAccProf  */
INSERT INTO student (UserId) SELECT Id FROM user WHERE Username="testAccStud";                              /* testAccStud  */    
INSERT INTO student (UserId) SELECT Id FROM user WHERE Username="testAccStud2";                             /* testAccStud2 */
INSERT INTO student (UserId) SELECT Id FROM user WHERE Username="testAccStud3";                             /* testAccStud3 */


/*
 * Create a session for each test account
 */


INSERT INTO sessionKey (authKey, expiration, userRole, UserId)
SELECT "3", "9999-12-31 23:59:59", "student", Id FROM user WHERE Username="testAccStud";


INSERT INTO sessionKey (authKey, expiration, userRole, UserId)
SELECT "5", "9999-12-31 23:59:59", "student", Id FROM user WHERE Username="testAccStud3";


/*
 * Create testing courses
 */

INSERT INTO course (ProfId, SectionId, CourseName, Semester)
SELECT professor.Id, "01", "Test Course", "2211" FROM professor
JOIN user ON professor.UserId = user.Id WHERE user.Username = "testAccProf";

INSERT INTO course (ProfId, SectionId, CourseName, Semester)
SELECT professor.Id, "02", "Test Course", "2211" FROM professor
JOIN user ON professor.UserId = user.Id WHERE user.Username = "testAccProf";

/*
 * Link students with courses
 */

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "testAccStud"
AND SectionId = "01" AND CourseName = "Test Course" AND Semester = "2211";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "testAccStud2"
AND SectionId = "01" AND CourseName = "Test Course" AND Semester = "2211";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "testAccStud3"
AND SectionId = "01" AND CourseName = "Test Course" AND Semester = "2211";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "testAccStud"
AND SectionId = "02" AND CourseName = "Test Course" AND Semester = "2211";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "testAccStud2"
AND SectionId = "02" AND CourseName = "Test Course" AND Semester = "2211";

/*
 * This is the dumbest solution to anything ever. Thanks MySQL
 * Trigger does not work without this for flags because the student table
 * is used when invoking it in this script.
 */
CREATE TABLE tempTable (
    UserId INT PRIMARY KEY,
    LoginTime DATETIME,
    Success BOOLEAN,
    Msg text(60000)
);

/*
 * 3 Successful Login Attempts for Student 1
 */

INSERT INTO tempTable (UserId, LoginTime, Success, Msg)
SELECT student.Id, NOW(), 1, "Test Attempt" FROM student
JOIN user ON student.UserId = user.Id WHERE user.Username = "testAccStud";

INSERT INTO loginAttempt (UserId, LoginTime, Success, Msg)
SELECT * FROM tempTable;

INSERT INTO loginAttempt (UserId, LoginTime, Success, Msg)
SELECT * FROM tempTable;

INSERT INTO loginAttempt (UserId, LoginTime, Success, Msg)
SELECT * FROM tempTable;

TRUNCATE tempTable;

/*
 * 2 Successful and 1 Failed Login Attempt for Student 2
 */

INSERT INTO tempTable (UserId, LoginTime, Success, Msg)
SELECT student.Id, NOW(), 0, "Test Attempt" FROM student
JOIN user ON student.UserId = user.Id WHERE user.Username = "testAccStud2";

INSERT INTO loginAttempt (UserId, LoginTime, Success, Msg)
SELECT * FROM tempTable;

TRUNCATE tempTable;

INSERT INTO tempTable (UserId, LoginTime, Success, Msg)
SELECT student.Id, NOW(), 1, "Test Attempt" FROM student
JOIN user ON student.UserId = user.Id WHERE user.Username = "testAccStud2";

INSERT INTO loginAttempt (UserId, LoginTime, Success, Msg)
SELECT * FROM tempTable;

INSERT INTO loginAttempt (UserId, LoginTime, Success, Msg)
SELECT * FROM tempTable;

TRUNCATE tempTable;

/*
 * 3 Failed Login Attempts for Student 3
 */

INSERT INTO tempTable (UserId, LoginTime, Success, Msg)
SELECT student.Id, NOW(), 0, "Test Attempt" FROM student
JOIN user ON student.UserId = user.Id WHERE user.Username = "testAccStud3";

INSERT INTO loginAttempt (UserId, LoginTime, Success, Msg)
SELECT * FROM tempTable;

INSERT INTO loginAttempt (UserId, LoginTime, Success, Msg)
SELECT * FROM tempTable;

INSERT INTO loginAttempt (UserId, LoginTime, Success, Msg)
SELECT * FROM tempTable;

DROP TABLE tempTable;

INSERT INTO assignment (assignmentName, assignmentPath, startTime, endTime, courseId)
SELECT "Test Assignment 1", "/testassignment1path/", NOW(), NOW(), Id FROM course
WHERE CourseName = "Test Course" AND SectionId = "01" AND Semester = "2211";

INSERT INTO assignment (assignmentName, assignmentPath, startTime, endTime, courseId)
SELECT "Test Assignment 2", "/testassignment2path/", NOW(), NOW(), Id FROM course
WHERE CourseName = "Test Course" AND SectionId = "01" AND Semester = "2211";

INSERT INTO assignment (assignmentName, assignmentPath, startTime, endTime, courseId)
SELECT "Test Assignment 3", "/testassignment3path/", NOW(), NOW(), Id FROM course
WHERE CourseName = "Test Course" AND SectionId = "01" AND Semester = "2211";

INSERT INTO assignment (assignmentName, assignmentPath, startTime, endTime, courseId)
SELECT "Test Assignment 4", "/testassignment4path/", NOW(), NOW(), Id FROM course
WHERE CourseName = "Test Course" AND SectionId = "02" AND Semester = "2211";

INSERT INTO assignment (assignmentName, assignmentPath, startTime, endTime, courseId)
SELECT "Test Assignment 5", "/testassignment5path/", NOW(), NOW(), Id FROM course
WHERE CourseName = "Test Course" AND SectionId = "02" AND Semester = "2211";

INSERT INTO assignment (assignmentName, assignmentPath, startTime, endTime, courseId)
SELECT "Test Assignment 6", "/testassignment6path/", NOW(), NOW(), Id FROM course
WHERE CourseName = "Test Course" AND SectionId = "02" AND Semester = "2211";

# https://www.geeksforgeeks.org/rand-function-in-mysql/#:~:text=If%20we%20want%20to%20obtain,*%20(j%20%E2%88%92%20i)).
UPDATE assignmentSubmission SET fileSize=RAND()*100, lineCount=FLOOR(1000 + RAND() * (2000-1000)), doneTime=CURRENT_TIMESTAMP - INTERVAL FLOOR(10 + RAND() * (30-10)) DAY;
