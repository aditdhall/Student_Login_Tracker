async function getUsers(tableType) {
    response = await fetch("http://BACKEND_HOST/users?" + new URLSearchParams({
        sessionToken: localStorage.getItem("sessionToken")
    }))

    jsonResponse = await response.json()
    
    users = []

    // loop through list of users within the database and append to table
    jsonResponse["Users"].forEach(element => {
        if(element["userRole"] !== tableType && tableType !== "all") {
            return
        }

        if (element["userRole"] === "student") {

            link = "/dashboards/studentCourses.html?" + new URLSearchParams({
                userID: element["id"],
                username: element["username"]
            })

            
            users.push(["<a class=\"text-blue decoration-solid userID\" href=\"" + link + "\">" + element["id"] + "</a>", element["username"], element["userRole"], '<img class="mr-6" src="/assets/img/delete.png" width="20" height="30" onclick="del(event)">'])
        } else {
            if (element["username"] !== localStorage.getItem("username")) {
                users.push([element["id"], element["username"], element["userRole"], '<img class="mr-6" src="/assets/img/delete.png" width="20" height="30" onclick="del(event)">'])
            } else {
                users.push([element["id"], element["username"], element["userRole"], ""])
            }
        }
    });

    tab = document.getElementById(tableType + "-tab")
    tab.innerHTML = ""

    new gridjs.Grid({
        columns: [{
            name: "User ID",
            width: "34%",
            formatter: (cell) => gridjs.html(`${cell}`)
        }, "Username", "Role", {
            name: "Options",
            formatter: (cell) => gridjs.html(`${cell}`)
        }],
        data: users,
        search: {
            enabled: true
        },
        sort: true,
        pagination: {
            enabled: true,
            limit: 10,
            summary: true
        }
    }).render(tab)
}

function del(event) {
    event.preventDefault()
    fetch("http://BACKEND_HOST/user/" + event.target.parentNode.parentNode.parentNode.getElementsByClassName("userID")[0].innerHTML + "?" + new URLSearchParams({
        sessionToken: localStorage.getItem("sessionToken")
    }), {
        method: "DELETE"
    }).then(response => {
        window.location.replace(window.location.href);
    })
}

function newUser(event) {
    event.preventDefault()

    body = document.getElementsByTagName("body")[0]
    transparent = document.createElement("div")
    popup = document.createElement("div")
    inputsDiv = document.createElement("div")
    header = document.createElement("h1")
    nameDiv = document.createElement("div")
    nameLabel = document.createElement("p")
    aName = document.createElement("input")
    roleDiv = document.createElement("div")
    roleLabel = document.createElement("p")
    role = document.createElement("select")
    roleStud = document.createElement("option")
    roleProf = document.createElement("option")
    roleSys = document.createElement("option")
    csvDiv = document.createElement("div")
    csvLabel = document.createElement("p")
    csv = document.createElement("input")
    wait = document.createElement("p")
    submit = document.createElement("input")

    aName.type = "text"
    submit.type = "button"
    csv.type = "file"
    submit.value = "Submit"
    roleStud.value = "student"
    roleProf.value = "professor"
    roleSys.value = "systemAdmin"
    nameLabel.innerHTML = "Username: "
    roleLabel.innerHTML = "User Role: "
    csvLabel.innerHTML = "Add by CSV Upload: "
    header.innerHTML = "Create New User"
    roleStud.innerHTML = "student"
    roleProf.innerHTML = "professor"
    roleSys.innerHTML = "systemAdmin"
    wait.innerHTML = "Please Wait, Processing CSV File"

    popup.className = "flex flex-col fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-rit-light-gray border-2 border-brick-orange rounded-lg drop-shadow-lg"
    inputsDiv.className = "flex flex-col mx-4 mb-4"
    nameDiv.className = "flex flex-row my-2"
    header.className = "text-center m-4 text-lg"
    nameLabel.className = "inline mr-2"
    aName.className = "self-center"
    roleDiv.className = "flex flex-row my-2"
    roleLabel.className = "inline mr-2"
    role.className = "self-center"
    csvDiv.className = "flex flex-row my-2"
    csvLabel.className = "inline mr-2"
    csv.className = "self-center"
    wait.className = "hidden"
    submit.className = "mb-4 bg-rit-dark-gray rounded border border-brick-orange self-center px-4 py-2 hover:border-rit-dark-gray hover:bg-brick-orange"
    transparent.className = "h-full w-full fixed bg-rit-gray opacity-75 z-10 top-0 left-0"

    submit.addEventListener("click", () => {
        if ((!aName.value || !role.value) && csv.files.length == 0) {
            return
        }

        if (csv.files.length == 0) {
            // Should probably add some error checking here eventually
            fetch("http://BACKEND_HOST/createUsers", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    users: [[aName.value, role.value]],
                    sessionToken: localStorage.getItem("sessionToken")
                })
            })

            window.location.reload()
        } else {
            wait.className = "text-red self-center mb-4 block"

            ingestor = new CSVIngestor(csv.files[0], async (users) => {
                usersBody = []

                users.forEach((line) => {
                    // line[0] = Username, line[1] = role (professor, student, systemAdmin)
                    usersBody.push([line[0], line[1]])
                })

                fetch("http://BACKEND_HOST/createUsers", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        users: usersBody,
                        sessionToken: localStorage.getItem("sessionToken")
                    })
                })
            })

            ingestor.addEventListener("load", (e) => {
                window.location.reload()
            })
        }
    })

    // Credit for closing popup when clicked outside of: https://www.codegrepper.com/code-examples/javascript/check+if+click+is+inside+div+javascript
    document.addEventListener("click", clearPopup = e => {
        if (document.getElementById("newUser") !== e.target && popup !== e.target && !popup.contains(e.target)) {
            e.preventDefault()
            body.removeChild(popup)
            body.removeChild(transparent)
            document.removeEventListener('click', clearPopup)
        }
    })

    body.appendChild(transparent)
    nameDiv.appendChild(nameLabel)
    nameDiv.appendChild(aName)
    role.appendChild(roleStud)
    role.appendChild(roleProf)
    role.appendChild(roleSys)
    roleDiv.appendChild(roleLabel)
    roleDiv.appendChild(role)
    csvDiv.appendChild(csvLabel)
    csvDiv.appendChild(csv)
    inputsDiv.appendChild(nameDiv)
    inputsDiv.appendChild(roleDiv)
    inputsDiv.appendChild(csvDiv)
    popup.appendChild(header)
    popup.appendChild(inputsDiv)
    popup.appendChild(wait)
    popup.appendChild(submit)
    body.appendChild(popup)
}

document.addEventListener("DOMContentLoaded", () => { getUsers("all") })