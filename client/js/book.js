import { showpopup, hidepopup, createElement, createBtn, createEvent } from "./utils.js";
import { deleteNotification } from "./notifications.js";

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

export const setAsBorrowed = (book_id, btn, borrower_id, notification_id, notificationEle) => {
    const baseUrl = 'http://127.0.0.1:5000/book/set-as-borrowed';

    // Create a URL object
    const url = new URL(baseUrl);

    // Append required query parameters
    url.searchParams.append('book_id', book_id);
    url.searchParams.append('flag', true); // or use flag.toString() if needed

    // Only append borrower_id if it is defined and not null
    if (borrower_id !== undefined && borrower_id !== null) {
        url.searchParams.append('borrower_id', borrower_id);
    }
    fetch(url.toString(), {
        method: 'POST',
        credentials: 'include'
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        if (btn.id == "set-borrow-btn")
            btn.innerText = "Make Available";
        else {
            createEvent("updateBtnText");   // Dispatch an event called updatebtnText to update the set as borrowed btn
            createEvent("createBorrowerInfo");
            deleteNotification(notification_id, notificationEle);
        }
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
        document.getElementById("borrower-info")?.remove();
    })
    .then(error => console.log(error));
}

export const refuseBorrowing = (book_id, notification_id, notificationEle) => {
    fetch(`http://127.0.0.1:5000/book/set-as-borrowed?book_id=${book_id}&flag=${false}`, {
        method: 'POST',
        credentials: 'include'
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        deleteNotification(notification_id, notificationEle);
    })
    .then(error => console.log(error));
}

const getUser = (user_id) => {
    const user = {};
    fetch(`http://127.0.0.1:5000/user/get-user?user_id=${user_id}`, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        user = data.user;
    })
    .then(error => console.log(error));
    return user;
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
    
        const deleteBtn = createBtn(`Delete`,
                                    "delete-btn", "delete-btn");
        deleteBtn.addEventListener("click", () => deleteBook(book.book_id, bookElement));
    
        btns.append(editBtn, deleteBtn);
        return btns;
    }
    else {
        const borrowBtn = createBtn("Borrow", "borrow-btn", "borrow-btn");
        borrowBtn.disabled = Boolean(book.borrow_req);
        borrowBtn.addEventListener("click", () => borrowBook(book, borrowBtn));
        return borrowBtn;
    }
}

const createBorrowBtn = (book) => {
    const text = book.is_borrowed ? "Make Available" : "Set as Borrowed";
    const setBorrowd = createBtn(text, "set-borrow-btn", "set-borrow-btn");
    setBorrowd.addEventListener("click", () => handleBorrowing(book, setBorrowd));
    document.addEventListener("updateBtnText", () => setBorrowd.innerText = "Make Available");
    return setBorrowd;
}

const createUserInfo = (book) => {
    const info = createElement("div", "user-info", undefined, undefined);
    const image = document.createElement("img");
    image.classList.add("profile_image");
    image.src = `http://127.0.0.1:5000/${book.owner.image_path}`;
    const FName = createElement("p", "user-name", undefined, book.owner.f_name);
    const LName = createElement("p", "user-name", undefined, book.owner.l_name);
    const name = createElement("div", "name", undefined, undefined);
    name.append(FName, LName);
    info.append(image, name);
    return info;
}

const createBorrowerInfo = (borrower) => {
    const info = createElement("div", "borrower-info", "borrower-info", "Borrowed by:");
    const FName = createElement("p", "user-name", undefined, borrower.f_name);
    const LName = createElement("p", "user-name", undefined, borrower.l_name);
    const name = createElement("div", "name", undefined, undefined);
    const email = createElement("p", "user-email", undefined, borrower.email);
    const phone = createElement("p", "user-phone", undefined, borrower.phone);
    const emailIcon = createElement("i", "fas", undefined, undefined);
    emailIcon.classList.add("fa-envelope");
    const phoneIcon = createElement("i", "fas", undefined, undefined);
    phoneIcon.classList.add("fa-phone");
    email.appendChild(emailIcon);
    phone.appendChild(phoneIcon);
    name.append(FName, LName);
    info.append(name, email, phone);
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
    const cradInfo = createElement("div", "card-info", undefined, undefined);
    cradInfo.append(infoContainer, actionBtns);

    const user_id = JSON.parse(localStorage.getItem("user")).user_id;
    if (book.owner_id == user_id) {
        const borrowBtn = createBorrowBtn(book);
        cradInfo.appendChild(borrowBtn);
        if (book.borrower) {
            const borrowerInfo = createBorrowerInfo(book.borrower);
            cradInfo.appendChild(borrowerInfo);
        }
        // document.addEventListener("createBorrowerInfo", () => {
        //     const borrowerInfo = createBorrowerInfo(book.borrower);
        //     cradInfo.appendChild(borrowerInfo);
        // });
    }
    else {
        const userInfo = createUserInfo(book);
        cradInfo.appendChild(userInfo);
    }
    
    bookElement.append(image, cradInfo);
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
        setAsBorrowed(book.book_id, btn, null);
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