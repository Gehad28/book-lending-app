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
            const editBtn = document.createElement("button");
            editBtn.innerText = "Edit";
            editBtn.classList.add("edit-btn");
            bookElement.appendChild(editBtn);

            const deleteBtn = document.createElement("button");
            deleteBtn.innerText = "Delete";
            deleteBtn.classList.add("delete-btn");
            bookElement.appendChild(deleteBtn);
        }
        else {
            const borrowBtn = document.createElement("button");
            borrowBtn.innerText = "Borrow";
            borrowBtn.classList.add("borrow-btn");
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

// window.onload = () => {
//     getBooks();
// }