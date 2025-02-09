const registerForm = document.getElementById("registerForm");

const register = (formData) => {
    fetch("http://127.0.0.1:5000/user/register", {
        method: 'POST',
        credentials: "include",
        body: formData
    }).then(request => request.json()
    ).then(data => {
        document.querySelector(".error-message.active")?.classList.remove("active");
        if (data.errors) {
            const errors = document.querySelectorAll(".error-message");
            errors.forEach(error => {
                if (data.errors[error.dataset.error]) {
                    error.classList.toggle("active");
                    error.innerText = data.errors[error.dataset.error];
                }
            });
        }
        else {
            window.location.href = "../pages/home.html";
        }
    });
}

registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let formData = new FormData(registerForm);
    register(formData);
});