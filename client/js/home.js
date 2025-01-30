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


// ________________________________________

const booksList = document.getElementById("books-list");

const addBookItems = (books) => {
    books.forEach((book, index) => {
        const bookElement = document.createElement("li");
        bookElement.id = index;
        bookElement.classList.add("book-item");

        const title = document.createElement("p");
        title.innerText = book.title;

        const author = document.createElement("p");
        author.innerText = book.author;

        const container = document.createElement("div");
        container.classList.add("info");
        container.appendChild(title);
        container.appendChild(author);

        const image = document.createElement("img");
        image.src = `http://127.0.0.1:5000/${book.image_path}`;

        const borrowBtn = document.createElement("button");
        borrowBtn.innerText = "Borrow";
        borrowBtn.classList.add("borrow-btn");

        bookElement.appendChild(image);
        bookElement.appendChild(container);
        bookElement.appendChild(borrowBtn);

        booksList.appendChild(bookElement);
    });
}

const getBooks = () => {
    fetch("http://127.0.0.1:5000/book/get-all-books", {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        console.log(data);
        addBookItems(data.books);
    })
    .then(error => console.log(error));
}

window.onload = () => {
    getBooks();
}