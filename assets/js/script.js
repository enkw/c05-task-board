// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

const taskFormEl = $('#task-form');
const taskDisplayEl = $('#task-display');
const taskNameInputEl = $('#task-name-input');
const taskDescriptionInputEl = $('task-description-input');
const taskDateInputEl = $('#taskDueDate');

const time = dayjs();
// This function is for checking localStorage for an existing task list (array), if none exist, this creates one
function readTasksFromStorage() {
    let tasks = JSON.parse(localStorage.getItem('task'));

    if (!tasks) {
        tasks = [];
    }
    return tasks;
}
// This function is for storing the task data to localStorage
function saveTasksToStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Todo: create a function to generate a unique task id
function generateTaskId() {
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskCard = $('<div>').addClass('card project-card draggable my-3').attr('data-task-id', task.id);
    const cardHeader = $('<div>').addClass('card-header h4').text(task.name);
    const cardBody = $('<div>').addClass('card-body');
    const cardDescription = $('<p>').addClass('card-text').text(task.description);
    const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
    const cardDeleteBtn = $('<button>').addClass('btn btn-danger delete').text('Delete').attr('data-project-id', task.id);

  cardDeleteBtn.on('click', handleDeleteTask);

  if (task.dueDate && task.status !== 'done') {

  }

  cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
  taskCard.append(cardHeader, cardBody);

  return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
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

    $('.draggable').draggable({
        opacity: 0.7,
        zIndex: 100,
        helper: function (e) {
            const original = $(e.target).hasClass('ui-draggable')
            ? $(e.target)
            : $(e.target).closest('.ui-draggable');
            return original.clone().css({
                width: original.outerWidth(),
            });
        },
    });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();
    // Reads user input
        const taskName = taskNameInputEl.val().trim();
        const taskDescription = taskDescriptionInputEl.val().trim();
        const taskDate = taskDateInputEl.val();
    
        const newTask = {
            name: taskName,
            description: taskDescription,
            dueDate: taskDate,
            status: 'to-do',
        };
    // Pulls tasks from localStorage and pushes the new task to the array
        const tasks = readTasksFromStorage();
        tasks.push(newTask);
    // Saves updated tasks array to localStorage
        saveTasksToStorage(tasks);
    // Print tasks to the page
        printTaskData();
    // Clears input values if needed
        taskNameInputEl.val('');
        taskDescriptionInputEl.val('');
        taskDateInputEl.val('');
};

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const taskId = $(this).attr('data-task-id');
    const tasks = readTasksFromStorage;
// This portion removes the task from the array
    tasks.forEach((task) => {
        if (task.id === taskId) {
            tasks.splice(tasks.indexOf(task), 1);
        }
    });
    saveTasksToStorage(tasks);
    renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const tasks = readTasksFromStorage();
    const taskId = ui.draggable[0].dataset.taskId;
    const newStatus = event.target.id;

    for (let task of tasks) {
        if (task.id === taskId) {
            task.status = newStatus;
        }
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTaskList();
}

taskFormEl.on('submit', handleAddTask);

taskDisplayEl.on('click', '.btn-delete-task', handleDeleteTask);

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    readTasksFromStorage();

    $('#taskDueDate').datepicker({
        changeMonth: true,
        changeYear: true,
    });

    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
    });
});
