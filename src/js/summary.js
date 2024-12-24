/**
 * Asynchronously initializes the summary section.
 */
async function initSummary() {
    isUserLoggedLoad();
    addAnimationOnResize();
    highLightNavBar('src/img/summaryActiv.svg', 'summaryNavIcon', 'summaryNavButton');
    loadActivUser();
    userCircleLoad();
    await loadAllTasks();
    loadDetails();
}

/**
 * Loads and sets specific texts for the summary section.
 * and loads the date for urgent priorities.
*/
function loadDetails() {
    loadNumbers();
    loadUrgentPrioDate();
    daylyGreeting();
}

/**
 * This function is used to load a function if someone resize the page
 * 
 */
function addAnimationOnResize() {
    let greetBox = document.getElementById('greetingBox');
    if (window.innerWidth <= 1020 && !isUserLoggedIn) {
        greetBox.classList.remove('d-none');
        setTimeout(() => {
            greetBox.classList.remove('fade-in');
            greetBox.classList.add('fade-out');
            isUserLoggedIn = true;
            isUserLoggedSave();
            greetBox.classList.add('d-none');
        }, 3000);
    } else if (window.innerWidth > 1020) {
        greetBox.classList.remove('d-none');
        setTimeout(() => {
            greetBox.classList.remove('fade-in');
            isUserLoggedIn = true;
            isUserLoggedSave();
        }, 3000);
    }
}

/**
 * This function loads the next urgent due date
 * 
 */
function loadUrgentPrioDate() {
    let container = document.getElementById('urgentDate');
    const nextUrgentDate = getNextUrgentDueDate(tasks);
    if (nextUrgentDate) {
        const convertedDate = convertDateFormat(nextUrgentDate);
        container.innerHTML = convertedDate;
    } else {
        container.innerHTML = "No urgent due dates";
    }
}

/**
 * This function shows the greeting for the user
 * 
 */
function daylyGreeting() {
    let dayTimeContainer = document.getElementById('dayTimeGreeting');
    let userName = document.getElementById('greetingUser');
    userName.innerText = activUser.name;
    dayTimeContainer.innerText = getTimeOfDay();
}

/**
 * This function returns greeting based on the current time of day
 */
function getTimeOfDay() {
    const time = new Date().getHours();
    if (time >= 0 && time < 8) {
        return dayTimeGreeting('morning,');
    } else if (time >= 8 && time < 12) {
        return dayTimeGreeting('day,');
    } else if (time >= 12 && time < 18) {
        return dayTimeGreeting('afternoon,');
    } else {
        return dayTimeGreeting('evening,');
    }
}

function dayTimeGreeting(dayTime) {
    return 'Good ' + dayTime;
}

/**
 * This function searches the next urgent due date
 */
function getNextUrgentDueDate(tasks) {
    const urgentTasks = tasks.filter(task => task.priority === "Urgent");
    if (urgentTasks.length === 0) return null;
    urgentTasks.sort((a, b) => {
        const dateA = new Date(a.dueDate.split("/").reverse().join("-"));
        const dateB = new Date(b.dueDate.split("/").reverse().join("-"));
        return dateA - dateB;
    });
    return urgentTasks[0].dueDate;
}

/**
 * Converts a date string in the format "DD/MM/YYYY" to a more human-readable format "MonthName DD, YYYY".
 * convertDateFormat("01/01/2021");
 */
function convertDateFormat(inputDate) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const parts = inputDate.split("/");
    const day = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const year = parts[2];
    return `${months[monthIndex]} ${day}, ${year}`;
}

/**
 * This function searches the number of tasks in the respective category
 */
function loadNumbers() {
    let todo = tasks.filter(t => t['status'] == 'toDo').length;
    let inProgress = tasks.filter(t => t['status'] == 'inProgress').length;
    let awaitingFeedback = tasks.filter(t => t['status'] == 'awaitFeedback').length;
    let done = tasks.filter(t => t['status'] == 'done').length;
    let allTasks = tasks.length
    let urgent = tasks.filter(t => t['priority'] == 'Urgent').length;
    displayNumbers(todo, inProgress, awaitingFeedback, done, allTasks, urgent)
}

/**
 * This function shows the number of tasks in the respective category
 */
function displayNumbers(todo, inProgress, awaitingFeedback, done, allTasks, urgent) {
    document.getElementById('todoNumber').innerHTML = todo;
    document.getElementById('doneNumber').innerHTML = done;
    document.getElementById('awaitingFeedback').innerHTML = awaitingFeedback;
    document.getElementById('tasksInProgress').innerHTML = inProgress;
    document.getElementById('tasksInBoard').innerHTML = allTasks;
    document.getElementById('urgentNumber').innerHTML = urgent;
}