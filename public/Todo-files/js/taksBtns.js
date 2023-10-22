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