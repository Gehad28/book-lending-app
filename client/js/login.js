const loginForm = document.getElementById("loginForm");

window.onload = function() {
    fetch("http://127.0.0.1:5000/auth/is_logged_in", { credentials: 'include' })
    .then(request => request.json())
    .then(response => {
        if (response.logged_in) {
            window.location.href = "../pages/home.html";
        }
    });
}

const login = (formData) => {
    fetch("http://127.0.0.1:5000/auth/login", {
        method: 'POST',
        credentials: "include",
        body: formData
    }).then((request) => request.json()
    ).then((data) => {
        if (data.error) {
            document.querySelector(".error-message")?.classList.remove("active");
            const mes = document.getElementById("error-message");
            mes.classList.add("active");
            mes.innerText = data.error
        }
        else {
            localStorage.setItem("user", JSON.stringify(data.user));
            window.location.href = "../pages/home.html";
        }
    });
}

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let formData = new FormData(loginForm);
    login(formData);
});