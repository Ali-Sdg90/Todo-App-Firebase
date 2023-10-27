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

    if (!filteredTodoSaves.length) {
        todoList.innerHTML = "<br />";
    } else {
        todoList.innerHTML = "";
    }

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
    addToDataBase();
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
