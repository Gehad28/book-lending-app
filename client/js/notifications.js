export const getNotifications = (fun) => {
    fetch("http://127.0.0.1:5000/notification/get-notifications", {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        fun(data.notifications);
    });
}

export const deleteNotification = (id, notificationEle) => {
    fetch(`http://127.0.0.1:5000/notification//mark-as-read?id=${id}`, {
        method: 'POST',
        credentials: 'include'
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        notificationEle.remove();
    });
}