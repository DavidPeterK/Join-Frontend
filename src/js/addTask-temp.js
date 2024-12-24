/**
 * Returns an HTML string representing a main category.
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

/**
 * Returns an HTML string representing a contact row.
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

/**
 * Returns an HTML string representing the priority section.
 *
 */
function returnPrioSection() {
    return /*html*/`
    <div onclick="urgentButtonClick()" id="urgentButton" class="prioButton">Urgent<img id="urgentImg"
            src="src/img/prioUrgent.svg" alt="urgent-icon"></div>
    <div onclick="mediumButtonClick()" id="mediumButton" class="prioButton">Medium<img id="mediumImg"
            src="src/img/prioMedium.svg" alt="medium-icon"></div>
    <div onclick="lowButtonClick()" id="lowButton" class="prioButton">Low<img id="lowImg"
            src="src/img/prioLow.svg" alt="low-icon"></div>`;
}

/**
 * Returns an HTML string representing a sub-task list item.
 */
function returnSubTasks(subCollection, i) {
    return /*html*/ `
    <ul id='subtaskUl${i}' onmouseover="subtaskListHover(${i})"
    onmouseout="subtaskListHoverReset(${i})" ondblclick="showEditContainer(${i})" class="subtaskListItem">
        <li>${subCollection}</li>
        <div id="subtaskListFunctions${i}" class='d-none' style="display: flex; gap: 5px;">
            <img class="greyHoverIcon" onclick="showEditContainer(${i})"
                src="src/img/PenAddTask 1=edit.svg">
            <div class="seperator" style='background: #F6F7F8'></div>
            <img class="greyHoverIcon" onclick="deleteSubtask(${i})"
                src="src/img/subTaskDelete.svg">
        </div>
    </ul>
    `;
}