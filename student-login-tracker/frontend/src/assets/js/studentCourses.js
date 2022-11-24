const urlParams=new URLSearchParams(window.location.search)
userID = urlParams.get("userID")
username = urlParams.get("username")

async function updateCourses() {
    response = await fetch("http://BACKEND_HOST/studentCourses?" + new URLSearchParams({
        sessionToken: window.localStorage.getItem("sessionToken"),
        userID: userID
    }))

    jsonResponse = await response.json()

    courses = document.getElementById("courses")
    studName = document.getElementById("studentName")

    studName.innerHTML = username

    jsonResponse["Courses"].forEach(element => {
        outerDiv = document.createElement("div")
        deleteImg = document.createElement("img")
        nameSection = document.createElement("p")
        semester = document.createElement("p")
        separator = document.createElement("hr")
        //TODO: We will need to add a remove course button here as well.

        deleteImg.src = "/assets/img/delete.png"
        deleteImg.style.height = "30px"
        deleteImg.style.width = "23px"

        outerDiv.className = "flex flex-col relative pl-4 bg-white mb-4 rounded-lg border-2 border-brick-orange drop-shadow-lg"
        nameSection.className = "text-lg pt-4"
        semester.className = "text-sm pb-4"
        separator.className = "border-white border-6"
        deleteImg.className = "absolute right-5 top-1/2 -translate-y-1/2"

        nameSection.innerHTML = element["courseName"] + "." + element["sectionID"]
        
        if (parseInt(element["semester"]) % 10 == 1) {
            semester.innerHTML = "Fall " + element["semester"]
        } else if (parseInt(element["semester"]) % 10 == 5) {
            semester.innerHTML = "Spring " + element["semester"]
        } else {
            semester.innerHTML = element["semester"]
        }

        deleteImg.addEventListener("click", e => {
            e.preventDefault()

            fetch("http://BACKEND_HOST/removeStudentCourse", {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    studentCourses: [[username, element["sectionID"] + "|" + element["courseName"] + "|" + element["semester"]]],
                    sessionToken: window.localStorage.getItem("sessionToken")
                })
            })

            window.location.reload()
        })

        outerDiv.appendChild(nameSection)
        outerDiv.appendChild(semester)
        outerDiv.appendChild(deleteImg)
        courses.appendChild(outerDiv)
        if (element != jsonResponse["Courses"][jsonResponse["Courses"].length - 1]) {
            courses.appendChild(separator)
        }
    });
}

async function updateLoginAttempts() {
    response = await fetch("http://BACKEND_HOST/studIDFromUserID?" + new URLSearchParams({
        userID: userID,
        sessionToken: window.localStorage.getItem("sessionToken")
    }))

    jsonResponse = await response.json()

    studentID = jsonResponse["Student ID"]

    responseStudent = await fetch("http://BACKEND_HOST/student?" + new URLSearchParams({
        studentID: studentID,
        sessionToken: window.localStorage.getItem("sessionToken")
    }))

    jsonResponseStudent = await responseStudent.json()

    // loginAttempts = document.getElementById("loginAttempts")
    loginAttempts = []

    jsonResponseStudent["LoginAttempts"].forEach(element => {
        datetime = element["LoginTime"].split("T")

        if (element["Success"]) {
            loginAttempts.push([datetime[0], datetime[1], "Successful"])
        } else {
            loginAttempts.push([datetime[0], datetime[1], "Not Successful"])
        }
    })

    table = document.getElementById("table")
    table.innerHTML = ""

    new gridjs.Grid({
        columns: ["Date", "Time", "Status"],
        data: loginAttempts,
        search: {
            enabled: true
        },
        sort: true,
        pagination: {
            enabled: true,
            limit: 10,
            summary: true
        }
    }).render(table)

    tableBG = document.getElementsByClassName("gridjs-wrapper")[0]
    tableBG.className = tableBG.className + " bg-white"
}

document.addEventListener("DOMContentLoaded", function(){
    updateCourses()
    updateLoginAttempts()

    document.getElementById("addClass").addEventListener("click", e => {
        e.preventDefault()
    
        body = document.getElementsByTagName("body")[0]
        transparent = document.createElement("div")
        popup = document.createElement("div")
        inputDiv = document.createElement("div")
        header = document.createElement("h1")
        labelDiv = document.createElement("div")
        label = document.createElement("p")
        format = document.createElement("p")
        text = document.createElement("input")
        submit = document.createElement("input")

        text.type = "text"
        submit.type = "button"
        submit.value = "Submit"
        label.innerHTML = "Course(s) Comma Separated: "
        format.innerHTML = "Section|Course Name|Semester"
        header.innerHTML = "Add Student to Courses"

        popup.className = "flex flex-col fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-rit-light-gray border-2 border-brick-orange rounded-lg drop-shadow-lg"
        inputDiv.className = "flex flex-row mx-4 mb-4"
        labelDiv.className = "flex flex-col"
        header.className = "text-center m-4 text-lg"
        label.className = "inline mr-2"
        format.className = "text-sm"
        text.className = "self-center"
        submit.className = "mb-4 bg-rit-dark-gray rounded border border-brick-orange self-center px-4 py-2 hover:border-rit-dark-gray hover:bg-brick-orange"
        transparent.className = "h-full w-full fixed bg-rit-gray opacity-75 z-10 top-0 left-0"

        submit.addEventListener("click", () => {
            if (!text.value) {
                return
            }

            courses = text.value.split(",")

            for (i = 0; i < courses.length; i++) {
                courses[i] = [username, courses[i].trim()]
            }

            // Should probably add some error checking here eventually
            fetch("http://BACKEND_HOST/addStudentToCourse", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    studentCourses: courses,
                    sessionToken: window.localStorage.getItem("sessionToken")
                })
            })

            window.location.reload()
        })

        // Credit for closing popup when clicked outside of: https://www.codegrepper.com/code-examples/javascript/check+if+click+is+inside+div+javascript
        document.addEventListener("click", clearPopup = e => {
            if (document.getElementById("addClass") !== e.target && popup !== e.target && !popup.contains(e.target)) {
                e.preventDefault()
                body.removeChild(popup)
                body.removeChild(transparent)
                document.removeEventListener("click", clearPopup)
            }
        })

        body.appendChild(transparent)
        labelDiv.appendChild(label)
        labelDiv.appendChild(format)
        inputDiv.appendChild(labelDiv)
        inputDiv.appendChild(text)
        popup.appendChild(header)
        popup.appendChild(inputDiv)
        popup.appendChild(submit)
        body.appendChild(popup)
    })
});
