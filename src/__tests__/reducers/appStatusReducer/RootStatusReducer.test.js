import React from 'react';
import {
    SHOW_BOOK_DESIGN_SCREEN,
    SHOW_AUTO_CREATE_BOOK_SCREEN,
    SHOW_CHANGE_ORDER_LAYOUT_SCREEN,
    SHOW_START_SELECT_PHOTO,
    SHOW_CHANGE_BOOK_DESIGN,
    CHANGE_BOOK_STYLE,
    SHOW_PREVIEW_BOOK,
    SHOW_PRELOADER,
    SHOW_GET_PHOTOS_FOR_BOOK,
    CHANGE_PHOTO_CHOOSING,
    DELETE_PHOTO_CARD,
    IS_CONNECTING_SOCIAL
} from './../../../actions/appStatusActions/RootStatusActions';

import { bookStyles } from './../../../constants/Constants';
import rootReducer from './../../../reducers/appStatusReducer/RootStatusReducer';

let rootStatusDefault = {
    isShowPreLoader:                true,
    isShowBookDesignScreen:         false,
    isShowAutoCreateBookScreen:           false,
    isShowChangeOrderLayoutBookScreen:    false,
    isShowStartSelectPhotoScreen:   false,
    isShowChangeBookDesignScreen:   false,
    isShowPreviewBookScreen:        false,
    isShowGetPhotoForBook:          false,
    isShowPopup: false,
    isConnecting: false,
    photoType: '',
    bookStyle: bookStyles.VIEW_FINDER,
    photoIdClicking: -1,            //it meaning don't any photo is choosing in photo management tray
    isShowLargeImagePopup: false,
    photoName: ''
};
describe('test reducer RootStatusReducer', () => {
    
    it('should be return initial rootStatusDefault', () => {
        expect(rootReducer(undefined, {})).toEqual(rootStatusDefault);
    });

    it('should react to an action with type "SHOW_BOOK_DESIGN_SCREEN"', () => {
        let action = {
            type: SHOW_BOOK_DESIGN_SCREEN,
        };

        expect(rootReducer(undefined, action)).toEqual(Object.assign({}, rootStatusDefault, {
            isShowPreLoader: false,
            isShowBookDesignScreen: true,
        }));
    });

    it('should react to an action with type "SHOW_AUTO_CREATE_BOOK_SCREEN"', () => {
        let action = {
            type: SHOW_AUTO_CREATE_BOOK_SCREEN,
        };
        //console.log(rootReducer(undefined, action));
        expect(rootReducer(undefined, action)).toEqual(Object.assign({}, rootStatusDefault, {
            isShowAutoCreateBookScreen: true,
        }));
    });

    it('should react to an action with type "SHOW_CHANGE_ORDER_LAYOUT_SCREEN"', () => {
        let action = {
            type: SHOW_CHANGE_ORDER_LAYOUT_SCREEN,
        };
        expect(rootReducer(undefined, action)).toEqual(Object.assign({}, rootStatusDefault, {
            isShowChangeOrderLayoutBookScreen: true,
        }));
    });

    it('should react to an action with type "SHOW_START_SELECT_PHOTO"', () => {
        let photoType = "photoType"
        let action = {
            type: SHOW_START_SELECT_PHOTO,
            photoType,
        };
        expect(rootReducer(undefined, action)).toEqual(Object.assign({}, rootStatusDefault, {
            isShowStartSelectPhotoScreen: true,
            photoType: action.photoType,
        }));
    });

    it('should react to an action with type "SHOW_CHANGE_BOOK_DESIGN"', () => {
        let action = {
            type: SHOW_CHANGE_BOOK_DESIGN,
        };
        expect(rootReducer(undefined, action)).toEqual(Object.assign({}, rootStatusDefault, {
            isShowChangeBookDesignScreen: true,
        }));
    });    

    it('should react to an action with type "SHOW_PREVIEW_BOOK"', () => {
        let action = {
            type: SHOW_PREVIEW_BOOK,
        };
        expect(rootReducer(undefined, action)).toEqual(Object.assign({}, rootStatusDefault, {
            isShowPreviewBookScreen: true,
        }));
    });

    it('should react to an action with type "SHOW_GET_PHOTOS_FOR_BOOK"', () => {
        let photoType = "photoType"
        let action = {
            type: SHOW_GET_PHOTOS_FOR_BOOK,
            photoType,
        };
        expect(rootReducer(undefined, action)).toEqual(Object.assign({}, rootStatusDefault, {
            isShowStartSelectPhotoScreen: true,
            isShowGetPhotoForBook: true,
            photoType: action.photoType,
        }));
    });

    it('should react to an action with type "CHANGE_BOOK_STYLE"', () => {
        let bookStyle = bookStyles.ELEGANT;
        let action = {
            type: CHANGE_BOOK_STYLE,
            bookStyle,
        };
        expect(rootReducer(undefined, action)).toEqual(Object.assign({}, rootStatusDefault, {
            bookStyle: action.bookStyle,
        }));
    });

    it('should react to an action with type "SHOW_PRELOADER"', () => {
        let action = {
            type: SHOW_PRELOADER,
        };
        expect(rootReducer(undefined, action)).toEqual(Object.assign({}, rootStatusDefault, {
            isShowPreLoader: true,
        }));
    });

    it('should react to an action with type "IS_CONNECTING_SOCIAL"', () => {
        let isConnecting = true;
        let action = {
            type: IS_CONNECTING_SOCIAL,
            payload: {
                isConnecting
            },
        };
        expect(rootReducer(undefined, action)).toEqual(Object.assign({}, rootStatusDefault, {
            isConnecting: action.payload.isConnecting,
        }));
    });
})