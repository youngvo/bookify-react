import undoable from 'redux-undo';
import Utils from './../../../../utils/Utils';
import { imageContainerUndoTypes } from './../../../../reducers/undoReducer/UndoReducer';
import { FIT_POLICY } from './../../../../constants/Constants'

import {
    UPDATE,
    REMOVE_IMAGE,
    CREATE
} from '../../../../actions/projectActions/bookActions/pagesActions/ImageContainerActions';

const imageContainerDefault = {
    $: {ref_id: ''},
    Image: {
        src: '',
        fit_policy: FIT_POLICY.FILL,
        rotation: 0,
        x_shift: 0,
        y_shift: 0,
        zoom_level: '100',
        image_source_id: ''
    }
};

export default function imageContainerReducerUndo(imageContainer = imageContainerDefault, action) {
    switch (action.type) {
        case CREATE:
            return handleAddImageContainer(imageContainer, action.payload);
        case UPDATE:
            return handleUpdateImageContainer(imageContainer, action.payload);
        case REMOVE_IMAGE:
            return handleRemoveImageOfImageContainer(imageContainer);
        default:
            return imageContainer;
    }
}

function handleAddImageContainer(imageContainer, { idLayout, imageObject }) {
    let imageContainerResult = {...imageContainer};

    imageContainerResult.Image = imageContainerDefault.Image;
    imageContainerResult.Image.src = Utils.replaceLowImageByOrigin(imageObject.imageUrl);
    imageContainerResult.Image.image_source_id = imageObject.baseId;

    return imageContainerResult;
}

function handleUpdateImageContainer(imageContainer, { idLayout, imageObject }) {
    console.log("imageObject in reducer::::", imageObject)
    let imageContainerResult = {...imageContainer};

    // imageContainerResult.$.ref_id = idLayout;
    imageContainerResult.Image.src = Utils.replaceLowImageByOrigin(imageObject.imageUrl);
    imageContainerResult.Image.image_source_id = imageObject.baseId;
    imageContainerResult.Image.fit_policy = imageObject.fit_policy;
    imageContainerResult.Image.rotation = imageObject.rotation;
    imageContainerResult.Image.x_shift = imageObject.x_shift;
    imageContainerResult.Image.y_shift = imageObject.y_shift;
    imageContainerResult.Image.zoom_level = imageObject.zoom_level;

    return imageContainerResult;
}

function handleRemoveImageOfImageContainer(imageContainer) {
    let imageContainerResult = {...imageContainer};
    imageContainerResult.Image = {};
    return imageContainerResult;
}

// export default undoable(imageContainerReducerUndo, {
//     undoType: imageContainerUndoTypes.undo,
//     redoType: imageContainerUndoTypes.redo
// });
