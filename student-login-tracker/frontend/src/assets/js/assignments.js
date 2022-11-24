const urlParams = new URLSearchParams(window.location.search);

id = urlParams.get("courseId")
semester = urlParams.get("semester")
sectionID = urlParams.get("section")
courseName = urlParams.get("name")

async function updateAssignments() {
    response = await fetch("http://BACKEND_HOST/course/" + id + "/assignments?" + new URLSearchParams({
        sessionToken: localStorage.getItem("sessionToken")
    }))

    jsonResponse = await response.json()

    jsonResponse["Assignments"].forEach(element => {
        assignmentOuter = document.createElement("li")
        assignmentInner = document.createElement("a")
        assignmentName = document.createElement("h1")
        assignmentInfo = document.createElement("h2")

        assignmentInner.href = "assignment.html?" + new URLSearchParams({
            id: element["Id"]
        })

        assignmentName.innerHTML = element["assignmentName"]
        assignmentInfo.innerHTML = element["startTime"].replace("T", " ") + " - " + element["endTime"].replace("T", " ") + "<br />" + element["assignmentPath"]

        assignmentName.className = "absolute left-5 top-1/2 -translate-y-1/2 text-xl"
        assignmentInfo.className = "absolute right-5 top-1/2 -translate-y-1/2 text-lg"
        assignmentInner.className = "block relative px-4 py-10 no-underline bg-white mb-4 rounded-lg hover:bg-rit-gray transition duration-200 border-2 border-brick-orange drop-shadow-lg"

        assignmentInner.appendChild(assignmentName)
        assignmentInner.appendChild(assignmentInfo)
        assignmentOuter.appendChild(assignmentInner)
        document.getElementById("assignments").appendChild(assignmentOuter)
    });
}

document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("header").innerHTML = courseName + "." + sectionID + " - " + semester

    updateAssignments()

})
