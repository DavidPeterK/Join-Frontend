let registerBtn;
let confirmPassword;
let email;
const RegisterFetchUrl = 'http://localhost:8000/api/auth/registration/';

/**
 * Initializes the register container elements.
 */
function initRegisterContainer() {
    userName = document.getElementById("userRegist");
    email = document.getElementById('emailRegist');
    password = document.getElementById('passwordRegist');
    confirmPassword = document.getElementById('confirmPasswordRegist');
    registerBtn = document.getElementById('signUpButton');
    checkbox = document.getElementById("checkPrivacyPolicy");
}

/**
 * Renders the sign-up content.
 */
function renderSignUp() {
    contentBox.innerHTML = signUpHtml();
    initRegisterContainer();
    signUpButtonTop.innerHTML = '';
    signUpButtonBottom.innerHTML = '';
}

/**
 * Handles a scenario when the entered email already exists in the system.
 */
function handleEmailExists() {
    document.getElementById('inputEmail').classList.add("red-border");
    document.getElementById('warning-email').classList.remove("d-none");
    setTimeout(() => {
        document.getElementById('inputEmail').classList.remove("red-border");
        document.getElementById('warning-email').classList.add("d-none");
    }, 4000);
}

function handleUsernameExists() {
    document.getElementById('containerUserName').classList.add("red-border");
    document.getElementById('warning-username').classList.remove("d-none");
    setTimeout(() => {
        document.getElementById('containerUserName').classList.remove("red-border");
        document.getElementById('warning-username').classList.add("d-none");
    }, 4000);
}

/**
 * Handles a scenario when entered passwords don't match.
 */
function handlePasswordMismatch() {
    loadRedBorderPassword();
    loadWarningTextTamplate();
}

/**
 * Highlights password fields in red.
 */
function loadRedBorderPassword() {
    let inputIds = ["inputPassword", "inputConfirmPassword"];
    for (let id of inputIds) {
        document.getElementById(id).classList.add("red-border");
        setTimeout(() => {
            document.getElementById(id).classList.remove("red-border");
        }, 4000);
    }
}

/**
 * Displays warning messages for password fields.
 */
function loadWarningTextTamplate() {
    let warningIds = ["warning-password", "warning-confirmPassword"];
    for (let id of warningIds) {
        document.getElementById(id).classList.remove("d-none");
        setTimeout(() => {
            document.getElementById(id).classList.add("d-none");
        }, 4000);
    }
}

/**
 * Registers a new user, saves the user's data, and redirects to the homepage after successful registration.
 */
async function handleRegistration() {
    const userData = collectRegistrationData();
    try {
        const response = await sendRegistrationRequest(userData);
        const data = await response.json();
        if (response.ok) {
            if (data.username == "A user with that username already exists.") {
                handleUsernameExists();
            } else {
                handleRegistrationSuccess(data);
            }
        } else if (!response.ok) {
            handleRegistrationErrors(data);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
}

/**
 * Handles registration-specific errors from the server response.
 */
function handleRegistrationErrors(data) {
    if (data.error === "User with that username already exists") {
        handleUsernameExists();
    }
    if (data.error === "User with that email already exists") {
        handleEmailExists();
    }
    if (data.error === "passwords dont match") {
        handlePasswordMismatch();
    }
}

/**
 * Collects user registration data from the form.
 * @returns {object} The registration data.
 */
function collectRegistrationData() {
    return {
        username: userName.value,
        email: email.value,
        password: password.value,
        repeated_password: confirmPassword.value,
    };
}

/**
 * Sends a POST request to register a new user.
 */
async function sendRegistrationRequest(userData) {
    return await fetch(RegisterFetchUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
}

/**
 * Handles a successful registration response.
 */
function handleRegistrationSuccess(data) {
    if (data.username === "A user with that username already exists.") {
        handleUsernameExists();
    } else {
        changesSaved('You Signed Up successfully');
        setTimeout(() => {
            switchContent('signIn');
            console.log('Registration data:', data);
        }, 3000);
    }
}

/**
 * Resets the registration form by clearing inputs and enabling the register button.
 */
function resetForm() {
    userName.value = ''
    email.value = '';
    password.value = '';
    confirmPassword.value = '';
}

/**
 * Validates user inputs, checks for email duplicates, and proceeds with the registration process.
 */
async function registUser() {
    if (checkbox.checked) {
        await handleRegistration();
    }
}