SET GLOBAL event_scheduler = ON;
SET GLOBAL time_zone = 'America/New_York';

CREATE TABLE user (
Id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
Username varchar (255) UNIQUE
);


CREATE TABLE student (
Id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
Flag boolean DEFAULT (0),
UserId int,
FOREIGN KEY (UserId) REFERENCES user(Id) ON DELETE CASCADE
);


CREATE TABLE loginAttempt (
Id int AUTO_INCREMENT PRIMARY KEY,
UserId int,
LoginTime DATETIME,
Success boolean,
Msg text(60000),
FOREIGN KEY (UserId) REFERENCES student(Id) ON DELETE CASCADE
);


CREATE TABLE systemAdmin ( 
Id int AUTO_INCREMENT PRIMARY KEY, 
UserId int,  
FOREIGN KEY (UserId) REFERENCES user(Id) ON DELETE CASCADE
);


CREATE TABLE professor ( 
Id int AUTO_INCREMENT PRIMARY KEY, 
UserId int,  
FOREIGN KEY (UserId) REFERENCES user(Id) ON DELETE CASCADE
);


CREATE TABLE course ( 
Id int AUTO_INCREMENT PRIMARY KEY,
ProfId int, 
SectionId varchar(255), 
CourseName varchar(255), 
Semester varchar(255), 
FOREIGN KEY (ProfId) REFERENCES professor(Id) ON DELETE CASCADE
);


CREATE TABLE studentCourse ( 
Id int AUTO_INCREMENT PRIMARY KEY,   
StudentId int, 
CourseId int, 
FOREIGN KEY (StudentId) REFERENCES student(Id) ON DELETE CASCADE,  
FOREIGN KEY (CourseId) REFERENCES course(Id) ON DELETE CASCADE 
);

CREATE TABLE sessionKey (
Id int AUTO_INCREMENT PRIMARY KEY,
authKey varchar(255) UNIQUE,
expiration DATETIME,
userRole varchar(255),
UserId int,
FOREIGN KEY (UserId) REFERENCES user(Id) ON DELETE CASCADE
);

CREATE TABLE assignment (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    assignmentName VARCHAR(255),
    assignmentPath VARCHAR(255),
    startTime DATETIME,
    endTime DATETIME,
    courseId INT,
    FOREIGN KEY (courseId) REFERENCES course(Id) ON DELETE CASCADE
);

CREATE TABLE assignmentSubmission (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    fileSize FLOAT,
    lineCount INT,
    doneTime DATETIME,
    studentId INT,
    assignmentId INT,
    FOREIGN KEY (studentId) REFERENCES student(Id) ON DELETE CASCADE,
    FOREIGN KEY (assignmentId) REFERENCES assignment(Id) ON DELETE CASCADE
);

CREATE EVENT purge_expired_sessions
ON SCHEDULE EVERY 30 MINUTE
DO DELETE FROM sessionKey WHERE expiration < NOW();

DELIMITER //

CREATE TRIGGER failed_flag BEFORE INSERT ON loginAttempt
FOR EACH ROW
BEGIN
    DECLARE attempt1 BOOLEAN;
    DECLARE attempt2 BOOLEAN;

    SET attempt1 = 1;
    SET attempt2 = 1;

    SELECT Success INTO attempt1 FROM loginAttempt
    WHERE UserId = NEW.UserId ORDER BY LoginTime DESC LIMIT 1;

    SELECT Success INTO attempt2 FROM loginAttempt
    WHERE UserId = NEW.UserId ORDER BY LoginTime DESC LIMIT 1 OFFSET 1;

    IF attempt1 = 0 AND attempt2 = 0 AND NEW.Success = 0 THEN
        UPDATE student SET Flag = 1 WHERE Id = NEW.UserId;
    ELSE
        UPDATE student SET Flag = 0 WHERE Id = NEW.UserId;
    END IF;
END;//

DELIMITER ;

DELIMITER //

CREATE TRIGGER create_submissions AFTER INSERT ON assignment
FOR EACH ROW
BEGIN
    INSERT INTO assignmentSubmission (fileSize, lineCount, studentId, assignmentId)
    SELECT 0.0, 0, student.Id, NEW.Id FROM student
    JOIN course ON NEW.courseId = course.Id
    JOIN studentCourse ON course.Id = studentCourse.CourseId
    WHERE student.Id = studentCourse.StudentId;
END;//

DELIMITER ;
