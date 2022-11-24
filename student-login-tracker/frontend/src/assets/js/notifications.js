async function getNotifications() {
    //list of students
    response = await fetch("http://BACKEND_HOST/notifications?" + new URLSearchParams({
        sessionToken: localStorage.getItem("sessionToken")
    }))
    
    jsonResponse = await response.json()
    //console.log(jsonResponse)
    
    students = []

    for (let index = 0; index < jsonResponse["Students"].length; index++) {
        //the name of the student
        studentName = jsonResponse["Students"][index].Student
        //console.log(studentName)
        //console.log(jsonResponse["Students"][index].Id)

        //retrieving the student id from the userId; not working contact eli about it
        studentIDresponse = await fetch("http://BACKEND_HOST/studIDFromUserID?" + new URLSearchParams({
            sessionToken: localStorage.getItem("sessionToken"),
            userID: jsonResponse["Students"][index].Id
        }))
        studentIDjsonResponse = await studentIDresponse.json()
        studentID = studentIDjsonResponse["Student ID"]
        //console.log(studentID)

        //course of the student
        course = await fetch("http://BACKEND_HOST/course?" + new URLSearchParams({ //change to studentCourses
            sessionToken: localStorage.getItem("sessionToken"),
        }))
        courseResponse = await course.json()
        courseName = courseResponse["Course"][0].Name //first course on the list for ease of use; one course only needs to be displayed
        //console.log(courseName)

        //number of login attempts and last login attempts
        responseStudent = await fetch("http://BACKEND_HOST/student?" + new URLSearchParams({
            studentID: studentID,
            sessionToken: window.localStorage.getItem("sessionToken")
        }))

        jsonResponseStudent = await responseStudent.json()

        loginAttempts = jsonResponseStudent["LoginAttempts"].length //number of login attempts
        //console.log(loginAttempts)

        lastLoginAttempt = new Date(jsonResponseStudent["LoginAttempts"][loginAttempts - 1].LoginTime).toString() //last login attempt
        //console.log(lastLoginAttempt)


        //final result of a student's information at the end of each loop
        students.push([studentName, courseName, loginAttempts, lastLoginAttempt])
    }

    div = document.getElementById("notifyList")
    div.innerHTML = ""

    new gridjs.Grid({ 
        columns: ["Name", {name: "Course", width: "20%"}, { name: "Login Attempts", width: "30%"}, { name: "Last Login Attempt", width: "40%"}],
        data: students,
            search: {
                enabled: true
            },
            sort: true,
            pagination: {
                enabled: true,
                limit: 10,
                summary: true
            }
      }).render(div);
}

async function getNoLogins() {
    //list of students
    response = await fetch("http://BACKEND_HOST/notifications?" + new URLSearchParams({
        sessionToken: localStorage.getItem("sessionToken")
    }))
    jsonResponse = await response.json()
    //console.log(jsonResponse)
    
    missingStudents = []

    await jsonResponse["Students"].forEach(async element => {
        //retrieving the student id from the userId
        studentIDresponse = await fetch("http://BACKEND_HOST/studIDFromUserID?" + new URLSearchParams({
            sessionToken: localStorage.getItem("sessionToken"),
            userID: element["Id"]
        }))
        studentIDjsonResponse = await studentIDresponse.json()
        studentID = studentIDjsonResponse["Student ID"]

        loginResponse = await fetch("http://BACKEND_HOST/student?"+ new URLSearchParams({
            sessionToken: localStorage.getItem("sessionToken"),
            studentID: studentID
        }))
        
        loginJsonResponse = await loginResponse.json()
        //console.log(loginJsonResponse)

        counterSuccessLogin = 0

        loginJsonResponse["LoginAttempts"].forEach(element => {
            if (element["Success"]) {
                counterSuccessLogin++
            }
        })

        if(loginJsonResponse["LoginAttempts"].length == 0 || counterSuccessLogin == 0) {
            //course of the student
            course = await fetch("http://BACKEND_HOST/course?" + new URLSearchParams({
                sessionToken: localStorage.getItem("sessionToken")
            }))

            courseResponse = await course.json()
            courseName = courseResponse["Course"][0].Name //first course on the list for ease of use; one course only needs to be displayed
            //console.log(courseName)

            missingStudents.push([element.Student, courseName])
        }
    });

    console.log(missingStudents)
    // div = document.getElementById("notifyList2")
    // div.innerHTML = ""

    var millisecondsToWait = 500;
    setTimeout(function() {
        div = document.getElementById("notifyList2")
        div.innerHTML = ""
        // append student information to grid
        new gridjs.Grid({
            columns: ["Username", "Course"],
            data: missingStudents,
            search: {
                enabled: true
            },
            sort: true,
            pagination: {
                enabled: true,
                limit: 10,
                summary: true
            }
        }).render(div);
    }, millisecondsToWait);
    
}

getNotifications()
getNoLogins()