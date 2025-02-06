const navItems = document.querySelectorAll(".nav-options a");

navItems.forEach(item => {
    item.addEventListener("click", () => {
        if (window.location.href.startsWith(item.href)) {
            document.querySelector(".nav-options a.active")?.classList.remove("active");
            item.classList.add("active");
        }
    });
})


const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {
    fetch("http://127.0.0.1:5000/auth/logout", { credentials: 'include' })
    .then(request => request.json())
    .then(response => {
        console.log(response);
        if (!response.logged_in) {
            localStorage.removeItem('user');
            window.location.href = "../pages/login.html";
        }
    });
});