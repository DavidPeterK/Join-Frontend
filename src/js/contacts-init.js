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
    try {
        let newContact = contactTemplate();

        // POST-Request an die API senden
        const response = await fetch('http://localhost:8000/api/contacts/list/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newContact),
        });

        if (!response.ok) {
            throw new Error('Fehler beim Erstellen des Kontakts');
        }

        const savedContact = await response.json(); // Kontakt mit Server-ID zurückbekommen
        contactsArray.push(savedContact); // Lokales Array aktualisieren

        changesSaved('Contact successfully created');
        renderContactInfo(savedContact.id); // Rendern mit der tatsächlichen Server-ID

    } catch (error) {
        console.error('Fehler beim Erstellen des Kontakts:', error);
    }
}


/**
 * Edits an existing contact, updates it in the database, and synchronizes with the local array.
 */
async function editContact(index) {
    try {
        let contact = contactsArray[index]; // Bestehenden Kontakt abrufen
        let updatedContact = contactTemplate();

        // PATCH-Request an die API senden
        const response = await fetch(`http://localhost:8000/api/contacts/update/${contact.id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedContact),
        });

        if (!response.ok) {
            throw new Error('Fehler beim Bearbeiten des Kontakts');
        }

        const savedContact = await response.json(); // Aktualisierte Daten zurückbekommen
        contactsArray[index] = savedContact; // Lokales Array aktualisieren

        changesSaved('Contact successfully edited');
        renderContactInfo(savedContact.id); // Rendern mit der tatsächlichen Server-ID

    } catch (error) {
        console.error('Fehler beim Bearbeiten des Kontakts:', error);
    }
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
        const contact = contactsArray[index];
        const response = await fetch(`http://localhost:8000/api/contacts/update/${contact.id}/`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Fehler beim Löschen des Kontakts.');
        }
        console.log(`Kontakt mit ID ${contact.id} erfolgreich gelöscht.`);
        contactsArray.splice(index, 1);
        closeContactInfoSmall();
        renderContactInfoEmpty();
        document.getElementById('contactsDeletePopUp').classList.add('d-none');
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

/**
 * Returns HTML for an empty contact information container.
 */
function returnEmptyInfoContainer() {
    return /*html*/`
    <div class="head-section">
        <h2 style='margin-bottom: 32px'>Contacts</h2>
        <div class="vector-span-direction">
            <div class="vectorContacts"></div>
            <span class="head-span">Better with a team</span>
        </div>
    </div>    
    `;
}

/**
 * Returns HTML for rendering a contact row in the contact list.
 */
function returnContactRow(array) {
    return /*html*/`
    <div onclick='renderContactInfo(${array.id})' id='contactId${array.id}' class="contact-row">
        <div style="${array.color}" class="contact-circle">${array.nameAbbreviation}</div>
        <div class="name-email-box">
            <span class="contact-name-list">${array.name}</span>
            <span class="contact-email-list">${array.email}</span>
        </div>
    </div>
`;
}

function returnDeleteWindow(array, index) {
    return /*html*/`
   <div class="deleteQuest">
        <span style='text-align: center' class="category-span">Do you really want to delete <span style="color: #29abe2;">${array.name}</span>?
        </span>
        <div style="width: 100%; display: flex; justify-content: center; align-items: center; gap: 28px;">
            <button onclick='closeDeleteWindow()' class="pop-button-cancel">No</button>
            <button onclick='deleteContact(${index})' class="pop-button-create">Yes</button>
        </div>
    </div>
    `;
}

function returnContactInfoContainerRight(array) {
    return /*html*/`
    <div class="contacts-info-name-box">
        <div style="${array.color}" class="big-contact-circle">${array.nameAbbreviation}</div>
        <div class="split-container-name-functions">
            <span class="contacts-info-name-span">${array.name}</span>
            <div class="functions-buttons-box">
                <span onclick='editContactInit(${array.id})' class="edit-button"><img src="src/img/PenAddTask 1=edit.svg" alt=""> Edit</span>
                <span onclick='deleteContactWindow(${array.id})' class="delete-button"><img src="src/img/subTaskDelete.svg" alt=""> Delete</span>
            </div>
        </div>
    </div>

    <span class="headline-info-center">Contact Information</span>

    <div class="split-container">
        <div class="split-span-box">
            <span class="email-headline">Email</span>
            <a style='text-decoration: none' href='mailto:${array.email}' class="email-adress">${array.email}</a>
        </div>
        <div class="split-span-box">
            <span class="phone-headline">Phone</span>
            <a style='text-decoration: none' href='tel:${array.phone}' class="phone-number">${array.phone}</a>
        </div>
    </div>    
    `;
}
