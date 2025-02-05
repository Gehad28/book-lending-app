import { showpopup, hidepopup, createElement, createBtn } from "./utils.js";

export function addBook(book, fun) {
    fetch("http://127.0.0.1:5000/book/add-book", {
        method: 'POST',
        credentials: 'include',
        body: book
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        fun(data);
        if (JSON.parse(localStorage.getItem('user')).user_id != data.book.owner_id)
            createBookItem(data.book);
    })
    .then(error => console.log(error));
}

export const getBooks = (endipoint, fun) => {
    fetch(`http://127.0.0.1:5000/book/${endipoint}`, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        console.log(data);
        fun(data);
    })
    .then(error => console.log(error));
}

const borrowBook = (book, btn) => {
    fetch(`http://127.0.0.1:5000/notification/send-notification?owner_id=${book.owner_id}&book_id=${book.book_id}`, {
        method: 'POST',
        credentials: 'include'
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        btn.disabled = true;
    })
    .then(error => console.log(error));
}

export const updateBook = (formData, id) => {
    fetch(`http://127.0.0.1:5000/book/update-book?book_id=${id}`, {
        method: 'POST',
        credentials: 'include',
        body: formData
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        console.log(data);
        hidepopup();
        updateBookCard(data.book);
    })
    .then(error => console.log(error));
}

export const deleteBook = (id, bookElement) => {
    fetch(`http://127.0.0.1:5000/book/delete-book?book_id=${id}`, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        console.log(data);
        bookElement.remove();
    })
    .then(error => console.log(error));
}

const setAsBorrowed = (book, btn) => {
    fetch(`http://127.0.0.1:5000/book/set-as-borrowed?book_id=${book.book_id}&flag=${true}`, {
        method: 'POST',
        credentials: 'include'
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        console.log(data);
        btn.innerText = "Make Available";
    })
    .then(error => console.log(error));
}

const makeAvailable = (book, btn) => {
    fetch(`http://127.0.0.1:5000/book/set-as-borrowed?book_id=${book.book_id}&flag=${false}`, {
        method: 'POST',
        credentials: 'include'
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        console.log(data);
        btn.innerText = "Set as Borrowed";
    })
    .then(error => console.log(error));
}

// _____ Rendering Books ______

const createInfoContainer = (book) => {
    const title = document.createElement("p");
    title.innerText = book.title;
    title.id = `title-${book.book_id}`;

    const author = document.createElement("p");
    author.innerText = book.author;
    author.id = `author-${book.book_id}`;

    const container = document.createElement("div");
    container.classList.add("info");
    container.append(title, author);
    return container;
}

const createActionBtns = (book, bookElement, user_id) => {
    if (book.owner_id == user_id) {
        const btns = document.createElement("div");
        btns.classList.add("action-btns");
    
        const editBtn = createBtn("Edit", "edit-btn", "edit-btn");
        editBtn.addEventListener("click", () => handleUpdate(book));
    
        const deleteBtn = createBtn(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z"/></svg>`,
                                    "delete-btn", "delete-btn");
        deleteBtn.addEventListener("click", () => deleteBook(book.book_id, bookElement));
    
        btns.append(editBtn, deleteBtn);
        return btns;
    }
    else {
        const borrowBtn = createBtn("Borrow", "borrow-btn", "borrow-btn");
        console.log(book.book_id, book.borrow_req);
        borrowBtn.disabled = Boolean(book.borrow_req);
        borrowBtn.addEventListener("click", () => borrowBook(book, borrowBtn));
        return borrowBtn;
    }
}

const createBorrowBtn = (book) => {
    const text = book.is_borrowed ? "Make Available" : "Set as Borrowed";
    const setBorrowd = createBtn(text, "set-borrow-btn", "set-borrow-btn");
    setBorrowd.addEventListener("click", () => handleBorrowing(book, setBorrowd));
    return setBorrowd;
}

const createUserInfo = (book) => {
    const info = createElement("div", "user-info", undefined, undefined);
    const image = document.createElement("img");
    image.classList.add("profile_image");
    image.src = `http://127.0.0.1:5000/${book.owner.image_path}`;
    const FName = createElement("p", "user-name", undefined, book.owner.f_name);
    const LName = createElement("p", "user-name", undefined, book.owner.l_name);
    info.append(FName, LName, image);
    return info;
}

const createBookElement = (book) => {
    const bookElement = createElement("li", "book-item", `book-${book.book_id}`, undefined);

    const image = document.createElement("img");
    image.classList.add("book_image");
    image.id = `image-${book.book_id}`;
    image.src = `http://127.0.0.1:5000/${book.image_path}`;

    const infoContainer = createInfoContainer(book);
    const actionBtns = createActionBtns(book, bookElement, JSON.parse(localStorage.getItem('user')).user_id);

    bookElement.append(image, infoContainer, actionBtns);

    const user_id = JSON.parse(localStorage.getItem("user")).user_id;
    if (book.owner_id == user_id) {
        const borrowBtn = createBorrowBtn(book);
        bookElement.appendChild(borrowBtn);
    }
    else {
        const userInfo = createUserInfo(book);
        bookElement.appendChild(userInfo);
    }
    return bookElement;
}

const setUpdateForm = (book) => {
    const editForm = document.getElementById("editForm");
    const b = {
        "title_up": book.title,
        "author_up": book.author
    }
    if (editForm) {
        Object.entries(b).forEach(([key, val]) => {
            const input = document.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = val;
            }
        });
    }

    editForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(editForm);
        const imageUpdatBtn = document.getElementById("image_up");
        if (imageUpdatBtn.files > 0) {
            formData.append("image_up", imageUpdatBtn.files[0]);
        }
        updateBook(formData, book.book_id);
    });
}

const handleUpdate = (book) => {
    showpopup();
    setUpdateForm(book);
}

const handleBorrowing = (book, btn) => {
    if (btn.innerText == "Set as Borrowed") {
        setAsBorrowed(book, btn);
    }
    else {
        makeAvailable(book, btn);
    }
}

const createBookItem = (book) => {
    const booksList = document.getElementById("books-list");
    const bookElement = createBookElement(book);
    booksList.appendChild(bookElement);
}

export const addBookItems = (data) => {
    data.books.reverse().forEach((book) => {
        createBookItem(book);
    });
}

const updateBookCard = (book) => {
    const image = document.getElementById(`image-${book.book_id}`);
    const title = document.getElementById(`title-${book.book_id}`);
    const author = document.getElementById(`author-${book.book_id}`);

    image.src = `http://127.0.0.1:5000/${book.image_path}`;
    title.innerText = book.title;
    author.innerText = book.author;
}