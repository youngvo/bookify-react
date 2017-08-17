import {
    ADD_UPLOADER_TO_UPLOADING_LIST,
    DELETE_UPLOAD_WHEN_COMPLETE,
    CHANGE_STATUS_UPLOADING
} from './../../actions/getPhotosActions/UploadingPhotosActions';
import { photoTypes } from './../../constants/Constants';

const uploadingPhotosDefault = []; //[{id, uploaderType, photos[], uploadSize}]

export default function (uploadingPhotos = uploadingPhotosDefault, action) {
    switch (action.type) {
        case ADD_UPLOADER_TO_UPLOADING_LIST:
            return handleAddUploadPhoto(uploadingPhotos, action);
        case DELETE_UPLOAD_WHEN_COMPLETE:
            return deleteUploadWhenComplete(uploadingPhotos, action);
        case CHANGE_STATUS_UPLOADING:
            return changeStatusUploading(uploadingPhotos, action);
        default:
            return uploadingPhotos;
    }
};

const handleAddUploadPhoto = (uploadingPhotos, action) => {
    let photosSize = 0;
    let lastUploadingId = uploadingPhotos.length > 0 ? uploadingPhotos[uploadingPhotos.length - 1].id : 0;
    
    if (action.uploaderType === photoTypes.COMPUTER) {
        action.photos.map(photo => {
            photosSize += photo.size;
        });
    } else {
        photosSize = action.photos.length;
    }

    let uploadingPhotoVO = {
        id: ++lastUploadingId,
        uploadType: action.uploaderType,
        photos: action.photos,
        size: photosSize,
        isUploading: false
    }
    uploadingPhotos.push(uploadingPhotoVO);
    return uploadingPhotos;
}

const deleteUploadWhenComplete = (uploadingPhotos, action) => {
    return uploadingPhotos.filter(uploading => uploading.id !== action.uploadingId);
}

const changeStatusUploading = (uploadingPhotos, action) => {
    for (let i = uploadingPhotos.length - 1; i--;) {
        if (uploadingPhotos[i].id === action.uploadingId) {
            uploadingPhotos[i].isUploading = true;
        }
    }
    return uploadingPhotos;
}
