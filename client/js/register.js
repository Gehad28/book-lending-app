const registerForm = document.getElementById("registerForm");

const register = (formData) => {
    fetch("http://127.0.0.1:5000/user/register", {
        method: 'POST',
        credentials: "include",
        body: formData
    }).then(request => {
        if (!request.ok) {
            console.log("Something went wrong!");
            return null;
        }
        return request.json();
    }).then(data => {
        window.location.href = "../pages/home.html";
    });
}

registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let formData = new FormData(registerForm);
    register(formData);
});