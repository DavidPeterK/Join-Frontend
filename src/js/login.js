let contentBox;
let password; let checkbox;
let userName;
let signUpButtonTop; let signUpButtonBottom;
let logo;
const LoginFetchUrl = 'http://localhost:8000/api/auth/login/';

/**
 * Initializes the index page.
 */
async function initIndex() {
    activUser = {
        'name': '',
        'token': '',
    };
    initContainer();
    saveActivUser();
    startAnimation();
    isUserLoggedIn = false;
    isUserLoggedSave();
}

/**
 * Initializes the container elements.
 */
function initContainer() {
    userName = document.getElementById('userLogin');
    password = document.getElementById('passwordLogin');
    contentBox = document.getElementById('indexContainer');
    checkbox = document.getElementById('rememberMe');
    logo = document.getElementById('logo');
    signUpButtonTop = document.getElementById('signSectionTop');
    signUpButtonBottom = document.getElementById('signSectionBottom');
}


/**
 * Renders the sign-in content.
 */
function renderSignIn() {
    initContainer();
    checkbox = document.getElementById('rememberMe');
    contentBox.classList.remove('d-none');
    contentBox.innerHTML = signInHtml();
    isRememberedUser();
    signUpButtonTop.innerHTML = signUpSection();
    signUpButtonBottom.innerHTML = signUpSection();
    document.getElementById('footer').classList.remove('d-none');
}

/**
 * Checks if the email should be remembered and updates the input accordingly.
 */
function isRememberedUser() {
    let rememberedUsername = localStorage.getItem('rememberUser');
    let checkbox = document.getElementById('rememberMe');
    if (rememberedUsername) {
        userName = rememberedUsername;
        checkbox.checked = true;
    }
}

/**
 * Checks if the "Remember Me" checkbox is checked and updates local storage accordingly.
 */
function isCheckBoxChecked() {
    let checkbox = document.getElementById('rememberMe');
    if (checkbox.checked) {
        localStorage.setItem('rememberUser', userName);
    } else {
        localStorage.removeItem('rememberMe');
    }
}


/**
 * Switches the content between sign-in and sign-up.
 */
function switchContent(newContent) {
    addClasses();
    setTimeout(() => {
        updateContent(newContent);
        updateClasses();
    }, 330);
}

/**
 * Updates the content based on the specified new content.
 */
function updateContent(newContent) {
    if (newContent === 'signIn') {
        renderSignIn();
    } else if (newContent === 'signUp') {
        renderSignUp();
    }
}

/**
 * Validates user credentials and logs them in if valid.
 */
async function login() {
    let user = document.getElementById('userLogin');
    let password = document.getElementById('passwordLogin');

    const userData = {
        username: user.value,
        password: password.value,
    };

    try {
        const response = await fetch(LoginFetchUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (response.ok) {
            isCheckBoxChecked();
            activUser['name'] = data.username;
            activUser['token'] = data.token;
            saveActivUser();
            console.log('data:', data);
            window.location.href = "./summary.html";
        }
        else if (!response.ok) {
            loadRedBorderInput();
            loadWarningTextTemplate();
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }

}


/**
 * Logs in a user as a guest and fills default data arrays.
 */
function guestLogin() {
    activUser.name = 'Guest';
    saveActivUser();
    fillTestArray();
    window.location.href = "./summary.html";
}

/**
 * Hides the logo animation by removing the 'd-none' class and adding the end position class.
 */
function hideLogoAnimation() {
    logo.classList.remove('d-none');
    logo.classList.add('join-logo-head-endposition');
}

/**
 * Adds a red border to specified input elements indicating an error.
 */
function loadRedBorderInput() {
    let inputIds = ["input-user", "input-password"];
    for (let id of inputIds) {
        document.getElementById(id).classList.add("red-border");
        setTimeout(() => {
            document.getElementById(id).classList.remove("red-border");
        }, 4000);

    }
}

/**
 * Displays warning text templates for specified elements.
 */
function loadWarningTextTemplate() {
    let warningIds = ["warning-text-password"];
    for (let id of warningIds) {
        document.getElementById(id).classList.remove("d-none");
        setTimeout(() => {
            document.getElementById(id).classList.add("d-none");
        }, 4000);

    }
}