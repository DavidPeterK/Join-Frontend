//------------------------LogIn Ainimation--------------------//
/**
 * Starts the join-logo animation if the document referrer is empty.
*/
function startAnimation() {
    showLogoAnimate();
    setTimeout(() => {
        logo.classList.add('animated');
    }, 1000);
    setTimeout(() => {
        walkingLogoAnimate();
        renderSignIn();
    }, 2825);
}

/**
 * Animates the join-logo to show.
 */
function showLogoAnimate() {
    logo.classList.add('join-logo-head-startposition');
    logo.classList.add('fade-in');
    logo.classList.remove('d-none');
}

/**
 * Animates the join-logo to simulate walking.
 */
function walkingLogoAnimate() {
    logo.classList.remove('join-logo-head-startposition');
    logo.classList.remove('fade-in');
    logo.classList.remove('animated');
    logo.classList.add('join-logo-head-endposition');
}

/**
 * Updates CSS classes for animation.
 */
function updateClasses() {
    [contentBox, signUpButtonTop, signUpButtonBottom].forEach(elem => {
        elem.classList.toggle('fade-in');
        elem.classList.toggle('fade-out');
    });
}

/**
 * Adds CSS classes for fading out elements.
 */
function addClasses() {
    [contentBox, signUpButtonTop, signUpButtonBottom].forEach(elem => {
        elem.classList.remove('fade-in');
        elem.classList.add('fade-out');
    });
}
//----------------------------------------------------------------------//
//-------------------------successFully popUp---------------------------//
/** * This function is used to the edit and delete menu on the mobile view */
function changesSaved(inputText) {
    let smallContainer = document.getElementById('successfullyCreated')
    smallContainer.innerHTML = /* html */ `${inputText}`;
    smallContainer.classList.remove('d-none');
    setTimeout(function () {
        smallContainer.classList.add('d-none');
    }, 2900);
}
//----------------------------------------------------------------------//
/**
 * Prevents the event from propagating further.
 */
function doNotClose(event) {
    event.stopPropagation();
}

/**
 * Triggers the browser's back functionality.
 */
function goBack() {
    window.history.back();
}

//------------------------Header-Menu----------------------------//
let openMenu = false;

/**
 * Closes the header menu.
 */
function closeHeadMenu() {
    let headerMenu = document.getElementById('userOptions');
    headerMenu.classList.add('d-none');
    openMenu = false;
}

/**
 * Shows the header menu.
 */
function showHeadMenu() {
    let headerMenu = document.getElementById('userOptions');
    headerMenu.classList.remove('d-none');
    openMenu = true;
}

/**
 * Toggles the visibility of the header menu.
 */
function openHeaderMenu(event) {
    event.stopPropagation();
    if (openMenu) {
        closeHeadMenu();
    } else {
        showHeadMenu();
    }
}
//----------------------------------------------------------------------//
/**
 * Opens the swap box for a specific task.
 */
function openSwapBox(id) {
    let box = document.getElementById(`swapContainer${id}`);
    let arrow = document.getElementById(`swapArrow${id}`);
    box.classList.remove('d-none');
    arrow.onclick = function (event) {
        closeSwapBox(id);
        doNotClose(event);
    };
}

/**
 * Closes the swap box for a specific task.
 */
function closeSwapBox(id) {
    let box = document.getElementById(`swapContainer${id}`);
    let arrow = document.getElementById(`swapArrow${id}`);
    box.classList.add('d-none');
    arrow.onclick = function (event) {
        openSwapBox(id);
        doNotClose(event);
    };
}

/**
 * Initiates the task swapping process by setting the task ID as the element to be dragged.
 */
function swapTask(group, id) {
    dragElement = id;
    moveTo(group);
}

/**
 * Changes the image source for the specified element.
 */
function changeImage(id, path) {
    document.getElementById(id).src = path;
}

/**
 * Restores the original image source for the specified element.
 */
function restoreImage(id, path) {
    document.getElementById(id).src = path;
}

/**
 * Highlights the navigation bar with specified image source and text color.
 */
function highLightNavBar(imgSrc, imgId, textId) {
    let image = document.getElementById(imgId);
    let text = document.getElementById(textId);
    text.style = 'color: var(--white, #FFF); background: #091931;';
    image.src = imgSrc;
}

/**
 * Controls the login state by loading active user data and adjusting UI visibility.
 */
function controlLogIn() {
    let nav = document.getElementById('navBox');
    let head = document.getElementById('headBox');
    loadActivUser();
    userCircleLoad();
    if (activUser.name === '') {
        nav.classList.add('d-none');
        head.classList.add('d-none');
    }
}
