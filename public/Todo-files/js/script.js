const addBtn = document.getElementById("add-btn");
const todoCounter = document.getElementById("todo-counter");
const taskTasks = document.getElementById("task-tasks");
const pendingFilter = document.getElementById("pending-filter");
const clearAll = document.getElementById("clear-btn");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("save-list");
const loadingPage = document.getElementById("loading-page");
let todoSaves = [];
let filteredTodoSaves = [];
let editTodo = -1;
let firstTopFilter = 35.5;
let filterList = "all"; // all - active - completed
let firebaseOnline = false;
let userInfo = {};

// localStorage.clear();

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

        console.log("All data:", data);
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
        } else {
            document.querySelector(".email-address").textContent = "";
        }

        document.querySelector(".email-full-name").textContent =
            userInfo.displayName;

        todoSaves = data.UserTodo;
        updateHTML(false);

        loadingPage.style.opacity = "0";
        setTimeout(() => {
            loadingPage.style.display = "none";
        }, 300);
    });
});

// Filter the todoSave in all - active - completed modes :
function filterTodoSavesFunc() {
    filteredTodoSaves = [];
    switch (filterList) {
        case "active":
            todoSaves.forEach(function (save) {
                if (!save.isComplete) {
                    filteredTodoSaves.push(save);
                }
            });
            break;
        case "completed":
            todoSaves.forEach(function (save) {
                if (save.isComplete) {
                    filteredTodoSaves.push(save);
                }
            });
            break;
        case "all":
            filteredTodoSaves = todoSaves;
            break;
    }
}

// Update the DOM
// Create new tasks with buttons and addEventListeners to them
// Set the position of navigation filters
// Update pending tasks in different modes :
function updateHTML(addNewTodo) {
    todoInput.value = "";
    filterTodoSavesFunc();
    if (!filteredTodoSaves.length) todoList.innerHTML = "<br />";
    else todoList.innerHTML = "";
    for (let i = filteredTodoSaves.length; i > 0; ) {
        i--;
        todoList.innerHTML += `
        <span id="todo-number${i}">
            <div id="work-number${i}">
                ${filteredTodoSaves[i].todo}
            </div>
            <div id="edit-number${i}">
                <img src="./Todo-files/imgs/edit.svg" alt="edit-btn" class="svg" />
            </div>
            <div id="complete-number${i}">
                <img src="./Todo-files/imgs/complete.svg" alt="complete-btn" class="svg" />
            </div>
            <div id="delete-number${i}">
                <img src="./Todo-files/imgs/delete.svg" alt="delete-btn" class="svg" />
            </div>
        </span>
        `;
    }
    for (let i = 0; i < filteredTodoSaves.length; i++) {
        document
            .getElementById(`edit-number${i}`)
            .addEventListener("click", function () {
                editBtn(filteredTodoSaves[i].todoID);
            });
        document
            .getElementById(`complete-number${i}`)
            .addEventListener("click", function () {
                completeBtn(filteredTodoSaves[i].todoID);
            });
        document
            .getElementById(`delete-number${i}`)
            .addEventListener("click", function () {
                deleteBtn(filteredTodoSaves[i].todoID);
            });
        if (filteredTodoSaves[i].isComplete) {
            document
                .getElementById(`work-number${i}`)
                .classList.toggle("complete-todo");
        }
    }
    if (addNewTodo) {
        const newTodo = document.getElementById(
            `todo-number${filteredTodoSaves.length - 1}`
        );
        newTodo.style.transform = "translate(0, -25px)";
        newTodo.style.opacity = "0";
        setTimeout(() => {
            newTodo.style.opacity = "1";
            newTodo.style.transform = "translate(0, 0)";
        }, 10);
    }
    todoCounter.textContent = filteredTodoSaves.length;
    if (filteredTodoSaves.length === 1) {
        taskTasks.textContent = "task";
    } else {
        taskTasks.textContent = "tasks";
    }
    switch (filterList) {
        case "all":
            pendingFilter.textContent = "";
            if (filteredTodoSaves.length === 1) {
                taskTasks.textContent = "task in total";
            } else {
                taskTasks.textContent = "tasks in total";
            }
            break;
        case "active":
            pendingFilter.textContent = "active";
            break;
        case "completed":
            pendingFilter.textContent = "completed";
            break;
    }
}

function findTodoNumber(taskNumber, array) {
    console.log("=>", array);

    for (let i = 0; i < array.length; i++) {
        if (array[i].todoID === taskNumber) {
            return i;
        }
    }
    console.log("ERROR");
}

// Function of edit button on tasks
// Change the style of the addBtn and set the value of todoInput to the task that is
// going to change :
function editBtn(taskNumber) {
    let editTodoNum = findTodoNumber(taskNumber, filteredTodoSaves);
    todoInput.value = filteredTodoSaves[editTodoNum].todo;

    editTodo = findTodoNumber(taskNumber, todoSaves);

    addBtn.textContent = "✓";
    addBtn.classList.add("change-add-btn");
    todoInput.focus();
}

// Function of complete button on tasks
// Find the taskNumber in todoSaves and change its isComplete property to the opposite
// value :
function completeBtn(taskNumber) {
    let doneTodo = findTodoNumber(taskNumber, filteredTodoSaves);

    if (filteredTodoSaves[doneTodo].isComplete) {
        filteredTodoSaves[doneTodo].isComplete = false;
    } else {
        filteredTodoSaves[doneTodo].isComplete = true;
    }

    // localStorage.setItem("saveTodos", JSON.stringify(todoSaves));
    updateTodos();

    document.getElementById(`todo-number${doneTodo}`).style.opacity = 0;
    if (filterList != "all")
        setTimeout(() => {
            updateHTML(false);
        }, 250);
    else updateHTML(false);
}

// Function of delete button on tasks
// Set filteredTodoSaves to the value of the task and run the deleteFunc() function :
function deleteBtn(taskNumber) {
    let deleteTodo = findTodoNumber(taskNumber, filteredTodoSaves);

    let deleteSave = filteredTodoSaves[deleteTodo];
    filteredTodoSaves = [];
    filteredTodoSaves.push(deleteSave);
    deleteFunc();

    document.getElementById(`todo-number${deleteTodo}`).style.opacity = 0;
    setTimeout(() => {
        updateHTML(false);
    }, 250);
}

// Object constructor for new task :
function addTodoSaves(newTodo, newIsComplete) {
    this.todo = newTodo;
    this.isComplete = newIsComplete;
    this.todoID = Math.trunc(Math.random() * 1000000);
}

// If todoInput.value avalable add it to todoSaves and localSave
// addBtn can also be the button to register the editBtn() :
addBtn.addEventListener("click", function () {
    if (!todoInput.value) {
        return;
    }
    if (editTodo !== -1) {
        todoSaves[editTodo].todo = todoInput.value;
        addBtn.textContent = "+";
        addBtn.classList.remove("change-add-btn");
        editTodo = -1;
        // localStorage.setItem("saveTodos", JSON.stringify(todoSaves));

        updateTodos();
        updateHTML(false);
        return;
    }
    todoSaves[todoSaves.length] = new addTodoSaves(todoInput.value, false);
    addBtn.blur();
    // localStorage.setItem("saveTodos", JSON.stringify(todoSaves));

    updateTodos();
    updateHTML(true);
});

// Prevent the browser's default behavior of refreshing the page when 'enter' is
// pressed while an input is in focus :
document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault();
});

// Simulate clicking on the addBtn by pressing the Enter key.
document.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        addBtn.dispatchEvent(new Event("click"));
    }
});

// Click on the Clear All button to delete the task on the filteredTodoSaves :
clearAll.addEventListener("click", function () {
    deleteFunc();
    updateHTML(false);
});

// Delete Tasks that are present in both filteredTodoSaves and todoSaves :
function deleteFunc() {
    for (let i = 0; i < filteredTodoSaves.length; i++) {
        for (let j = 0; j < todoSaves.length; j++) {
            if (filteredTodoSaves[i] == todoSaves[j]) {
                delete todoSaves[j];
            }
        }
    }
    todoSaves = todoSaves.filter((value) => Object.keys(value).length !== 0);
    // localStorage.setItem("saveTodos", JSON.stringify(todoSaves));

    updateTodos();
}

// Add an addEventListener to the filter buttons and change the styles
// for the buttons :
const filterBackground = document.getElementsByClassName("filter-background");
const filtertext = document.getElementsByClassName("filter-text");
const filterDivBackground = document.getElementsByClassName(
    "filter-div-background"
);

for (let i = 0; i < 3; i++) {
    filtertext[i].addEventListener("click", function () {
        for (let j = 0; j < 3; j++) {
            filterBackground[j].style.fill = "rgb(198, 198, 198)";
            filterDivBackground[j].style.zIndex = "1";
        }
        filterBackground[i].style.fill = "white";
        filterDivBackground[i].style.zIndex = "2";

        switch (i) {
            case 0:
                filterList = "all";
                break;
            case 1:
                filterList = "active";
                break;
            case 2:
                filterList = "completed";
                break;
        }

        updateHTML(false);
    });
}

const uploadText = document.getElementById("upload-text");
const uploadBtn = document.getElementById("upload-btn");
const downloadText = document.getElementById("download-text");
const downloadBtn = document.getElementById("download-btn");

const fileInput = document.getElementById("fileInput");

const uploadHandler = () => {
    fileInput.value = null;
    fileInput.click();

    console.log("upload");
};

fileInput.addEventListener("change", function () {
    const selectedFile = fileInput.files[0];
    if (selectedFile) {
        console.log("Selected file:", selectedFile.name);

        const reader = new FileReader();

        reader.onload = function (event) {
            let fileContent = JSON.parse(event.target.result);
            console.log("File content:", fileContent);

            todoSaves = fileContent;

            console.log("Import successful");
            updateTodos();
            updateHTML(false);
        };

        reader.readAsText(selectedFile);
    }
    fileInput.value = null;
});

const downloadHandler = () => {
    console.log("download");

    let content = JSON.stringify(todoSaves, null, 2);

    // content = content.replace(/},{/g, "}\n{");
    // content = content.replace("[{", "[\n{");
    // content = content.replace("}]", "}\n]");
    // content = content.replace(/{/g, "  {  ");
    // content = content.replace(/}/g, "  }");
    // content = content.replace(/,/g, "\t\t");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    console.log(url);

    console.log(
        "If you cannot download todos, consider turning off your ad blocker"
    );

    const a = document.createElement("a");
    a.href = url;
    a.download = "save-todos.txt";
    a.textContent = "Download Array";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

setTimeout(() => {
    if (!firebaseOnline) {
        loadingPage.innerHTML = `
        <h1>Cannot access Firebase servers</h1>
        <br />
        <p>Maybe turn on your VPN</p>`;

        downloadText.removeEventListener("click", downloadHandler);
        uploadText.removeEventListener("click", uploadHandler);
    } else {
        downloadText.addEventListener("click", downloadHandler);
        uploadText.addEventListener("click", uploadHandler);

        uploadText.addEventListener("mouseover", () => {
            uploadBtn.style.opacity = "0";
        });
        uploadText.addEventListener("mouseleave", () => {
            uploadBtn.style.opacity = "1";
        });
        uploadText.style.cursor = "pointer";

        downloadText.addEventListener("mouseover", () => {
            downloadBtn.style.opacity = "0";
        });
        downloadText.addEventListener("mouseleave", () => {
            downloadBtn.style.opacity = "1";
        });
        downloadText.style.cursor = "pointer";

        console.log("Download-Upload btns unlock");
    }
}, 3000);

document.querySelector(".anonymous-session").addEventListener("click", () => {
    window.location.href =
        "http://localhost:3000/React-login-page/todoApp/goAnonymousMode"
});

console.log("update10");
