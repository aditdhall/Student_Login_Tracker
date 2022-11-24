const urlParams = new URLSearchParams(window.location.search);

authuser = urlParams.get("authuser")
code = urlParams.get("code")
hd = urlParams.get("hd")
prompt = urlParams.get("prompt")
scope = urlParams.get("scope")
state = urlParams.get("state")

console.log("authuser " + authuser +
            "\ncode " + code +
            "\nhd " + hd +
            "\nprompt " + prompt +
            "\nscope " + scope +
            "\nstate " + state)

// TODO: Forward auth info to api to determine who the user is. Give user a session key with set expiry time to be kept in session storage. This isn't secure but at least it'll work.
// Afterwards, redirect to the appropriate dashboard

async function getBackendAuth() {
    // Credit for concise GET fetch: https://stackoverflow.com/questions/35038857/setting-query-string-using-fetch-get-request
    response = await fetch("http://BACKEND_HOST/auth?" + new URLSearchParams({
        authCode: code
    }))
    jsonResponse = await response.json()

    window.localStorage.setItem("sessionToken", jsonResponse["sessionToken"])
    window.localStorage.setItem("userRole", jsonResponse["userRole"])
    window.localStorage.setItem("username", jsonResponse["username"])
    
    if (jsonResponse["userRole"] == "student") {
        window.location.replace("http://FRONTEND_HOST/dashboards/student.html")
    } else if (jsonResponse["userRole"] == "professor") {
        window.location.replace("http://FRONTEND_HOST/dashboards/professor.html")
    } else if (jsonResponse["userRole"] == "systemAdmin") {
        window.location.replace("http://FRONTEND_HOST/dashboards/sysadmin.html")
    }
}

getBackendAuth()