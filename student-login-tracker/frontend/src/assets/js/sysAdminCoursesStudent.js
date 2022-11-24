const urlParams=new URLSearchParams(window.location.search)
courseID = urlParams.get("courseId")
semester = urlParams.get("semester")
section = urlParams.get("section")
courseName = urlParams.get("name")

async function updateStudents() {
    response = await fetch("http://BACKEND_HOST/studentInCourse?" + new URLSearchParams({
        sessionToken: window.localStorage.getItem("sessionToken"),
        courseID: courseID
    }))

    jsonResponse = await response.json()

    students = document.getElementById("students")
    courseNameElem = document.getElementById("courseName")

    courseNameElem.innerHTML = courseName + "." + section + " " + semester

    jsonResponse["Students"].forEach(element => {
        outerDiv = document.createElement("div")
        deleteImg = document.createElement("img")
        nameSection = document.createElement("p")
        separator = document.createElement("hr")
        //TODO: We will need to add a remove course button here as well.

        deleteImg.src = "/assets/img/delete.png"
        deleteImg.style.height = "30px"
        deleteImg.style.width = "23px"

        outerDiv.className = "flex flex-col relative pl-10 bg-white text-3xl border-brick-orange border-2 rounded drop-shadow-lg w-3/4 mx-auto"
        nameSection.className = "text-lg pt-4 pb-4"
        separator.className = "border-rit-light-gray border-4 opacity-0"
        deleteImg.className = "absolute right-5 top-1/2 -translate-y-1/2 hover:border-rit-light-gray"

        nameSection.innerHTML = element["Username"]

        deleteImg.addEventListener("click", e => {
            e.preventDefault()

            fetch("http://BACKEND_HOST/removeStudentCourse", {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    studentCourses: [[element["Username"], section + "|" + courseName + "|" + semester]],
                    sessionToken: window.localStorage.getItem("sessionToken")
                })
            })

            window.location.reload()
        })

        outerDiv.appendChild(nameSection)
        outerDiv.appendChild(deleteImg)
        students.appendChild(outerDiv)
        if (element != jsonResponse["Students"][jsonResponse["Students"].length - 1]) {
            students.appendChild(separator)
        }
    });
}

document.addEventListener("DOMContentLoaded", function(){
    updateStudents()

    document.getElementById("addStudent").addEventListener("click", e => {
        e.preventDefault()
    
        body = document.getElementsByTagName("body")[0]
        transparent = document.createElement("div")
        popup = document.createElement("div")
        inputDiv = document.createElement("div")
        header = document.createElement("h1")
        labelDiv = document.createElement("div")
        label = document.createElement("p")
        text = document.createElement("input")
        submit = document.createElement("input")

        text.type = "text"
        submit.type = "button"
        submit.value = "Submit"
        label.innerHTML = "Student Username(s) Comma Separated: "
        header.innerHTML = "Add Students to Course"

        popup.className = "flex flex-col fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-rit-light-gray border-2 border-brick-orange rounded-lg drop-shadow-lg"
        inputDiv.className = "flex flex-row mx-4 mb-4"
        labelDiv.className = "flex flex-col"
        header.className = "text-center m-4 text-lg"
        label.className = "inline mr-2"
        text.className = "self-center"
        submit.className = "mb-4 bg-rit-dark-gray rounded border border-brick-orange self-center px-4 py-2 hover:border-rit-dark-gray hover:bg-brick-orange"
        transparent.className = "h-full w-full fixed bg-rit-gray opacity-75 z-10 top-0 left-0"

        submit.addEventListener("click", () => {
            if (!text.value) {
                return
            }

            students = text.value.split(",")

            for (i = 0; i < students.length; i++) {
                students[i] = [students[i].trim(), section + "|" + courseName + "|" + semester]
            }

            // Should probably add some error checking here eventually
            fetch("http://BACKEND_HOST/addStudentToCourse", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    studentCourses: students,
                    sessionToken: window.localStorage.getItem("sessionToken")
                })
            })

            window.location.reload()
        })

        // Credit for closing popup when clicked outside of: https://www.codegrepper.com/code-examples/javascript/check+if+click+is+inside+div+javascript
        document.addEventListener("click", clearPopup = e => {
            if (document.getElementById("addStudent") !== e.target && popup !== e.target && !popup.contains(e.target)) {
                e.preventDefault()
                body.removeChild(popup)
                body.removeChild(transparent)
                document.removeEventListener("click", clearPopup)
            }
        })

        body.appendChild(transparent)
        labelDiv.appendChild(label)
        inputDiv.appendChild(labelDiv)
        inputDiv.appendChild(text)
        popup.appendChild(header)
        popup.appendChild(inputDiv)
        popup.appendChild(submit)
        body.appendChild(popup)
    })
});
