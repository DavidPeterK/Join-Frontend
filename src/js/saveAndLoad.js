let tasks = [];
let user = [];
let activUser = { 'name': '', }
let isUserLoggedIn;
let selectedColorIndex = null;
let contactsArray = [];
/** Represents the currently selected index in the task list. */
let selectedIndex = null;
/** Collection of background colors used for task categories. */
let colorCollection = [
    'background: #006400', 'background: #00008B', 'background: #8B0000', 'background: #800080', 'background: #808080', 'background: #0000CD',
    'background: #008000', 'background: #FF0000', 'background: #8A2BE2', 'background: #FFA500', 'background: #2E8B57', 'background: #9932CC',
    'background: #DC143C', 'background: #228B22', 'background: #20B2AA', 'background: #FF1493', 'background: #D2691E', 'background: #00CED1',
    'background: #008080', 'background: #FF6347'
];

/** Main categories for tasks, each with a name and associated colors. */
let mainCategorys = {
    'name': ['Technical Task', 'User Story',],
    'color': ['background: #1FD7C1', 'background: #0038FF',],
};

/** All task categories, initially empty. */
let ownCategorys = {
    'name': [],
    'color': [],
};

/** * Collection of subtasks associated with tasks. */
let subtasks = [];
/** Collection of finished subtasks. */
let subtasksFinish = [];
/** Collection of contacts associated with tasks. */
let contactCollection = [];
/** Represents the currently selected category with its name and color. */
let currentCategorySelected = {
    'name': '',
    'color': '',
    'type': '',
};
/** Represents the currently selected priority. */
let currentPrioSelected = "";
/** Represents the current ID for tasks. */
let currentId = 0;
/** Task ID for editing tasks. */
let taskIdForEdit = '';
/** Represents the status for editing tasks. */
let statusEdit = '';
/** Represents the task being edited. */
let editTask = '';
/** Represents the status group for tasks. */
let statusGroup = '';

/**
 * Displays the user's initials within the specified HTML container.
 * Extracts the initials from the active user's name and populates them inside the designated container.
 */
function userCircleLoad() {
    let container = document.getElementById('headerUserCircle');
    let nameParts = activUser.name.split(' ');
    let firstName = nameParts[0];
    let lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
    let nameAbbreviation = `<b>${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}</b>`;
    container.innerHTML = nameAbbreviation;
}

//------------------------------------tasks--------------------------------------//
/**
 * Checks if the current user is logged in as a guest.
 */
function isGuestLogIn() {
    return activUser.name === 'Guest';
}

/**
 * Saves the user login status to the local storage.
 */
function isUserLoggedSave() {
    localStorage.setItem('isUserLoggedText', JSON.stringify(isUserLoggedIn));
}

/**
 * Loads the user login status from the local storage.
 */
function isUserLoggedLoad() {
    let logged = localStorage.getItem('isUserLoggedText')
    isUserLoggedIn = JSON.parse(logged);
}

/**
 * Asynchronously saves the current user's tasks. 
 * If the active user is 'Guest', the tasks are saved to local storage. 
 * Otherwise, they are saved to remote storage.
 */
function currentUserTaskSave() {
    if (isGuestLogIn()) {
        localStorage.setItem('tasksAsText', JSON.stringify(tasks));
    }
}

/**
 * Asynchronously loads the current user's tasks. 
 * If the active user is 'Guest', the tasks are loaded from local storage. 
 * Otherwise, they are fetched from remote storage.
 */
async function loadAllTasks() {
    if (isGuestLogIn()) {
        let loadTasks = localStorage.getItem('tasksAsText');
        if (loadTasks) {
            tasks = JSON.parse(loadTasks);
        }
    } else {
        try {
            const response = await fetch('http://localhost:8000/api/tasks/list/');
            if (!response.ok) {
                throw new Error('Fehler beim Laden der Tasks');
            }
            tasks = await response.json();
            console.log('Tasks erfolgreich geladen:', tasks);
        } catch (error) {
            console.error('Fehler:', error);
        }
    }
}

//------------------------------------current id--------------------------------------------
/**
 * Asynchronously saves the current user's ID. 
 * If the active user is 'Guest', the ID is saved to local storage. 
 * Otherwise, it is saved to remote storage.
 */
async function currentUserIdSave() {
    if (isGuestLogIn()) {
        localStorage.setItem('currentIdAsText', JSON.stringify(currentId));
    }
}

/**
 * Asynchronously loads the current user's ID. 
 * If the active user is 'Guest', the ID is loaded from local storage. 
 * Otherwise, it is fetched from remote storage.
 */
async function currentUserIdLoad() {
    if (isGuestLogIn()) {
        let currentIdLoad = localStorage.getItem('currentIdAsText');
        if (currentIdLoad) {
            currentId = JSON.parse(currentIdLoad);
        }
    }
}

//--------------------------------Categorys------------------------------------------------
/**
 * Asynchronously saves the current user's categories. 
 * If the active user is 'Guest', the categories are saved to local storage. 
 * Otherwise, they are saved to remote storage.
 */
async function currentUserCategorysSave() {
    localStorage.setItem('categorysAsText', JSON.stringify(ownCategorys));
}

/**
 * Asynchronously loads the current user's categories. 
 * If the active user is 'Guest', the categories are loaded from local storage. 
 * Otherwise, they are fetched from remote storage.
 */
async function currentUserCategorysLoad() {
    let categorysLoad = localStorage.getItem('categorysAsText');
    if (categorysLoad) {
        ownCategorys = JSON.parse(categorysLoad);
    }
}

//--------------------------------Contacts--------------------------------------------------
/**
 * Asynchronously saves the current user's contacts. 
 * If the active user is 'Guest', the contacts are saved to local storage. 
 * Otherwise, they are saved to remote storage.
 */
async function currentUserContactsSave() {
    if (isGuestLogIn()) {
        localStorage.setItem('contactsAsText', JSON.stringify(contactsArray));
        localStorage.setItem('contactIdAsText', JSON.stringify(contactId));
    }
}

/**
 * Loads all contacts for the current user.
 * For guests, it retrieves them from localStorage.
 * For authenticated users, it fetches them from the Django API.
 */
async function loadAllContacts() {
    if (isGuestLogIn()) {
        let contactsLoad = localStorage.getItem('contactsAsText');
        if (contactsLoad) {
            contactsArray = JSON.parse(contactsLoad);
            console.log('Kontakte aus dem lokalen Speicher geladen:', contactsArray);
        } else {
            console.info('Keine Kontakte im lokalen Speicher gefunden.');
            contactsArray = [];
        }
    } else {
        try {
            const response = await fetch('http://localhost:8000/api/contacts/list/');
            if (!response.ok) {
                throw new Error('Fehler beim Laden der Kontakte von der API');
            }
            contactsArray = await response.json();
            console.log('Kontakte von der API geladen:', contactsArray);
        } catch (error) {
            console.error('Fehler beim Laden der Kontakte:', error);
        }
    }
}

/** * This function is to load contacts or display a error message */
async function currentUserContactsLoad() {
    if (isGuestLogIn()) {
        let contactsLoad = localStorage.getItem('contactsAsText');
        let contactIdLoad = localStorage.getItem('contactIdAsText');
        if (contactsLoad && contactIdLoad) {
            contactsArray = JSON.parse(contactsLoad);
            contactId = JSON.parse(contactIdLoad);
        }
    }
}

//Activ user
/**
 * Saves the current active user to local storage.
 */
function saveActivUser() {
    localStorage.setItem('activUserAsText', JSON.stringify(activUser));
}

/**
 * Loads the current active user from local storage.
 */
function loadActivUser() {
    let activUserLoad = localStorage.getItem('activUserAsText');
    if (activUserLoad) {
        activUser = JSON.parse(activUserLoad);
    }
}