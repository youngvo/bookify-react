const PRE_FIX = 'imageContainer/';
export const UPDATE = PRE_FIX + 'UPDATE';
export const CREATE = PRE_FIX + 'CREATE';
export const REMOVE_IMAGE = PRE_FIX + 'REMOVE_IMAGE';

export function update(idLayout, imageObject) {
    return {
        type: UPDATE,
        payload: {
            idLayout,
            imageObject
        }
    }
}

export function create(idLayout, imageObject) {
    return {
        type: CREATE,
        payload: {
            idLayout,
            imageObject
        }
    }
}

export function removeImage() {
    return {
        type: REMOVE_IMAGE
    }
}

const imageContainerActionCreators = {
    update,
    removeImage,
    create
};

export default imageContainerActionCreators;
