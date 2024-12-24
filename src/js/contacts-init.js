/**
 * Initializes the contacts page, highlighting the navigation bar and rendering contacts.
 */
async function contactsInit() {
    highLightNavBar('src/img/contactsActiv.svg', 'contactsNavIcon', 'contactsNavButton');
    loadActivUser();
    userCircleLoad();
    await loadAllContacts();
    renderContacts();
    renderContactInfoEmpty();
}

/**
 * Renders the entire list of contacts organized alphabetically with navigation by letters.
 */
function renderContacts() {
    let alphabetBox = document.getElementById('alphaBox');
    alphabetBox.innerHTML = '';
    for (let i = 0; i < alphabet.length; i++) {
        const letter = alphabet[i];
        renderContactsAlphabet(alphabetBox, letter);
    }
}

/**
 * Renders contacts for a specific alphabet letter in the navigation bar.
 */
function renderContactsAlphabet(alphabetBox, letter) {
    if (isContactLetter(letter)) {
        alphabetBox.innerHTML += `<div class="alphabet-letter">${letter}</div>`;
        filterContacts(alphabetBox, letter);
    }
}

/**
 * Filters and renders contacts based on the specified alphabet letter.
 */
function filterContacts(alphabetBox, letter) {
    let alphabetArray = filterBy(letter);
    for (let i = 0; i < alphabetArray.length; i++) {
        const array = alphabetArray[i];
        alphabetBox.innerHTML += returnContactRow(array);
    }
}

/**
 * Filters contacts by the specified letter and returns the filtered array.
 */
function filterBy(letter) {
    let array = contactsArray.sort((a, b) => a.name.localeCompare(b.name));
    return array.filter(contact => contact.name.toUpperCase().startsWith(letter));
}

/**
 * Checks if any contact's name starts with the given letter.
 */
function isContactLetter(letter) {
    return contactsArray.some(contact => contact.name.toUpperCase().startsWith(letter));
}

/**
 * Renders an empty contact information container.
 */
function renderContactInfoEmpty() {
    let container = document.getElementById('contactInfoContainerRight');
    container.innerHTML = returnEmptyInfoContainer();
}

/**
 * Renders contact information based on the provided contact ID.
 */
function renderContactInfo(id) {
    let index = contactsArray.findIndex(object => object.id === id);
    let array = contactsArray[index];
    renderContacts();
    activateContact(id);
    if (window.innerWidth > 1020) {
        renderContactInfoBig(array);
    } else {
        renderContactInfoPopUp(array);
    }
}

/**
 * Activates the specified contact row by adding a CSS class.
 */
function activateContact(id) {
    let contactRow = document.getElementById(`contactId${id}`);
    contactRow.classList.add('contact-row-activ');
}

/**
 * Renders the contact information in a larger container for wider screens.
 */
function renderContactInfoBig(id) {
    renderContactInfoEmpty();
    let container = document.getElementById('contactInfoContainerRight');
    container.innerHTML += returnContactInfoContainerRight(id);
}

/**
 * Initializes the contact popup for editing with the details of the specified contact ID.
 */
function editContactInit(id) {
    let index = contactsArray.findIndex(object => object.id === id);
    let array = contactsArray[index];
    showContactsPopUp('edit', index);
    initContactPopUp(array);
}

/**
 * Initializes the contact popup with the details of the specified contact for editing.
 */
function initContactPopUp(array) {
    document.getElementById('contactUserName').value = array.name;
    document.getElementById('contactEmail').value = array.email;
    document.getElementById('contactPhone').value = array.phone;
}

/**
 * This function saves a new contact to the database and updates the local contact array.
 */
async function createContact() {
    const newContact = contactTemplate();
    try {
        if (isGuestLogIn()) {
            handleGuestContactCreation(newContact);
        } else {
            const savedContact = await saveContactToAPI(newContact);
            handleAuthenticatedContactCreation(savedContact);
        }
    } catch (error) {
        console.error('Fehler beim Erstellen des Kontakts:', error);
    }
}

/**
 * Sends a POST request to save a contact in the API.
 */
async function saveContactToAPI(contact) {
    const response = await fetch('http://localhost:8000/api/contacts/list/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${activUser.token}`,
            'X-CSRFToken': activUser.csrfToken,
        },
        body: JSON.stringify(contact),
    });
    if (!response.ok) {
        throw new Error('Fehler beim Erstellen des Kontakts.');
    }
    return await response.json();
}

/**
 * Handles contact creation for authenticated users.
 */
function handleAuthenticatedContactCreation(savedContact) {
    contactsArray.push(savedContact);
    changesSaved('Contact successfully created');
    renderContactInfo(savedContact.id);
}

/**
 * Edits an existing contact, updates it in the database, and synchronizes with the local array.
 */
async function editContact(index) {
    const updatedContact = contactTemplate();
    try {
        if (isGuestLogIn()) {
            handleGuestContactEdit(index, updatedContact);
        } else {
            const savedContact = await updateContactInAPI(index, updatedContact);
            handleAuthenticatedContactEdit(index, savedContact);
        }
    } catch (error) {
        console.error('Fehler beim Bearbeiten des Kontakts:', error);
    }
}

/**
 * Sends a PATCH request to update a contact in the API.
 */
async function updateContactInAPI(index, updatedContact) {
    const contact = contactsArray[index];
    const response = await fetch(`http://localhost:8000/api/contacts/update/${contact.id}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${activUser.token}`,
            'X-CSRFToken': activUser.csrfToken,
        },
        body: JSON.stringify(updatedContact),
    });
    if (!response.ok) {
        throw new Error('Fehler beim Bearbeiten des Kontakts.');
    }
    return await response.json();
}

/**
 * Displays a confirmation window for deleting a contact.
 */
function deleteContactWindow(id) {
    let index = contactsArray.findIndex(object => object.id === id);
    let array = contactsArray[index];
    let container = document.getElementById('contactsDeletePopUp');
    container.innerHTML = returnDeleteWindow(array, index);
    container.classList.remove('d-none');
}

/**
 * Deletes a contact from the server and updates the UI.
 */
async function deleteContact(index) {
    try {
        if (isGuestLogIn()) {
            handleGuestContactDeletion(index);
        } else {
            await handleAuthenticatedContactDeletion(index);
        }
    } catch (error) {
        console.error('Fehler beim Löschen des Kontakts:', error);
    }
}

/**
 * Renders the contact information in a popup for smaller screens.
 */
function renderContactInfoPopUp(id) {
    renderContactInfoBig(id);
    let listBox = document.getElementById('contactsListContainer');
    let container = document.getElementById('contactInfoContainerRight');
    listBox.classList.add('d-none');
    container.classList.add('d-flex');
}

/**
 * Closes the small contact information popup and renders the contact list.
 */
function closeContactInfoSmall() {
    renderContacts();
    let listBox = document.getElementById('contactsListContainer');
    let container = document.getElementById('contactInfoContainerRight');
    listBox.classList.remove('d-none');
    container.classList.remove('d-flex');
}

/**
 * Closes the delete confirmation window.
 */
function closeDeleteWindow() {
    let container = document.getElementById('contactsDeletePopUp');
    container.classList.add('d-none');
}