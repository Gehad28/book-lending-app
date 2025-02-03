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


const handleBorrow = (book) => {
    fetch(`http://127.0.0.1:5000/notification/send-notification?owner_id=${book.owner_id}&book_id=${book.book_id}`, {
        method: 'POST',
        credentials: 'include'
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        console.log(data);
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
        const borrowBtn = createBtn("Borrow", "borrow-btn", "borrow-btn");
        borrowBtn.addEventListener("click", () => handleBorrow(book));
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
        addBookItems(data);
    })
    .then(error => console.log(error));
}