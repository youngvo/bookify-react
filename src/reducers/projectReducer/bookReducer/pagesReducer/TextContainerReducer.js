import undoable from 'redux-undo';

import { textContainerUndoTypes } from './../../../../reducers/undoReducer/UndoReducer';

import {
    UPDATE_TEXT
} from '../../../../actions/projectActions/bookActions/pagesActions/TextContainerActions';

const textContainerDefault = {
    $: {ref_id: ''},
    text: {},
    parsedText: {}
};

export default function textContainerReducer(textContainer = textContainerDefault, action) {
    switch (action.type) {
        case UPDATE_TEXT:
            return handleUpdateTextOfTextContainer(textContainer, action.payload);
        default:
            return textContainer;
    }
}

function handleUpdateTextOfTextContainer(textContainer, { idLayout, textObject }) {
    return {
        ...textContainer,
        $: {ref_id: idLayout},
        parsedText: textObject
    };
}

// export default undoable(textContainerReducer, {
//     undoType: textContainerUndoTypes.undo,
//     redoType: textContainerUndoTypes.redo
// });
