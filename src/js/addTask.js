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
    await loadAllContacts();
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
    let categoryId = document.getElementById("categoryInput");
    createTaskControl(title, description, dueDate, categoryId, id);
}

/**
 * Controls the creation or editing of a task based on the input values.
 */
function createTaskControl(title, description, dueDate, categoryId, id) {
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
    try {
        let task = createTaskObject();
        const response = await fetch('http://localhost:8000/api/tasks/list/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${activUser.token}`,
                'X-CSRFToken': activUser.csrfToken,
            }, body: JSON.stringify(task),
        });
        if (!response.ok) {
            console.log(response);
            throw new Error('Fehler beim Speichern der neuen Task.');
        }
        const savedTask = await response.json();
        tasks.push(savedTask);
        changesSaved('Task added to board');
        if (window.location.pathname.endsWith('board.html')) {
            closeAddTaskPopup();
            renderAllTasks();
        }
        else {
            setTimeout(() => {
                window.location.href = './board.html';
            }, 3000);
        }
    } catch (error) {
        console.error('Fehler beim Erstellen der Task:', error);
    }
}

/**
 * Edits an existing task based on the provided ID.
 */
async function editTasks(taskId) {
    try {
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) {
            console.error("Task nicht gefunden.");
            return;
        }
        const updatedTask = createTaskObject();
        const response = await fetch(`http://localhost:8000/api/tasks/edit/${taskId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${activUser.token}`,
                'X-CSRFToken': activUser.csrfToken,
            }, body: JSON.stringify(updatedTask),
        });
        if (!response.ok) {
            throw new Error('Fehler beim Aktualisieren der Task.');
        }
        console.log('Task erfolgreich aktualisiert.');
        tasks[taskIndex] = updatedTask;
        changesSaved('Task added to board');
        closeAddTaskPopup();
        await loadAllTasks();
        renderAllTasks();
    } catch (error) {
        console.error('Fehler:', error);
    }
}

/** Collects and returns data for a new task. */
function createTaskObject() {
    return {
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
