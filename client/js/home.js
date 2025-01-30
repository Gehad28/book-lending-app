const bookForm = document.getElementById("bookForm");
const message = document.getElementById("message");

bookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Form Submittted.");
    const formData = new FormData(bookForm);
    fetch("http://127.0.0.1:5000/book/add-book", {
        method: 'POST',
        credentials: 'include',
        body: formData
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        message.innerText = data.message;
    })
    .then(error => console.log(error));
    bookForm.reset();
});