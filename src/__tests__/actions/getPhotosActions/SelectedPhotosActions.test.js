import React from 'react';
import {
    selectPhoto,
    deselectPhoto
} from './../../../actions/getPhotosActions/SelectedPhotosActions';
import {
    SELECT_PHOTO,
    DE_SELECT_PHOTO
} from './../../../actions/getPhotosActions/SelectedPhotosActions';

describe('Test action SelectedPhotosActions', () => {
    let photo = {};

    describe('test selectPhoto action', () => {
        it('should have type "SELECT_PHOTO"', () => {
            expect(selectPhoto().type).toEqual(SELECT_PHOTO);
        });

        it('should pass in "photo" have passed', () => {
            expect(selectPhoto(photo).payload).toEqual({photo});
        });
    });

    describe('test deselectPhoto action', () => {
        it('should have type "DE_SELECT_PHOTO"', () => {
            expect(deselectPhoto().type).toEqual(DE_SELECT_PHOTO);
        });

        it('should pass in "photo" have passed', () => {
            expect(deselectPhoto(photo).payload).toEqual({photo});
        });
    });
});

