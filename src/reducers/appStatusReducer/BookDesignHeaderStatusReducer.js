import Utils            from '../../utils/Utils';

import {
    SHOW_MENU_MAIN,
    SHOW_MENU_GET_PHOTOS,
    CLOSE_POPUP,
    UPDATE_LAST_TIME_SAVED,
    TOGGLE_SHOWING_INFO_OF_ACTIONS,
    TOGGLE_SHOW_HELP_BUBBLE
} from '../../actions/appStatusActions/BookDesignHeaderStatusActions';

var bookDesignHeaderStatusDefault = {
    id: 'id-book-design-header',
    isShowMenuOptions: false,
    isShowMenuGetPhotos: false,
    isClickingMenu: false,
    lastTimeSaved: '',
    isShowInfoAction: false,
    statusAction: '',
    isShowHelpBubble: false
}

export default function (bookDesignHeaderStatus = bookDesignHeaderStatusDefault, action) {
    switch (action.type) {
        case SHOW_MENU_GET_PHOTOS:
            return toggleShowingMenuGetPhotos(bookDesignHeaderStatus);
        case SHOW_MENU_MAIN:
            return toggleShowingMenuOption(bookDesignHeaderStatus);
        case UPDATE_LAST_TIME_SAVED:
            return updateLastTimeSaved(bookDesignHeaderStatus);
        case CLOSE_POPUP:
            return closePopup(bookDesignHeaderStatus);
        case TOGGLE_SHOWING_INFO_OF_ACTIONS:
            return toggleShowingInfoAction(bookDesignHeaderStatus, action.message);
        case TOGGLE_SHOW_HELP_BUBBLE:
            return toggleShowHelpBubble(bookDesignHeaderStatus, action.showHelpIsChecked);
        default:
            return bookDesignHeaderStatus;
    }
};

function toggleShowingInfoAction(bookDesignHeaderStatus, message) {
    return {
        ...bookDesignHeaderStatus,
        isShowInfoAction: !bookDesignHeaderStatus.isShowInfoAction,
        statusAction: message
    };
}

function toggleShowingMenuGetPhotos(bookDesignHeaderStatus) {
    return {
        ...bookDesignHeaderStatus,
        isShowMenuOptions: false,
        isShowMenuGetPhotos: !bookDesignHeaderStatus.isShowMenuGetPhotos
    };
}

function toggleShowingMenuOption(bookDesignHeaderStatus) {
    return {
        ...bookDesignHeaderStatus,
        isShowMenuOptions: !bookDesignHeaderStatus.isShowMenuOptions,
        isShowMenuGetPhotos: false
    };
}

function updateLastTimeSaved(bookDesignHeaderStatus) {
    let currentTime = Utils.getCurrentTime();
    return {
        ...bookDesignHeaderStatus,
        lastTimeSaved: currentTime
    };
}

function closePopup(bookDesignHeaderStatus) {
    return {
        ...bookDesignHeaderStatus,
        isShowMenuOptions: false,
        isShowMenuGetPhotos: false,
        isClickingMenu: false,
    };
}

function toggleShowHelpBubble(bookDesignHeaderStatus, showHelpIsChecked) {
    return {
        ...bookDesignHeaderStatus,
        isShowHelpBubble: showHelpIsChecked
    };
}
