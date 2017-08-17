const PRE_FIX = 'textContainer/';
export const UPDATE_TEXT = PRE_FIX + 'UPDATE_TEXT';

function updateText(idLayout, textObject) {
    return {
        type: UPDATE_TEXT,
        payload: {
            idLayout,
            textObject
        }
    }
}

const textContainerActionCreators = {
    updateText
};

export default textContainerActionCreators;
