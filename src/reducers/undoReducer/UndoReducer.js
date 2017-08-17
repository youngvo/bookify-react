import {
    UPDATE_IMAGE_INTO_PAGE,
    REMOVE_IMAGE_IN_PAGE,
    UPDATE_TEXT_INTO_PAGE
} from './../../actions/projectActions/bookActions/pagesActions/PagesActions';

import {
    UPDATE_CURR_ACTION_INDEX,
    UNDO_REDO_IMAGE_CONTAINER,
    UNDO_REDO_TEXT_CONTAINER
} from './../../actions/undoActions/UndoActions';

const PRE_FIX = 'undo/';

export const imageContainerUndoTypes = {
    undo: PRE_FIX + 'UNDO_TYPE_IMAGE_CONTAINER',
    redo: PRE_FIX + 'REDO_TYPE_IMAGE_CONTAINER'
};

export const textContainerUndoTypes = {
    undo: PRE_FIX + 'UNDO_TYPE_TEXT_CONTAINER',
    redo: PRE_FIX + 'REDO_TYPE_TEXT_CONTAINER'
};
const actionsInfoDefault = {
    actions: [],
    currActionIndex: -1
};

function undoReducer(actionsInfo = actionsInfoDefault, action) {
    switch (action.type) {
        case UPDATE_IMAGE_INTO_PAGE:
        case REMOVE_IMAGE_IN_PAGE:
            return handleAddActionForImageContainer(actionsInfo, action.payload.page);
        case UPDATE_TEXT_INTO_PAGE:
            return handleAddActionForTextContainer(actionsInfo, action.payload.page);
        case UPDATE_CURR_ACTION_INDEX:
            return handleUpdateCurrActionIndex(actionsInfo, action.payload);
        default:
            return actionsInfo;
    }
}

function handleAddActionForImageContainer(actionsInfo, { idPage, idLayout }) {
    let actionsInfoResult = {...actionsInfo};
    let action = {
        type: UNDO_REDO_IMAGE_CONTAINER,
        payload: {
            idPage,
            idLayout,
            undoType: imageContainerUndoTypes.undo,
            redoType: imageContainerUndoTypes.redo,
            undoRedoType: ''
        }
    };

    pushActionTo(action, actionsInfoResult);

    return actionsInfoResult;
}

function handleAddActionForTextContainer(actionsInfo, { idPage, idLayout }) {
    let actionsInfoResult = {...actionsInfo};
    let action = {
        type: UNDO_REDO_TEXT_CONTAINER,
        payload: {
            idPage,
            idLayout,
            undoType: textContainerUndoTypes.undo,
            redoType: textContainerUndoTypes.redo,
            undoRedoType: ''
        }
    };

    pushActionTo(action, actionsInfoResult);

    return actionsInfoResult;
}

function handleUpdateCurrActionIndex(actionsInfo, { currActionIndex }) {
    let actionsInfoResult = {...actionsInfo};
    actionsInfoResult.currActionIndex = currActionIndex;
    return actionsInfoResult;
}

function pushActionTo(action, actionsInfo) {
    actionsInfo.actions = actionsInfo.actions.slice(0, actionsInfo.currActionIndex + 1);
    actionsInfo.actions.push(action);
}

export default undoReducer;
