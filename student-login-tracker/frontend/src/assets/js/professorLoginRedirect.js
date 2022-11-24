// Need to change this to verify session token authenticity
if (!window.localStorage.getItem("sessionToken") || window.localStorage.getItem("userRole") !== "professor") {
    window.location.replace("http://FRONTEND_HOST/login.html")
}