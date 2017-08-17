const Prefix = 'BookDesignHeader/';
export const SHOW_MENU_GET_PHOTOS   = Prefix + 'SHOW_MENU_GET_PHOTOS';
export const SHOW_MENU_MAIN         = Prefix + 'SHOW_MENU_MAIN';
export const CLOSE_POPUP            = Prefix + 'CLOSE_POPUP';
export const UPDATE_LAST_TIME_SAVED = Prefix +  'UPDATE_LAST_TIME_SAVED';
export const TOGGLE_SHOWING_INFO_OF_ACTIONS = Prefix + 'TOGGLE_SHOWING_INFO_OF_ACTIONS';
export const TOGGLE_SHOW_HELP_BUBBLE = Prefix + 'TOGGLE_SHOW_HELP_BUBBLE';

export function toggleMenuGetPhotos() {
    return { type: SHOW_MENU_GET_PHOTOS };
};

export function toggleMenuOptions() {
    return { type: SHOW_MENU_MAIN };
};

export function closePopup(){
    return { type: CLOSE_POPUP };
};

export function updateLastTimeSaved(){
    return {
        type: UPDATE_LAST_TIME_SAVED,
    };
};

export function toggleShowingInfoOfAction(message) {
    return {
        type: TOGGLE_SHOWING_INFO_OF_ACTIONS,
        message
    };
};

export function toggleShowHelpBubble(showHelpIsChecked) {
    return {
        type: TOGGLE_SHOW_HELP_BUBBLE,
        showHelpIsChecked
    };
};

