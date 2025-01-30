const loginForm = document.getElementById("loginForm");

window.onload = function() {
    fetch("http://127.0.0.1:5000/auth/is_logged_in", { credentials: 'include' })
    .then(request => request.json())
    .then(response => {
        console.log(response);
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
    }).then((request) => {
        if (!request.ok) {
            console.log("Something went wrong!", request);
            return null;
        }

        return request.json();
    }).then((data) => {
        console.log(data)
        window.location.href = "../pages/home.html";
    });
}

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let formData = new FormData(loginForm);
    login(formData);
});