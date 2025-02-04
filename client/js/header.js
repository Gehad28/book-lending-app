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