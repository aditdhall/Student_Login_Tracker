INSERT INTO user (Username) VALUES ("ad6449");
INSERT INTO user (Username) VALUES ("emm4601");
INSERT INTO user (Username) VALUES ("tba8537");
INSERT INTO user (Username) VALUES ("rb5565");
INSERT INTO user (Username) VALUES ("sb8715");
INSERT INTO user (Username) VALUES ("emc3424");
INSERT INTO user (Username) VALUES ("dec8768");
INSERT INTO user (Username) VALUES ("sec7944");
INSERT INTO user (Username) VALUES ("eth7395");
INSERT INTO user (Username) VALUES ("ewh3157");
INSERT INTO user (Username) VALUES ("jhk5203");
INSERT INTO user (Username) VALUES ("lwm2120");
INSERT INTO user (Username) VALUES ("xm5723");
INSERT INTO user (Username) VALUES ("nxm1137");
INSERT INTO user (Username) VALUES ("mmo9420");
INSERT INTO user (Username) VALUES ("ttp4725");
INSERT INTO user (Username) VALUES ("jmr8990");
INSERT INTO user (Username) VALUES ("nmr5651");
INSERT INTO user (Username) VALUES ("mmr8027");
INSERT INTO user (Username) VALUES ("err4471");
INSERT INTO user (Username) VALUES ("drs4281");
INSERT INTO user (Username) VALUES ("jy8445");
INSERT INTO user (Username) VALUES ("awdics");
INSERT INTO user (Username) VALUES ("cbbics");
INSERT INTO systemAdmin (UserId) SELECT Id FROM user WHERE Username="ad6449";
INSERT INTO professor (UserId) SELECT Id FROM user WHERE Username="emm4601";
INSERT INTO student (UserId) SELECT Id FROM user WHERE Username="tba8537";
INSERT INTO student (UserId) SELECT Id FROM user WHERE Username="rb5565";
INSERT INTO student (UserId) SELECT Id FROM user WHERE Username="sb8715";
INSERT INTO student (UserId) SELECT Id FROM user WHERE Username="emc3424";
INSERT INTO student (UserId) SELECT Id FROM user WHERE Username="dec8768";
INSERT INTO student (UserId) SELECT Id FROM user WHERE Username="sec7944";
INSERT INTO student (UserId) SELECT Id FROM user WHERE Username="eth7395";
INSERT INTO systemAdmin (UserId) SELECT Id FROM user WHERE Username="ewh3157";
INSERT INTO student (UserId) SELECT Id FROM user WHERE Username="jhk5203";
INSERT INTO student (UserId) SELECT Id FROM user WHERE Username="lwm2120";
INSERT INTO student (UserId) SELECT Id FROM user WHERE Username="xm5723";
INSERT INTO student (UserId) SELECT Id FROM user WHERE Username="nxm1137";
INSERT INTO student (UserId) SELECT Id FROM user WHERE Username="mmo9420";
INSERT INTO student (UserId) SELECT Id FROM user WHERE Username="ttp4725";
INSERT INTO student (UserId) SELECT Id FROM user WHERE Username="jmr8990";
INSERT INTO student (UserId) SELECT Id FROM user WHERE Username="nmr5651";
INSERT INTO professor (UserId) SELECT Id FROM user WHERE Username="mmr8027";
INSERT INTO student (UserId) SELECT Id FROM user WHERE Username="err4471";
INSERT INTO student (UserId) SELECT Id FROM user WHERE Username="drs4281";
INSERT INTO student (UserId) SELECT Id FROM user WHERE Username="jy8445";
INSERT INTO systemAdmin (UserId) SELECT Id FROM user WHERE Username="awdics";
INSERT INTO professor (UserId) SELECT Id FROM user WHERE Username="cbbics";

INSERT INTO course (ProfId, SectionId, CourseName, Semester)
SELECT professor.Id, "01", "Web & Mobile I", "2221" FROM professor
JOIN user ON professor.UserId = user.Id WHERE user.Username = "cbbics";

INSERT INTO course (ProfId, SectionId, CourseName, Semester)
SELECT professor.Id, "01", "Senior Development Project I", "2221" FROM professor
JOIN user ON professor.UserId = user.Id WHERE user.Username = "emm4601";

INSERT INTO course (ProfId, SectionId, CourseName, Semester)
SELECT professor.Id, "01", "Senior Development Project II", "2215" FROM professor
JOIN user ON professor.UserId = user.Id WHERE user.Username = "mmr8027";

INSERT INTO course (ProfId, SectionId, CourseName, Semester)
SELECT professor.Id, "01", "Introduction to Database and Data Modeling", "2221" FROM professor
JOIN user ON professor.UserId = user.Id WHERE user.Username = "cbbics";
INSERT INTO course (ProfId, SectionId, CourseName, Semester)
SELECT professor.Id, "01", "Information Requirements Modeling", "2215" FROM professor
JOIN user ON professor.UserId = user.Id WHERE user.Username = "cbbics";

INSERT INTO course (ProfId, SectionId, CourseName, Semester)
SELECT professor.Id, "01", "Database Design And Implementation", "2215" FROM professor
JOIN user ON professor.UserId = user.Id WHERE user.Username = "cbbics";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "tba8537"
AND SectionId = "01" AND CourseName = "Web & Mobile I" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "tba8537"
AND SectionId = "01" AND CourseName = "Senior Development Project I" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "tba8537"
AND SectionId = "01" AND CourseName = "Senior Development Project II" AND Semester = "2215";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "tba8537"
AND SectionId = "01" AND CourseName = "Introduction to Database and Data Modeling" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "tba8537"
AND SectionId = "01" AND CourseName = "Information Requirements Modeling" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "tba8537"
AND SectionId = "01" AND CourseName = "Database Design And Implementation" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "rb5565"
AND SectionId = "01" AND CourseName = "Web & Mobile I" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "rb5565"
AND SectionId = "01" AND CourseName = "Senior Development Project I" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "rb5565"
AND SectionId = "01" AND CourseName = "Senior Development Project II" AND Semester = "2215";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "rb5565"
AND SectionId = "01" AND CourseName = "Introduction to Database and Data Modeling" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "rb5565"
AND SectionId = "01" AND CourseName = "Information Requirements Modeling" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "rb5565"
AND SectionId = "01" AND CourseName = "Database Design And Implementation" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "sb8715"
AND SectionId = "01" AND CourseName = "Web & Mobile I" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "sb8715"
AND SectionId = "01" AND CourseName = "Senior Development Project I" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "sb8715"
AND SectionId = "01" AND CourseName = "Senior Development Project II" AND Semester = "2215";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "sb8715"
AND SectionId = "01" AND CourseName = "Introduction to Database and Data Modeling" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "sb8715"
AND SectionId = "01" AND CourseName = "Information Requirements Modeling" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "sb8715"
AND SectionId = "01" AND CourseName = "Database Design And Implementation" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "emc3424"
AND SectionId = "01" AND CourseName = "Web & Mobile I" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "emc3424"
AND SectionId = "01" AND CourseName = "Senior Development Project I" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "emc3424"
AND SectionId = "01" AND CourseName = "Senior Development Project II" AND Semester = "2215";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "emc3424"
AND SectionId = "01" AND CourseName = "Introduction to Database and Data Modeling" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "emc3424"
AND SectionId = "01" AND CourseName = "Information Requirements Modeling" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "emc3424"
AND SectionId = "01" AND CourseName = "Database Design And Implementation" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "dec8768"
AND SectionId = "01" AND CourseName = "Web & Mobile I" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "dec8768"
AND SectionId = "01" AND CourseName = "Senior Development Project I" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "dec8768"
AND SectionId = "01" AND CourseName = "Senior Development Project II" AND Semester = "2215";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "dec8768"
AND SectionId = "01" AND CourseName = "Introduction to Database and Data Modeling" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "dec8768"
AND SectionId = "01" AND CourseName = "Information Requirements Modeling" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "dec8768"
AND SectionId = "01" AND CourseName = "Database Design And Implementation" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "sec7944"
AND SectionId = "01" AND CourseName = "Web & Mobile I" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "sec7944"
AND SectionId = "01" AND CourseName = "Senior Development Project I" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "sec7944"
AND SectionId = "01" AND CourseName = "Senior Development Project II" AND Semester = "2215";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "sec7944"
AND SectionId = "01" AND CourseName = "Introduction to Database and Data Modeling" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "sec7944"
AND SectionId = "01" AND CourseName = "Information Requirements Modeling" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "sec7944"
AND SectionId = "01" AND CourseName = "Database Design And Implementation" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "eth7395"
AND SectionId = "01" AND CourseName = "Senior Development Project I" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "eth7395"
AND SectionId = "01" AND CourseName = "Senior Development Project II" AND Semester = "2215";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "eth7395"
AND SectionId = "01" AND CourseName = "Introduction to Database and Data Modeling" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "eth7395"
AND SectionId = "01" AND CourseName = "Information Requirements Modeling" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "eth7395"
AND SectionId = "01" AND CourseName = "Database Design And Implementation" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "jhk5203"
AND SectionId = "01" AND CourseName = "Web & Mobile I" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "jhk5203"
AND SectionId = "01" AND CourseName = "Senior Development Project I" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "jhk5203"
AND SectionId = "01" AND CourseName = "Senior Development Project II" AND Semester = "2215";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "jhk5203"
AND SectionId = "01" AND CourseName = "Introduction to Database and Data Modeling" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "jhk5203"
AND SectionId = "01" AND CourseName = "Information Requirements Modeling" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "jhk5203"
AND SectionId = "01" AND CourseName = "Database Design And Implementation" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "lwm2120"
AND SectionId = "01" AND CourseName = "Web & Mobile I" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "lwm2120"
AND SectionId = "01" AND CourseName = "Senior Development Project I" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "lwm2120"
AND SectionId = "01" AND CourseName = "Senior Development Project II" AND Semester = "2215";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "lwm2120"
AND SectionId = "01" AND CourseName = "Introduction to Database and Data Modeling" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "lwm2120"
AND SectionId = "01" AND CourseName = "Information Requirements Modeling" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "lwm2120"
AND SectionId = "01" AND CourseName = "Database Design And Implementation" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "xm5723"
AND SectionId = "01" AND CourseName = "Web & Mobile I" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "xm5723"
AND SectionId = "01" AND CourseName = "Senior Development Project I" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "xm5723"
AND SectionId = "01" AND CourseName = "Senior Development Project II" AND Semester = "2215";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "xm5723"
AND SectionId = "01" AND CourseName = "Introduction to Database and Data Modeling" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "xm5723"
AND SectionId = "01" AND CourseName = "Information Requirements Modeling" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "xm5723"
AND SectionId = "01" AND CourseName = "Database Design And Implementation" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "nxm1137"
AND SectionId = "01" AND CourseName = "Information Requirements Modeling" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "nxm1137"
AND SectionId = "01" AND CourseName = "Database Design And Implementation" AND Semester = "2221";


INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "mmo9420"
AND SectionId = "01" AND CourseName = "Web & Mobile I" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "mmo9420"
AND SectionId = "01" AND CourseName = "Senior Development Project I" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "mmo9420"
AND SectionId = "01" AND CourseName = "Senior Development Project II" AND Semester = "2215";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "mmo9420"
AND SectionId = "01" AND CourseName = "Introduction to Database and Data Modeling" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "mmo9420"
AND SectionId = "01" AND CourseName = "Information Requirements Modeling" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "mmo9420"
AND SectionId = "01" AND CourseName = "Database Design And Implementation" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "ttp4725"
AND SectionId = "01" AND CourseName = "Senior Development Project II" AND Semester = "2215";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "ttp4725"
AND SectionId = "01" AND CourseName = "Introduction to Database and Data Modeling" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "ttp4725"
AND SectionId = "01" AND CourseName = "Information Requirements Modeling" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "ttp4725"
AND SectionId = "01" AND CourseName = "Database Design And Implementation" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "jmr8990"
AND SectionId = "01" AND CourseName = "Web & Mobile I" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "jmr8990"
AND SectionId = "01" AND CourseName = "Senior Development Project I" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "nmr5651"
AND SectionId = "01" AND CourseName = "Senior Development Project II" AND Semester = "2215";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "nmr5651"
AND SectionId = "01" AND CourseName = "Introduction to Database and Data Modeling" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "nmr5651"
AND SectionId = "01" AND CourseName = "Information Requirements Modeling" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "err4471"
AND SectionId = "01" AND CourseName = "Senior Development Project I" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "err4471"
AND SectionId = "01" AND CourseName = "Senior Development Project II" AND Semester = "2215";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "err4471"
AND SectionId = "01" AND CourseName = "Introduction to Database and Data Modeling" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "err4471"
AND SectionId = "01" AND CourseName = "Information Requirements Modeling" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "drs4281"
AND SectionId = "01" AND CourseName = "Database Design And Implementation" AND Semester = "2221";


INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "jy8445"
AND SectionId = "01" AND CourseName = "Senior Development Project I" AND Semester = "2221";

INSERT INTO studentCourse (StudentId, CourseId)
SELECT student.Id, course.Id FROM student
JOIN course
JOIN user ON student.UserId = user.Id WHERE user.Username = "jy8445"
AND SectionId = "01" AND CourseName = "Senior Development Project II" AND Semester = "2215";

INSERT INTO assignment (assignmentName, assignmentPath, startTime, endTime, courseId)
SELECT "Project 1", "/project1", NOW(), NOW(), Id
FROM course WHERE CourseName = "Web & Mobile I";

INSERT INTO assignment (assignmentName, assignmentPath, startTime, endTime, courseId)
SELECT "Project 2", "/project2", NOW(), NOW(), Id
FROM course WHERE CourseName = "Web & Mobile I";

INSERT INTO assignment (assignmentName, assignmentPath, startTime, endTime, courseId)
SELECT "Project 3", "/project3", NOW(), NOW(), Id
FROM course WHERE CourseName = "Senior Development Project I";

INSERT INTO assignment (assignmentName, assignmentPath, startTime, endTime, courseId)
SELECT "Project 4", "/project4", NOW(), NOW(), Id
FROM course WHERE CourseName = "Senior Development Project I";

INSERT INTO assignment (assignmentName, assignmentPath, startTime, endTime, courseId)
SELECT "Project 5", "/project5", NOW(), NOW(), Id
FROM course WHERE CourseName = "Senior Development Project II";

INSERT INTO assignment (assignmentName, assignmentPath, startTime, endTime, courseId)
SELECT "Project 6", "/project6", NOW(), NOW(), Id
FROM course WHERE CourseName = "Senior Development Project II";

INSERT INTO assignment (assignmentName, assignmentPath, startTime, endTime, courseId)
SELECT "Project 7", "/project7", NOW(), NOW(), Id
FROM course WHERE CourseName = "Introduction to Database and Data Modeling";

INSERT INTO assignment (assignmentName, assignmentPath, startTime, endTime, courseId)
SELECT "Project 8", "/project8", NOW(), NOW(), Id
FROM course WHERE CourseName = "Introduction to Database and Data Modeling";

INSERT INTO assignment (assignmentName, assignmentPath, startTime, endTime, courseId)
SELECT "Project 9", "/project9", NOW(), NOW(), Id
FROM course WHERE CourseName = "Information Requirements Modeling";

INSERT INTO assignment (assignmentName, assignmentPath, startTime, endTime, courseId)
SELECT "Project 10", "/project10", NOW(), NOW(), Id
FROM course WHERE CourseName = "Information Requirements Modeling";

INSERT INTO assignment (assignmentName, assignmentPath, startTime, endTime, courseId)
SELECT "Project 11", "/project11", NOW(), NOW(), Id
FROM course WHERE CourseName = "Database Design and Implementation";

INSERT INTO assignment (assignmentName, assignmentPath, startTime, endTime, courseId)
SELECT "Project 12", "/project12", NOW(), NOW(), Id
FROM course WHERE CourseName = "Database Design and Implementation";
