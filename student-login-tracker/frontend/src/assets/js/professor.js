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

        courseInner.href = "course.html?" + new URLSearchParams({
            courseId: element["Id"],
            semester: element["Semester"],
            section: element["SectionId"],
            name: element["Name"]
        })

        courseInner.className = "block p-4 no-underline bg-white border-2 border-brick-orange mb-4 rounded-lg hover:bg-rit-gray transition duration-200 drop-shadow-lg"

        if (parseInt(element["Semester"]) % 10 == 1) {
            courseInner.innerHTML = element["Name"] + " - " + element["SectionId"] + "<br>Fall " + element["Semester"]
        } else if (parseInt(element["Semester"]) % 10 == 5) {
            courseInner.innerHTML = element["Name"] + " - " + element["SectionId"] + "<br>Spring " + element["Semester"]
        } else {
            courseInner.innerHTML = element["Name"] + " - " + element["SectionId"] + "<br>" + element["Semester"]
        }

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

        currentSemester.className = "block pl-4 pb-3.5 pt-3.5 no-underline font-bold hover:text-rit-dark-gray"
        allInner.className = "block pl-4 pb-3.5 pt-3.5 no-underline font-bold text-brick-orange"

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
updateSemesters()
updateCourses("All")
