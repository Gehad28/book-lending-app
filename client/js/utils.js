export const checkLoging = async (funs) => {
    const res = await fetch("http://127.0.0.1:5000/auth/is_logged_in", { credentials: 'include' });
    const data = await res.json();
    if (!data.logged_in) {
        window.location.href = "../pages/login.html";
    }
    else {
        document.body.style.display = "block";
        funs.forEach(fun => fun(data));
    }
}

export const createBtn = (innerText, className, id) => {
    const btn = document.createElement("button");
    btn.innerHTML = innerText;
    btn.classList.add(className);
    btn.id = id;
    return btn;
}

export const displayConent = (activeTab, element) => {
    activeTab.classList.add("active");
    element.style.display = "block";
}

export const hideContent = (tabs, elements) => {
    tabs.forEach(tab => {
        tab.classList.remove("active");
    });

    elements.forEach(element => {
        element.style.display = "none";
    });
}

const popup = (display) => {
    const container = document.querySelector(".form-popup");
    const overlay = document.querySelector(".overlay");
    container.style.display = display;
    overlay.style.display = display;
    if (display == "block")
        overlay.addEventListener("click", () => popup("none"));
}

export const showpopup = () => {
    popup("block");
}

export const hidepopup = () => {
    popup("none");
}

export const createElement = (...args) => {
    const ele = document.createElement(args[0]);
    ele.classList.add(args[1]);
    if (args[2])
        ele.id = args[2];
    if (args[3])
        ele.innerText = args[3];
    return ele;
}