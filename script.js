// Select DOM elements
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const dueDateInput = document.getElementById("due-date");
const prioritySelect = document.getElementById("priority");
const filterSelect = document.getElementById("filter");

// Load tasks from localStorage
document.addEventListener("DOMContentLoaded", loadTasksFromStorage);

// Add task event listener
addTaskBtn.addEventListener("click", addTask);

// Filter tasks event listener
filterSelect.addEventListener("change", filterTasks);

// Add a task
function addTask() {
  const taskText = taskInput.value;
  const dueDate = dueDateInput.value;
  const priority = prioritySelect.value;

  if (taskText === "" || dueDate === "") {
    alert("Please enter a task and due date");
    return;
  }

  const task = {
    text: taskText,
    dueDate: dueDate,
    priority: priority,
    completed: false
  };

  addTaskToDOM(task);
  saveTaskToStorage(task);
  taskInput.value = "";
  dueDateInput.value = "";
  prioritySelect.value = "low";
}

// Add task to DOM
function addTaskToDOM(task) {
  const li = document.createElement("li");
  li.classList.add(task.priority);
  
  li.innerHTML = `
    <span>${task.text} - ${task.dueDate} [${task.priority}]</span>
    <div>
      <button class="complete-btn">${task.completed ? "Undo" : "Complete"}</button>
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    </div>
  `;
  
  if (task.completed) li.classList.add("completed");

  taskList.appendChild(li);

  // Event listeners for buttons
  li.querySelector(".complete-btn").addEventListener("click", () => toggleComplete(task, li));
  li.querySelector(".edit-btn").addEventListener("click", () => editTask(task, li));
  li.querySelector(".delete-btn").addEventListener("click", () => deleteTask(task, li));
}

// Toggle task completion
function toggleComplete(task, li) {
  task.completed = !task.completed;
  li.classList.toggle("completed");
  updateStorage();
}

// Edit a task
function editTask(task, li) {
  taskInput.value = task.text;
  dueDateInput.value = task.dueDate;
  prioritySelect.value = task.priority;
  deleteTask(task, li);
}

// Delete a task
function deleteTask(task, li) {
  taskList.removeChild(li);
  removeTaskFromStorage(task);
}

// Filter tasks by priority
function filterTasks() {
  const filter = filterSelect.value;
  const tasks = Array.from(taskList.children);

  tasks.forEach(task => {
    if (filter === "all" || task.classList.contains(filter)) {
      task.style.display = "";
    } else {
      task.style.display = "none";
    }
  });
}

// Save task to localStorage
function saveTaskToStorage(task) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasksFromStorage() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => addTaskToDOM(task));
}

// Update task in localStorage
function updateStorage() {
  let tasks = [];
  Array.from(taskList.children).forEach(li => {
    const taskText = li.querySelector("span").textContent.split(" - ")[0];
    const dueDate = li.querySelector("span").textContent.split(" - ")[1].split(" [")[0];
    const priority = li.classList[0];
    const completed = li.classList.contains("completed");
    
    tasks.push({ text: taskText, dueDate: dueDate, priority: priority, completed: completed });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Remove task from localStorage
function removeTaskFromStorage(task) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter(t => t.text !== task.text || t.dueDate !== task.dueDate);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
