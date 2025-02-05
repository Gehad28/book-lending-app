import { checkLoging } from "./utils.js";
import { addBook, getBooks, addBookItems } from "./book.js";

document.addEventListener("DOMContentLoaded", () => {
    checkLoging([() => getBooks("get-all-books", (data) => addBookItems(data))]);


    const bookForm = document.getElementById("bookForm");
    const message = document.getElementById("message");
    bookForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(bookForm);
        addBook(formData, function(data) { message.innerText = data.message; })
        bookForm.reset();
    });
});