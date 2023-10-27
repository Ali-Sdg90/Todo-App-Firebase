const publicSession = document.querySelector(".public-session");
const privateSession = document.querySelector(".private-session");
const anonymousSession = document.querySelector(".anonymous-session");

const publicSessionInput = document.getElementById("public-session-input");
const privateSessionInput = document.getElementById("private-session-input");
const anonymousSessionInput = document.getElementById(
    "anonymous-session-input"
);

const emailLogoutAddress = document.querySelector(".email-logout-address");

// ----Run-local---- //
const localMode = true;
// ----------------- //

let LoginBaseURL = "";
let TodoBaseURL = "";

if (localMode) {
    LoginBaseURL = "http://localhost:3000/Todo-Login-Page/";
    TodoBaseURL = "http://localhost:5000/";
} else {
    LoginBaseURL = "https://ali-sdg90.github.io/Todo-Login-Page/";
    TodoBaseURL = "https://ali-sdg9093-todo-app.web.app/";
}

const encryptedEmailAdrs = window.location.href.split("/").reverse()[0];
let decryptedEmailAdrs = "";

try {
    decryptedEmailAdrs = urlDecoder(encryptedEmailAdrs);
} catch (error) {
    window.location.href = `${LoginBaseURL}goAnonymousMode`;
}

console.log("Encrypted_URL:", encryptedEmailAdrs);
console.log("Decrypted_URL:", decryptedEmailAdrs);

emailLogoutAddress.setAttribute("href", LoginBaseURL);

if (!encryptedEmailAdrs) {
    window.location.href = `${LoginBaseURL}goAnonymousMode`;
}

// Update todos to Firebase server
function updateTodos() {
    const db = firebase.firestore();
    const myPost = db.collection("Accounts").doc(decryptedEmailAdrs);
    const newData = todoSaves;
    myPost.update({ UserTodo: JSON.parse(JSON.stringify(newData)) });
}

// Add log to Todos collection
const addToDataBase = () => {
    const db = firebase.firestore();
    const myPost = db.collection("Todos").doc("todos-data");
    const newData = todoSaves;

    const date = new Date();
    const logTime = date.getTime();

    const updateObj = {};
    updateObj[logTime] = {
        UserEmail: decryptedEmailAdrs,
        UserTodo: JSON.parse(JSON.stringify(newData)),
    };

    myPost.update(updateObj);
};

// Get todos from Firebase server
document.addEventListener("DOMContentLoaded", () => {
    const db = firebase.firestore();
    const myPost = db.collection("Accounts").doc(decryptedEmailAdrs);

    myPost.get().then((doc) => {
        firebaseOnline = true;
        const data = doc.data();

        try {
            userInfo = data.UserInfo;
        } catch (error) {
            window.location.href = `${LoginBaseURL}goAnonymousMode`;
        }

        console.log("UserInfo:", userInfo);
        console.log("UserTodo:", data.UserTodo);

        if (userInfo.photoURL) {
            document.querySelector(
                ".email-image"
            ).style.background = `url(${userInfo.photoURL}) center/cover no-repeat`;
        }

        if (!userInfo.isAnonymous) {
            document.querySelector(".email-address").textContent =
                userInfo.email;
            document.querySelector(".email-logout").textContent = "Logout";
        } else {
            document.querySelector(".email-logout").textContent = "Login";
            document.querySelector(".email-address").textContent = "";
        }

        document.querySelector(".email-full-name").textContent =
            userInfo.displayName;

        switch (userInfo.displayName) {
            case "Public Session":
                document.getElementById("public-session-input").checked =
                    "true";
                break;
            case "Anonymous User":
                document.getElementById("anonymous-session-input").checked =
                    "true";
                break;
            default:
                document.getElementById("private-session-input").checked =
                    "true";
        }

        if (!anonymousSessionInput.checked) {
            anonymousSession.addEventListener("click", () => {
                window.location.href = `${LoginBaseURL}goAnonymousMode`;
            });
        }

        if (!publicSessionInput.checked) {
            publicSession.addEventListener("click", () => {
                window.location.href = `${TodoBaseURL}17a%25C2%2586s%257Dzt1dv%25C2%2584%25C2%2584z%25C2%2580%257F`;
            });
        }

        if (!privateSessionInput.checked) {
            privateSession.addEventListener("click", () => {
                window.location.href = LoginBaseURL;
            });
        }

        todoSaves = data.UserTodo;
        updateHTML(false);

        loadingPage.style.opacity = "0";
        setTimeout(() => {
            loadingPage.style.display = "none";
        }, 300);
    });
});
