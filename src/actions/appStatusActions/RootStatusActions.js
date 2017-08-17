const Prefix = 'Root/';
export const SHOW_BOOK_DESIGN_SCREEN            = Prefix + 'SHOW_BOOK_DESIGN_SCREEN';
export const SHOW_AUTO_CREATE_BOOK_SCREEN       = Prefix + 'SHOW_AUTO_CREATE_BOOK_SCREEN';
export const SHOW_CHANGE_ORDER_LAYOUT_SCREEN    = Prefix + 'SHOW_CHANGE_ORDER_LAYOUT_SCREEN';
export const SHOW_START_SELECT_PHOTO            = Prefix + 'SHOW_START_SELECT_PHOTO';
export const SHOW_CHANGE_BOOK_DESIGN            = Prefix + 'SHOW_CHANGE_BOOK_DESIGN';
export const SHOW_PREVIEW_BOOK                  = Prefix + 'SHOW_PREVIEW_BOOK';
export const SHOW_GET_PHOTOS_FOR_BOOK           = Prefix + 'SHOW_GET_PHOTOS_FOR_BOOK';
export const SHOW_FB_FAILED_MESSAGE             = Prefix + 'SHOW_FB_FAILED_MESSAGE';
export const SHOW_PRELOADER                     = Prefix + 'SHOW_PRELOADER';
export const CHANGE_PHOTO_ID_CLICKING           = Prefix + 'CHANGE_PHOTO_ID_CLICKING';
export const IS_CONNECTING_SOCIAL               = Prefix + 'IS_CONNECTING_SOCIAL';
export const TOGGLE_LARGE_IMAGE_POPUP           = Prefix + 'TOGGLE_LARGE_IMAGE_POPUP';
export const TOGGLE_SHOW_FACEBOOK_POPUP         = Prefix +'TOGGLE_SHOW_FACEBOOK_POPUP';
export const TOGGLE_LIMIT_POPUP                 = Prefix + 'TOGGLE_LIMIT_POPUP';
export const TOGGLE_ALERT                       = Prefix + 'TOGGLE_ALERT';
export const TOGGLE_SHOW_BOOK_SAFE_ZONE         = Prefix + 'TOGGLE_SHOW_BOOK_SAFE_ZONE';
export const ADD_PAGES_INTO_PAGE_CHOOSING_LIST = Prefix + 'ADD_PAGES_INTO_PAGE_CHOOSING_LIST';
export const ADD_ALL_PAGES_INTO_PAGE_CHOOSING_LIST = Prefix + 'ADD_ALL_PAGES_INTO_PAGE_CHOOSING_LIST';
export const REMOVE_PAGES_OUTTO_PAGE_CHOOSING_LIST = Prefix + 'REMOVE_PAGES_OUTTO_PAGE_CHOOSING_LIST';
export const SHOW_REGISTER_POPUP                = Prefix + "SHOW_REGISTER";
export const SHOW_SIGN_IN_POPUP                 = Prefix + "SHOW_SIGN_IN";
export const RESET_PAGES_CHOOSING               = Prefix + 'RESET_PAGES_CHOOSING';
export const ADD_IMAGE_ID_INTO_IMAGES_CHOOSING_LIST     = Prefix + 'ADD_IMAGE_ID_INTO_IMAGES_CHOOSING_LIST';
export const REMOVE_IMAGE_ID_OUTTO_IMAGES_CHOOSING_LIST = Prefix + 'REMOVE_IMAGE_ID_OUTTO_IMAGES_CHOOSING_LIST';
export const SHOW_MANAGE_PAGE_SCREEN            = Prefix + 'SHOW_MANAGE_PAGE_SCREEN';
export const TOGGLE_WELCOME_NEW_REGISTER        = Prefix + 'TOGGLE_WELCOME_NEW_REGISTER';
export const TOGGLE_WELCOME_BACK_LOGIN          = Prefix + 'TOGGLE_WELCOME_BACK_LOGIN';
export const TOGGLE_READY_TO_ORDER_POPUP        = Prefix + 'TOGGLE_READY_TO_ORDER_POPUP';
export const TOGGLE_SHOW_CUSTOM_LOGO_POPUP      = Prefix + 'TOGGLE_SHOW_CUSTOM_LOGO_POPUP';
export const TOGGLE_SHOW_SERVICES_ERROR_DIALOG  = Prefix + 'TOGGLE_SHOW_SERVICES_ERROR_DIALOG';
export const TOGGLE_SHOW_UNSUPPORT_CHARACTERS_POPUP  = Prefix + 'TOGGLE_SHOW_UNSUPPORT_CHARACTERS_POPUP';
export const TOGGLE_LOGIN_ALERT                 = Prefix + 'TOGGLE_ALERT_LOGIN';
export const SHOW_SELECT_LAYOUT_PAGE_RIGHT      = Prefix + 'SHOW_SELECT_LAYOUT_PAGE_RIGHT';
export const SHOW_SELECT_LAYOUT_PAGE_LEFT       = Prefix + 'SHOW_SELECT_LAYOUT_PAGE_LEFT';
export const SHOW_SELECT_BACKGROUNDS_BORDERS_PAGE_RIGHT      = Prefix + 'SHOW_SELECT_BACKGROUNDS_BORDERS_PAGE_RIGHT';
export const SHOW_SELECT_BACKGROUNDS_BORDERS_PAGE_LEFT       = Prefix + 'SHOW_SELECT_BACKGROUNDS_BORDERS_PAGE_LEFT';
export const PREVENT_CLOSING_OR_REFRESHING_PAGE = Prefix + 'PREVENT_CLOSING_OR_REFRESHING_PAGE';
export const SHOWING_ERROR_POPUP              = Prefix + 'SHOWING_ERROR_POPUP';
export const SHOWING_ERROR_DETAIL_POPUP       = Prefix + 'SHOWING_ERROR_DETAIL_POPUP';
export const SHOWING_IMAGES_DUPLICATED        = Prefix + 'SHOWING_IMAGES_DUPLICATED';
export const APP_CRASHED                      = Prefix + 'APP_CRASHED';
export const SHOWING_MISSING_ASSETS           = Prefix + 'SHOWING_MISSING_ASSETS';

export function showBookDesignScreen() {
    return {
        type: SHOW_BOOK_DESIGN_SCREEN
    };
};

export function showAutoCreateBookScreen() {
    return {
        type: SHOW_AUTO_CREATE_BOOK_SCREEN
    };
};

export function showChangeOrderLayoutScreen() {
    return {
        type: SHOW_CHANGE_ORDER_LAYOUT_SCREEN
    };
};

export function showStartSelectPhoto(photoType) {
    return {
        type: SHOW_START_SELECT_PHOTO,
        photoType
    };
};

export function toggleLargeImagePopup(photoName) {
    return {
        type: TOGGLE_LARGE_IMAGE_POPUP,
        photoName
    };
};

export function showChangeBookDesign() {
    return {
        type: SHOW_CHANGE_BOOK_DESIGN,
    };
};

export function showPreviewBook() {
    return {
        type: SHOW_PREVIEW_BOOK
    };
};

export function showGetPhotosForBook(photoType) {
    return {
        type: SHOW_GET_PHOTOS_FOR_BOOK,
        photoType
    };
};

export function showFBFailedMessage() {
    return {
        type: SHOW_FB_FAILED_MESSAGE
    };
};

export function showPreloader() {
    return {
        type: SHOW_PRELOADER
    };
};

export function isConnecting(isConnecting) {
    return {
        type: IS_CONNECTING_SOCIAL,
        payload: {
            isConnecting
        }
    };
};

export function toggleFacebookPopup() {
    return {
        type: TOGGLE_SHOW_FACEBOOK_POPUP
    };
}

export function toggleLimitPopup() {
    return {
        type: TOGGLE_LIMIT_POPUP
    };
}

export function toggleAlert(title, content, textBtn, onClickBtn, attachedData) {
    return {
        type: TOGGLE_ALERT,
        title,
        content,
        textBtn,
        onClickBtn,
        attachedData
    };
};

export function toggleShowBookSafeZone() {
    return {
        type: TOGGLE_SHOW_BOOK_SAFE_ZONE
    };
};

export function addPagesIntoPageChoosingList(idPages) {
    return {
        type: ADD_PAGES_INTO_PAGE_CHOOSING_LIST,
        idPages
    };
};

export function addAllPagesIntoPageChoosingList() {
    return {
        type: ADD_ALL_PAGES_INTO_PAGE_CHOOSING_LIST
    }
}

export function removePagesOuttoPageChoosingList(idPages) {
    return {
        type: REMOVE_PAGES_OUTTO_PAGE_CHOOSING_LIST,
        idPages
    };
};

export function toggleRegisterPopup() {
    return { type: SHOW_REGISTER_POPUP };
};

export function toggleSignInPopup() {
    return { type: SHOW_SIGN_IN_POPUP };
};

export function resetPagesChoosing() {
    return { type: RESET_PAGES_CHOOSING };
}

export function addImageIdIntoImagesChoosingList(imageIdList) {
    return {
        type: ADD_IMAGE_ID_INTO_IMAGES_CHOOSING_LIST,
        imageIdList
    };
}

export function removeImageIdOuttoImagesChoosingList(imageIdList) {
    return {
        type: REMOVE_IMAGE_ID_OUTTO_IMAGES_CHOOSING_LIST,
        imageIdList
    };
}

export function changePhotoIsClicking(photoId) {
    return {
        type: CHANGE_PHOTO_ID_CLICKING,
        photoId
    }
}

export function showManagePage(isShowManagePage) {
    return {
        type: SHOW_MANAGE_PAGE_SCREEN,
        isShowManagePage
    }
}

export function toggleWelcomeNewRegister() {
    return { type: TOGGLE_WELCOME_NEW_REGISTER }
}

export function toggleWelcomeBackLogin() {
    return { type: TOGGLE_WELCOME_BACK_LOGIN }
}

export function toggleReadyToOrderPopup() {
    return { type: TOGGLE_READY_TO_ORDER_POPUP };
}

export function toggleShowCustomLogoPopup() {
    return { type: TOGGLE_SHOW_CUSTOM_LOGO_POPUP };
}

export function toggleServicesErrorDialog() {
    return {
        type: TOGGLE_SHOW_SERVICES_ERROR_DIALOG,
     };
}

export function toggleShowUnsupportCharactersPopup() {
    return {
        type: TOGGLE_SHOW_UNSUPPORT_CHARACTERS_POPUP,
     };
}

export function toggleLoginAlert() {
    return { type: TOGGLE_LOGIN_ALERT };
}

export function showSelectLayoutPageLeft() {
    return {
        type: SHOW_SELECT_LAYOUT_PAGE_LEFT,
    };
}

export function showSelectLayoutPageRight() {
    return {
        type: SHOW_SELECT_LAYOUT_PAGE_RIGHT,
    };
}

export function showBackgroundAndBorderPageLeft() {
    return {
        type: SHOW_SELECT_BACKGROUNDS_BORDERS_PAGE_LEFT,
    };
}

export function showBackgroundAndBorderPageRight() {
    return {
        type: SHOW_SELECT_BACKGROUNDS_BORDERS_PAGE_RIGHT,
    };
}

export function togglePreventClosingPageEvent() {
    return { type: PREVENT_CLOSING_OR_REFRESHING_PAGE };
}

export function toggleShowingErrorPopup(error) {
    return {
        type: SHOWING_ERROR_POPUP,
        payload: { error }
    };
}

export function appCrashed(error) {
  return {
          type: APP_CRASHED,
          payload: { error }
        };
}

export function toggleShowingErrorDetailPopup() {
    return { type: SHOWING_ERROR_DETAIL_POPUP };
}

export function toggleImagesDuplicatedPopup(images, continueFunc) {
    return {
        type: SHOWING_IMAGES_DUPLICATED,
        payload: {
            images,
            continueFunc
        }
    };
}

export function toggleShowingMissingAssetsPopup(isRecoveredSuccess) {
    return {
        type: SHOWING_MISSING_ASSETS,
        isRecoveredSuccess
    };
}
