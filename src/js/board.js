let dragElement;

/** * Initializes the board view. */
async function initBoard() {
    highLightNavBar('src/img/boardActiv.svg', 'boardNavIcon', 'boardNavButton');
    loadActivUser();
    userCircleLoad();
    await currentUserContactsLoad();
    currentUserCategorysLoad();
    await currentUserIdLoad();
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
            return search.category.toLowerCase().includes(filterText.toLowerCase()) || search.description.toLowerCase().includes(filterText.toLowerCase()) || search.title.toLowerCase().includes(filterText.toLowerCase());
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

/** * Moves a task to a specified group. */
/** 
 * Moves a task to a specified group and speichert die Änderung auf dem Server.
 */
async function moveTo(group) {
    try {
        // Index der zu verschiebenden Task finden
        let index = tasks.findIndex(task => task.id === dragElement);
        if (index === -1) {
            console.error("Task nicht gefunden");
            return;
        }

        // Status der Task lokal aktualisieren
        tasks[index].status = group;

        // PATCH-Request an den Server senden
        const response = await fetch(`http://localhost:8000/api/tasks/edit/${dragElement}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: group }) // Nur das Feld 'status' senden
        });

        if (!response.ok) {
            throw new Error('Fehler beim Aktualisieren der Task');
        }

        console.log('Task erfolgreich verschoben');

        // Lokale Taskliste aktualisieren und neu rendern
        currentUserTaskSave(); // Optional: Lokale Speicherung synchronisieren
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

/** * Moves a subtask between in-progress and finished status. */
async function moveASubtask(index, subtask) {
    let array = tasks[index];
    let subtaskFinishId = array.subtasksFinish;
    if (subtaskFinishId.some(subTasks => subTasks === subtask)) {
        let indexSub = subtaskFinishId.findIndex(subTasks => subTasks === subtask);
        subtaskFinishId.splice(indexSub, 1);
        await currentUserTaskSave();
    } else {
        subtaskFinishId.push(subtask);
        await currentUserTaskSave();
    }
    renderSubtaskRowPopUp(array, index);
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

/** * Deletes a task and updates the UI. */
async function deleteTask(index) {
    tasks.splice(index, 1);
    await currentUserTaskSave();
    closeDeleteWindow();
    renderAllTasks();
    closeCurrentTaskPopUp();
}

/** * Returns the HTML for the current task popup. */
function returnCurrentTaskPopUp(array) {
    return /*html*/`
    <div onclick='doNotClose(event)' class="currentTaskPopUpPosition">
        <div style="display: flex; width: 100%; align-items: center; gap: 24px; justify-content: space-between">
            <span style="${array.categoryColor}" class="currentTaskCategorySpan">${array.category}</span>
            <img onclick='closeCurrentTaskPopUp()' class="currentTaskCrossPop" src="src/img/crossAddTask.svg" alt="cross">
        </div>
        <span class="currentTaskTitelSpan">${array.title}</span>
        <span class="currentTaskDescriptionSpan">${array.description}</span>
        <div
            style="display: flex; align-items: center; justify-content: flex-start; gap: 24px; align-self: stretch;">
            <span class="currentTaskSpan">Due date:</span>
            <span class="currentTaskDescriptionSpan">${array.dueDate}</span>
        </div>
        <div
            style="display: flex; align-items: center; justify-content: flex-start; gap: 24px; align-self: stretch;">
            <span style="align-self: stretch;" class="currentTaskSpan">Priority:</span>
            <span style="padding: 0px 18px; gap: 10px;" class="currentTaskDescriptionSpan">${array.priority}<img
                    src="src/img/prio${array.priority}.svg" alt=""></span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: flex-start; width: 100%; gap: 8px;">
            <span style="align-self: stretch;" class="currentTaskSpan">Assigned To:</span>
            <div id='contactRowPopUp' style="display: flex; flex-direction: column; align-items: flex-start; width: 100%; max-height: 250px; overflow-y: auto;">
            </div>
        </div>
        <div style="display: flex; flex-direction: column; align-items: flex-start; width: 100%; gap: 8px;">
            <span style="align-self: stretch;" class="currentTaskSpan">Subtasks</span>
            <div id='subtaskRowPopUp' style="display: flex; flex-direction: column; align-items: flex-start; width: 100%; max-height: 250px; overflow-y: auto;">
            </div>
        </div>
        <div style="display: flex; align-items: center; justify-content: flex-end; width: 100%; gap: 8px;">
            <div onclick='deleteTaskWindow(${array.id})' class="currentTaskButton"><img style="width: 24px; height: 24px;"
                    src="src/img/subTaskDelete.svg" alt="">Delete</div>
            <div style="width: 1px; background: #d1d1d1; height: 24px;"></div>
            <div onclick='showAddTaskPopupEdit(${array.id}), doNotClose(event)' class="currentTaskButton"><img style="width: 24px; height: 24px;"
                    src="src/img/PenAddTask 1=edit.svg" alt="">Edit</div>
        </div>
    </div>    
    `;
}

function returnButtonAreaAddTask() {
    return /*html*/ `
    <span class="addTask-requiredSpan"><span class="star-red">*</span>This field is required</span>
    <div class="addTask-button-container">
        <div onclick='clearAddTask(), renderAllSelectedContacts(), controlPrioButton(), renderSubTasks();' onmouseover="changeImage('clearButton', 'src/img/crossBlue.png')"
            onmouseout="restoreImage('clearButton', 'src/img/crossAddTask.svg')" class="clear-button">
            Clear
            <img id="clearButton" style="width: 24px; height: 24px;" src="src/img/crossAddTask.svg"
                alt="cross-icon">
        </div>
        <div onclick="loadTaskControl('')" class="createTask-button button-hover">Create Task <img
                src="src/img/check.svg" alt="check-icon">
        </div>
    </div>    
    `;
}

function returnButtonAreaEditTask(id) {
    return /*html*/ `
    <span class="addTask-requiredSpan"><span class="star-red">*</span>This field is required</span>
    <div class="addTask-button-container">
        <div onclick="closeAddTaskPopup()" onmouseover="changeImage('clearButton', 'src/img/crossBlue.png')"
            onmouseout="restoreImage('clearButton', 'src/img/crossAddTask.svg')" class="clear-button">
            Cancel
            <img id="clearButton" style="width: 24px; height: 24px;" src="src/img/crossAddTask.svg"
                alt="cross-icon">
        </div>
        <div onclick="loadTaskControl(${id})" class="createTask-button button-hover">Save<img
                src="src/img/check.svg" alt="check-icon">
        </div>
    </div>    
    `;
}

function returnDeleteWindow(index) {
    return /*html*/`
   <div class="deleteQuest">
        <span style='text-align: center' class="category-span">Do you really want to delete this <span style="color: #29abe2;">task</span>?
        </span>
        <div style="width: 100%; display: flex; justify-content: center; align-items: center; gap: 28px;">
            <button onclick='closeDeleteWindow()' class="pop-button-cancel">No</button>
            <button onclick='deleteTask(${index})' class="pop-button-create">Yes</button>
        </div>
    </div>`;
}

function returnArrayHtml(task) {
    let contactHtml;
    let prioHtml;
    let progress;
    contactHtml = '';
    prioHtml = '';
    progress = '';
    for (let i = 0; i < task.assignContacts.length; i++) {
        if (i === 5 && task.assignContacts.length > 6) {
            contactHtml += `<b style='font-size: 18px; padding-left: 7px'>+${task.assignContacts.length - 5}</b>`;
            break;
        } else {
            const allContacts = task.assignContacts[i];
            contactHtml += /*html*/`
    <div style="${allContacts.color};" class="userCircle">${allContacts.nameAbbreviation}</div>`;
        }
    }
    if (task.priority) {
        prioHtml = /*html*/`<img class="prioIcon" src="src/img/prio${task.priority}.svg" alt="prio-icon">`;
    }
    if (task.subtasksInProgress.length > 0) {
        progress = /*html*/`
            <div class="progress-container">
                <div class="progress-bar" style="width: ${100 / (task.subtasksInProgress.length / task.subtasksFinish.length)}%;"></div>
            </div>
            <span class="progressSpan">${task.subtasksFinish.length}/${task.subtasksInProgress.length} Subtasks</span>
        `;
    }
    return /*html*/`
    <div onclick='renderCurrentTaskPopUp(${task.id}), doNotClose(event)' id='taskNote${task.id}' draggable='true' ondragstart='startDragAnimation(${task.id})' class="taskContainer">
        <span style="${task.categoryColor}" class="taskCategorySpan">${task.category}</span>
        <div class="titelDescriptionBox">
            <span class="titelSpan">${task.title}</span>
            <span class="descriptionSpan">${task.description}</span>
        </div>
        <div class="progressSection">
            ${progress}
        </div>
        <div class="taskFooter">
            <div class="taskUserCircles">
                ${contactHtml}
            </div>
            ${prioHtml}
        </div>
        <div id='swapContainer${task.id}' onclick='doNotClose(event)' class='swapBox d-none'>
            <b style='padding-bottom: 8px; font-size: 18px'>Move to:</b>
            <div onclick="swapTask('toDo', ${task.id})" class='swapRow'>To do</div>
            <div onclick="swapTask('inProgress', ${task.id})" class='swapRow'>In progress</div>
            <div onclick="swapTask('awaitFeedback', ${task.id})" class='swapRow'>Await feedback</div>
            <div onclick="swapTask('done', ${task.id})" class='swapRow'>Done</div>
        </div>
        <img onclick='openSwapBox(${task.id}), doNotClose(event)' id='swapArrow${task.id}' class='arrowUpDown' src="src/img/arrow-down-up.svg" alt="arrow-down-up">
    </div> `;
}