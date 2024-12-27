/**
 * Handles contact deletion for guest users.
 */
function handleGuestContactDeletion(index) {
    const container = document.getElementById('contactsDeletePopUp');
    contactsArray.splice(index, 1);
    currentUserContactsSave();
    closeContactInfoSmall();
    renderContactInfoEmpty();
    container.classList.add('d-none');
    console.log('Kontakt für Gastbenutzer erfolgreich gelöscht.');
}

/**
 * Handles contact editing for authenticated users.
 */
function handleAuthenticatedContactEdit(index, savedContact) {
    contactsArray[index] = savedContact;
    changesSaved('Contact successfully edited');
    renderContactInfo(savedContact.id);
}

/**
 * Handles contact creation for guest users.
 */
async function handleGuestContactCreation(newContact) {
    contactsArray.push(newContact);
    contactId++;
    currentUserContactsSave();
    changesSaved('Contact successfully created');
    renderContactInfo(contactId - 1);
}

/**
 * Handles contact editing for guest users.
 */
async function handleGuestContactEdit(index, updatedContact) {
    contactsArray[index] = updatedContact;
    contactId++;
    await currentUserContactsSave();
    changesSaved('Contact successfully edited');
    renderContactInfo(contactId - 1);
}

/**
 * Handles contact deletion for authenticated users.
 */
async function handleAuthenticatedContactDeletion(index) {
    const contact = contactsArray[index];
    const response = await fetch(`${FETCH_URL}api/contacts/update/${contact.id}/`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Token ${activUser.token}`,
            'X-CSRFToken': activUser.csrfToken,
        },
    });
    if (!response.ok) {
        throw new Error(`Fehler beim Löschen des Kontakts mit ID ${contact.id}.`);
    }
    console.log(`Kontakt mit ID ${contact.id} erfolgreich gelöscht.`);
    contactsArray.splice(index, 1);
    closeContactInfoSmall();
    renderContactInfoEmpty();
    document.getElementById('contactsDeletePopUp').classList.add('d-none');
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