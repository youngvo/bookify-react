const PRE_FIX = 'undo/';

export const UNDO_REDO_IMAGE_CONTAINER = PRE_FIX + 'UNDO_REDO_IMAGE_CONTAINER';
export const UNDO_REDO_TEXT_CONTAINER = PRE_FIX + 'UNDO_REDO_TEXT_CONTAINER';

export const UPDATE_CURR_ACTION_INDEX = PRE_FIX + 'UPDATE_CURR_ACTION_INDEX';

export function updateCurrActionIndex(currActionIndex) {
    return {
        type: UPDATE_CURR_ACTION_INDEX,
        payload: {
            currActionIndex
        }
    }
}
