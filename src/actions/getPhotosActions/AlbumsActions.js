export const GET_ALBUMS         = 'GET_ALBUMS';
export const GET_TAGGED_ALBUM   = 'GET_TAGGED_ALBUM';
export const GET_PHOTOS_OF_ALBUM_SUCCESS = 'GET_PHOTOS_OF_ALBUM_SUCCESS';
export const GET_INSTAGRAM_ALBUM   = 'GET_INSTAGRAM_ALBUM';
export const GET_INSTAGRAM_PHOTO_FAILED = 'GET_INSTAGRAM_PHOTO_FAILED';
export const GET_500PX_ALBUM   = 'GET_500PX_ALBUM';
export const GET_FLICKR_ALBUM   = 'GET_FLICKR_ALBUM';
export const GET_SMUGMUG_ALBUM   = 'GET_SMUGMUG_ALBUM';
export const GET_SMUG_PHOTO_SUCCSESS = 'GET_SMUG_PHOTO_SUCCSESS';
export const GET_FB_PHOTO_SUCCSESS = 'GET_FB_PHOTO_SUCCSESS';
export function getAlbumsOfFB(albumObjects) {
    return {
        type: GET_ALBUMS,
        payload: {
            albumObjects
        },
    };
}

export function getTaggedAlbumOfFB(taggedPhotos) {
    return {
        type: GET_TAGGED_ALBUM,
        payload: {
            taggedPhotos
        }
    };
}

export function getPhotosOfAlbumSuccess(albumId) {
    return {
        type: GET_PHOTOS_OF_ALBUM_SUCCESS,
        payload: {
            albumId
        }
    }
}

export function getInstagramAlbum(albumObjects) {
    return {
      type: GET_INSTAGRAM_ALBUM,
      payload: {
          albumObjects
      },
    }
}

export function getPhotosOfSmugSuccess(albumId, photos) {
    return {
      type: GET_SMUG_PHOTO_SUCCSESS,
      payload: {
          albumId,
          photos
      }
    }
}

export function getPhotosOfFbSuccess(albumId, photos) {
    return {
      type: GET_FB_PHOTO_SUCCSESS,
      payload: {
          albumId,
          photos
      }
    }
}

export function getPhotosOfInstagramFailed(meta) {
    return {
      type: GET_INSTAGRAM_PHOTO_FAILED,
      payload: meta
    }
}

export function get500pxAlbum(albumObjects) {
    return {
      type: GET_500PX_ALBUM,
      payload: {
          albumObjects
      },
    }
}

export function getFlickerAlbum(albumObjects) {
    return {
      type: GET_FLICKR_ALBUM,
      payload: {
          albumObjects
      },
    }
}

export function getSmugmugAlbum(albumObjects) {
    return {
      type: GET_SMUGMUG_ALBUM,
      payload: {
          albumObjects
      },
    }
}
