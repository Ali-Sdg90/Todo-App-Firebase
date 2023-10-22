const encryptedEmailAdrs = window.location.href.split("/").reverse()[0];
const decryptedEmailAdrs = urlDecoder(encryptedEmailAdrs);

console.log("Encrypted_URL:", encryptedEmailAdrs);
console.log("Decrypted_URL:", decryptedEmailAdrs);

// Update todos to Firebase server
function updateTodos() {
    const db = firebase.firestore();
    const myPost = db.collection("Accounts").doc(decryptedEmailAdrs);
    const newData = todoSaves;
    myPost.update({ UserTodo: JSON.parse(JSON.stringify(newData)) });
}

// Get todos from Firebase server
document.addEventListener("DOMContentLoaded", () => {
    const db = firebase.firestore();
    const myPost = db.collection("Accounts").doc(decryptedEmailAdrs);

    myPost.get().then((doc) => {
        firebaseOnline = true;
        const data = doc.data();

        userInfo = data.UserInfo;

        console.log("UserInfo:", userInfo);
        console.log("UserTodo:", data.UserTodo);

        if (userInfo.photoURL) {
            document
                .querySelector(".email-image")
                .setAttribute("src", userInfo.photoURL);
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

        todoSaves = data.UserTodo;
        updateHTML(false);

        loadingPage.style.opacity = "0";
        setTimeout(() => {
            loadingPage.style.display = "none";
        }, 300);
    });
});