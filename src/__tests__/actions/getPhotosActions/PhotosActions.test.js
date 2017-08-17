import React from 'react';
import {
    getPhotosOfAlbumById,
    getPhotosOfInstagram,
    getPhotosOf500px,
    getPhotosOfFlickr,
    getPhotosOfSumg
} from './../../../actions/getPhotosActions/PhotosActions';
import {
    GET_PHOTOS,
    GET_PHOTOS_OF_INSTAGRAM,
    GET_PHOTOS_OF_500PX,
    GET_PHOTOS_OF_FLICKR,
    GET_PHOTOS_OF_SMUG,
} from './../../../actions/getPhotosActions/PhotosActions';

describe('Test action PhotosActions', () => {
    let albumObjects = {};
    let photoObjects = {};
    let albumId = "123551235";
    let photos = {};
    let meta = {};

    describe('test getPhotosOfAlbumById action', () => {
        it('should have type of "GET_PHOTOS"', () => {
            expect(getPhotosOfAlbumById().type).toEqual(GET_PHOTOS);
        });

        it('should pass in albumId, photoObjects have passed ', () => {
            expect(getPhotosOfAlbumById(albumId, photoObjects).payload).toEqual({albumId, photoObjects});
        });
    });

    describe('test getPhotosOfInstagram action', () => {
        it('should have type of "GET_PHOTOS_OF_INSTAGRAM"', () => {
            expect(getPhotosOfInstagram().type).toEqual(GET_PHOTOS_OF_INSTAGRAM);
        });

        it('should pass in albumId, photoObjects have passed ', () => {
            expect(getPhotosOfInstagram(albumId, photoObjects).payload).toEqual({albumId, photoObjects});
        });
    });

    describe('test getPhotosOf500px action', () => {
        it('should have type of "GET_PHOTOS_OF_500PX"', () => {
            expect(getPhotosOf500px().type).toEqual(GET_PHOTOS_OF_500PX);
        });

        it('should pass in albumId, photoObjects have passed ', () => {
            expect(getPhotosOf500px(albumId, photoObjects).payload).toEqual({albumId, photoObjects});
        });
    });

    describe('test getPhotosOfFlickr action', () => {
        it('should have type of "GET_PHOTOS_OF_FLICKR"', () => {
            expect(getPhotosOfFlickr().type).toEqual(GET_PHOTOS_OF_FLICKR);
        });

        it('should pass in albumId, photoObjects have passed ', () => {
            expect(getPhotosOfFlickr(albumId, photoObjects).payload).toEqual({albumId, photoObjects});
        });
    });

    describe('test getPhotosOfSumg action', () => {
        it('should have type of "GET_PHOTOS_OF_SMUG"', () => {
            expect(getPhotosOfSumg().type).toEqual(GET_PHOTOS_OF_SMUG);
        });

        it('should pass in albumId, photoObjects have passed ', () => {
            expect(getPhotosOfSumg(albumId, photoObjects).payload).toEqual({albumId, photoObjects});
        });
    });
})