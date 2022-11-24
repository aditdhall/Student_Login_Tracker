async function logout() {
    response = await fetch("http://BACKEND_HOST/logout?" + new URLSearchParams({
        sessionToken: localStorage.getItem("sessionToken")
    }), {
        method: 'DELETE'
    })

    window.localStorage.removeItem("sessionToken")
    window.location.replace("http://FRONTEND_HOST/login.html")
}

document.addEventListener("DOMContentLoaded", function(){
    logoutButton = document.getElementById("logout")

    logoutButton.addEventListener("click", (e) => {
        e.preventDefault()
        logout()
    })
});
