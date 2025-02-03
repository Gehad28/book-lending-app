const booksOption = document.getElementById("books");
const notificationsOption = document.getElementById("notifications");
const settingsOption = document.getElementById("settings");
const contentBooks = document.getElementById("content-books");
const contentNotifications = document.getElementById("content-notifications");
const contentSettings = document.getElementById("content-settings");

const displayConent = (activeTab, element) => {
    activeTab.classList.add("active");
    element.style.display = "block";
}

const hideContent = (tabs, elements) => {
    tabs.forEach(tab => {
        tab.classList.remove("active");
    });

    elements.forEach(element => {
        element.style.display = "none";
    });
}

booksOption.addEventListener("click", () => {
    displayConent(booksOption, contentBooks);
    hideContent([notificationsOption, settingsOption], [contentNotifications, contentSettings]);
});

notificationsOption.addEventListener("click", () => {
    displayConent(notificationsOption, contentNotifications);
    hideContent([booksOption, settingsOption], [contentBooks, contentSettings]);
});

settingsOption.addEventListener("click", () => {
    displayConent(settingsOption, contentSettings);
    hideContent([booksOption, notificationsOption], [contentBooks, contentNotifications]);
});

const booksList = document.getElementById("books-list");
const notificationsList = document.getElementById("notifications-list");

window.onload = async () => {
    const res = await fetch("http://127.0.0.1:5000/auth/is_logged_in", { credentials: 'include' });
    const data = await res.json();
    if (!data.logged_in) {
        window.location.href = "../pages/login.html";
    }
    else {
        document.body.style.display = "block";
        getBooks();
        getNotifications();
    }

    const ulrParams = new URLSearchParams(window.location.search);
    if (ulrParams.get("notifications") == "true") {
        displayConent(notificationsOption, contentNotifications);
        hideContent([booksOption, settingsOption], [contentBooks, contentSettings]);
    }
}

const createBtn = (innerText, className, id) => {
    const btn = document.createElement("button");
    btn.innerHTML = innerText;
    btn.classList.add(className);
    btn.id = id;
    return btn;
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
        // e.preventDefault();
        const formData = new FormData(editForm);
        const imageUpdatBtn = document.getElementById("image_up");
        if (imageUpdatBtn.files > 0) {
            formData.append("image_up", imageUpdatBtn.files[0]);
        }
        updateBook(formData, book.book_id);
    });
}

const updateBook = (formData, id) => {
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
        // update book list
    })
    .then(error => console.log(error));
}

const handleUpdate = (book) => {
    const container = document.querySelector(".form-popup");
    const overlay = document.querySelector(".overlay");
    container.style.display = "block";
    overlay.style.display = "block";
    overlay.addEventListener("click", () => {
        container.style.display = "none";
        overlay.style.display = "none";
    });
    setUpdateForm(book);
}

const handleDelete = (id, bookElement) => {
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

const handleBorrowing = (book, btn) => {
    if (btn.innerText == "Set as Borrowed") {
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
            console.log(btn.innerText);
        })
        .then(error => console.log(error));
    }
    else {
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
}

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

        bookElement.appendChild(image);
        bookElement.appendChild(container);

        const btns = document.createElement("div");
        btns.classList.add("action-btns");
        const editBtn = createBtn("Edit", "edit-btn", "edit-btn");
        editBtn.addEventListener("click", () => handleUpdate(book));
        btns.appendChild(editBtn);

        const deleteBtn = createBtn(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z"/></svg>`,
                                    "delete-btn", "delete-btn");
        deleteBtn.addEventListener("click", () => handleDelete(book.book_id, bookElement));
        btns.appendChild(deleteBtn);
        
        const text = book.is_borrowed ? "Make Available" : "Set as Borrowed";
        const setBorrowd = createBtn(text, "set-borrow-btn", "set-borrow-btn");
        setBorrowd.addEventListener("click", () => handleBorrowing(book, setBorrowd));
        bookElement.appendChild(btns);
        bookElement.appendChild(setBorrowd);

        booksList.appendChild(bookElement);
    });
}

const getBooks = () => {
    fetch("http://127.0.0.1:5000/book/get-user-books", {
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

const addNotificationItems = (notifications) => {
    notifications.forEach(notification => {
        const notificationElement = document.createElement("li");
        notificationElement.id = notification.id;
        notificationElement.classList.add("notification-item");

        const message = document.createElement("p");
        message.classList.add("notification-message");
        message.innerText = notification.message;

        notificationElement.appendChild(message);
        notificationsList.appendChild(notificationElement);
    });
}

const getNotifications = () => {
    fetch("http://127.0.0.1:5000/notification/get-notifications", {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        console.log(data);
        addNotificationItems(data.notifications);
    })
    .then(error => console.log(error));
}

const settings = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const fName = document.getElementById("f_name");
    const lName = document.getElementById("l_name");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");

    fName.innerText = user['f_name'];
    lName.innerText = user['l_name'];
    email.innerText = user['email'];
    phone.innerText = user['phone'];
}

settings();

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {
    fetch("http://127.0.0.1:5000/auth/logout", { credentials: 'include' })
    .then(request => request.json())
    .then(response => {
        console.log(response);
        if (!response.logged_in) {
            window.location.href = "../pages/login.html";
        }
    });
})