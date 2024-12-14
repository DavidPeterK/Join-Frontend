let selectedCategorys = '';
let selectedContacts = '';
let selectedPrio = '';
let currentSubtask = '';

/**
 * Initializes the add task page, loading necessary data and setting default values.
 */
async function addTaskInit() {
    highLightNavBar('src/img/addTaskActiv.svg', 'addTaskNavIcon', 'addTaskNavButton');
    loadActivUser();
    userCircleLoad();
    await currentUserContactsLoad();
    await currentUserCategorysLoad();
    await currentUserIdLoad();
    await loadAllTasks();
    renderPrioSection();
    renderCategoryPopUp();
    selectedPrio = 'Medium';
    controlPrioButton();
}

/**
 * Loads task control elements based on the provided task ID.
 */
function loadTaskControl(id) {
    let title = document.getElementById('addTaskTitleInput');
    let description = document.getElementById('addTaskDescriptionInput');
    let dueDate = document.getElementById('datepicker');
    createTaskControl(title, description, dueDate, id);
}

/**
 * Controls the creation or editing of a task based on the input values.
 */
function createTaskControl(title, description, dueDate, id) {
    if (title.value === '') {
        warnTitle();
    } else if (description.value === '') {
        warnDescription();
    } else if (dueDate.value === '') {
        warnDueDate();
    } else if (id === '') {
        createTask();
    } else {
        editTasks(id);
    }
}

/**
 * Displays a warning for a missing task title.
 */
function warnTitle() {
    let titleBox = document.getElementById('addTaskTitleBox');
    let titleWarn = document.getElementById('warnTitle');
    titleBox.classList.add('red-border');
    titleWarn.classList.remove('d-none');
    setTimeout(() => {
        titleBox.classList.remove('red-border');
        titleWarn.classList.add('d-none');
    }, 4000);
}

/**
 * Displays a warning for a missing task description.
 */
function warnDescription() {
    let description = document.getElementById('addTaskDescriptionInput');
    let descriptionWarn = document.getElementById('warnDescription');
    description.classList.add('red-border');
    descriptionWarn.classList.remove('d-none');
    setTimeout(() => {
        description.classList.remove('red-border');
        descriptionWarn.classList.add('d-none');
    }, 4000);
}

/**
 * Displays a warning for a missing due date.
 */
function warnDueDate() {
    let dueDateBox = document.getElementById('addTaskDueDateBox');
    let dueDateWarn = document.getElementById('warnDueDate');
    dueDateBox.classList.add('red-border');
    dueDateWarn.classList.remove('d-none');
    setTimeout(() => {
        dueDateBox.classList.remove('red-border');
        dueDateWarn.classList.add('d-none');
    }, 4000);
}

/**
 * Creates a new task and adds it to the tasks collection.
 */
async function createTask() {
    let task = createTaskObject();
    tasks.push(task);
    currentId++;
    await currentUserIdSave();
    await currentUserTaskSave();
    changesSaved('Task added to board');
    if (window.location === './board.html') {
        closeAddTaskPopup()
        renderAllTasks();
    }
    setTimeout(() => { window.location.href = './board.html'; }, 3000);
}

/**
 * Edits an existing task based on the provided ID.
 */
async function editTasks(id) {
    let index = tasks.findIndex(object => object.id === id);
    let task = createTaskObject();
    tasks[index] = task;
    await currentUserTaskSave();
    changesSaved('Task added to board');
    closeAddTaskPopup();
    renderAllTasks();
}

/** Collects and returns data for a new task. */
function createTaskObject() {
    return {
        'id': currentId,
        'status': statusGroup,
        'category': currentCategorySelected.name,
        'categoryColor': currentCategorySelected.color,
        'title': document.getElementById("addTaskTitleInput").value,
        'description': document.getElementById("addTaskDescriptionInput").value,
        'dueDate': document.getElementById("datepicker").value,
        'priority': selectedPrio,
        'assignContacts': contactCollection,
        'subtasksInProgress': subtasks,
        'subtasksFinish': subtasksFinish,
    }
}

/**
 * Loads task data for editing based on the provided ID.
 */
function loadTaskForEdit(id) {
    let index = tasks.findIndex(object => object.id === id);
    let task = tasks[index];
    document.getElementById("addTaskTitleInput").value = task.title;
    document.getElementById("addTaskDescriptionInput").value = task.description;
    document.getElementById("datepicker").value = task.dueDate;
    document.getElementById('categoryInput').value = task.category;
    currentId = task.id;
    statusGroup = task.status;
    currentCategorySelected.name = task.category;
    currentCategorySelected.color = task.categoryColor;
    selectedPrio = task.priority;
    contactCollection = task.assignContacts;
    subtasks = task.subtasksInProgress;
    subtasksFinish = task.subtasksFinish;
}

/**
 * Clears input values in the add task form.
 */
function clearAddTask() {
    document.getElementById("addTaskTitleInput").value = '';
    document.getElementById("addTaskDescriptionInput").value = '';
    document.getElementById("datepicker").value = '';
    document.getElementById("subtaskInput").value = '';
    document.getElementById('categoryInput').value = 'Select task category';
    statusGroup = '';
    currentCategorySelected.name = '';
    currentCategorySelected.color = '';
    currentCategorySelected.type = '';
    selectedPrio = 'Medium';
    controlPrioButton();
    contactCollection = [];
    subtasks = [];
    subtasksFinish = [];
}

function setStatusToDo() {
    statusGroup = 'toDo';
}

//only for date-input by addTask.html/ Due date//
/**
 * Event listener to initialize a date picker for task due date input.
 */
document.addEventListener('DOMContentLoaded', function () {
    var dateInput = document.getElementById('datepicker');
    var picker = new Pikaday({
        field: dateInput,
        position: 'center',
        format: 'DD/MM/YYYY',
        minDate: new Date(), // Das stellt sicher, dass kein Datum vor dem heutigen Datum ausgewählt werden kann.
        onSelect: function (date) {
            const formattedDate = [
                date.getDate().toString().padStart(2, '0'),
                (date.getMonth() + 1).toString().padStart(2, '0'),
                date.getFullYear()
            ].join('/');
            dateInput.value = formattedDate;
        }
    });

    dateInput.addEventListener('focus', function () {
        if (!this.value) {
            const today = new Date();
            const formattedDate = [
                today.getDate().toString().padStart(2, '0'),
                (today.getMonth() + 1).toString().padStart(2, '0'),
                today.getFullYear()
            ].join('/');
            this.value = formattedDate;
            picker.show();
        }
    });
});
