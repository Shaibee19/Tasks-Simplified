// Sample task data for initial display
const sampleTasks = [
  {
    id: 1,
    title: "Module 2: Build and Apply",
    description:
      "Go through all lessons in Module 2, ensuring you pause to take notes and code along actively. This module introduces real-world projects, so take the time to understand how the concepts from Module 1 are applied in practical scenarios.",
    priority: "Extreme",
    date: "20/05/2025",
    completed: false,
  },
  {
    id: 2,
    title: "Module 1: The Foundations",
    description:
      "Go through all lessons inside Module 1 at your own pace. As you progress, make detailed notes to reinforce your understanding and practice writing the code alongside the instructor.",
    priority: "Extreme",
    date: "01/05/2025",
    completed: true,
  },
];

// STORE TASKS IN MEMORY
let tasks = [...sampleTasks];
let editingTaskId = null;

// DOM ELEMENTS
const taskModal = document.getElementById("taskModal");
const modalTitle = document.getElementById("modalTitle");
const taskTitleInput = document.getElementById("taskTitle");
const taskDateInput = document.getElementById("taskDate");
const taskDescriptionInput = document.getElementById("taskDescription");
const saveTaskBtn = document.getElementById("saveTaskBtn");
const tasksWrapper = document.querySelector(".tasks__wrapper");
const taskDetailsPanel = document.querySelector(".tasks__details");
const addTaskBtn = document.getElementById("addTaskBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const searchInput = document.querySelector(".search__input");
const searchButton = document.querySelector(".search__button");

document.addEventListener("DOMContentLoaded", function () {
  // Set current date in header
  updateCurrentDate();

  // Render initial tasks
  renderTasks();

  // Select first task by default
  if (tasks.length > 0) {
    selectTask(tasks[0].id);
  } else {
    showEmptyState();
  }

  // EVENT LISTENERS
  addTaskBtn.addEventListener("click", openAddTaskModal);
  closeModalBtn.addEventListener("click", closeModal);
  saveTaskBtn.addEventListener("click", saveTask);
  searchInput.addEventListener("input", searchTasks);
  searchButton.addEventListener("click", searchTasks);

  // Close modal when clicking outside
  window.addEventListener("click", function (event) {
    if (event.target === taskModal) {
      closeModal();
    }
  });
});

// Render tasks in the task list
function renderTasks() {
  tasksWrapper.innerHTML = "";

  if (tasks.length === 0) {
    showEmptyState();
    return;
  }

  tasks.forEach((task) => {
    const taskCard = createTaskCard(task);
    tasksWrapper.appendChild(taskCard);
  });
}

// Create a task card element
function createTaskCard(task) {
  const taskCard = document.createElement("div");
  taskCard.className = "task__card";
  taskCard.dataset.id = task.id;

  // Create the task card content
  taskCard.innerHTML = `
        <div class="task__status">
            <div class="status__circle ${task.completed ? "completed" : ""}">
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="12" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="${task.completed ? "white" : "currentColor"}"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"><polyline>
                </svg>
            </div>
            <div class="task__title">${task.title}</div>
        </div>
        <div class="task__description">${truncateText(
          task.description,
          100
        )}</div>
        <div class="task__info">
            <span class="priority__info">Priority:
                <span class="${task.priority.toLowerCase()}">${task.priority}</span>
            </span>
            <span class="date__info">Created on: ${task.date}</span>
        </div>
        `;

  // Add click event to select this task
  taskCard.addEventListener("click", () => selectTask(task.id));

  // Add click event to toggle completion status
  const statusCircle = taskCard.querySelector(".status__circle");
  statusCircle.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleTaskCompletion(task.id);
  });

  return taskCard;
}

// Select a task and show its details
function selectTask(taskID) {
  // Deselect all tasks
  document.querySelectorAll(".task__card").forEach((card) => {
    card.classList.remove("selected");
  });

  // Select the clicked task
  const taskCard = document.querySelector(`.task__card[data-id="${taskID}"]`);
  if (taskCard) {
    taskCard.classList.add("selected");
  }

  // Find the task data
  const task = tasks.find((t) => t.id === taskID);
  if (!task) return;

  // Update the details panel
  taskDetailsPanel.innerHTML = `
        <div class="task__detail--header">
            <h2>${task.title}</h2>
            <div class="detail__meta">
                <div class="detail__meta--item">
                    <span class="meta__label">Priority:</span>
                    <span class="${task.priority.toLowerCase()}">${task.priority}</span>
                </div>
                <div class="detail__meta--item">
                    <span class="meta__label">Created on:</span>
                    <span>${task.date}</span>
                </div>
            </div>
        </div>
        
        <div class="detail__description">
            <p>${task.description}</p>
        </div>
        
        <div class="action__buttons">
            <button class="action__btn btn__secondary" id="editCurrentTaskBtn">
                <svg
                    xmlns="http://www.w3.org/200/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
            </button>
            <button class="action__btn btn__primary" id="deleteCurrentTaskBtn">
                <svg
                    xmlns="http://www.w3.org/200/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
            </button>
        </div>
        `;

  // Add event listeners to action buttons
  document
    .getElementById("editCurrentTaskBtn")
    .addEventListener("click", () => openEditTaskModal(taskID));
  document
    .getElementById("deleteCurrentTaskBtn")
    .addEventListener("click", () => deleteTask(taskID));
}

// Update current date in header
function updateCurrentDate() {
  const now = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayName = days[now.getDay()];

  // Format date as MM/DD/YYYY
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const year = now.getFullYear();
  const formattedDate = `${month}/${day}/${year}`;

  document.getElementById("currentDay").textContent = dayName;
  document.getElementById("currentDate").textContent = formattedDate;
}

// Truncate text with ellipsis
function truncateText(text, maxLength) {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

// Show empty state when no tasks
function showEmptyState() {
  tasksWrapper.innerHTML = `
        <div class="empty__state">
            <p>No tasks to show. Get to work! Please add a task.</p>
        </div>
        `;

  // Clear the details panel
  taskDetailsPanel.innerHTML = "";
}

// Toggle task completion status
function toggleTaskCompletion(taskID) {
  const taskIndex = tasks.findIndex((t) => t.id === taskID);
  if (taskIndex !== -1) {
    tasks[taskIndex].completed = !tasks[taskIndex].completed;

    // Update the UI
    const statusCircle = document.querySelector(
      `.task__card[data-id="${taskID}"] .status__circle`);
    if (statusCircle) {
      statusCircle.classList.toggle("completed");
    }

    // Reselect the task to update details view
    selectTask(taskID);
  }
}

// MODAL

// Open
function openAddTaskModal() {
    editingTaskId = null;
    modalTitle.textContent = "Add New Task";
    taskTitleInput.value = "";
    taskDescriptionInput.value = "";

    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const year = now.getFullYear();
    taskDateInput.value = `${month}/${day}/${year}`;

    document.querySelectorAll('input[name="priority"]').forEach((radio) => {
        radio.checked = radio.value === "low";
    });

    taskModal.style.display = "flex";
}

// Edit
function openEditTaskModal(taskID) {
    const task = tasks.find((t) => t.id === taskID);
    if (!task) return;

    editingTaskId = taskID;
    modalTitle.textContent = "Edit Task";
    taskTitleInput.value = task.title;
    taskDateInput.value = task.date;
    taskDescriptionInput.value = task.description;

    document.querySelectorAll('input[name="priority"]').forEach((radio) => {
        radio.checked = radio.value.toLowerCase() === task.priority.toLowerCase();
    });

    taskModal.style.display = "flex";
}

// Close
function closeModal() {
    taskModal.style.display = "none";
}

// Save **Most important**
function saveTask() {
    if(!taskTitleInput.value.trim()) {
        alert("Please enter a task title");
        return;
    }

    let selectedPriority = "Low";
    document.querySelectorAll('input[name="priority"]').forEach((radio) => {
        if (radio.checked) {
            selectedPriority = radio.value.charAt(0).toUpperCase() + radio.value.slice(1);
        }
    });

    if (editingTaskId === null) {
        const newTask = {
            id: Date.now(),
            title: taskTitleInput.value.trim(),
            description: taskDescriptionInput.value.trim(),
            priority: selectedPriority,
            date: taskDateInput.value,
            completed: false,
        };

        tasks.unshift(newTask);

        renderTasks();
        selectTask(newTask.id);
    } else {
        const taskIndex = tasks.findIndex((t) => t.id === editingTaskId);
        if (taskIndex !== -1) {
            tasks[taskIndex].title = taskTitleInput.value.trim();
            tasks[taskIndex].description = taskDescriptionInput.value.trim();
            tasks[taskIndex].priority = selectedPriority;
            tasks[taskIndex].date = taskDateInput.value;

            renderTasks();
            selectTask(editingTaskId);
        }
    }

    closeModal();
}

// Delete
function deleteTask(taskID) {
    if (!confirm("Are you sure you want to delete this task completely?")) return;

    const taskIndex = tasks.findIndex((t) => t.id === taskID);
    if (taskIndex === -1) return;

    tasks.splice(taskIndex, 1);

    renderTasks();

    if(tasks.length > 0) {
        selectTask(tasks[0].id);
    } else {
        showEmptyState();
    }
}

// Search
function searchTasks() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    if(searchTerm === "") {
        renderTasks();
        if(tasks.length > 0) {
            selectTask(tasks[0].id);
        }
        return;
    }

    const filteredTasks = tasks.filter((task) => task.title.toLowerCase().includes(searchTerm));

    if (filteredTasks.length === 0) {
        tasksWrapper.innerHTML = `
            <div class="empty__state">
                <p>No tasks match your search. Try a different query.</p>
            </div>
            `;
        taskDetailsPanel.innerHTML = "";
    } else {
        tasksWrapper.innerHTML = "";
        filteredTasks.forEach((task) => {
            const taskCard = createTaskCard(task);
            tasksWrapper.appendChild(taskCard);
        });

        selectTask(filteredTasks[0].id);
    }
}