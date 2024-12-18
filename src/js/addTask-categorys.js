//Category functions//
/**
 * Renders the categories into the specified container.
 */
function renderCategorys() {
    let container = document.getElementById('categoryContent');
    container.innerHTML = '';
    renderMainCategorys(container);
    renderOwnCategorys(container);
}

/**
 * Displays the category container and renders the categories.
 */
function showCategoryContainer() {
    let container = document.getElementById('categoryContainer');
    container.classList.remove('d-none');
    changeOpenInputArrowCategory();
    renderCategorys();
}

/**
 * Hides the category container.
 */
function hideCategoryContainer() {
    let container = document.getElementById('categoryContainer');
    if (container) {
        container.classList.add('d-none');
        changeCloseInputArrowCategory();
    }
}

/**
 * Changes the arrow in the category input to the open position.
 */
function changeOpenInputArrowCategory() {
    let arrow = document.getElementById('categoryInputArrow');
    arrow.src = 'src/img/arrow_drop_up.svg';
    arrow.onclick = function (event) {
        hideCategoryContainer();
        doNotClose(event);
    }
}

/**
 * Changes the arrow in the category input to the close position.
 */
function changeCloseInputArrowCategory() {
    let arrow = document.getElementById('categoryInputArrow');
    if (arrow) {
        arrow.src = 'src/img/arrow_drop_downaa.svg';
        arrow.onclick = function (event) {
            showCategoryContainer();
            doNotClose(event);
        };
    }
}

/**
 * Renders main categories into the specified container.
 *
 * @param {HTMLElement} container - The container to render main categories into.
 */
function renderMainCategorys(container) {
    for (let m = 0; m < mainCategorys.name.length; m++) {
        const mName = mainCategorys.name[m];
        const mColor = mainCategorys.color[m];
        container.innerHTML += returnRenderMainCategorys(mName, mColor, m);
    }
}

/**
 * Renders user's own categories into the specified container.
 *
 * @param {HTMLElement} container - The container to render user's own categories into.
 */
function renderOwnCategorys(container) {
    for (let a = 0; a < ownCategorys.name.length; a++) {
        const aName = ownCategorys.name[a];
        const aColor = ownCategorys.color[a];
        container.innerHTML += returnRenderOwnCategorys(aName, aColor, a);
    }
}

/**
 * Selects a category based on its index and type (main or own).
 *
 */
function selectCategory(i, type) {
    let input = document.getElementById('categoryInput');
    if (type === 'main') {
        input.value = mainCategorys.name[i];
        fillSelectedCategoryArray(i, type);
    }
    if (type === 'own') {
        input.value = ownCategorys.name[i];
        fillSelectedCategoryArray(i, type);
    }
    hideCategoryContainer();
}

/**
 * Fills the currentCategorySelected object with information from the selected category.
 *
 */
function fillSelectedCategoryArray(i, type) {
    if (type === 'main') {
        currentCategorySelected.name = mainCategorys.name[i];
        currentCategorySelected.color = mainCategorys.color[i];
        currentCategorySelected.type = type;
    }
    if (type === 'own') {
        currentCategorySelected.name = ownCategorys.name[i];
        currentCategorySelected.color = ownCategorys.color[i];
        currentCategorySelected.type = type;
    }
}

/**
 * Renders available color options for categories.
 */
function createCategoryColors() {
    let colorContainer = document.getElementById('colorSettingBox');
    colorContainer.innerHTML = '';
    for (let index = 0; index < colorCollection.length; index++) {
        const color = colorCollection[index];
        colorContainer.innerHTML += returnCreateCategoryColors(color, index);
    }
}

/**
 * Selects a color and updates the UI.
 *
 */
function selectColor(color) {
    if (selectedColorIndex === color) {
        selectedColorIndex = '';
    } else {
        selectedColorIndex = color;
    }
    createCategoryColors();
}

/**
 * Checks if category input is valid, and if so, creates a new category.
 */
function confirmCreateCategory() {
    if (isValidCategoryInput()) {
        createNewCategory();
        renderCategorys();
        clearCreateWindow();
    } else {
        alertInvalidInput();
    }
}

async function deleteOwnCategory(index) {
    ownCategorys.name.splice(index, 1);
    ownCategorys.color.splice(index, 1);
    await currentUserCategorysSave();
    renderCategorys();
}

/**
 * Validates the input for category creation.
 */
function isValidCategoryInput() {
    let input = document.getElementById('newCategoryName');
    return input.value.length > 0 && selectedColorIndex !== null;
}

/**
 * Clears the category creation window. 
 */
function clearCreateWindow() {
    let input = document.getElementById('newCategoryName');
    input.value = '';
    selectedColorIndex = null;
}

/**
 * Displays a warning for invalid category input.
 */
function alertInvalidInput() {
    let inputContainer = document.getElementById('newCategoryNameContainer')
    let warnText = document.getElementById('warnCategoryInput');
    inputContainer.classList.add('red-border');
    warnText.classList.remove('d-none');
    setTimeout(() => {
        inputContainer.classList.remove('red-border');
        warnText.classList.add('d-none');
    }, 4000);
}

/**
 * Creates and adds a new category to the `allCategorys` array.
 */
async function createNewCategory() {
    let newCategoryName = document.getElementById('newCategoryName');
    ownCategorys.name.push(newCategoryName.value);
    ownCategorys.color.push(selectedColorIndex);
    await currentUserCategorysSave();
    showCategoryContainer();
    closeCategoryPopUp();
    clearCreateWindow();
    changesSaved('Category successfully created');
}

/**
 * Clears the category creation window and hides the category creation popup.
 */
function stopCreateCategory() {
    renderCategorys();
    closeCategoryPopUp();
    clearCreateWindow();
}

/**
 * Closes the category creation popup.
 */
function closeCategoryPopUp() {
    let popup = document.getElementById('categoryPopUp');
    popup.classList.add('d-none');
}

/**
 * Displays the category creation popup and initializes color options.
 */
function showCategoryPopUp() {
    let popup = document.getElementById('categoryPopUp');
    popup.classList.remove('d-none');
    createCategoryColors();
}

/**
 * Renders the category creation popup.
 */
function renderCategoryPopUp() {
    let container = document.getElementById('categoryPopUp');
    container.innerHTML = returnCategoryPopUp();
}

/**
 * Returns an HTML string representing a main category.
 *
 */
function returnRenderMainCategorys(mName, mColor, m) {
    return /*html*/`
    <div onclick='selectCategory(${m}, "main")' id='mainCategory${m}' class="categoryRow">
        <span class="category-span">${mName}</span>
        <div style="display: flex; align-items: center; gap: 8px;">
            <div style="${mColor}" class="colorCircleSmall"></div>
        </div>
    </div>`;
}

/**
 * Renders user's own categories into the specified container.
 *
 * @param {HTMLElement} container - The container to render user's own categories into.
 */
function returnRenderOwnCategorys(aName, aColor, a) {
    return /*html*/`
    <div onclick='selectCategory(${a}, "own")' id='ownCategory${a}' class="categoryRow">
        <span class="category-span">${aName}</span>
        <div style="display: flex; align-items: center; gap: 8px;">
            <img onclick='deleteOwnCategory(${a}), doNotClose(event)' class="greyHoverIcon" src="src/img/subTaskDelete.svg" alt="">
            <div style="${aColor}" class="colorCircleSmall"></div>
        </div>
    </div>`;
}

/**
 * Returns an HTML string representing a color circle, with optional selection.
 */
function returnCreateCategoryColors(color, index) {
    if (color === selectedColorIndex) {
        return /*html*/ `
        <div onclick='selectColor("${color}")' style="${color}" id='colorCircle${index}' class="colorCircle selectedColor"></div>
        `;
    } else {
        return /*html*/ `
        <div onclick='selectColor("${color}")' style="${color}" id='colorCircle${index}' class="colorCircle"></div>
        `;
    }
}

/**
 * Returns an HTML string representing the category creation popup.
 *
 */
function returnCategoryPopUp() {
    return /*html*/`
    <div class="pop-position">
        <img onclick="closeCategoryPopUp()" class="blue-cross greyHoverIcon" src="src/img/iconoir_cancel.svg"
            alt="">
        <img onclick="closeCategoryPopUp()" class="grey-cross greyHoverIcon" src="src/img/closeGrey.svg" alt="">
        <div class="pop-head-box">
            <img class="pop-logo" style="width: 55px; height: 55px;" src="src/img/join.logo-white.svg"
                alt="join-logo">
            <span class="pop-headline">Add category</span>
            <span class="pop-slogen">Create your own category!</span>
            <div class="pop-vector"></div>
        </div>
        <div class="pop-icon-box">
            <div class="pop-person-background"><img class="pop-person-png" src="src/img/addTaskCategory.svg"
                    alt="person-icon"></div>
        </div>
        <div class="pop-input-box">
            <div class="input-pop-container" id="newCategoryNameContainer">
                <input style="width: 100%;" id="newCategoryName" type="text" placeholder="New category"
                    id="contactUserName">
            </div>
            <span id="warnCategoryInput" style="text-align: center;" class="warningByInput d-none">
                Please enter a category name and choose a color.
            </span>
            <div id="colorSettingBox"></div>
            <div class="pop-button-box">
                <div onclick="stopCreateCategory()" class="pop-button-cancel">Cancel</div>
                <div onclick="confirmCreateCategory()" class="pop-button-create">Create category</div>
            </div>
        </div>
    </div>    `;
}