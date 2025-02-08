import { addBook, getBooks, addBookItems, setAsBorrowed, refuseBorrowing } from "./book.js";
import { getNotifications } from "./notifications.js";
import { checkLoging, displayConent, hideContent, showpopup, createElement, createBtn } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
    checkLoging([() => getBooks("get-user-books", (data) => addBookItems(data)), () => getNotifications((notifications) => addNotificationItems(notifications))]);


    const createTabs = () => {
        const booksOption = document.getElementById("books");
        const notificationsOption = document.getElementById("notifications");
        const settingsOption = document.getElementById("settings");
        const contentBooks = document.getElementById("content-books");
        const contentNotifications = document.getElementById("content-notifications");
        const contentSettings = document.getElementById("content-settings");
    
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

        const ulrParams = new URLSearchParams(window.location.search);
        if (ulrParams.get("notifications") == "true") {
            displayConent(notificationsOption, contentNotifications);
            hideContent([booksOption, settingsOption], [contentBooks, contentSettings]);
        }
    }

    createTabs();
    
    const addNotificationItems = (notifications) => {
        const notificationsList = document.getElementById("notifications-list");
        notifications.forEach(notification => {
            const notificationElement = createElement("li", "notification-item", notification.id, undefined);
            const message = createElement("p", "notification-message", undefined, notification.message);
            const acceptBtn = createBtn("Accept", "accept-btn", "accept-btn");
            const refuseBtn = createBtn("Refuse", "refuse-btn", "refuse-btn");
            const actionBtns = createElement("div", "action-btns", undefined, undefined);
            actionBtns.append(acceptBtn, refuseBtn);
            notificationElement.append(message, actionBtns);
            notificationsList.appendChild(notificationElement);
            acceptBtn.addEventListener("click", () => setAsBorrowed(notification.book_id, acceptBtn, notification.id, notificationElement));
            refuseBtn.addEventListener("click", () => refuseBorrowing(notification.book_id, notification.id, notificationElement));
        });
    }

    const settings = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        const fName = document.getElementById("f_name");
        const lName = document.getElementById("l_name");
        const email = document.getElementById("email");
        const phone = document.getElementById("phone");
        const img = document.getElementById("profile-img");
        img.src = `http://127.0.0.1:5000/${user.image_path}`;
    
        fName.innerText = user['f_name'];
        lName.innerText = user['l_name'];
        email.innerText = user['email'];
        phone.innerText = user['phone'];
    }
    
    settings();
});