const urlParams=new URLSearchParams(window.location.search)
courseId=urlParams.get("courseId")
semester=urlParams.get("semester")
section=urlParams.get("section")
courseName=urlParams.get("name")


async function getLoginAttempts(){
    nemo = document.getElementById("nemo")
    bigHead = document.getElementById("bigHead")
    bigHead.innerHTML = courseName+ "." + section

    response=await fetch("http://BACKEND_HOST/studentInCourse?" + new URLSearchParams({
        sessionToken: localStorage.getItem("sessionToken"),
        courseID: courseId
    }))

    //START OF COUNTER
    counterFailedLogin=0
    counterTotalLogin=0

    counterNoSuccessful=0
    counterSuccessful=0

    students = []


    jsonResponse=await response.json()
    await jsonResponse["Students"].forEach(async element => {
        loginResponse = await fetch("http://BACKEND_HOST/student?"+ new URLSearchParams({
            sessionToken: localStorage.getItem("sessionToken"),
            studentID: element["Id"]
        }))
        loginJsonResponse= await loginResponse.json()

        for(i = 0; i < loginJsonResponse["LoginAttempts"].length; i++) {
            loginJsonResponse["LoginAttempts"][i]["LoginTime"] = new Date(loginJsonResponse["LoginAttempts"][i]["LoginTime"])
        }

        students.push([element["Username"], loginJsonResponse["LoginAttempts"][0]["LoginTime"].toString(), loginJsonResponse["LoginAttempts"].length])

        success = false

        loginJsonResponse["LoginAttempts"].forEach(element => {
            weekOld = new Date(new Date().getTime() - (86400000 * 7))

            if (element["Success"]) {
                success = true
            }

            if (element["LoginTime"] > weekOld) {
                counterTotalLogin++

                if (!element["Success"]) {
                    counterFailedLogin++
                    //console.log(counterFailedLogin)
                    //console.log(counterTotalLogin)
                } 
            }
        })

        if (success) {
            counterSuccessful++
        } else {
            counterNoSuccessful++
        }
    });

    var millisecondsToWait = 500;
setTimeout(function() {
    // Whatever you want to do after the wait

    //START OF GRAPHIC
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Unsuccessful', 'Successful',],
            datasets: [{
                data: [counterFailedLogin, (counterTotalLogin-counterFailedLogin)],
                backgroundColor: [
                  'rgb(218,41,28)',
                  'rgb(0, 100, 0)'
                ],
                borderColor: [
                    '#FFFFFF'
                ],
                hoverOffset: 4
            }]
        },
    });
    //END OF GRAPHIC

//2ND GRAPH - START OF GRAPHIC
const stx = document.getElementById('secondChart').getContext('2d');
const secondChart = new Chart(stx, {
    type: 'pie',
    data: {
        labels: ['Not Logged In', 'Logged In',],
        datasets: [{
            data: [counterNoSuccessful, counterSuccessful],
            backgroundColor: [
              'rgb(100, 100, 100)',
              'rgb(0, 100, 0)'
            ],
            borderColor: [
                '#FFFFFF'
            ],
            hoverOffset: 4
        }]
    },
});
//END OF GRAPHIC
    document.getElementById("failPercentLi").innerHTML= "" + Math.round(((counterFailedLogin/counterTotalLogin) *100)) + "% Failed Logins" 
    document.getElementById("successPercentLi").innerHTML= "" + Math.round(((counterTotalLogin-counterFailedLogin)/counterTotalLogin) *100) + "% Successful Logins"

    document.getElementById("secondfailPercentLi").innerHTML= "" + Math.round(((counterNoSuccessful/(counterNoSuccessful + counterSuccessful)) *100)) + "% No First Time Login" 
    document.getElementById("secondsuccessPercentLi").innerHTML= "" + Math.round(((counterSuccessful/(counterNoSuccessful + counterSuccessful)) *100)) + "% Successful Logins"

    users = document.getElementById("users")
    users.innerHTML = ""

    new gridjs.Grid({
        columns: ["Username", "Last Login Time", {
            name: "Login Attempts",
            width: "30%"
        }],
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
    }).render(users)

    }, millisecondsToWait);
}

async function updateAssignments() {
    response = await fetch("http://BACKEND_HOST/course/" + courseId + "/assignments?" + new URLSearchParams({
        sessionToken: localStorage.getItem("sessionToken")
    }))

    jsonResponse = await response.json()

    jsonResponse["Assignments"].forEach(element => {
        assignmentOuter = document.createElement("li")
        assignmentInner = document.createElement("a")
        assignmentName = document.createElement("h1")
        assignmentInfoOuter = document.createElement("div")
        assignmentInfo = document.createElement("h2")
        redXImg = document.createElement("img")

        assignmentInner.href = "profAssignment.html?" + new URLSearchParams({
            id: element["Id"]
        })

        assignmentName.innerHTML = element["assignmentName"]
        assignmentInfo.innerHTML = element["startTime"].replace("T", " ") + " - " + element["endTime"].replace("T", " ") + "<br />" + element["assignmentPath"]

        assignmentName.className = "absolute left-5 top-1/2 -translate-y-1/2 text-xl"
        assignmentInfoOuter.className = "absolute right-5 top-1/2 -translate-y-1/2 flex flex-row"
        assignmentInfo.className = "text-lg"
        assignmentInner.className = "block relative px-4 py-10 no-underline bg-white mb-4 rounded-lg hover:bg-rit-gray transition duration-200 border-2 border-brick-orange drop-shadow-lg"
        redXImg.className = "mx-5 translate-y-1/2"

        redXImg.src = "../assets/img/delete.png"
        redXImg.style.height="30px"
        redXImg.style.width="23px"

        redXImg.addEventListener("click", (e) => {
            e.preventDefault()
            fetch("http://BACKEND_HOST/assignment/" + element["Id"] + "?" + new URLSearchParams({
                sessionToken: localStorage.getItem("sessionToken")
            }), {
                method: "DELETE"
            })
            window.location.reload()
        })

        assignmentInner.appendChild(assignmentName)
        assignmentInfoOuter.appendChild(redXImg)
        assignmentInfoOuter.appendChild(assignmentInfo)
        assignmentInner.appendChild(assignmentInfoOuter)
        assignmentOuter.appendChild(assignmentInner)
        document.getElementById("assignments").appendChild(assignmentOuter)
    })
}

function newAssignment(event) {
    event.preventDefault()

    body = document.getElementsByTagName("body")[0]
    transparent = document.createElement("div")
    popup = document.createElement("div")
    inputsDiv = document.createElement("div")
    header = document.createElement("h1")
    nameDiv = document.createElement("div")
    nameLabel = document.createElement("p")
    aName = document.createElement("input")
    pathDiv = document.createElement("div")
    pathLabel = document.createElement("p")
    path = document.createElement("input")
    startDiv = document.createElement("div")
    startLabel = document.createElement("p")
    start = document.createElement("input")
    endDiv = document.createElement("div")
    endLabel = document.createElement("p")
    end = document.createElement("input")
    csvDiv = document.createElement("div")
    csvLabel = document.createElement("p")
    csv = document.createElement("input")
    wait = document.createElement("p")
    submit = document.createElement("input")

    aName.type = "text"
    path.type = "text"
    start.type = "datetime-local"
    end.type = "datetime-local"
    csv.type = "file"
    submit.type = "button"
    submit.value = "Submit"
    nameLabel.innerHTML = "Assignment Name: "
    pathLabel.innerHTML = "Assignment Path: "
    startLabel.innerHTML = "Start Time: "
    endLabel.innerHTML = "End Time: "
    csvLabel.innerHTML = "Create by CSV Upload: "
    wait.innerHTML = "Please Wait, Processing CSV File"
    header.innerHTML = "Create New Assignment"

    popup.className = "flex flex-col fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-rit-light-gray border-2 border-brick-orange rounded-lg drop-shadow-lg"
    inputsDiv.className = "flex flex-col mx-4 mb-4"
    nameDiv.className = "flex flex-row my-2"
    header.className = "text-center m-4 text-lg"
    nameLabel.className = "inline mr-2"
    aName.className = "self-center"
    pathDiv.className = "flex flex-row my-2"
    pathLabel.className = "inline mr-2"
    path.className = "self-center"
    startDiv.className = "flex flex-row my-2"
    startLabel.className = "inline mr-2"
    start.className = "self-center"
    endDiv.className = "flex flex-row my-2"
    endLabel.className = "inline mr-2"
    end.className = "self-center"
    csvDiv.className = "flex flex-row my-2"
    csvLabel.className = "inline mr-2"
    csv.className = "self-center"
    wait.className = "hidden"
    submit.className = "mb-4 bg-rit-dark-gray rounded border border-brick-orange self-center px-4 py-2 hover:border-rit-dark-gray hover:bg-brick-orange"
    transparent.className = "h-full w-full fixed bg-rit-gray opacity-75 z-10 top-0 left-0"

    submit.addEventListener("click", () => {
        if ((!aName.value || !path.value || !start.value || !end.value) && csv.files.length == 0) {
            return
        }

        if (csv.files.length == 0) {
            // Should probably add some error checking here eventually
            fetch("http://BACKEND_HOST/assignment?" + new URLSearchParams({
                sessionToken: window.localStorage.getItem("sessionToken")
            }), {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    assignmentName: aName.value,
                    assignmentPath: path.value,
                    startTime: new Date(start.value).toUTCString(),
                    endTime: new Date(end.value).toUTCString(),
                    courseId: parseInt(courseId)
                })
            })
            window.location.reload()
        } else {
            wait.className = "text-red self-center mb-4 block"

            ingestor = new CSVIngestor(csv.files[0], async (assignments) => {
                assignmentsBody = []

                assignments.forEach((line) => {
                    assignmentsBody.push({
                        assignmentName: line[0],
                        assignmentPath: line[1],
                        startTime: line[2],
                        endTime: line[3],
                        courseId: parseInt(courseId)
                    })
                })

                // Start and End Time Use Different Format Here to make CSV work properly
                // Example: 06-28-2022 08:55:30 GMT
                fetch("http://BACKEND_HOST/assignments?" + new URLSearchParams({
                    sessionToken: window.localStorage.getItem("sessionToken")
                }), {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(assignmentsBody)
                })
            })

            ingestor.addEventListener("load", (e) => {
                window.location.reload()
            })
        }
    })

    // Credit for closing popup when clicked outside of: https://www.codegrepper.com/code-examples/javascript/check+if+click+is+inside+div+javascript
    document.addEventListener("click", clearPopup = e => {
        if (document.getElementById("newAssignment") !== e.target && popup !== e.target && !popup.contains(e.target)) {
            e.preventDefault()
            body.removeChild(popup)
            body.removeChild(transparent)
            document.removeEventListener('click', clearPopup)
        }
    })

    body.appendChild(transparent)
    nameDiv.appendChild(nameLabel)
    nameDiv.appendChild(aName)
    pathDiv.appendChild(pathLabel)
    pathDiv.appendChild(path)
    startDiv.appendChild(startLabel)
    startDiv.appendChild(start)
    endDiv.appendChild(endLabel)
    endDiv.appendChild(end)
    csvDiv.appendChild(csvLabel)
    csvDiv.appendChild(csv)
    inputsDiv.appendChild(nameDiv)
    inputsDiv.appendChild(pathDiv)
    inputsDiv.appendChild(startDiv)
    inputsDiv.appendChild(endDiv)
    inputsDiv.appendChild(csvDiv)
    popup.appendChild(header)
    popup.appendChild(inputsDiv)
    popup.appendChild(wait)
    popup.appendChild(submit)
    body.appendChild(popup)
}

document.addEventListener("DOMContentLoaded", function(){
    // Code here waits to run until the DOM is loaded.
    getLoginAttempts()
    updateAssignments()
});