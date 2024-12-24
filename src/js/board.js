let dragElement;

/** * Initializes the board view. */
async function initBoard() {
    highLightNavBar('src/img/boardActiv.svg', 'boardNavIcon', 'boardNavButton');
    loadActivUser();
    userCircleLoad();
    await loadAllContacts();
    currentUserCategorysLoad();
    currentUserIdLoad();
    await loadAllTasks();
    renderPrioSection();
    renderCategoryPopUp();
    renderAllTasks();
}

/** * Renders all tasks on the board, applying optional filter. */
function renderAllTasks(filterText) {
    renderToDoTasks(filterText);
    renderInProgressTasks(filterText);
    renderAwaitFeedbackTasks(filterText);
    renderDoneTasks(filterText);
    removeDragClass();
}

/** * Renders tasks in the "To Do" section. */
function renderToDoTasks(filterText) {
    let box = document.getElementById('boardToDo');
    let array = tasks.filter(task => task.status === 'toDo');
    let emptyText = 'No tasks To do';
    box.innerHTML = '';
    isTaskInArray(filterText, array, box, emptyText)
}

/** * Renders tasks in the "In Progress" section. */
function renderInProgressTasks(filterText) {
    let box = document.getElementById('boardInProgress');
    let array = tasks.filter(task => task.status === 'inProgress');
    let emptyText = 'No tasks In Progress';
    box.innerHTML = '';
    isTaskInArray(filterText, array, box, emptyText)
}

/** * Renders tasks in the "Await Feedback" section. */
function renderAwaitFeedbackTasks(filterText) {
    let box = document.getElementById('boardAwaitFeedback');
    let array = tasks.filter(task => task.status === 'awaitFeedback');
    let emptyText = 'No tasks Await feedback';
    box.innerHTML = '';
    isTaskInArray(filterText, array, box, emptyText)
}

/** * Renders tasks in the "Done" section. */
function renderDoneTasks(filterText) {
    let box = document.getElementById('boardDone');
    let array = tasks.filter(task => task.status === 'done');
    emptyText = 'No tasks Done';
    box.innerHTML = '';
    isTaskInArray(filterText, array, box, emptyText)
}

/** * Checks if tasks are present in the array and renders them, otherwise shows an empty box. */
function isTaskInArray(filterText, array, box, emptyText) {
    if (array.length > 0) {
        boardSearch(filterText, array, box, emptyText);
    } else {
        box.innerHTML = returnEmptyBox(emptyText);
    }
}

/** * Searches and renders tasks based on a filter text, updating the specified box. */
function boardSearch(filterText, array, box, emptyText) {
    let taskArray = fillTaskArray(filterText, array);
    if (taskArray.length > 0) {
        for (let t = 0; t < taskArray.length; t++) {
            const task = taskArray[t];
            box.innerHTML += returnArrayHtml(task);
        }
    } else {
        box.innerHTML = returnEmptyBox(emptyText);
    }
}

/** * Filters tasks based on the provided filter text and renders the results in the specified box. */
function fillTaskArray(filterText, array) {
    let filteredTasks;
    if (filterText) {
        filteredTasks = array.filter(function (search) {
            return search.category.toLowerCase().includes(filterText.toLowerCase()) ||
                search.description.toLowerCase().includes(filterText.toLowerCase()) ||
                search.title.toLowerCase().includes(filterText.toLowerCase());
        });
    } else {
        filteredTasks = array;
    }
    return filteredTasks;
}

function returnEmptyBox(text) {
    return /*html*/`
    <div class="empty-label">${text}</div>`;
}

/** * Handles the drag start animation for a task. */
function startDragAnimation(id) {
    let task = document.getElementById(`taskNote${id}`)
    dragElement = id;
    task.classList.add('rotating');
}

/** * Removes the taskSectionDrag class from task containers. */
function removeDragClass() {
    let ids = ['boardToDo', 'boardInProgress', 'boardAwaitFeedback', 'boardDone'];
    ids.forEach(function (id) {
        let box = document.getElementById(id);
        box.classList.remove('taskSectionDrag');
    });
}

/** * It prevents the default behavior of the browser (which blocks dragging by default) */
function allowDrop(ev, id) {
    let box = document.getElementById(id);
    box.classList.add('taskSectionDrag');
    ev.preventDefault();
}

/** 
 * Moves a task to a specified group and speichert die Änderung auf dem Server.
 */
async function moveTo(group) {
    try {
        const index = tasks.findIndex(task => task.id === dragElement);
        if (index === -1) {
            console.error("Task nicht gefunden");
            return;
        }
        if (isGuestLogIn()) {
            await handleGuestTaskMove(index, group);
        } else {
            await handleAuthenticatedTaskMove(index, group);
        }
        renderAllTasks();
    } catch (error) {
        console.error('Fehler beim Verschieben der Task:', error);
    }
}

/** * Displays the add task popup for a specified status group. */
async function showAddTaskPopup(status) {
    clearAddTask();
    let box = document.getElementById('addTaskPopUp');
    let headline = document.getElementById('addTaskHeadline');
    let buttonArea = document.getElementById('addTaskButtonArea');
    box.classList.remove('d-none');
    headline.innerText = 'Add Task';
    buttonArea.innerHTML = returnButtonAreaAddTask();
    await currentUserIdLoad();
    renderAllSelectedContacts();
    controlPrioButton();
    renderSubTasks();
    statusGroup = status;
}

/** * Displays the add task popup for editing an existing task. */
function showAddTaskPopupEdit(id) {
    clearAddTask();
    let box = document.getElementById('addTaskPopUp');
    let headline = document.getElementById('addTaskHeadline');
    let buttonArea = document.getElementById('addTaskButtonArea');
    closeCurrentTaskPopUp();
    box.classList.remove('d-none');
    headline.innerText = 'Edit Task';
    buttonArea.innerHTML = returnButtonAreaEditTask(id);
    loadTaskForEdit(id);
    controlPrioButton();
    renderAllSelectedContacts();
    renderSubTasks();
}

/** * Closes the add task popup. */
function closeAddTaskPopup() {
    let box = document.getElementById('addTaskPopUp');
    box.classList.add('d-none');
    clearAddTask();
}

/** * Renders the popup for the current task. */
function renderCurrentTaskPopUp(id) {
    let container = document.getElementById('currentTaskPopUp');
    let index = tasks.findIndex(object => object.id === id);
    let array = tasks[index];
    container.classList.remove('d-none');
    container.innerHTML = returnCurrentTaskPopUp(array);
    renderContactRowPopUp(array);
    renderSubtaskRowPopUp(array, index);
}

/** * Closes the popup for the current task. */
function closeCurrentTaskPopUp() {
    let container = document.getElementById('currentTaskPopUp');
    container.classList.add('d-none');
    container.innerHTML = '';
    renderAllTasks();
}

/** * Renders the contact row in the current task popup. */
function renderContactRowPopUp(array) {
    let contactRow = document.getElementById('contactRowPopUp');
    contactRow.innerHTML = '';
    for (let i = 0; i < array.assignContacts.length; i++) {
        const allContacts = array.assignContacts[i];
        contactRow.innerHTML += /*html*/`
        <div class="currentTaskContactRow">
             <div style="${allContacts.color}" class="currentTaskContactCircle">${allContacts.nameAbbreviation}</div>
            <span class="currentTaskContactName">${allContacts.name}</span>
        </div>`;
    }
}

/**
 * Moves a subtask between in-progress and finished status and saves changes to the server.
 */
async function moveASubtask(index, subtask) {
    const task = tasks[index];
    if (!task) {
        console.error('Task nicht gefunden.');
        return;
    }
    try {
        if (isGuestLogIn()) {
            handleGuestSubtaskMove(task, subtask);
        } else {
            await handleAuthenticatedSubtaskMove(task, subtask, index);
        }
        renderSubtaskRowPopUp(task, index); // Gemeinsames Rendern
    } catch (error) {
        console.error('Fehler beim Bewegen des Subtasks:', error);
    }
}

/** * Renders the subtask row in the current task popup. */
function renderSubtaskRowPopUp(array, index) {
    let subtaskRow = document.getElementById('subtaskRowPopUp');
    subtaskRow.innerHTML = '';
    let progress = '';
    for (let i = 0; i < array.subtasksInProgress.length; i++) {
        let subtask = array.subtasksInProgress[i];
        if (array.subtasksFinish.some(subTasks => subTasks === subtask)) {
            progress = 'src/img/done.svg';
        } else {
            progress = 'src/img/addTaskBox.svg';
        }
        subtaskRow.innerHTML += /*html*/`
        <div onclick="moveASubtask(${index}, '${subtask}')" id='subtaskRow${i}' class="currentTaskHover" style="display: flex; align-items: center; justify-content: center; gap: 16px; padding: 6px 16px;">
            <img src="${progress}" alt="">
            <span class="currentTaskSubtaskSpan">${subtask}</span>
        </div> `;
    }
}

/** * Displays the confirmation window for deleting a task. */
function deleteTaskWindow(id) {
    let index = tasks.findIndex(object => object.id === id);
    let container = document.getElementById('contactsDeletePopUp');
    container.innerHTML = returnDeleteWindow(index);
    container.classList.remove('d-none');
}

/** * Closes the confirmation window for deleting a task. */
function closeDeleteWindow() {
    let container = document.getElementById('contactsDeletePopUp');
    container.classList.add('d-none');
}

/**
 * Deletes a task from the server and updates the UI.
 */
async function deleteTask(index) {
    try {
        if (isGuestLogIn()) {
            handleGuestTaskDeletion(index);
        } else {
            await handleAuthenticatedTaskDeletion(index);
        }
        closeDeleteWindow();
        renderAllTasks();
        closeCurrentTaskPopUp();
    } catch (error) {
        console.error('Fehler beim Löschen der Aufgabe:', error);
    }
}