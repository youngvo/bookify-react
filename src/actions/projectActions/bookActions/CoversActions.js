const PREX_FIX = 'covers/';
export const SET_COVERS = PREX_FIX + 'SET_COVERS';
export const ADD_NEW_IMAGE_INTO_COVER = PREX_FIX + 'ADD_NEW_IMAGE_INTO_COVER';
export const SET_COVER_TYPE = PREX_FIX + 'SET_COVER_TYPE';
export const SET_COVER_LAYOUT_INTO_BOOK = PREX_FIX + 'SET_COVER_LAYOUT_INTO_BOOK';
export const UPDATE_IMAGE_INTO_COVER = PREX_FIX + 'UPDATE_IMAGE_INTO_COVER';
export const UPDATE_TEXT_INTO_COVER = PREX_FIX + 'UPDATE_TEXT_INTO_COVER';
export const REMOVE_IMAGE_IN_COVER = PREX_FIX + 'REMOVE_IMAGE_IN_COVER';
export const CHANGE_BACKGROUND_COLOR_FOR_COVER = PREX_FIX + 'CHANGE_BACKGROUND_COLOR_FOR_COVER';

export function setCovers(coverInfo, backCover, backFlap, frontCover, frontFlap, spine) {
    return {
        type: SET_COVERS,
        payload: {
            coverInfo, backCover, backFlap, frontCover, frontFlap, spine
        }
    }
}

export function addNewImageIntoCover(cover) {
    return {
        type: ADD_NEW_IMAGE_INTO_COVER,
        payload: { cover }
    }
}

export function setCoverType(coverType) {
    return {
        type: SET_COVER_TYPE,
        payload: { coverType }
    }
}

export function setCoverLayout(idPage, newLayout) {
    return {
        type: SET_COVER_LAYOUT_INTO_BOOK,
        payload: {
            idPage,
            newLayout
        }
    }
}


export function updateTextIntoCover(cover) {
    return {
        type: UPDATE_TEXT_INTO_COVER,
        payload: {
            cover
        }
    }
}

export function updateImageIntoCover(cover) {
    return {
        type: UPDATE_IMAGE_INTO_COVER,
        payload: {
            cover
        }
    }
}

export function removePhotoInCover(cover) {
    return {
        type: REMOVE_IMAGE_IN_COVER,
        payload: {
            cover
        }
    }
}

export function changeBackgroundColorForCover(backgroundId) {
    return {
        type: CHANGE_BACKGROUND_COLOR_FOR_COVER,
        payload: {
            backgroundId
        }
    }
}