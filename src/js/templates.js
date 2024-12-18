//-------------Log-in---------------//
function signInHtml() {
    return /*html*/`
    <form onsubmit="login(); return false">
        <div class="column-center">
            <h3>Log in</h3>
            <div class="blueUnderline"></div>
        </div>
        <div class="input-section">
            <div class="input-container" id="input-user">
                <input required id="userLogin" type="text" placeholder="Username">
                <img class="input-icon" src="src/img/input-person.svg" alt="person-icon">
            </div>
            <div class="input-container" id="input-password">
                <input required id="passwordLogin" type="password" placeholder="Password">
                <img class="input-icon" src="src/img/password-icon.svg" alt="password-icon">
            </div>
            <div class="warning-field">
                <span id="warning-text-password" class="d-none">Please enter the correct username or password.</span>
            </div>
            <div class="remember-container">
                <input type="checkbox" id="rememberMe" name="rememberMe">
                <span id="label-span">Remember me</span>
            </div>
            <div class="button-section">
                <button type="submit" id="login-button" class="button button-hover">Log in</button>
                <button onclick='guestLogin()' type="button" id="guest-login-button" class="button">Guest Log in</button>
            </div>
        </div>
    </form>
`;
}

function signUpSection() {
    return /*html*/`
    <span id="sign-up-span">Not a Join user?</span>
    <button onclick="switchContent('signUp')" id="sign-up-button" class="button button-hover">
        Sign up
    </button>
    `;
}

//-------------Register---------------//
function signUpHtml() {
    return /*html*/`
    <form onsubmit="registUser(); return false">
        <div class="sign-up-headline">
            <img class="arrow-left-img" onclick="switchContent('signIn')" src="src/img/arror-left.svg" alt="arrow left">
            <div class="column-center">
                <h3>Sign up</h3>
                <div class="blueUnderline"></div>
            </div>
            <div></div>
        </div>
        <div class="input-section">
            <div class="input-container" id="containerUserName">
                <input required type="text" minlength="4" placeholder="Name" id="userRegist">
                <img class="input-icon" src="src/img/input-person.svg" alt="person-icon">
            </div>
            <div class="warning-field">
                <span id="warning-username" class="d-none">
                    This username already exists.
                </span>
            </div>
            <div class="input-container" id="inputEmail">
                <input required type="email" minlength="4" placeholder="Email" id="emailRegist">
                <img class="input-icon" src="src/img/input-mail.svg" alt="email-icon">
            </div>
            <div class="warning-field">
                <span id="warning-email" class="d-none">
                    This email address already exists.
                </span>
            </div>
            <div class="input-container" id="inputPassword">
                <input required type="password" minlength="4" placeholder="Password" id="passwordRegist">
                <img class="input-icon" src="src/img/password-icon.svg" alt="password-icon">
            </div>
            <div class="warning-field">
                <span id="warning-password" class="d-none">
                    Password do not Match.
                </span>
            </div>
            <div class="input-container" id="inputConfirmPassword">
                <input required type="password" minlength="4" placeholder="Confirm Password" id="confirmPasswordRegist">
                <img class="input-icon" src="src/img/password-icon.svg" alt="password-icon">
            </div>
            <div class="warning-field">
                <span id="warning-confirmPassword" class="d-none">
                    Password do not Match.
                </span>
            </div>
            <div class="privacy-check-container">
                <input type="checkbox" value="yes" required id="checkPrivacyPolicy" name="acceptPrivacyPolicy">
                <span id="label-span">I accept the <a style="text-decoration: none" href="./privacy-police.html">Privacy policy</a></span>
            </div>
            <div class="button-section">
                <button type="submit" id="signUpButton" class="button button-hover">Sign up</button>
            </div>
        </div>
    </form>
    `;
}

//-------------Arrays for guest---------------//
/**
 * Fills default test data for the guest login. This data includes sample contacts, tasks, and categories.
 */
function fillTestArray() {
    contactsArray = [
        {
            "name": "Anja Sonnenberger",
            "nameAbbreviation": "AS",
            "email": "hdsfvdsjfjf@web.de",
            "phone": "6546465464",
            "color": "background: #D2691E",
            "id": 2
        },
        {
            "name": "David Peterka",
            "nameAbbreviation": "DP",
            "email": "testDavid@web.de",
            "phone": "012345678",
            "color": "background: #228B22",
            "id": 0
        },
        {
            "name": "Devin Krause",
            "nameAbbreviation": "DK",
            "email": "hjfjf@web.de",
            "phone": "4648463543",
            "color": "background: #DC143C",
            "id": 1
        },
        {
            "name": "Kevin Meister",
            "nameAbbreviation": "KM",
            "email": "hjfjfstars@web.de",
            "phone": "846464654654",
            "color": "background: #00008B",
            "id": 3
        }
    ];

    tasks = [
        {
            "id": 15,
            "status": "toDo",
            "category": "User Story",
            "categoryColor": "background: #0038FF",
            "title": "Kochwelt Page",
            "description": "Build start page with recipe recommendation.",
            "dueDate": "22/06/2024",
            "priority": "Medium",
            "assignContacts": [
                {
                    "name": "Anja Sonnenberger",
                    "nameAbbreviation": "AS",
                    "email": "hdsfvdsjfjf@web.de",
                    "phone": "6546465464",
                    "color": "background: #D2691E",
                    "id": 2
                },
                {
                    "name": "David Peterka",
                    "nameAbbreviation": "DP",
                    "email": "testDavid@web.de",
                    "phone": "012345678",
                    "color": "background: #228B22",
                    "id": 0
                },
                {
                    "name": "Devin Krause",
                    "nameAbbreviation": "DK",
                    "email": "hjfjf@web.de",
                    "phone": "4648463543",
                    "color": "background: #DC143C",
                    "id": 1
                },
                {
                    "name": "Kevin Meister",
                    "nameAbbreviation": "KM",
                    "email": "hjfjfstars@web.de",
                    "phone": "846464654654",
                    "color": "background: #00008B",
                    "id": 3
                }
            ],
            "subtasksInProgress": [
                "Implement Recipe Recommendation"
            ],
            "subtasksFinish": []
        },
        {
            "id": 16,
            "status": "inProgress",
            "category": "Technical Task",
            "categoryColor": "background: #1FD7C1",
            "title": "CSS Planning",
            "description": "Define CSS naming conventions and structure\n\n",
            "dueDate": "12/07/2024",
            "priority": "Urgent",
            "assignContacts": [
                {
                    "name": "Anja Sonnenberger",
                    "nameAbbreviation": "AS",
                    "email": "hdsfvdsjfjf@web.de",
                    "phone": "6546465464",
                    "color": "background: #D2691E",
                    "id": 2
                },
                {
                    "name": "Devin Krause",
                    "nameAbbreviation": "DK",
                    "email": "hjfjf@web.de",
                    "phone": "4648463543",
                    "color": "background: #DC143C",
                    "id": 1
                },
                {
                    "name": "Kevin Meister",
                    "nameAbbreviation": "KM",
                    "email": "hjfjfstars@web.de",
                    "phone": "846464654654",
                    "color": "background: #00008B",
                    "id": 3
                }
            ],
            "subtasksInProgress": [
                "css names",
                "hover effects",
                "animations"
            ],
            "subtasksFinish": [
                "css names",
                "hover effects"
            ]
        },
        {
            "id": 17,
            "status": "awaitFeedback",
            "category": "New project",
            "categoryColor": "background: #8B0000",
            "title": "Pokedex Project",
            "description": "Final corrections of the project",
            "dueDate": "07/06/2024",
            "priority": "Medium",
            "assignContacts": [
                {
                    "name": "Anja Sonnenberger",
                    "nameAbbreviation": "AS",
                    "email": "hdsfvdsjfjf@web.de",
                    "phone": "6546465464",
                    "color": "background: #D2691E",
                    "id": 2
                },
                {
                    "name": "Kevin Meister",
                    "nameAbbreviation": "KM",
                    "email": "hjfjfstars@web.de",
                    "phone": "846464654654",
                    "color": "background: #00008B",
                    "id": 3
                }
            ],
            "subtasksInProgress": [],
            "subtasksFinish": []
        },
        {
            "id": 18,
            "status": "toDo",
            "category": "Technical Task",
            "categoryColor": "background: #1FD7C1",
            "title": "Delivery App",
            "description": "Implement the shopping cart",
            "dueDate": "21/06/2024",
            "priority": "Low",
            "assignContacts": [
                {
                    "name": "Devin Krause",
                    "nameAbbreviation": "DK",
                    "email": "hjfjf@web.de",
                    "phone": "4648463543",
                    "color": "background: #DC143C",
                    "id": 1
                },
                {
                    "name": "David Peterka",
                    "nameAbbreviation": "DP",
                    "email": "testDavid@web.de",
                    "phone": "012345678",
                    "color": "background: #228B22",
                    "id": 0
                }
            ],
            "subtasksInProgress": [],
            "subtasksFinish": []
        }
    ];

    ownCategorys = {
        "name": [
            "New project"
        ],
        "color": [
            "background: #8B0000"
        ]
    };
    currentId = 22;
    contactId = 5;
    currentUserTaskSave();
    currentUserIdSave();
    currentUserCategorysSave();
    currentUserContactsSave();
}

