/**
 * Adds a sub-task to the collection.
 */
function addSubTask() {
    let input = document.getElementById('subtaskInput');
    if (input.value === '') {
        return;
    } else {
        subtasks.push(input.value);
        renderSubTasks();
        input.value = '';
    }
}

/**
 * Renders the sub-task collection to the DOM.
 */
function renderSubTasks() {
    let collection = document.getElementById('subtasksContainer');
    collection.innerHTML = '';
    hideEditContainer();
    for (let i = 0; i < subtasks.length; i++) {
        const subCollection = subtasks[i];
        collection.innerHTML += returnSubTasks(subCollection, i);
    }
}

/**
 * Edits a sub-task.
 */
function showEditContainer(i) {
    let container = document.getElementById('subtaskEditContainer');
    let input = document.getElementById('editSubtaskInput');
    container.classList.remove('d-none');
    input.value = subtasks[i];
    currentSubtask = i;
}

/**
 * Hides the edit container for sub-tasks.
 */
function hideEditContainer() {
    let container = document.getElementById('subtaskEditContainer');
    container.classList.add('d-none');
}

/**
 * Edits a sub-task based on the input in the edit container.
 */
function editSubtask() {
    let input = document.getElementById('editSubtaskInput');
    if (input.value === '') {
        subtasks.splice(currentSubtask, 1);
    } else {
        subtasks[currentSubtask] = input.value;
    }
    renderSubTasks();
}

/**
 * Deletes a specific sub-task.
 */
function deleteSubtask(i) {
    subtasks.splice(i, 1)
    renderSubTasks();
}

/**
 * Handles the hover effect for the sub-task list item.
 */
function subtaskListHover(i) {
    let box = document.getElementById(`subtaskListFunctions${i}`);
    box.classList.remove('d-none');
}

/**
 * Resets the hover effect for the sub-task list item.
 */
function subtaskListHoverReset(i) {
    let box = document.getElementById(`subtaskListFunctions${i}`);
    box.classList.add('d-none');
}