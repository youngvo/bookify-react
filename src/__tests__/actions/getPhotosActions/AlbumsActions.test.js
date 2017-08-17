import React from 'react';
import {
    getAlbumsOfFB,
    getTaggedAlbumOfFB,
    getPhotosOfAlbumSuccess,
    getInstagramAlbum,
    getPhotosOfSmugSuccess,
    getPhotosOfInstagramFailed,
    get500pxAlbum,
    getFlickerAlbum,
    getSmugmugAlbum,
} from './../../../actions/getPhotosActions/AlbumsActions';
import {
    GET_ALBUMS,
    GET_TAGGED_ALBUM,
    GET_PHOTOS_OF_ALBUM_SUCCESS,
    GET_INSTAGRAM_ALBUM,
    GET_INSTAGRAM_PHOTO_FAILED,
    GET_500PX_ALBUM,
    GET_FLICKR_ALBUM,
    GET_SMUGMUG_ALBUM,
    GET_SMUG_PHOTO_SUCCSESS,
} from './../../../actions/getPhotosActions/AlbumsActions';

describe('test action AlbumsActions', () => {
    let albumObjects = {};
    let taggedPhotos = {};
    let albumId = "123551235";
    let photos = {};
    let meta = {};
    describe('test getAlbumsOfFB action', () => {
        it('should have type of GET_ALBUMS', () => {
            expect(getAlbumsOfFB().type).toEqual(GET_ALBUMS);
        });

        it('should pass in albumObjects have passed', () => {
            expect(getAlbumsOfFB(albumObjects).payload).toEqual({albumObjects});
        });
    });

    describe('test getTaggedAlbumOfFB action', () => {
        it('should have type of GET_TAGGED_ALBUM', () => {
            expect(getTaggedAlbumOfFB().type).toEqual(GET_TAGGED_ALBUM);
        });

        it('should pass in taggedPhotos have passed', () => {
            expect(getTaggedAlbumOfFB(taggedPhotos).payload).toEqual({taggedPhotos});
        });
    });

    describe('test getPhotosOfAlbumSuccess action', () => {
        it('should have type of GET_PHOTOS_OF_ALBUM_SUCCESS', () => {
            expect(getPhotosOfAlbumSuccess().type).toEqual(GET_PHOTOS_OF_ALBUM_SUCCESS);
        });

        it('should pass in albumId have passed', () => {
            expect(getPhotosOfAlbumSuccess(albumId).payload).toEqual({albumId});
        });
    });

    describe('test getInstagramAlbum action', () => {
        it('should have type of GET_INSTAGRAM_ALBUM', () => {
            expect(getInstagramAlbum().type).toEqual(GET_INSTAGRAM_ALBUM);
        });

        it('should pass in albumObjects have passed', () => {
            expect(getInstagramAlbum(albumObjects).payload).toEqual({albumObjects});
        });
    });

    describe('test getPhotosOfSmugSuccess action', () => {
        it('should have type of GET_SMUG_PHOTO_SUCCSESS', () => {
            expect(getPhotosOfSmugSuccess().type).toEqual(GET_SMUG_PHOTO_SUCCSESS);
        });

        it('should pass in albumId, photos have passed', () => {
            expect(getPhotosOfSmugSuccess(albumId, photos).payload).toEqual({albumId, photos});
        });
    });

    describe('test getPhotosOfInstagramFailed action', () => {
        it('should have type of GET_INSTAGRAM_PHOTO_FAILED', () => {
            expect(getPhotosOfInstagramFailed().type).toEqual(GET_INSTAGRAM_PHOTO_FAILED);
        });

        it('should pass in meta have passed', () => {
            expect(getPhotosOfInstagramFailed(meta).payload).toEqual(meta);
        });
    });

    describe('test get500pxAlbum action', () => {
        it('should have type of GET_500PX_ALBUM', () => {
            expect(get500pxAlbum().type).toEqual(GET_500PX_ALBUM);
        });

        it('should pass in albumObjects have passed', () => {
            expect(get500pxAlbum(albumObjects).payload).toEqual({albumObjects});
        });
    });

    describe('test getFlickerAlbum action', () => {
        it('should have type of GET_FLICKR_ALBUM', () => {
            expect(getFlickerAlbum().type).toEqual(GET_FLICKR_ALBUM);
        });

        it('should pass in albumObjects have passed', () => {
            expect(getFlickerAlbum(albumObjects).payload).toEqual({albumObjects});
        });
    });

    describe('test getSmugmugAlbum action', () => {
        it('should have type of GET_SMUGMUG_ALBUM', () => {
            expect(getSmugmugAlbum().type).toEqual(GET_SMUGMUG_ALBUM);
        });

        it('should pass in albumObjects have passed', () => {
            expect(getSmugmugAlbum(albumObjects).payload).toEqual({albumObjects});
        });
    });

});