const PRE_FIX = 'pages/';
export const SET_PAGES_INTO_BOOK = PRE_FIX + 'SET_PAGES_INTO_BOOK';
export const SET_PAGE_LAYOUT_INTO_BOOK = PRE_FIX + 'SET_PAGE_LAYOUT_INTO_BOOK';
export const SET_PAGE_LAYOUT_IMAGE_BY_AUTO_CREATE_BOOK = PRE_FIX + 'SET_PAGE_LAYOUT_IMAGES_BY_AUTO_CREATE_BOOK';
export const UPDATE_IMAGE_INTO_PAGE = PRE_FIX + 'UPDATE_IMAGE_INTO_PAGE';
export const ADD_NEW_IMAGE_INTO_PAGE = PRE_FIX + 'ADD_NEW_IMAGE_INTO_PAGE';
export const REMOVE_IMAGE_IN_PAGE = PRE_FIX + 'REMOVE_IMAGE_IN_PAGE';
export const ADD_PAGE_IN_BOOK = PRE_FIX + 'ADD_PAGE_IN_BOOK';
export const DELETE_PAGE_IN_BOOK = PRE_FIX + 'DELETE_PAGE_IN_BOOK';
export const UPDATE_TEXT_INTO_PAGE = PRE_FIX + 'UPDATE_TEXT_INTO_PAGE';
export const DELETE_PAGES_LIST_IN_BOOK = PRE_FIX + 'DELETE_PAGES_LIST_IN_BOOK';
export const DELETE_PAGES_CONTENT_IN_BOOK = PRE_FIX + 'DELETE_PAGES_CONTENT_IN_BOOK';
export const REARRANG_PAGES = PRE_FIX + 'REARRANG_PAGES';
export const UPDATE_TEXT_STYLE_OF_PAGES = PRE_FIX + 'UPDATE_TEXT_STYLE_OF_PAGES';
export const CHANGE_BACKGROUND_FOR_PAGE = PRE_FIX + 'CHANGE_BACKGROUND_FOR_PAGE';
export const CHANGE_BACKGROUND_FOR_ALL_PAGES = PRE_FIX + 'CHANGE_BACKGROUND_FOR_ALL_PAGES';

export function setPages(pages) {
    return {
        type: SET_PAGES_INTO_BOOK,
        payload: {
            newPages: pages
        }
    }
}

export function setPageLayout(pagesChoosingList, newLayout) {
    return {
        type: SET_PAGE_LAYOUT_INTO_BOOK,
        payload: {
            pagesChoosingList,
            newLayout
        }
    }
}

export function setPageLayoutImageByAutoCreateBook(sortedPhotos, layoutLeft, layoutRight, isKeepPagesMade) {
    return {
        type: SET_PAGE_LAYOUT_IMAGE_BY_AUTO_CREATE_BOOK,
        payload: {
            sortedPhotos,
            layoutLeft,
            layoutRight,
            isKeepPagesMade
        }
    }
}

export function updateTextIntoPage(page) {
    return {
        type: UPDATE_TEXT_INTO_PAGE,
        payload: {
            page
        }
    }
}

export function updateImageIntoPage(page) {
    return {
        type: UPDATE_IMAGE_INTO_PAGE,
        payload: {
            page
        }
    }
}

export function addNewImageIntoPage(page) {
    return {
        type: ADD_NEW_IMAGE_INTO_PAGE,
        payload: {
            page
        }
    }
}

export function removePhotoInPage(page) {
    return {
        type: REMOVE_IMAGE_IN_PAGE,
        payload: {
            page
        }
    }
}

export function addPageInBookAfterPage(position) {
    return {
        type: ADD_PAGE_IN_BOOK,
        position
    }
}

export function deletePageInBook(numPage) {
    return {
        type: DELETE_PAGE_IN_BOOK,
        numPage
    }
}

export function deletePagesListInBook(pagesChoosing) {
    return {
        type: DELETE_PAGES_LIST_IN_BOOK,
        pagesChoosing
    }
}

export function deletePagesContentInBook(pagesChoosing) {
    return {
        type: DELETE_PAGES_CONTENT_IN_BOOK,
        pagesChoosing
    }
}

export function movePagesToAfterPage(pagesChoosingList, position) {
    return {
        type: REARRANG_PAGES,
        pagesChoosingList,
        position
    };
}

export function updateTextStyleOfPages(style, enable, pagesChoosingList) {
    return {
        type: UPDATE_TEXT_STYLE_OF_PAGES,
        payload: {
            style,
            enable,
            pagesChoosingList
        }
    }
}

export function changeBackgroundForPage(pagePosition, backgroundId) {
    return {
        type: CHANGE_BACKGROUND_FOR_PAGE,
        payload: {
            pagePosition,
            backgroundId
        }
    }
}

export function changeBackgroundForAllPages(backgroundId) {
    return {
        type: CHANGE_BACKGROUND_FOR_ALL_PAGES,
        payload: {
            backgroundId
        }
    }
}