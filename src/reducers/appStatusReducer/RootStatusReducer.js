import {
    SHOW_BOOK_DESIGN_SCREEN,
    SHOW_AUTO_CREATE_BOOK_SCREEN,
    SHOW_CHANGE_ORDER_LAYOUT_SCREEN,
    SHOW_START_SELECT_PHOTO,
    SHOW_CHANGE_BOOK_DESIGN,
    SHOW_PREVIEW_BOOK,
    SHOW_PRELOADER,
    SHOW_GET_PHOTOS_FOR_BOOK,
    CHANGE_PHOTO_ID_CLICKING,
    IS_CONNECTING_SOCIAL,
    TOGGLE_LARGE_IMAGE_POPUP,
    TOGGLE_SHOW_FACEBOOK_POPUP,
    TOGGLE_LIMIT_POPUP,
    TOGGLE_ALERT,
    TOGGLE_SHOW_BOOK_SAFE_ZONE,
    ADD_PAGES_INTO_PAGE_CHOOSING_LIST,
    REMOVE_PAGES_OUTTO_PAGE_CHOOSING_LIST,
    SHOW_REGISTER_POPUP,
    SHOW_SIGN_IN_POPUP,
    RESET_PAGES_CHOOSING,
    ADD_IMAGE_ID_INTO_IMAGES_CHOOSING_LIST,
    REMOVE_IMAGE_ID_OUTTO_IMAGES_CHOOSING_LIST,
    SHOW_MANAGE_PAGE_SCREEN,
    TOGGLE_WELCOME_NEW_REGISTER,
    TOGGLE_WELCOME_BACK_LOGIN,
    TOGGLE_READY_TO_ORDER_POPUP,
    TOGGLE_SHOW_CUSTOM_LOGO_POPUP,
    TOGGLE_SHOW_SERVICES_ERROR_DIALOG,
    TOGGLE_SHOW_UNSUPPORT_CHARACTERS_POPUP,
    TOGGLE_LOGIN_ALERT,
    SHOW_SELECT_LAYOUT_PAGE_LEFT,
    SHOW_SELECT_LAYOUT_PAGE_RIGHT,
    SHOW_SELECT_BACKGROUNDS_BORDERS_PAGE_LEFT,
    SHOW_SELECT_BACKGROUNDS_BORDERS_PAGE_RIGHT,
    PREVENT_CLOSING_OR_REFRESHING_PAGE,
    SHOWING_ERROR_POPUP,
    SHOWING_ERROR_DETAIL_POPUP,
    SHOWING_IMAGES_DUPLICATED,
    APP_CRASHED,
    UPDATE_ERROR,
    SHOWING_MISSING_ASSETS
} from './../../actions/appStatusActions/RootStatusActions';
import {
    SET_COVERS,
    ADD_NEW_IMAGE_INTO_COVER,
    SET_COVER_TYPE,
    UPDATE_IMAGE_INTO_COVER,
    SET_COVER_LAYOUT_INTO_BOOK,
    REMOVE_IMAGE_IN_COVER,
    UPDATE_TEXT_INTO_COVER
} from './../../actions/projectActions/bookActions/CoversActions';
import {
    UPDATE_CURR_ACTION_INDEX, UNDO_REDO_IMAGE_CONTAINER, UNDO_REDO_TEXT_CONTAINER
} from './../../actions/undoActions/UndoActions';
import {
    REARRANG_PAGES, UPDATE_IMAGE_INTO_PAGE, REMOVE_IMAGE_IN_PAGE, UPDATE_TEXT_INTO_PAGE
} from './../../actions/projectActions/bookActions/pagesActions/PagesActions';
import { UPDATE_LAST_TIME_SAVED } from './../../actions/appStatusActions/BookDesignHeaderStatusActions';
import { ADD_PHOTOS, DELETE_PHOTO_CARD } from './../../actions/photoListActions/PhotoListActions';
import { SET_AUTO_FLOW_LAYOUTS, CHANGE_CURR_CHOOSE_LAYOUT } from './../../actions/autoFlowLayoutsActions/AutoFlowLayoutsActions';
import CTEventFactory from './../../utils/CTEventFactory';
import AppServices from './../../services/AppServices';

let rootStatusDefault = {
    isShowPreLoader:                false,
    isShowBookDesignScreen:         false,
    isShowAutoCreateBookScreen:           false,
    isShowChangeOrderLayoutBookScreen:    false,
    isShowStartSelectPhotoScreen:   false,
    isShowChangeBookDesignScreen:   false,
    isShowPreviewBookScreen:        false,
    isShowGetPhotoForBook:          false,
    isShowRegister: false,
    isShowSignIn: false,
    isConnecting: false,
    photoType: '',
    photoIdClicking: -1,            //it meaning don't any photo is choosing in photo management tray
    isShowLargeImagePopup: false,
    photoName: '',
    isShowFacebookPopup: false,
    isShowLimitPopup: false,
    isShowBrowerDetectionPopup: false,
    isShowAlert: false,
    isShowBookSafeZone: false,
    isShowingPopup: false,
    pagesChoosingList: [],          //[idPage]
    idsOfImageUsingList: [],     //[{baseId of image}]
    isShowManagePage: false,
    isShowWelcomeNewRegister: false,
    isShowWelcomeBackLogin: false,
    isShowReadyToOrderPopup: false,
    isShowCustomeLogoPopup: false,
    isShowServicesErrorDialog: false,
    isShowUnsupportCharactersPopup: false,
    isShowingLoginAlert: false,
    isShowSelectLayoutPageLeft: false,
    isShowSelectLayoutPageRight: false,
    isShowSelectBackgroundsAndBordersPageLeft: false,
    isShowSelectBackgroundsAndBordersPageRight: false,
    shouldPreventClosingPageEvent: false,
    isShowingErrorPopup: false,
    isShowingErrorDetailPopup: false,
    imagesDuplicated: {
        isShowingImagesDuplicated: false,
        images: [],       //[{imageVO}]
        continueFunc: null          //continue uploading or importing images
    },
    isAppCrashed: false,
    errorPool: [],
    error: null,         //{typle, errorMessage} - type: one of types in the ErrorPopup
    isShowingMissingAssetsPopup: false,
    isRecoveredSuccess: true
};

function hideAllComponents(rootStatus) {
    return {
        ...rootStatus,
        isShowPreLoader: false,
        isShowBookDesignScreen: false,
        isShowAutoCreateBookScreen: false,
        isShowChangeOrderLayoutBookScreen: false,
        isShowStartSelectPhotoScreen: false,
        isShowChangeBookDesignScreen: false,
        isShowPreviewBookScreen: false,
        isShowGetPhotoForBook: false,
        isShowBrowerDetectionPopup: false,
        isShowingPopup: false,
        isShowUnsupportCharactersPopup: false,
    };
}

export default function rootReducer(rootStatus = rootStatusDefault, action) {
    // rootStatus = hideAllComponents(rootStatus);
    switch (action.type) {
        case SHOW_BOOK_DESIGN_SCREEN:
            rootStatus = hideAllComponents(rootStatus);
            return {
                ...rootStatus,
                isShowBookDesignScreen: true,
            };
        case SHOW_AUTO_CREATE_BOOK_SCREEN:
            rootStatus = hideAllComponents(rootStatus);
            return {
                ...rootStatus,
                isShowAutoCreateBookScreen: true,
            };
        case SHOW_CHANGE_ORDER_LAYOUT_SCREEN:
            rootStatus = hideAllComponents(rootStatus);
            return {
                ...rootStatus,
                isShowChangeOrderLayoutBookScreen: true,
            };
        case SHOW_START_SELECT_PHOTO:
            rootStatus = hideAllComponents(rootStatus);
            return {
                ...rootStatus,
                isShowStartSelectPhotoScreen: true,
                photoType: action.photoType
            };
        case SHOW_CHANGE_BOOK_DESIGN:
            rootStatus = hideAllComponents(rootStatus);
            return {
                ...rootStatus,
                isShowChangeBookDesignScreen: true,
            };
        case SHOW_PREVIEW_BOOK:
            rootStatus = hideAllComponents(rootStatus);
            AppServices.trackCTEvent(CTEventFactory.instance.createPreviewShownEvent(), null, null);
            return {
                ...rootStatus,
                isShowPreviewBookScreen: true,
            };
        case SHOW_GET_PHOTOS_FOR_BOOK:
            rootStatus = hideAllComponents(rootStatus);
            AppServices.trackCTEvent(CTEventFactory.instance.createImageImportSetsLoadedEvent(action.photoType), null, null);
            return {
                ...rootStatus,
                isShowStartSelectPhotoScreen: true,
                isShowGetPhotoForBook: true,
                photoType: action.photoType,
            };
        case SHOW_PRELOADER:
            rootStatus = hideAllComponents(rootStatus);
            return {
                ...rootStatus,
                isShowPreLoader: true,
            };

        case CHANGE_PHOTO_ID_CLICKING:
            return {
                ...rootStatus,
                photoIdClicking: action.photoId
            };

        case DELETE_PHOTO_CARD:
            return {
                ...rootStatus,
                photoIdClicking: -1,
                shouldPreventClosingPageEvent: true
            };
        case IS_CONNECTING_SOCIAL:
            return {
                ...rootStatus,
                isConnecting: action.payload.isConnecting,
            };
        case TOGGLE_LARGE_IMAGE_POPUP:
            return {
                ...rootStatus,
                isShowLargeImagePopup: !rootStatus.isShowLargeImagePopup,
                photoName: action.photoName,
            };
        case TOGGLE_SHOW_FACEBOOK_POPUP:
            return {
                ...rootStatus,
                isShowFacebookPopup: !rootStatus.isShowFacebookPopup
            };
        case TOGGLE_LIMIT_POPUP:
            return {
                ...rootStatus,
                isShowLimitPopup: !rootStatus.isShowLimitPopup
            };
        case TOGGLE_ALERT:
            return {
                ...rootStatus,
                isShowAlert: !rootStatus.isShowAlert,
                title: action.title,
                content: action.content,
                textBtn: action.textBtn,
                onClickBtn: action.onClickBtn,
                attachedData: action.attachedData,
            }
        case TOGGLE_SHOW_BOOK_SAFE_ZONE:
            return {
                ...rootStatus,
                isShowBookSafeZone: !rootStatus.isShowBookSafeZone
            };
        case ADD_PAGES_INTO_PAGE_CHOOSING_LIST:
            return addPagesIntoPageChoosingList(rootStatus, action.idPages);
        case REMOVE_PAGES_OUTTO_PAGE_CHOOSING_LIST:
            return removePagesOutToPageChoosingList(rootStatus, action.idPages);
        case SHOW_REGISTER_POPUP:
            return toggleShowingRegisterPopup(rootStatus);
        case SHOW_SIGN_IN_POPUP:
            return toggleShowingLogInPopup(rootStatus);
        case RESET_PAGES_CHOOSING:
            return resetPagesChoosingToEmpty(rootStatus);
        case ADD_IMAGE_ID_INTO_IMAGES_CHOOSING_LIST:
            return addImageIdIntoImagesChoosingList(rootStatus, action.imageIdList);
        case REMOVE_IMAGE_ID_OUTTO_IMAGES_CHOOSING_LIST:
            return removeImageIdOuttoImagesChoosingList(rootStatus, action.imageIdList);
        case REARRANG_PAGES:
            return reArrangePagesChoosedToPage(rootStatus, action.pagesChoosingList, action.position);
        case SHOW_MANAGE_PAGE_SCREEN:
            return showManagePageScreen(rootStatus, action.isShowManagePage);
        case TOGGLE_WELCOME_NEW_REGISTER:
            return toggleWelcomeNewRegister(rootStatus);
        case TOGGLE_WELCOME_BACK_LOGIN:
            return toggleWelcomeBackLogin(rootStatus);
        case TOGGLE_READY_TO_ORDER_POPUP:
            return toggleReadyToOrderPopup(rootStatus);
        case TOGGLE_SHOW_CUSTOM_LOGO_POPUP:
            return toggleCustomLogoPopup(rootStatus);
        case TOGGLE_SHOW_UNSUPPORT_CHARACTERS_POPUP:
            return toggleUnsupportCharactersPopup(rootStatus);
        case TOGGLE_SHOW_SERVICES_ERROR_DIALOG:
            return toggleShowingServicesError(rootStatus);
        case TOGGLE_LOGIN_ALERT:
            return toggleLoginAlert(rootStatus);
        case SHOW_SELECT_LAYOUT_PAGE_LEFT:
            return {
                ...rootStatus,
                isShowSelectLayoutPageLeft: !rootStatus.isShowSelectLayoutPageLeft,
            }
        case SHOW_SELECT_LAYOUT_PAGE_RIGHT:
            return {
                ...rootStatus,
                isShowSelectLayoutPageRight: !rootStatus.isShowSelectLayoutPageRight,
            }
        case SHOW_SELECT_BACKGROUNDS_BORDERS_PAGE_LEFT:
            return {
                ...rootStatus,
                isShowSelectBackgroundsAndBordersPageLeft: !rootStatus.isShowSelectBackgroundsAndBordersPageLeft
            }
        case SHOW_SELECT_BACKGROUNDS_BORDERS_PAGE_RIGHT:
            return {
                ...rootStatus,
                isShowSelectBackgroundsAndBordersPageRight: !rootStatus.isShowSelectBackgroundsAndBordersPageRight
            }
        case PREVENT_CLOSING_OR_REFRESHING_PAGE:
            return turnOnPreventClosingOrRefreshingPageEvent(rootStatus);
        case UPDATE_LAST_TIME_SAVED:
            return turnOffPreventClosingOrRefreshingPageEvent(rootStatus);
        case SHOWING_ERROR_POPUP:
            return toggleErrorPopup(rootStatus, action.payload);
        case SHOWING_ERROR_DETAIL_POPUP:
            return toggleErrorDetailPopup(rootStatus);
        case SHOWING_IMAGES_DUPLICATED:
            return toggleImagesDuplicatedPopup(rootStatus, action.payload);
        case ADD_PHOTOS || UPDATE_IMAGE_INTO_PAGE || REMOVE_IMAGE_IN_PAGE || UPDATE_TEXT_INTO_PAGE ||
            SET_COVERS || ADD_NEW_IMAGE_INTO_COVER || SET_COVER_TYPE || UPDATE_IMAGE_INTO_COVER ||
            SET_COVER_LAYOUT_INTO_BOOK || REMOVE_IMAGE_IN_COVER || UPDATE_TEXT_INTO_COVER || UPDATE_CURR_ACTION_INDEX ||
            UNDO_REDO_IMAGE_CONTAINER || UNDO_REDO_TEXT_CONTAINER || SET_AUTO_FLOW_LAYOUTS || CHANGE_CURR_CHOOSE_LAYOUT:
            return turnOnPreventClosingOrRefreshingPageEvent(rootStatus);
        case APP_CRASHED:
            let status = toggleErrorPopup(rootStatus, action.payload);
            status.isAppCrashed = true;
            return status;
        case SHOWING_MISSING_ASSETS:
            return toggleShowingMissingAssets(rootStatus, action.isRecoveredSuccess);
        default:    
            return rootStatus;
    }
};

function toggleShowingMissingAssets(rootStatus,isRecoveredSuccess) {
    return {
        ...rootStatus,
        isShowingMissingAssetsPopup: !rootStatus.isShowingMissingAssetsPopup,
        isRecoveredSuccess
    };
}

function addPagesIntoPageChoosingList(rootStatus, idPages) {
    let { pagesChoosingList } = rootStatus;
    for (let i in idPages) {
        if (pagesChoosingList.indexOf(idPages[i]) < 0) {
            pagesChoosingList.push(idPages[i]);
        }
    }
    pagesChoosingList.sort(function (a, b) { return a - b; });
    return {
        ...rootStatus,
        pagesChoosingList: [...pagesChoosingList],
        shouldPreventClosingPageEvent: true
    };
}

function removePagesOutToPageChoosingList(rootStatus, idPages) {
    let { pagesChoosingList } = rootStatus;
    for (let i = idPages.length - 1; i >= 0; i--) {
        let idPagePos = pagesChoosingList.indexOf(idPages[i]);
        if (idPagePos >= 0) {
            pagesChoosingList.splice(idPagePos, 1);
        }
    }

    return {
        ...rootStatus,
        pagesChoosingList: [...pagesChoosingList],
        shouldPreventClosingPageEvent: true
    };
}

function toggleShowingRegisterPopup(rootStatus) {
    return {
        ...rootStatus,
        isShowRegister: !rootStatus.isShowRegister,
        isShowSignIn: false
    }
}

function toggleShowingLogInPopup(rootStatus) {
    return {
        ...rootStatus,
        isShowSignIn: !rootStatus.isShowSignIn,
        isShowRegister: false,
    }
}

function resetPagesChoosingToEmpty(rootStatus) {
    return {
        ...rootStatus,
        pagesChoosingList: [],
        shouldPreventClosingPageEvent: true
    };
}

function addImageIdIntoImagesChoosingList(rootStatus, imageBaseIdList) {
    let newList = [...rootStatus.idsOfImageUsingList];
    for (let i in imageBaseIdList) {
        if (newList.indexOf(imageBaseIdList[i]) < 0) {
            newList.push(imageBaseIdList[i]);
        }
    }

    return {
        ...rootStatus,
        idsOfImageUsingList: newList,
        shouldPreventClosingPageEvent: true
    };
}

function removeImageIdOuttoImagesChoosingList(rootStatus, imageIdList) {
    let { idsOfImageUsingList } = rootStatus;
    for (let i = imageIdList.length - 1; i >= 0; i--) {
        let imageIdPos = idsOfImageUsingList.indexOf(imageIdList[i]);
        if (imageIdPos >= 0) {
            idsOfImageUsingList.splice(imageIdPos, 1);
        }
    }

    return {
        ...rootStatus,
        idsOfImageUsingList,
        shouldPreventClosingPageEvent: true
    }
}

function reArrangePagesChoosedToPage(rootStatus, pages, position) {
    let pagesChoosingList = [];
    for (let i = 1; i <= pages.length; i++) {
        pagesChoosingList.push(parseInt(position, 10) + i);
    }
    return {
        ...rootStatus,
        pagesChoosingList,
        shouldPreventClosingPageEvent: true
    }
}

function showManagePageScreen(rootStatus, isShowManagePage) {
    return {
        ...rootStatus,
        isShowManagePage: isShowManagePage
    };
}

function toggleWelcomeNewRegister(rootStatus) {
    return {
        ...rootStatus,
        isShowWelcomeNewRegister: !rootStatus.isShowWelcomeNewRegister
    }
}

function toggleWelcomeBackLogin(rootStatus) {
    return {
        ...rootStatus,
        isShowWelcomeBackLogin: !rootStatus.isShowWelcomeBackLogin
    }
}

function toggleReadyToOrderPopup(rootStatus) {
    return {
        ...rootStatus,
        isShowReadyToOrderPopup: !rootStatus.isShowReadyToOrderPopup
    };
}

function toggleCustomLogoPopup(rootStatus) {
    return {
        ...rootStatus,
        isShowingPopup: !rootStatus.isShowingPopup,
        isShowCustomeLogoPopup: !rootStatus.isShowCustomeLogoPopup,
    }
}

function toggleUnsupportCharactersPopup(rootStatus) {
    return {
        ...rootStatus,
        isShowingPopup: !rootStatus.isShowingPopup,
        isShowUnsupportCharactersPopup: !rootStatus.isShowUnsupportCharactersPopup
    }
}

function toggleShowingServicesError(rootStatus) {
    return {
        ...rootStatus,
        isShowServicesErrorDialog: !rootStatus.isShowServicesErrorDialog
    }
}

function toggleLoginAlert(rootStatus) {
    return {
        ...rootStatus,
        isShowingLoginAlert: !rootStatus.isShowingLoginAlert
    };
}

function turnOnPreventClosingOrRefreshingPageEvent(rootStatus) {
    return {
        ...rootStatus,
        shouldPreventClosingPageEvent: true
    };
}

function turnOffPreventClosingOrRefreshingPageEvent(rootStatus) {
    return {
        ...rootStatus,
        shouldPreventClosingPageEvent: false
    };
}

function toggleErrorPopup(rootStatus, { error }) {
    if (error) {
      rootStatus.errorPool.push(error);
    } else if (rootStatus.errorPool.length > 0) {
      error = rootStatus.errorPool.pop();
    }
    return {
        ...rootStatus,
        isShowingErrorPopup: error != null,
        errorPool: rootStatus.errorPool,
        error: error
    };
}

function toggleErrorDetailPopup(rootStatus) {
    return {
        ...rootStatus,
        isShowingErrorDetailPopup: !rootStatus.isShowingErrorDetailPopup
    };
}

function toggleImagesDuplicatedPopup(rootStatus, { images, continueFunc }) {
    let imagesDuplicated = {
        isShowingImagesDuplicated: !rootStatus.imagesDuplicated.isShowingImagesDuplicated,
        images: images,
        continueFunc: continueFunc
    };

    return {
        ...rootStatus,
        imagesDuplicated
    };
}
