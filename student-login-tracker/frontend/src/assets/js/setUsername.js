document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("username").innerHTML = window.localStorage.getItem("username")
})