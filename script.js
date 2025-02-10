document.addEventListener("DOMContentLoaded", () => {
    loadTasks();

    document.getElementById("add-task").addEventListener("click", addTask);
    document.getElementById("task-input").addEventListener("keypress", (event) => {
        if (event.key === "Enter") addTask();
    });

    document.getElementById("task-list").addEventListener("click", handleTaskActions);
});

function loadTasks() {
    const tasks = getTasks();
    tasks.forEach(renderTask);
}

function addTask() {
    const input = document.getElementById("task-input");
    const taskText = input.value.trim();
    if (!taskText) return;

    const task = { text: taskText, id: Date.now(), completed: false };
    
    saveTask(task);
    renderTask(task);
    input.value = "";
}

function renderTask(task) {
    const list = document.getElementById("task-list");
    const li = document.createElement("li");
    
    li.dataset.id = task.id;
    li.classList.add("task-item");
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
        <span class="task-text">${task.text}</span>
        <input type="text" class="edit-input" value="${task.text}" style="display: none;">
        <div class="buttons">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </div>`;
    
    list.appendChild(li);
}

function handleTaskActions(event) {
    const li = event.target.closest("li");
    if (!li) return;

    const id = Number(li.dataset.id);
    if (event.target.classList.contains("task-text")) toggleComplete(id, li);
    if (event.target.classList.contains("edit-btn")) toggleEdit(id, li);
    if (event.target.classList.contains("delete-btn")) deleteTask(id, li);
}

function toggleEdit(id, li) {
    const textElement = li.querySelector(".task-text");
    const inputElement = li.querySelector(".edit-input");
    const editBtn = li.querySelector(".edit-btn");

    if (inputElement.style.display === "none") {
        inputElement.style.display = "block";
        textElement.style.display = "none";
        inputElement.focus();

        inputElement.setSelectionRange(inputElement.value.length, inputElement.value.length);

        editBtn.textContent = "Save";
    } else {
        const newText = inputElement.value.trim();
        if (!newText) return;

        textElement.textContent = newText;
        inputElement.style.display = "none";
        textElement.style.display = "block";
        editBtn.textContent = "Edit";
        
        updateTask(id, newText);
    }
}

function toggleComplete(id, li) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks(tasks);
        li.classList.toggle("completed");
    }
}

function deleteTask(id, li) {
    let tasks = getTasks().filter(task => task.id !== id);
    saveTasks(tasks);
    li.remove();
}

function updateTask(id, newText) {
    let tasks = getTasks().map(task => 
        task.id === id ? { ...task, text: newText } : task
    );
    saveTasks(tasks);
}

// Local Storage Helpers
function getTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTask(task) {
    let tasks = getTasks();
    tasks.push(task);
    saveTasks(tasks);
}

function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

