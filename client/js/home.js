import { checkLoging } from "./utils.js";
import { addBook, getBooks, addBookItems } from "./book.js";

document.addEventListener("DOMContentLoaded", () => {
    checkLoging([() => getBooks("get-all-books", (data) => addBookItems(data))]);


    const bookForm = document.getElementById("bookForm");
    const message = document.getElementById("message");
    const booksList = document.getElementById("books-list");

    bookForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(bookForm);
        addBook(formData, function(data) { message.innerText = data.message; })
        bookForm.reset();
    });

    // const addBookItems = (data) => {
    //     data.books.forEach((book, index) => {
    //         const bookElement = document.createElement("li");
    //         bookElement.id = index;
    //         bookElement.classList.add("book-item");
    
    //         const title = document.createElement("p");
    //         title.innerText = book.title;
    
    //         const author = document.createElement("p");
    //         author.innerText = book.author;
    
    //         const container = document.createElement("div");
    //         container.classList.add("info");
    //         container.appendChild(title);
    //         container.appendChild(author);
    
    //         const image = document.createElement("img");
    //         image.src = `http://127.0.0.1:5000/${book.image_path}`;
    
    //         bookElement.appendChild(image);
    //         bookElement.appendChild(container);
    //         const borrowBtn = createBtn("Borrow", "borrow-btn", "borrow-btn");
    //         borrowBtn.addEventListener("click", () => borrowBook(book));
    //         bookElement.appendChild(borrowBtn);
    //         booksList.appendChild(bookElement);
    //     });
    // }
    
});


const createEvent = (eventName) => {
    const event = new CustomEvent(eventName, { detail: { message: "Update book list" } });
    document.dispatchEvent(event);
}
