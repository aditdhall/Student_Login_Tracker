async function updateCourses(semester) {
    response = await fetch("http://BACKEND_HOST/course?" + new URLSearchParams({
        sessionToken: localStorage.getItem("sessionToken")
    }))

    jsonResponse = await response.json()

    div = document.getElementById("courses")

    while (div.firstChild) {
        div.removeChild(div.firstChild)
    }

    jsonResponse["Course"].forEach(element => {
        if (semester !== element["Semester"] && semester !== "All") {
            return
        }
        
        courseOuter = document.createElement("li")
        courseInner = document.createElement("a")
        redXImg = document.createElement("img")

        courseInner.href = "sysAdminCoursesStudent.html?" + new URLSearchParams({
            courseId: element["Id"],
            semester: element["Semester"],
            section: element["SectionId"],
            name: element["Name"]
        })

        courseInner.className = "relative block p-4 no-underline mb-4 rounded-lg bg-white border-2 border-brick-orange hover:bg-rit-gray transition duration-200 drop-shadow-lg"
        redXImg.className = "absolute right-5 top-1/2 -translate-y-1/2"
        
        if (parseInt(element["Semester"]) % 10 == 1) {
            courseInner.innerHTML = element["Name"] + " - " + element["SectionId"] + "<br>Fall " + element["Semester"]
        } else if (parseInt(element["Semester"]) % 10 == 5) {
            courseInner.innerHTML = element["Name"] + " - " + element["SectionId"] + "<br>Spring " + element["Semester"]
        } else {
            courseInner.innerHTML = element["Name"] + " - " + element["SectionId"] + "<br>" + element["Semester"]
        }

         // START OF NEW STUFF
        redXImg.src = "../assets/img/delete.png"
        redXImg.style.height="30px"
        redXImg.style.width="23px"
        courseInner.appendChild(redXImg)
        redXImg.addEventListener("click", (e) => {
            e.preventDefault()
            fetch("http://BACKEND_HOST/removeCourse?"+ new URLSearchParams({
                sessionToken: localStorage.getItem("sessionToken"),
                courseID: element["Id"]
            }),{
                method: "DELETE"
            })
            window.location.reload()
        })
         // END OF NEW STUFF

        courseOuter.appendChild(courseInner)
        div.appendChild(courseOuter)
    })
}

async function updateSemesters() {
    response = await fetch("http://BACKEND_HOST/semester?" + new URLSearchParams({
        sessionToken: localStorage.getItem("sessionToken")
    }))

    jsonResponse = await response.json()

    div = document.getElementById("semesters")

    while (div.firstChild) {
        div.removeChild(div.firstChild)
    }

    allOuter = document.createElement("li")
    allInner = document.createElement("a")

    allOuter.className = "float-left"
    allInner.href = "#"
    allInner.className = "block pl-4 pb-3.5 pt-3.5 no-underline font-bold text-brick-orange"
    allInner.innerHTML = "All"

    currentSemester = allInner

    allInner.addEventListener("click", (e) => {
        e.preventDefault()

        currentSemester.className = "block pl-4 pb-3.5 pt-3.5 no-underline font-bold hover:text-rit-light-gray"
        allInner.className = "block pl-4 pb-3.5 pt-3.5 no-underline font-bold text-brick-orange bg-none"

        currentSemester = allInner

        updateCourses("All")
    })

    allOuter.appendChild(allInner)
    div.appendChild(allOuter)

    jsonResponse["Semesters"].forEach(element => {
        semOuter = document.createElement("li")
        semInner = document.createElement("a")

        semOuter.className = "float-left"
        semInner.href = "#"
        semInner.className = "block pl-4 pb-3.5 pt-3.5 no-underline font-bold hover:text-rit-dark-gray"

        if (parseInt(element) % 10 == 1) {
            semInner.innerHTML = "Fall " + element
        } else if (parseInt(element) % 10 == 5) {
            semInner.innerHTML = "Spring " + element
        } else {
            semInner.innerHTML = element
        }

        semInner.addEventListener("click", (e) => {
            e.preventDefault()

            currentSemester.className = "block pl-4 pb-3.5 pt-3.5 no-underline font-bold hover:text-rit-dark-gray"
            semInner.className = "block pl-4 pb-3.5 pt-3.5 no-underline font-bold text-brick-orange"

            currentSemester = semInner

            updateCourses(element)
        })

        semOuter.appendChild(semInner)
        div.appendChild(semOuter)
    });
}

function newCourse(event) {
    event.preventDefault()

    body = document.getElementsByTagName("body")[0]
    transparent = document.createElement("div")
    popup = document.createElement("div")
    inputsDiv = document.createElement("div")
    header = document.createElement("h1")
    nameDiv = document.createElement("div")
    nameLabel = document.createElement("p")
    aName = document.createElement("input")
    userNameDiv = document.createElement("div")
    userNameLabel = document.createElement("p")
    userName = document.createElement("input")
    sectionDiv = document.createElement("div")
    sectionLabel = document.createElement("p")
    section = document.createElement("input")
    semesterDiv = document.createElement("div")
    semesterLabel = document.createElement("p")
    semester = document.createElement("input")
    csvDiv = document.createElement("div")
    csvLabel = document.createElement("p")
    csv = document.createElement("input")
    wait = document.createElement("p")
    submit = document.createElement("input")

    aName.type = "text"
    userName.type = "text"
    section.type = "text"
    semester.type = "text"
    csv.type = "file"
    submit.type = "button"
    submit.value = "Submit"
    nameLabel.innerHTML = "Course Name: "
    userNameLabel.innerHTML = "Professor Username: "
    sectionLabel.innerHTML = "Section ID: "
    semesterLabel.innerHTML = "Semester: "
    csvLabel.innerHTML = "Create by CSV Upload: "
    wait.innerHTML = "Please Wait, Processing CSV File"
    header.innerHTML = "Create New Course"

    popup.className = "flex flex-col fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-rit-light-gray border-2 border-brick-orange rounded-lg drop-shadow-lg"
    inputsDiv.className = "flex flex-col mx-4 mb-4"
    nameDiv.className = "flex flex-row my-2"
    header.className = "text-center m-4 text-lg"
    nameLabel.className = "inline mr-2"
    aName.className = "self-center"
    userNameDiv.className = "flex flex-row my-2"
    userNameLabel.className = "inline mr-2"
    userName.className = "self-center"
    sectionDiv.className = "flex flex-row my-2"
    sectionLabel.className = "inline mr-2"
    section.className = "self-center"
    semesterDiv.className = "flex flex-row my-2"
    semesterLabel.className = "inline mr-2"
    semester.className = "self-center"
    csvDiv.className = "flex flex-row my-2"
    csvLabel.className = "inline mr-2"
    csv.className = "self-center"
    wait.className = "hidden"
    submit.className = "mb-4 bg-rit-dark-gray rounded border border-brick-orange self-center px-4 py-2 hover:border-rit-dark-gray hover:bg-brick-orange"
    transparent.className = "h-full w-full fixed bg-rit-gray opacity-75 z-10 top-0 left-0"

    submit.addEventListener("click", () => {
        if ((!aName.value || !userName.value || !section.value || !semester.value) && csv.files.length == 0) {
            return
        }

        if (csv.files.length == 0) {
            // Should probably add some error checking here eventually
            fetch("http://BACKEND_HOST/createCourse", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    courses: [[section.value, aName.value, semester.value]],
                    sessionToken: localStorage.getItem("sessionToken"),
                    username: userName.value
                })
            })

            window.location.reload()
        } else {
            wait.className = "text-red self-center mb-4 block"

            ingestor = new CSVIngestor(csv.files[0], async (courses) => {
                coursesBody = []

                courses.forEach((line) => {
                    coursesBody.push({
                        name: line[0],
                        section: line[1],
                        semester: line[2],
                        professor: line[3]
                    })
                })

                fetch("http://BACKEND_HOST/courses?" + new URLSearchParams({
                    sessionToken: localStorage.getItem("sessionToken")
                }), {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(coursesBody)
                })
            })

            ingestor.addEventListener("load", (e) => {
                window.location.reload()
            })
        }
        
    })

    // Credit for closing popup when clicked outside of: https://www.codegrepper.com/code-examples/javascript/check+if+click+is+inside+div+javascript
    document.addEventListener("click", clearPopup = e => {
        if (document.getElementById("newCourse") !== e.target && popup !== e.target && !popup.contains(e.target)) {
            e.preventDefault()
            body.removeChild(popup)
            body.removeChild(transparent)
            document.removeEventListener('click', clearPopup)
        }
    })

    body.appendChild(transparent)
    nameDiv.appendChild(nameLabel)
    nameDiv.appendChild(aName)
    userNameDiv.appendChild(userNameLabel)
    userNameDiv.appendChild(userName)
    sectionDiv.appendChild(sectionLabel)
    sectionDiv.appendChild(section)
    semesterDiv.appendChild(semesterLabel)
    semesterDiv.appendChild(semester)
    csvDiv.appendChild(csvLabel)
    csvDiv.appendChild(csv)
    inputsDiv.appendChild(nameDiv)
    inputsDiv.appendChild(userNameDiv)
    inputsDiv.appendChild(sectionDiv)
    inputsDiv.appendChild(semesterDiv)
    inputsDiv.appendChild(csvDiv)
    popup.appendChild(header)
    popup.appendChild(inputsDiv)
    popup.appendChild(wait)
    popup.appendChild(submit)
    body.appendChild(popup)
}

updateSemesters()
updateCourses("All")