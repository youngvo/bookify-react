const PREFIX = "UploadingAction/"
export const ADD_UPLOADER_TO_UPLOADING_LIST = PREFIX + "ADD_UPLOADER_TO_UPLOADING_LIST";
export const DELETE_UPLOAD_WHEN_COMPLETE = PREFIX + "DELETE_UPLOAD_WHEN_COMPLETE";
export const CHANGE_STATUS_UPLOADING = PREFIX + "CHANGE_STATUS_UPLOADING";

export function addUploaderToUploadingList(uploaderType, photos) {
    return {
        type: ADD_UPLOADER_TO_UPLOADING_LIST,
        uploaderType,
        photos
    };
};

export function deleteUploadingPhotoWhenComplete(uploadingId) {
    return {
        type: DELETE_UPLOAD_WHEN_COMPLETE,
        uploadingId
    };
};

export function changeStatusUploading(uploadingId) {
    return {
        type: CHANGE_STATUS_UPLOADING,
        uploadingId
    };
};