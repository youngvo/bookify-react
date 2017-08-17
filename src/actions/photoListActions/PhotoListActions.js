const PRE_FIX = 'photoList/';

export const ADD_PHOTOS_BY_COMPUTER_BEFORE_UPLOADING = PRE_FIX + 'ADD_PHOTOS_BY_COMPUTER_BEFORE_UPLOADING';
export const ADD_PHOTOS_BY_SERVICE_BEFORE_UPLOADING = PRE_FIX + 'ADD_PHOTOS_BY_SERVICE_BEFORE_UPLOADING';
export const ADD_PHOTOS_BY_COMPUTER = PRE_FIX + 'ADD_PHOTOS_BY_COMPUTER';
export const ADD_PHOTOS_BY_SERVICE = PRE_FIX + 'ADD_PHOTOS_BY_SERVICE';
export const ADD_PHOTOS_BY_LOADING_PROJECT = PRE_FIX + 'ADD_PHOTOS_BY_LOADING_PROJECT';
export const DELETE_PHOTO_CARD = PRE_FIX + 'DELETE_PHOTO_CARD';

export function photoListAct_addPhotosByComputerBeforeUploading(photos) {
    return {
        type: ADD_PHOTOS_BY_COMPUTER_BEFORE_UPLOADING,
        payload: {
            photos
        }
    };
}

export function photoListAct_addPhotosByServiceBeforeUploading(photos, uploadType) {
    return {
        type: ADD_PHOTOS_BY_SERVICE_BEFORE_UPLOADING,
        payload: {
            photos,
            uploadType
        }
    };
}

export function photoListAct_addPhotosByComputer(photoSourceFromComputer) {
    return {
        type: ADD_PHOTOS_BY_COMPUTER,
        payload: {
            photoSourceFromComputer
        }
    };
}

export function photoListAct_addPhotosByService(photosSourceFromService) {
    return {
        type: ADD_PHOTOS_BY_SERVICE,
        payload: {
            photosSourceFromService
        }
    };
}

export function photoListAct_addPhotosByLoadingProject(photosSourceFromProject) {
    return {
        type: ADD_PHOTOS_BY_LOADING_PROJECT,
        payload: {
            photosSourceFromProject
        }
    };
}

export function photoListAct_deletePhoto(photoId) {
    return {
        type: DELETE_PHOTO_CARD,
        photoId
    };
}
