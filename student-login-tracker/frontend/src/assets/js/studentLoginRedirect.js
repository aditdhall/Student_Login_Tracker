// Need to change this to verify session token authenticity
if (!window.localStorage.getItem("sessionToken") || window.localStorage.getItem("userRole") !== "student") {
    window.location.replace("http://FRONTEND_HOST/login.html")
}