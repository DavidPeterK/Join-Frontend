/**
 * Handles task deletion for guest users.
 */
async function handleGuestTaskDeletion(index) {
    tasks.splice(index, 1);
    currentUserTaskSave();
    console.log('Task erfolgreich gelöscht (Gastbenutzer)');
}

/**
 * Handles task deletion for authenticated users.
 */
async function handleAuthenticatedTaskDeletion(index) {
    const task = tasks[index];
    const response = await fetch(`http://localhost:8000/api/tasks/edit/${task.id}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${activUser.token}`,
            'X-CSRFToken': activUser.csrfToken,
        },
    });
    if (!response.ok) {
        throw new Error(`Fehler beim Löschen der Aufgabe mit ID ${task.id}.`);
    }
    console.log(`Task mit ID ${task.id} erfolgreich gelöscht.`);
    tasks.splice(index, 1);
}

/**
 * Handles the movement of a subtask for guest users.
 */
function handleGuestSubtaskMove(task, subtask) {
    const subtaskFinishId = task.subtasksFinish;
    if (subtaskFinishId.includes(subtask)) {
        const indexSub = subtaskFinishId.indexOf(subtask);
        subtaskFinishId.splice(indexSub, 1);
    } else {
        subtaskFinishId.push(subtask);
    }
    currentUserTaskSave();
}

/**
 * Handles the movement of a subtask for authenticated users.
 */
async function handleAuthenticatedSubtaskMove(task, subtask, index) {
    const finishedSubtasks = task.subtasksFinish;
    if (finishedSubtasks.includes(subtask)) {
        const indexSub = finishedSubtasks.indexOf(subtask);
        finishedSubtasks.splice(indexSub, 1);
    } else {
        finishedSubtasks.push(subtask);
    }
    tasks[index].subtasksFinish = finishedSubtasks;
    const response = await fetch(`http://localhost:8000/api/tasks/edit/${task.id}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${activUser.token}`,
            'X-CSRFToken': activUser.csrfToken,
        },
        body: JSON.stringify({
            subtasksFinish: finishedSubtasks,
        }),
    });
    if (!response.ok) {
        throw new Error('Fehler beim Speichern der Subtasks.');
    }
    console.log('Subtask-Änderungen erfolgreich gespeichert.');
}

/**
 * Handles the task movement for guest users.
 */
async function handleGuestTaskMove(index, group) {
    tasks[index].status = group;
    currentUserTaskSave();
    console.log('Task erfolgreich verschoben (Gastbenutzer)');
}

/**
 * Handles the task movement for authenticated users.
 */
async function handleAuthenticatedTaskMove(index, group) {
    tasks[index].status = group;
    const response = await fetch(`http://localhost:8000/api/tasks/edit/${tasks[index].id}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${activUser.token}`,
            'X-CSRFToken': activUser.csrfToken,
        },
        body: JSON.stringify({ status: group }),
    });
    if (!response.ok) {
        throw new Error('Fehler beim Aktualisieren der Task.');
    }
    console.log('Task erfolgreich verschoben (Authentifizierter Benutzer)');
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