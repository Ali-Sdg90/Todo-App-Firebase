const addBtn = document.getElementById("add-btn");
const todoCounter = document.getElementById("todo-counter");
const taskTasks = document.getElementById("task-tasks");
const pendingFilter = document.getElementById("pending-filter");
const clearAll = document.getElementById("clear-btn");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("save-list");
const localTodo = localStorage.getItem("saveTodos");
let todoSaves = [];
let filteredTodoSaves = [];
let editTodo = -1;
let firstTopFilter = 35.5;
let filterList = "all"; // all - active - completed
// localStorage.clear();

// If localSave is available, todoSaves will be set to localSave :
if (localTodo) {
    todoSaves = JSON.parse(localStorage.getItem("saveTodos"));
    updateHTML(false);
}

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
                <img src="svg/edit.svg" alt="edit-btn" class="svg" />
            </div>
            <div id="complete-number${i}">
                <img src="svg/complete.svg" alt="complete-btn" class="svg" />
            </div>
            <div id="delete-number${i}">
                <img src="svg/delete.svg" alt="delete-btn" class="svg" />
            </div>
        </span>
        `;
    }
    for (let i = 0; i < filteredTodoSaves.length; i++) {
        document
            .getElementById(`edit-number${i}`)
            .addEventListener("click", function () {
                editBtn(i);
            });
        document
            .getElementById(`complete-number${i}`)
            .addEventListener("click", function () {
                completeBtn(i);
            });
        document
            .getElementById(`delete-number${i}`)
            .addEventListener("click", function () {
                deleteBtn(i);
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
    if (filteredTodoSaves.length == 1) {
        taskTasks.textContent = "task";
    } else {
        taskTasks.textContent = "tasks";
    }
    switch (filterList) {
        case "all":
            pendingFilter.textContent = "";
            if (filteredTodoSaves.length == 1) {
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

// Function of edit button on tasks
// Change the style of the addBtn and set the value of todoInput to the task that is
// going to change :
function editBtn(taskNumber) {
    todoInput.value = todoSaves[taskNumber].todo;
    editTodo = taskNumber;
    addBtn.textContent = "✓";
    addBtn.classList.add("change-add-btn");
    todoInput.focus();
}

// Function of complete button on tasks
// Find the taskNumber in todoSaves and change its isComplete property to the opposite
// value :
function completeBtn(taskNumber) {
    for (let i = 0; i < todoSaves.length; i++) {
        if (todoSaves[i].todo == filteredTodoSaves[taskNumber].todo) {
            if (todoSaves[i].isComplete) {
                todoSaves[i].isComplete = false;
            } else {
                todoSaves[i].isComplete = true;
            }
        }
    }
    localStorage.setItem("saveTodos", JSON.stringify(todoSaves));
    document.getElementById(`todo-number${taskNumber}`).style.opacity = 0;
    if (filterList != "all")
        setTimeout(() => {
            updateHTML(false);
        }, 250);
    else updateHTML(false);
}

// Function of delete button on tasks
// Set filteredTodoSaves to the value of the task and run the deleteFunc() function :
function deleteBtn(taskNumber) {
    let deleteSave = filteredTodoSaves[taskNumber];
    filteredTodoSaves = [];
    filteredTodoSaves.push(deleteSave);
    deleteFunc();
    document.getElementById(`todo-number${taskNumber}`).style.opacity = 0;
    setTimeout(() => {
        updateHTML(false);
    }, 250);
}

// Object constructor for new task :
function addTodoSaves(newTodo, newIsComplete) {
    this.todo = newTodo;
    this.isComplete = newIsComplete;
}

// If todoInput.value avalable add it to todoSaves and localSave
// addBtn can also be the button to register the editBtn() :
addBtn.addEventListener("click", function () {
    if (!todoInput.value) return;
    if (editTodo != -1) {
        todoSaves[editTodo].todo = todoInput.value;
        addBtn.textContent = "+";
        addBtn.classList.remove("change-add-btn");
        editTodo = -1;
        localStorage.setItem("saveTodos", JSON.stringify(todoSaves));
        updateHTML(false);
        return;
    }
    todoSaves[todoSaves.length] = new addTodoSaves(todoInput.value, false);
    addBtn.blur();
    localStorage.setItem("saveTodos", JSON.stringify(todoSaves));
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
    localStorage.setItem("saveTodos", JSON.stringify(todoSaves));
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

function getDistanceFromTop(element) {
    let distance = 0;
    while (element) {
        distance += element.offsetTop;
        element = element.offsetParent;
    }
    return distance;
}
