/**
 * Renders the priority section in the designated container.
 */
function renderPrioSection() {
    let container = document.getElementById('prioSection');
    container.innerHTML = returnPrioSection();
}

/**
 * Handles the click event for the "Urgent" priority button.
 */
function urgentButtonClick() {
    if (selectedPrio === 'Urgent') {
        resetUrgentButton();
        selectedPrio = '';
    } else if (selectedPrio === 'Low' || selectedPrio === 'Medium' || selectedPrio === '') {
        urgentButtonActiv();
        resetMediumButton();
        resetLowButton();
        selectedPrio = 'Urgent';
    }
}

/**
 * Handles the click event for the "Medium" priority button.
 */
function mediumButtonClick() {
    if (selectedPrio === 'Medium') {
        resetMediumButton();
        selectedPrio = '';
    } else if (selectedPrio === 'Low' || selectedPrio === 'Urgent' || selectedPrio === '') {
        mediumButtonActiv();
        resetUrgentButton();
        resetLowButton();
        selectedPrio = 'Medium';
    }
}

/**
 * Handles the click event for the "Low" priority button.
 */
function lowButtonClick() {
    if (selectedPrio === 'Low') {
        resetLowButton();
        selectedPrio = '';
    } else if (selectedPrio === 'Medium' || selectedPrio === 'Urgent' || selectedPrio === '') {
        lowButtonActiv();
        resetMediumButton();
        resetUrgentButton();
        selectedPrio = 'Low';
    }
}

/**
 * Activates the styles for the "Urgent" priority button.
 */
function urgentButtonActiv() {
    document.getElementById('urgentImg').src = 'src/img/prioUrgentWhite.svg';
    document.getElementById('urgentButton').classList.add('urgentActiv');
}

/**
 * Activates the styles for the "Medium" priority button.
 */
function mediumButtonActiv() {
    document.getElementById('mediumImg').src = 'src/img/PrioMediumWhite.svg';
    document.getElementById('mediumButton').classList.add('mediumActiv');
}

/**
 * Activates the styles for the "Low" priority button.
 */
function lowButtonActiv() {
    document.getElementById('lowImg').src = 'src/img/prioLowWhite.svg';
    document.getElementById('lowButton').classList.add('lowActiv');
}

/**
 * Resets the styles for the "Urgent" priority button.
 */
function resetUrgentButton() {
    document.getElementById('urgentImg').src = 'src/img/prioUrgent.svg';
    document.getElementById('urgentButton').classList.remove('urgentActiv');
}

/**
 * Resets the styles for the "Medium" priority button.
 */
function resetMediumButton() {
    document.getElementById('mediumImg').src = 'src/img/prioMedium.svg';
    document.getElementById('mediumButton').classList.remove('mediumActiv');
}

/**
 * Resets the styles for the "Low" priority button.
 */
function resetLowButton() {
    document.getElementById('lowButton').classList.remove('lowActiv');
    document.getElementById('lowImg').src = 'src/img/prioLow.svg';
}

/**
 * Controls the state of priority buttons based on the selected priority.
 */
function controlPrioButton() {
    if (selectedPrio === 'Urgent') {
        urgentButtonActiv();
        resetLowButton();
        resetMediumButton();
    }
    if (selectedPrio === 'Medium') {
        mediumButtonActiv();
        resetLowButton();
        resetUrgentButton();
    }
    if (selectedPrio === 'Low') {
        lowButtonActiv();
        resetMediumButton();
        resetUrgentButton();
    }
    if (selectedPrio === '') {
        resetLowButton();
        resetMediumButton();
        resetUrgentButton();
    }
}

/**
 * Returns an HTML string representing the priority section.
 *
 */
function returnPrioSection() {
    return /*html*/`
    <div onclick="urgentButtonClick()" id="urgentButton" class="prioButton">Urgent<img id="urgentImg"
            src="src/img/prioUrgent.svg" alt="urgent-icon"></div>
    <div onclick="mediumButtonClick()" id="mediumButton" class="prioButton">Medium<img id="mediumImg"
            src="src/img/prioMedium.svg" alt="medium-icon"></div>
    <div onclick="lowButtonClick()" id="lowButton" class="prioButton">Low<img id="lowImg"
            src="src/img/prioLow.svg" alt="low-icon"></div>`;
}