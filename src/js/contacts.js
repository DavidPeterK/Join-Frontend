const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

/**
 * Closes the contacts popup by adding a 'd-none' class.
 */
function closeContactsPopUp() {
    let popup = document.getElementById('contactsPopUp');
    popup.classList.add('d-none');
}

/**
 * Shows the contacts popup with the specified mode and index.
 */
function showContactsPopUp(mode, index) {
    let popup = document.getElementById('contactsPopUp');
    popup.classList.remove('d-none');
    popup.innerHTML = returnPopUpContactNew(mode, index);
}

/**
 * Cancels the contact popup, closes it, and clears the input fields.
 */
function cancelContactPopUp() {
    closeContactsPopUp();
    clearContactInput();
}

/**
 * Creates a contact template with default values based on user input.
 */
function contactTemplate() {
    return {
        "name": nameToUpperCase(document.getElementById('contactUserName').value),
        "nameAbbreviation": makeNameAbbreviation(document.getElementById('contactUserName').value),
        "email": document.getElementById('contactEmail').value,
        "phone": document.getElementById('contactPhone').value,
        "color": getColor(),
    }
}

/**
 * Validates the input value of a form's phone field.
 * Checks whether the entered phone number only contains the plus symbol and digits 0-9. 
 * If the validation fails, it displays an error message and prevents form submission. 
 * Otherwise, it allows form submission.
 */
function validateForm(mode, index) {
    if (checkInputPhone() && checkInputEmail() && checkInputName()) {
        if (mode === 'edit') {
            editContact(index);
            closeContactsPopUp();
            clearContactInput();
        } else {
            createContact();
            closeContactsPopUp();
            clearContactInput();
        }
    } else {
        return false;
    }
}

/**
 * Checks if the phone input is valid based on the specified regex pattern.
 */
function checkInputPhone() {
    let warn = document.getElementById('warnContactPhone');
    let box = document.getElementById('contactPhoneBox');
    let phoneInput = document.getElementById('contactPhone').value;
    let phoneRegex = /^[+0-9]+$/;
    return isCheckInput(warn, box, phoneInput, phoneRegex);
}

/**
 * Checks if the email input is valid based on the specified regex pattern.
 */
function checkInputEmail() {
    let warn = document.getElementById('warnContactEmail');
    let box = document.getElementById('contactEmailBox');
    let emailInput = document.getElementById('contactEmail').value;
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return isCheckInput(warn, box, emailInput, emailRegex);
}

/**
 * Checks if the input is valid based on the specified regex pattern.
 */
function isCheckInput(warn, box, input, regex) {
    if (!regex.test(input)) {
        box.style.borderColor = 'red';
        warn.classList.remove('d-none');
        setTimeout(function () {
            box.style.borderColor = '#A8A8A8';
            warn.classList.add('d-none');
        }, 4000);
        return false;
    } else {
        return true;
    }
}

/**
 * Checks if the name input is valid based on the specified regex pattern.
 */
function checkInputName() {
    let warn = document.getElementById('warnContactName');
    let box = document.getElementById('contactNameBox');
    let nameInput = document.getElementById('contactUserName').value;
    let nameRegex = /^[^0-9]/;
    return isCheckInput(warn, box, nameInput, nameRegex);
}

/**
 * Converts the first letter of each word in a name input to uppercase.
 */
function nameToUpperCase(nameInput) {
    const capitalizedNames = nameInput.split(' ').map(name => name.charAt(0).toUpperCase() + name.slice(1)).join(' ');
    return capitalizedNames;
}

/**
 * Creates a 2-letter abbreviation from a given name (e.g. "John Doe" -> "JD").
 */
function makeNameAbbreviation(name) {
    let nameParts = name.split(' ');
    let firstName = nameParts[0];
    let lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
    let nameAbbreviation = `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
    return nameAbbreviation;
}

/** * This function is to clear the input fields in a popup */
function clearContactInput() {
    document.getElementById('contactUserName').value = '';
    document.getElementById('contactEmail').value = '';
    document.getElementById('contactPhone').value = '';
}

/** * This function is used to create the profile image color */
function getColor() {
    const randomIndex = Math.floor(Math.random() * colorCollection.length);
    const randomColor = colorCollection[randomIndex];
    return randomColor;
}

function returnPopUpContactEdit() {
    return /*html*/`
    <button onclick="cancelContactPopUp()" type="reset"
        class="pop-button-cancel">Cancel</button>
    <button type="submit" class="pop-button-create">Save</button>
    `;
}

function returnPopUpContactNew(mode, index) {
    let sub;
    let button;
    if (mode === 'edit') {
        sub = `onsubmit = "validateForm('edit', ${index});return false;"`;
        button = 'Save';
    } else {
        sub = `onsubmit="validateForm();return false;"`;
        button = 'Create contact';
    }
    return /*html*/`
    <div class="pop-position">
        <img onclick="closeContactsPopUp()" class="blue-cross greyHoverIcon" src="src/img/iconoir_cancel.svg"
            alt="">
        <img onclick="closeContactsPopUp()" class="grey-cross greyHoverIcon" src="src/img/closeGrey.svg" alt="">

        <div class="pop-head-box">
            <img class="pop-logo" style="width: 55px; height: 55px;" src="src/img/join.logo-white.svg"
                alt="join-logo">
            <span class="pop-headline">Add contact</span>
            <span class="pop-slogen">Tasks are better with a team!</span>
            <div class="pop-vector"></div>
        </div>

        <div class="pop-icon-box">
            <div class="pop-person-background"><img class="pop-person-png" src="src/img/person.svg"
                    alt="person-icon">
            </div>
        </div>

        <form ${sub} style="display: flex; align-self: stretch; flex: 2;">
            <div class="pop-input-box">
                <div class="input-pop-container" id="contactNameBox">
                    <input required type="text" minlength="4" placeholder="Name" id="contactUserName">
                    <img class="input-icon" src="src/img/input-person.svg" alt="person-icon">
                </div>
                <span id="warnContactName" style="text-align: center;" class="warningByInput d-none">
                    Please enter only letters.
                </span>

                <div class="input-pop-container" id="contactEmailBox">
                    <input required type="email" minlength="4" placeholder="Email" id="contactEmail">
                    <img class="input-icon" src="src/img/input-mail.svg" alt="email-icon">
                </div>
                <span id="warnContactEmail" style="text-align: center;" class="warningByInput d-none">
                    Please enter a valid email address.
                </span>

                <div class="input-pop-container" id="contactPhoneBox">
                    <input required type="tel" minlength="4" placeholder="Phone" id="contactPhone">
                    <img class="input-icon" src="src/img/call.svg" alt="phone-icon">
                </div>
                <span id="warnContactPhone" style="text-align: center;" class="warningByInput d-none">
                    Invalid input! Only + and numbers from 0-9 are allowed.
                </span>

                <div id="contactPopUpButtons" class="pop-button-box">
                    <button onclick="cancelContactPopUp()" type="reset"
                        class="pop-button-cancel">Cancel</button>
                    <button type="submit" class="pop-button-create">${button}</button>
                </div>
        </form>
    </div>
    `;
}