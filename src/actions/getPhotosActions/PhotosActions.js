export const GET_PHOTOS = 'GET_PHOTOS';
export const GET_PHOTOS_OF_INSTAGRAM = 'GET_PHOTOS_OF_INSTAGRAM';
export const GET_PHOTOS_OF_500PX = 'GET_PHOTOS_OF_500PX';
export const GET_PHOTOS_OF_FLICKR = 'GET_PHOTOS_OF_FLICKR';
export const GET_PHOTOS_OF_SMUG = 'GET_PHOTOS_OF_SMUG';

export function getPhotosOfAlbumById(albumId, photoObjects) {
    return {
        type: GET_PHOTOS,
        payload: {
            albumId,
            photoObjects
        }
    };
};

export function getPhotosOfInstagram(albumId, photoObjects) {
    return {
        type: GET_PHOTOS_OF_INSTAGRAM,
        payload: {
            albumId,
            photoObjects
        }
    };
};

export function getPhotosOf500px(albumId, photoObjects) {
    return {
        type: GET_PHOTOS_OF_500PX,
        payload: {
            albumId,
            photoObjects
        }
    };
};

export function getPhotosOfFlickr(albumId, photoObjects) {
    return {
        type: GET_PHOTOS_OF_FLICKR,
        payload: {
            albumId,
            photoObjects
        }
    };
};

export function getPhotosOfSumg(albumId, photoObjects) {
    return {
        type: GET_PHOTOS_OF_SMUG,
        payload: {
            albumId,
            photoObjects
        }
    };
};
