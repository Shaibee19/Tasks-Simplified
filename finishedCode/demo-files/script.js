// ========================================================
// DAY 4: JAVASCRIPT FUNDAMENTALS - PART 1
// ========================================================

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

// 4.2.1: INITIAL SETUP AND DOM ELEMENTS

// Store tasks in memory
let tasks = [...sampleTasks];
let editingTaskId = null;

// DOM Elements
const taskModal = document.getElementById("taskModal");
const modalTitle = document.getElementById("modalTitle");
const taskTitleInput = document.getElementById("taskTitle");
const taskDateInput = document.getElementById("taskDate");
const taskDescriptionInput = document.getElementById("taskDescription");
const saveTaskBtn = document.getElementById("saveTaskBtn");
const tasksWrapper = document.querySelector(".tasks-wrapper");
const taskDetailsPanel = document.querySelector(".task-details");
const addTaskBtn = document.getElementById("addTaskBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const searchInput = document.querySelector(".search-input");
const searchButton = document.querySelector(".search-button");

// 4.2.2: DOMCONTENTLOADED EVENT
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

  // SLIDE 8: EVENT LISTENERS
  // Event listeners
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

// 4.2.3: CREATING AND RENDERING ELEMENTS
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

function createTaskCard(task) {
  const taskCard = document.createElement("div");
  taskCard.className = "task-card";
  taskCard.dataset.id = task.id;

  // Create the task card content
  taskCard.innerHTML = `
      <div class="task-status">
        <div class="status-circle ${task.completed ? "completed" : ""}">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${
            task.completed ? "white" : "currentColor"
          }" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <div class="task-title">${task.title}</div>
      </div>
      <div class="task-description">${truncateText(task.description, 100)}</div>
      <div class="task-info">
        <span class="priority-info">Priority: <span class="${task.priority.toLowerCase()}">${
    task.priority
  }</span></span>
        <span class="date-info">Created on: ${task.date}</span>
      </div>
    `;

  // Add click event to select this task
  taskCard.addEventListener("click", () => selectTask(task.id));

  // Add click event to toggle completion status
  const statusCircle = taskCard.querySelector(".status-circle");
  statusCircle.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleTaskCompletion(task.id);
  });

  return taskCard;
}

// 4.2.3: HANDELING EVENTS AND USER INTERACTIONS
function selectTask(taskId) {
  // Deselect all tasks
  document.querySelectorAll(".task-card").forEach((card) => {
    card.classList.remove("selected");
  });

  // Select the clicked task
  const taskCard = document.querySelector(`.task-card[data-id="${taskId}"]`);
  if (taskCard) {
    taskCard.classList.add("selected");
  }

  // Find the task data
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;

  // Update the details panel
  taskDetailsPanel.innerHTML = `
      <div class="task-detail-header">
        <h2>${task.title}</h2>
        <div class="detail-meta">
          <div class="detail-meta-item">
            <span class="meta-label">Priority:</span>
            <span class="${task.priority.toLowerCase()}">${task.priority}</span>
          </div>
          <div class="detail-meta-item">
            <span class="meta-label">Created on:</span>
            <span>${task.date}</span>
          </div>
        </div>
      </div>
      
      <div class="detail-description">
        <p>${task.description}</p>
      </div>
      
      <div class="action-buttons">
        <button class="action-btn btn-secondary" id="editCurrentTaskBtn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button class="action-btn btn-primary" id="deleteCurrentTaskBtn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
    .addEventListener("click", () => openEditTaskModal(taskId));
  document
    .getElementById("deleteCurrentTaskBtn")
    .addEventListener("click", () => deleteTask(taskId));
}

// 4.2.5: HELPER FUNCTIONS - explained in the next lecture.
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

  // Format date as DD/MM/YYYY
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

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
      <div class="empty-state">
        <p>No tasks to show. Please add a task.</p>
      </div>
    `;

  // Clear the details panel
  taskDetailsPanel.innerHTML = "";
}

// Toggle task completion status
function toggleTaskCompletion(taskId) {
  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  if (taskIndex !== -1) {
    tasks[taskIndex].completed = !tasks[taskIndex].completed;

    // Update the UI
    const statusCircle = document.querySelector(
      `.task-card[data-id="${taskId}"] .status-circle`
    );
    if (statusCircle) {
      statusCircle.classList.toggle("completed");
    }

    // Re-select the task to update details view
    selectTask(taskId);
  }
}

// ========================================================
// DAY 5: JAVASCRIPT FUNDAMENTALS - PART 2
// ========================================================

// 5.2.1: FORM HANDLING
function openAddTaskModal() {
  // Reset form
  editingTaskId = null;
  modalTitle.textContent = "Add New Task";
  taskTitleInput.value = "";
  taskDescriptionInput.value = "";

  // Set current date
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  taskDateInput.value = `${day}/${month}/${year}`;

  // Set default priority (Low)
  document.querySelectorAll('input[name="priority"]').forEach((radio) => {
    radio.checked = radio.value === "low";
  });

  // Show modal
  taskModal.style.display = "flex";
}

// Open modal to edit existing task
function openEditTaskModal(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;

  // Set form values from task
  editingTaskId = taskId;
  modalTitle.textContent = "Edit Task";
  taskTitleInput.value = task.title;
  taskDateInput.value = task.date;
  taskDescriptionInput.value = task.description;

  // Set priority radio button
  document.querySelectorAll('input[name="priority"]').forEach((radio) => {
    radio.checked = radio.value.toLowerCase() === task.priority.toLowerCase();
  });

  // Show modal
  taskModal.style.display = "flex";
}

// Close the modal
function closeModal() {
  taskModal.style.display = "none";
}

// 5.2.2: SAVING AND VALIDATING FORM DATA
function saveTask() {
  // Validate title
  if (!taskTitleInput.value.trim()) {
    alert("Please enter a task title");
    return;
  }

  // Get selected priority
  let selectedPriority = "Low";
  document.querySelectorAll('input[name="priority"]').forEach((radio) => {
    if (radio.checked) {
      selectedPriority =
        radio.value.charAt(0).toUpperCase() + radio.value.slice(1);
    }
  });

  if (editingTaskId === null) {
    // Add new task
    const newTask = {
      id: Date.now(), // Use timestamp as unique ID
      title: taskTitleInput.value.trim(),
      description: taskDescriptionInput.value.trim(),
      priority: selectedPriority,
      date: taskDateInput.value,
      completed: false,
    };

    // Add to the beginning of tasks array
    tasks.unshift(newTask);

    // Render tasks and select the new one
    renderTasks();
    selectTask(newTask.id);
  } else {
    // Update existing task
    const taskIndex = tasks.findIndex((t) => t.id === editingTaskId);
    if (taskIndex !== -1) {
      tasks[taskIndex].title = taskTitleInput.value.trim();
      tasks[taskIndex].description = taskDescriptionInput.value.trim();
      tasks[taskIndex].priority = selectedPriority;
      tasks[taskIndex].date = taskDateInput.value;

      // Render tasks and select the updated one
      renderTasks();
      selectTask(editingTaskId);
    }
  }

  // Close modal
  closeModal();
}

// 5.2.3: SEARCH FUCTIONALITY
function deleteTask(taskId) {
  // Confirm deletion
  if (!confirm("Are you sure you want to delete this task?")) return;

  // Find the task index
  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) return;

  // Remove the task
  tasks.splice(taskIndex, 1);

  // Render tasks
  renderTasks();

  // Select another task or show empty state
  if (tasks.length > 0) {
    selectTask(tasks[0].id);
  } else {
    showEmptyState();
  }
}

// 5.2.4: SEARCH FUCTIONALITY
function searchTasks() {
  const searchTerm = searchInput.value.toLowerCase().trim();

  if (searchTerm === "") {
    // Reset to show all tasks
    renderTasks();
    if (tasks.length > 0) {
      selectTask(tasks[0].id);
    }
    return;
  }

  // Filter tasks by title
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm)
  );

  if (filteredTasks.length === 0) {
    // Show no results message
    tasksWrapper.innerHTML = `
        <div class="empty-state">
          <p>No tasks match your search. Try a different query.</p>
        </div>
      `;
    taskDetailsPanel.innerHTML = "";
  } else {
    // Show filtered tasks
    tasksWrapper.innerHTML = "";
    filteredTasks.forEach((task) => {
      const taskCard = createTaskCard(task);
      tasksWrapper.appendChild(taskCard);
    });

    // Select the first filtered task
    selectTask(filteredTasks[0].id);
  }
}
