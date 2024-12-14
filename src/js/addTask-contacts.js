/**
 * Opens the contacts container, hides selected contacts, and renders all contacts.
 */
function openContactsContainer() {
    let addTaskSelectedContactBox = document.getElementById('selectedContactsContainer');
    let addTaskContactCollectionBox = document.getElementById('contactsCollectionContainer');
    addTaskSelectedContactBox.classList.add('d-none');
    addTaskContactCollectionBox.classList.remove('d-none');
    changeOpenInputBox();
    changeOpenInputInner();
    changeOpenInputArrow();
    renderAllContacts();
}

/**
 * Closes the contacts container, displays selected contacts, and renders them.
 */
function closeContactsContainer() {
    let addTaskSelectedContactBox = document.getElementById('selectedContactsContainer');
    let addTaskContactCollectionBox = document.getElementById('contactsCollectionContainer');
    addTaskSelectedContactBox.classList.remove('d-none');
    addTaskContactCollectionBox.classList.add('d-none');
    changeCloseInputBox();
    changeCloseInputInner();
    changeCloseInputArrow();
    renderAllSelectedContacts();
}

/**
 * Changes the arrow in the contacts input to the open position.
 */
function changeOpenInputArrow() {
    let arrow = document.getElementById('contactsInputArrow');
    arrow.src = 'src/img/arrow_drop_up.svg';
    arrow.onclick = function (event) {
        closeContactsContainer();
        doNotClose(event);
    }
}

/**
 * Changes the arrow in the contacts input to the close position.
 */
function changeCloseInputArrow() {
    let arrow = document.getElementById('contactsInputArrow');
    arrow.src = 'src/img/arrow_drop_downaa.svg';
    arrow.onclick = function (event) {
        openContactsContainer();
        doNotClose(event);
    };
}

/**
 * Allows user input in the contacts input box and triggers contact rendering based on input.
 */
function changeOpenInputInner() {
    let addTaskContactInput = document.getElementById('addTaskContactsInput');
    addTaskContactInput.removeAttribute('readonly');
    addTaskContactInput.placeholder = 'An:';
    addTaskContactInput.value = '';
    addTaskContactInput.onkeyup = function (event) {
        renderAllContacts(addTaskContactInput.value);
    };
}

/**
 * Disallows user input in the contacts input box and resets its placeholder and value.
 */
function changeCloseInputInner() {
    let addTaskContactInput = document.getElementById('addTaskContactsInput');
    addTaskContactInput.setAttribute('readonly', 'readonly');
    addTaskContactInput.placeholder = '';
    addTaskContactInput.value = 'Select contacts to assign';
    addTaskContactInput.onkeyup = null;
}

/**
 * Prevents closing the contacts container when clicking inside the input box.
 */
function changeOpenInputBox() {
    let addTaskContactInputBox = document.getElementById('addTaskContactsInputBox');
    addTaskContactInputBox.onclick = function (event) {
        doNotClose(event);
    };
}

/**
 * Allows closing the contacts container when clicking inside the input box.
 */
function changeCloseInputBox() {
    let addTaskContactInputBox = document.getElementById('addTaskContactsInputBox');
    addTaskContactInputBox.onclick = function (event) {
        openContactsContainer();
        doNotClose(event);
    };
}

/**
 * Renders all contacts, optionally filtered based on the provided search filter.
 *
 */
function renderAllContacts(filter) {
    let contacts = contactsArray.sort((a, b) => a.name.localeCompare(b.name));
    let container = document.getElementById('contactsContent');
    let array;
    if (filter) {
        array = filterContactsForSearch(filter, contacts);
    } else {
        array = contacts;
    }
    container.innerHTML = '';
    for (let i = 0; i < array.length; i++) {
        const arrayContacts = array[i];
        container.innerHTML += returnAddTaskContactRow(arrayContacts);
    }
}

/**
 * Filters contacts based on a search filter.
 *
 */
function filterContactsForSearch(filter, contacts) {
    var filterContacts = contacts.filter(function (contact) {
        return contact.name.toLowerCase().includes(filter.toLowerCase());
    });

    return filterContacts;
}

/**
 * Renders all selected contacts in the selected contacts container.
 */
function renderAllSelectedContacts() {
    let container = document.getElementById('selectedContactsContainer');
    container.innerHTML = '';
    for (let i = 0; i < contactCollection.length; i++) {
        if (i === 5 && contactCollection.length > 6) {
            container.innerHTML += `<b style='font-size: 18px; padding-left: 7px'>+${contactCollection.length - 5}</b>`;
            break;
        } else {
            const array = contactCollection[i];
            container.innerHTML += returnAddTaskSelectedContact(array);
        }
    }
}

/**
 * Returns an HTML string representing a selected contact.
 *
 */
function returnAddTaskSelectedContact(array) {
    return /*html*/`
    <div  style="${array.color}" class="userCircle">${array.nameAbbreviation}</div>
    `;
}

/**
 * Checks if a contact with the given id exists in the selected contacts.
 *
 */
function contactIdCheck(id) {
    return contactCollection.some(item => item.id === id);
}

/**
 * Handles the selection or deselection of a contact row.
 */
function selectContactRow(id) {
    let index = contactsArray.findIndex(object => object.id === id);
    let array = contactsArray[index];
    if (contactIdCheck(id)) {
        let i = contactCollection.findIndex(object => object.id === id);
        contactCollection.splice(i, 1)
    } else {
        contactCollection.push(array);
    }
    renderAllContacts();
}

/**
 * Creates a new contact and adds it to the contacts array.
 */
async function createContact() {
    let newContact = contactTemplate();
    contactsArray.push(newContact);
    contactId++;
    await currentUserContactsSave();
    changesSaved('Contact successfully created');
    openContactsContainer()
}

/**
 * Returns an HTML string representing a contact row.
 *
 */
function returnAddTaskContactRow(array) {
    let selected;
    let icon;
    if (contactIdCheck(array.id)) {
        selected = 'addTask-contact-row-activ';
        icon = 'src/img/addTaskCheckBox.svg';
    } else {
        selected = 'addTask-contact-row';
        icon = 'src/img/addTaskBox.svg';
    }
    return /*html*/`
    <div onclick='selectContactRow(${array.id})' class=${selected}>
        <div style="display: flex; justify-content: flex-start; align-items: center; gap: 20px;">
            <div style="${array.color}" class="userCircle">${array.nameAbbreviation}</div>
            <span class="contacts-container-row-span">${array.name}</span>
        </div>
        <img src=${icon} alt="checkBox">
    </div>
`;
}