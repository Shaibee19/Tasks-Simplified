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
const tasksWrapper = document.getElementById(".tasks__wrapper");
const taskDetailsPanel = document.getElementById(".task__details");
const addTaskBtn = document.getElementById("addTaskBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const searchInput = document.getElementById(".search__input");
const searchButton = document.getElementById(".search__button");