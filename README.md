# Student_Login_Tracker
The mission for this project was to gather log files from login attempts made by students to a solace servers from the iSchool. We then displayed those logs in a web application to show which students are struggling to login to the server. We created three different dashboards for this project: Professor, Student, and Systems Administrator.
Solace is one of the RIT servers which allow students to upload their assignments or host their projects. Since we do not have access to the actual Solace server, within this project we built our own Solace Instance to mimic the actual RIT Solace server. Our system will store the generated Solace logs. Our project server will host a web-based management site that offers 3 different perspectives:
Admin View – For System Administrators
Instructor View – For RIT teaching faculties (Professors, Lecturers, Instructors)
Student View – For RIT active students
The project server is also responsible for coordinating with the database and RIT account authentication using Application Programming Interfaces/APIs.
The project server will retrieve data from the database to analyze the user's login attempts and generate alerts if necessary.
RIT Students and Faculties will have to use their RIT accounts to access the web-based management site.

#Credits:
  Adit Dhall, Ethan Marschean, Tariq Afoke, Eli Hopkins, Essence Hagan, Matthew Russell, Songyuan Bo, Samuel Crouch
