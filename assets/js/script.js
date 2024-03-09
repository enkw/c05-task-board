// Retrieve tasks and nextId from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;
// Calling variables for jQuery that I learned via the mini project in class
const taskFormEl = $('#taskForm');
const taskDisplayEl = $('#task-display');
const taskNameInputEl = $('#taskName');
const taskDescriptionInputEl = $('#taskDescription');
const taskDateInputEl = $('#taskDueDate');

// This function is for checking localStorage for an existing task list (array), if none exist, this creates one
function readTasksFromStorage() {
    let tasks = JSON.parse(localStorage.getItem('tasks'));

    if (!tasks) {
        tasks = [];
    }
    return tasks;
}

// This function is for storing the task data to localStorage
function saveTasksToStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// This function generates a task ID
// REMINDER: Look further into this as I'm not currently 100% sure I understand how this works
function generateTaskId() {
    return nextId++;
}

// This function creates a card for each created task
function createTaskCard(task) {
    const taskCard = $('<div>').addClass('card project-card draggable my-3').attr('data-task-id', task.id);
    const cardHeader = $('<div>').addClass('card-header h4').text(task.name);
    const cardBody = $('<div>').addClass('card-body');
    const cardDescription = $('<p>').addClass('card-text').text(task.description);
    const cardDueDate = $('<p>').addClass('card-text').text('Due Date: ' + task.dueDate);
    const cardDeleteBtn = $('<button>').addClass('btn btn-danger delete-task').text('Delete').attr('data-task-id', task.id.toString());

    cardDeleteBtn.on('click', handleDeleteTask);
// This portion adjusts the color of the card based on the due date and current date
// Learned this one from the mini project from class
    if (task.dueDate && task.status !== 'done') {
        const now = dayjs();
        const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');
        
        if (now.isSame(taskDueDate, 'day')) {
            taskCard.addClass('bg-warning text-white');
        } else if (now.isAfter(taskDueDate)) {
            taskCard.addClass('bg-danger text-white');
            cardDeleteBtn.addClass('border-light');
        }
    }
    
    taskCard.append(cardHeader, cardBody.append(cardDescription, cardDueDate, cardDeleteBtn));

    return taskCard;
}

// This function renders the task cards on the page and makes them draggable
function renderTaskList() {
    const tasks = readTasksFromStorage();
    // Empties any existing lists
    const todoList = $('#todo-cards');
    todoList.empty();
    const inProgList = $('#in-progress-cards');
    inProgList.empty();
    const doneList = $('#done-cards');
    doneList.empty();

    for (let task of tasks) {
        if (task.status === 'to-do') {
            todoList.append(createTaskCard(task));
        } else if (task.status === 'in-progress') {
            inProgList.append(createTaskCard(task));
        } else if (task.status === 'done') {
            doneList.append(createTaskCard(task));
        }
    }
// This specifically is the portion to make it draggable
    $('.draggable').draggable({
        opacity: 0.7,
        zIndex: 100,
        helper: function (e) {
            const original = $(e.target).hasClass('ui-draggable') ?
                $(e.target) :
                $(e.target).closest('.ui-draggable');
            return original.clone().css({
                width: original.outerWidth(),
            });
        },
    });
}

// Function for adding a new task
function handleAddTask(event) {
    event.preventDefault();
// Reads user input for the three fields
    const taskName = taskNameInputEl.val().trim();
    const taskDescription = taskDescriptionInputEl.val().trim();
    const taskDueDate = taskDateInputEl.val();
// Creates the task object
    const newTask = {
        id: generateTaskId(),
        name: taskName,
        description: taskDescription,
        dueDate: taskDueDate,
        status: 'to-do',
    };
// Pulls tasks from localStorage and pushes the new task to the array
    const tasks = readTasksFromStorage();
    tasks.push(newTask);
// Saves updated tasks array to localStorage
    saveTasksToStorage(tasks);
// Renders task to the page
    renderTaskList();
// Clears input values if needed
    taskNameInputEl.val('');
    taskDescriptionInputEl.val('');
    taskDateInputEl.val('');
// Hides the modal
    $('#formModal').modal('hide');
}

// Function in charge of deleting taks
function handleDeleteTask(event) {
    const taskId = parseInt($(this).attr('data-task-id')); // Convert taskId back to integer
    let tasks = readTasksFromStorage(); // Call as a function

// Remove the task from the array
    tasks = tasks.filter((task) => task.id !== taskId); // Use !== for strict comparison
// Re-saves the array after the delete
    saveTasksToStorage(tasks);
    renderTaskList();
}

// This function handles dropping the task card after dragging it somewhere
function handleDrop(event, ui) {
    const tasks = readTasksFromStorage();
    const draggedTaskId = ui.helper.attr('data-task-id');
    const newStatus = event.target.id;

    for (let task of tasks) {
        if (task.id == draggedTaskId) {
            task.status = newStatus;
        }
    }

    saveTasksToStorage(tasks);
    renderTaskList();
}

// This section renders the date picker and task list when the page is done loading
$(document).ready(function () {
    renderTaskList();

    $('#taskDueDate').datepicker({
        dateFormat: 'yy-mm-dd',
        changeMonth: true,
        changeYear: true,
    });

    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
    });
});

taskFormEl.on('submit', handleAddTask);

taskDisplayEl.on('click', '.delete-task', handleDeleteTask);