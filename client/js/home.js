window.onload = async () => {
    const res = await fetch("http://127.0.0.1:5000/auth/is_logged_in", { credentials: 'include' });
    const data = await res.json();
    if (!data.logged_in) {
        window.location.href = "../pages/login.html";
    }
    else {
        document.body.style.display = "block";
        getBooks();
    }
}

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


const bookForm = document.getElementById("bookForm");
const message = document.getElementById("message");

bookForm.addEventListener("submit", (e) => {
    e.preventDefault();
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

const createEvent = (eventName) => {
    const event = new CustomEvent(eventName, { detail: { message: "Update book list" } });
    document.dispatchEvent(event);
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

const addBookItems = (data) => {
    data.books.forEach((book, index) => {
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

        if (data.user_id == book.owner_id) {
            const btns = document.createElement("div");
            btns.classList.add("action-btns");
            const editBtn = createBtn("Edit", "edit-btn", "edit-btn");
            editBtn.addEventListener("click", () => handleUpdate(book));
            btns.appendChild(editBtn);

            const deleteBtn = createBtn(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z"/></svg>`,
                                        "delete-btn", "delete-btn");
            deleteBtn.addEventListener("click", () => handleDelete(book.book_id, bookElement));
            btns.appendChild(deleteBtn);
            bookElement.appendChild(btns);
        }
        else {
            const borrowBtn = createBtn("Borrow", "borrow-btn", "borrow-btn");
            bookElement.appendChild(borrowBtn);
        }

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
        addBookItems(data);
    })
    .then(error => console.log(error));
}