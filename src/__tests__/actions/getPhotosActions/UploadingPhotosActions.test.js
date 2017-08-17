import React from 'react';
import {
    addUploaderToUploadingList,
    deleteUploadingPhotoWhenComplete,
    changeStatusUploading
} from './../../../actions/getPhotosActions/UploadingPhotosActions';
import {
    ADD_UPLOADER_TO_UPLOADING_LIST,
    DELETE_UPLOAD_WHEN_COMPLETE,
    CHANGE_STATUS_UPLOADING
} from './../../../actions/getPhotosActions/UploadingPhotosActions';

describe('Test action UploadingPhotosActions', () => {
    let uploaderType = 'uploaderType';
    let photos = {};
    let uploadingId = 123523;

    describe('test addUploaderToUploadingList action', () => {
        it('should have type "ADD_UPLOADER_TO_UPLOADING_LIST"', () => {
            expect(addUploaderToUploadingList().type).toEqual(ADD_UPLOADER_TO_UPLOADING_LIST);
        });

        it('should pass in "uploaderType", "photos" have passed', () => {
            expect(addUploaderToUploadingList(uploaderType, photos).uploaderType).toEqual(uploaderType);
            expect(addUploaderToUploadingList(uploaderType, photos).photos).toEqual(photos);
        });
    });

    describe('test deleteUploadingPhotoWhenComplete action', () => {
        it('should have type "DELETE_UPLOAD_WHEN_COMPLETE"', () => {
            expect(deleteUploadingPhotoWhenComplete().type).toEqual(DELETE_UPLOAD_WHEN_COMPLETE);
        });

        it('should pass in "uploadingId" have passed', () => {
            expect(deleteUploadingPhotoWhenComplete(uploadingId).uploadingId).toEqual(uploadingId);
            
        });
    });

    describe('test changeStatusUploading action', () => {
        it('should have type "CHANGE_STATUS_UPLOADING"', () => {
            expect(changeStatusUploading().type).toEqual(CHANGE_STATUS_UPLOADING);
        });

        it('should pass in "uploadingId" have passed', () => {
            expect(changeStatusUploading(uploadingId).uploadingId).toEqual(uploadingId);
        
        });
    });
});






