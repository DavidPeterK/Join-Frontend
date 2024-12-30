let selectedCategorys = '';
let selectedContacts = '';
let selectedPrio = '';
let currentSubtask = '';
/**
 * Initializes the add task page, loading necessary data and setting default values.
 */
async function addTaskInit() {
    highLightNavBar('src/img/addTaskActiv.svg', 'addTaskNavIcon', 'addTaskNavButton');
    loadActivUser(); userCircleLoad();
    await loadAllContacts();
    currentUserCategorysLoad(); currentUserIdLoad();
    await loadAllTasks();
    renderPrioSection(); renderCategoryPopUp();
    selectedPrio = 'Medium'; controlPrioButton();
}

/**
 * Loads task control elements based on the provided task ID.
 */
function loadTaskControl(id) {
    let title = document.getElementById('addTaskTitleInput');
    let description = document.getElementById('addTaskDescriptionInput');
    let dueDate = document.getElementById('datepicker');
    let categoryId = document.getElementById("categoryInput");
    createTaskControl(title, description, dueDate, categoryId, id);
}

/**
 * Controls the creation or editing of a task based on the input values.
 */
async function createTaskControl(title, description, dueDate, categoryId, id) {
    if (title.value === '') {
        warnValTask('addTaskTitleBox', 'warnTitle');
    } else if (description.value === '') {
        warnValTask('addTaskDescriptionInput', 'warnDescription');
    } else if (dueDate.value === '') {
        warnValTask('addTaskDueDateBox', 'warnDueDate');
    } else if (categoryId.value === 'Select task category') {
        warnValTask("categoryBox", 'warnCategory');
    } else if (id === '') {
        createTask();
    } else {
        editTasks(id);
    }
}

/**
 * Displays a warning for a missing task title.
 */
function warnValTask(box, title) {
    let outline = document.getElementById(box);
    let warnTitle = document.getElementById(title);
    outline.classList.add('red-border');
    warnTitle.classList.remove('d-none');
    setTimeout(() => {
        outline.classList.remove('red-border');
        warnTitle.classList.add('d-none');
    }, 4000);
}

/**
 * Creates a new task and adds it to the tasks collection.
 */
async function createTask() {
    if (isGuestLogIn()) {
        createTaskForGuest();
    }
    else {
        try {
            let task = createTaskObject();
            const savedTask = await saveTaskToAPI(task);
            tasks.push(savedTask);
            changesSaved('Task added to board');
            handlePostTaskAction(savedTask);
        } catch (error) {
            console.error('Fehler beim Erstellen der Task:', error);
        }
    }
}

function createTaskForGuest() {
    let task = createTaskObject();
    tasks.push(task);
    currentId++;
    currentUserIdSave();
    currentUserTaskSave();
    changesSaved('Task added to board');
    handlePostTaskAction();
}

/**
 * Sends a POST request to save a new task to the API.
 */
async function saveTaskToAPI(task) {
    const response = await fetch(`${FETCH_URL + 'api/tasks/list/'}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${activUser.token}`,
            'X-CSRFToken': activUser.csrfToken,
        },
        body: JSON.stringify(task),
    });
    if (!response.ok) {
        console.error(response);
        throw new Error('Fehler beim Speichern der neuen Task.');
    }
    return await response.json();
}

/**
 * Handles UI and navigation actions after saving a task.
 */
function handlePostTaskAction() {
    if (window.location.pathname.endsWith('board.html')) {
        closeAddTaskPopup();
        renderAllTasks();
    } else {
        setTimeout(() => {
            window.location.href = './board.html';
        }, 3000);
    }
}

/**
 * Edits an existing task based on the provided ID.
 */
async function editTasks(taskId) {
    if (isGuestLogIn()) {
        editTaskForGuest(taskId);
    } else {
        try {
            const taskIndex = findTaskIndex(taskId);
            if (taskIndex === -1) {
                console.error("Task nicht gefunden.");
                return;
            }
            const updatedTask = createTaskObject();
            await updateTaskInAPI(taskId, updatedTask);
            updateLocalTask(taskIndex, updatedTask);
            handlePostEditActions();
        } catch (error) {
            console.error('Fehler beim Bearbeiten der Task:', error);
        }
    }
}

function editTaskForGuest(taskId) {
    const index = findTaskIndex(taskId);
    let task = createTaskObject();
    tasks[index] = task;
    currentUserTaskSave();
    changesSaved('Task added to board');
    closeAddTaskPopup();
    renderAllTasks();
}

/**
 * Finds the index of a task in the local tasks array by ID.
 */
function findTaskIndex(taskId) {
    return tasks.findIndex(task => task.id === taskId);
}

/**
 * Updates a task in the local tasks array.
 */
function updateLocalTask(taskIndex, updatedTask) {
    tasks[taskIndex] = updatedTask;
    console.log('Lokale Task-Liste aktualisiert.');
}

/**
 * Handles UI updates and task reloading after editing a task.
 */
async function handlePostEditActions() {
    changesSaved('Task updated successfully.');
    closeAddTaskPopup();
    await loadAllTasks();
    renderAllTasks();
}

/**
 * Sends a PUT request to update a task in the API.
 */
async function updateTaskInAPI(taskId, updatedTask) {
    const response = await fetch(`${FETCH_URL}api/tasks/edit/${taskId}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${activUser.token}`,
            'X-CSRFToken': activUser.csrfToken,
        },
        body: JSON.stringify(updatedTask),
    });
    if (!response.ok) {
        throw new Error('Fehler beim Aktualisieren der Task.');
    }
    console.log('Task erfolgreich in der API aktualisiert.');
}

/** Collects and returns data for a new task. */
function createTaskObject() {
    const task = {
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
    };
    if (isGuestLogIn()) {
        task.id = currentId;
    }
    return task;
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

/**
 * Event listener to initialize a date picker for task due date input.
 */
document.addEventListener('DOMContentLoaded', function () {
    var dateInput = document.getElementById('datepicker');
    var picker = new Pikaday({
        field: dateInput,
        position: 'center',
        format: 'DD/MM/YYYY',
        minDate: new Date(),
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