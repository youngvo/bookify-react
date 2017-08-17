// import FB from '../../services/FBServices';

import {
    GET_ALBUMS,
    GET_TAGGED_ALBUM,
    GET_PHOTOS_OF_ALBUM_SUCCESS,
    GET_INSTAGRAM_PHOTO_SUCCSESS,
    GET_SMUG_PHOTO_SUCCSESS,
    GET_FB_PHOTO_SUCCSESS,
    GET_INSTAGRAM_PHOTO_FAILED,
    GET_INSTAGRAM_ALBUM,
    GET_500PX_ALBUM,
    GET_FLICKR_ALBUM,
    GET_SMUGMUG_ALBUM,
} from '../../actions/getPhotosActions/AlbumsActions';
import LocaleUtils from './../../utils/LocaleUtils';
import Utils from './../../utils/Utils';
export const FB_TAGGED_ALBUM_ID = 'fb_tagged_photos';
export const FB_TAGGED_ALBUM_NAME = 'Facebook Tagged NormalAlbum';

export const INSTAGRAM_ALBUM_ID = 'INSTAGRAM_ALBUM_ID';
export const INSTAGRAM_ALBUM_NAME = 'INSTAGRAM_ALBUM_NAME';

export const PX500_ALBUM_ID = 'PX500_ALBUM_ID';
export const PX500_ALBUM_NAME = 'PX500_ALBUM_NAME';

export const FLICKR_ALBUM_ID = 'FLICKR_ALBUM_ID';
export var FLICKR_ALBUM_NAME = LocaleUtils.instance.translate('import.flickr.photostream.title');

export const albumTypes = {
    facebook:  'facebook',
    instagram: 'instagram',
    px500:     'px500',
    flickr:    'flickr',
    smugmug:   'smugmug',
}
/*
const album = {
    id: '',
    name: '',
    picUrls: [],
    photoIds: [],
    isGetPhotos: false,
    photoCount: 0
};
*/

//<albumId: album>
var albumsDefault = {};
export default function albumsReducer(albums = albumsDefault, action) {
    switch (action.type) {
         case 'INIT':
            return albumsDefault;
        case GET_ALBUMS:
            return handleGetAlbums(albums, action.payload);
        case GET_TAGGED_ALBUM:
            return handleGetTaggedAlbum(albums, action.payload);
        case GET_PHOTOS_OF_ALBUM_SUCCESS:
            return handleGetPhotosOfAlbumSuccess(albums, action.payload);
        case GET_SMUG_PHOTO_SUCCSESS:
            return handleGetPhotosOfSmugSuccess(albums, action.payload);
        case GET_FB_PHOTO_SUCCSESS:
            return handleGetPhotosOfFbSuccess(albums, action.payload);
        case GET_INSTAGRAM_ALBUM:
            return handleGetInstagramAlbum(albums, action.payload);
        case GET_500PX_ALBUM:
            return handleGet500PxAlbum(albums, action.payload);
        case GET_FLICKR_ALBUM:
            return handlerGetFlickrAlbum(albums, action.payload);
        case GET_SMUGMUG_ALBUM:
            return handlerGetSmugmugAlbum(albums, action.payload);
        default:
            return albums;
    }
}

function createAlbum(id, name, picUrls, photoIds, type, count = 0) {
    var album = {};
    album.id = id;
    album.name = name;
    album.picUrls = picUrls;
    album.photoIds = photoIds;
    album.isGetPhotos = false;
    album.type = type;
    album.photoCount = count;
    return album;
}

function handleGetAlbums(albums, { albumObjects }) {
    var result = {...albums};

    albumObjects.forEach(function(albumObject) {
         var photoIds = new Array();
        if (!albumObject.photos) {
            return;
        }
        // albumObject.photos.data.forEach(function(photoObject) {
        //     photoIds.push(photoObject.id);
        // });

        var album = createAlbum(albumObject.id, albumObject.name, [albumObject.picture.data.url], photoIds, albumTypes.facebook, albumObject.photo_count);
        result[album.id] = album;
    });

    return result;
}

function handleGetTaggedAlbum(albums, { taggedPhotos }) {
    if (taggedPhotos.length <= 0) {
      return albums;
    }

    var result = {...albums};

    var picUrls = [];
    let maxUrlsCount = taggedPhotos.length >= 4 ? 4 : taggedPhotos.length;
    for (let i = 0; i < maxUrlsCount; i++) {
        picUrls.push(taggedPhotos[i].picture);
    }

    var photoIds = [];

    var album = createAlbum(FB_TAGGED_ALBUM_ID, LocaleUtils.instance.translate('import.facebook.album.tagged'), picUrls, photoIds, albumTypes.facebook);
    result[album.id] = album;

    return result;
}

function handleGetInstagramAlbum(albums, { albumObjects }) {
    if (!albumObjects) {
        return albums;
    }

    if (albumObjects.length === 0 ) {
        return albums;
    }
    var result = {...albums};
    let period = [];
    albumObjects.forEach(function(photoObject) {
        var albumCreatedDate = new Date(photoObject.created_time * 1000);

        var createdMonth = albumCreatedDate.getMonth();
        var monthText = Utils.getMonthName(createdMonth);
        var createdYear = albumCreatedDate.getFullYear();
        let photoName = monthText + "-" + createdYear;
        if (period.indexOf(photoName) === -1) {
            period.push(photoName);

            var picUrls = [];
            picUrls.push(photoObject.images.thumbnail.url);

            var photoIds = [];
            let album = createAlbum(photoName, photoName, picUrls, photoIds, albumTypes.instagram);
            result[album.id] = album;
        }

        if (result[photoName]) {
            result[photoName].photoIds.push(photoObject.id);        
        }
    });

    return result;

}

function handleGet500PxAlbum(albums, { albumObjects }) {
    if (!albumObjects) {
        return albums;
    }

    if (albumObjects.length === 0 ) {
        return albums;
    }
    var { photos } = albumObjects;
    var result = {...albums};

    if (photos.length === 0) {
        var picUrls = [];
        var photoIds = [];
        var album = createAlbum(PX500_ALBUM_ID, LocaleUtils.instance.translate('import.flickr.photostream.title'), picUrls, photoIds, albumTypes.px500);
        result[album.id] = album;
        return result;
    }

    var picUrls = [];
        picUrls.push(photos[0].images[0].https_url);

    var photoIds = [];
    photos.forEach(function(photoObject) {
        photoIds.push(photoObject.id);
    });

    var album = createAlbum(PX500_ALBUM_ID, LocaleUtils.instance.translate('import.flickr.photostream.title'), picUrls, photoIds, albumTypes.px500);
    result[album.id] = album;
    return result;

}

function handlerGetFlickrAlbum(albums, { albumObjects }) {
    var { photo } = albumObjects
    if (!photo) {
        var result = {...albums};

        var picUrls = [];
        var photoIds = [];
        var album = createAlbum(FLICKR_ALBUM_ID, LocaleUtils.instance.translate('import.flickr.photostream.title'), picUrls, photoIds, albumTypes.flickr);
        result[album.id] = album;
        return result;
    }
    if (photo.length === 0) {
        return albums;
    }

    var result = {...albums};

    var picUrls = [];
        picUrls.push(photo[0].url_s);

    var photoIds = [];
    photo.forEach(function(photoObject) {
        photoIds.push(photoObject.id);
    });

    var album = createAlbum(FLICKR_ALBUM_ID, LocaleUtils.instance.translate('import.flickr.photostream.title'), picUrls, photoIds, albumTypes.flickr);
    result[album.id] = album;
    return result;
}

// function getPhotos(response) {
//     console.log('photos ',response);
// }

function handlerGetSmugmugAlbum(albums, { albumObjects }) {
    var result = {...albums};

    albumObjects.forEach(function(albumObject) {
        var albumKey = albumObject.Key;
        var albumIdTemp = albumObject.id;
        var albumId = albumIdTemp + '-' + albumKey;
    //https://testbookifyreact.smugmug.com/6056387538_BFzw6FR-Ti.jpg
    //https://www.smugmug.com/6056387511_7rLsb42-Ti.jpg
        var url;
        if (albumObject.Highlight) {
            let urlId = albumObject.Highlight.id;
            let urlKey = albumObject.Highlight.Key;
            url = `https://www.smugmug.com/${urlId}_${urlKey}-Ti.jpg`;
        }else {
            url = null;
        }
        var photoIds = new Array(albumObject.ImageCount);
        var album = createAlbum(albumId, albumObject.Title, [url], photoIds, albumTypes.smugmug);
        result[albumId] = album;
    });

    return result;
}


function handleGetPhotosOfAlbumSuccess(albums, { albumId }) {
    var result = {...albums};
    result[albumId].isGetPhotos = true;
    return result;
}

function handleGetPhotosOfSmugSuccess(albums, { albumId, photos }) {
    var result = {...albums};
    result[albumId].isGetPhotos = true;
    var { Images } = photos;
    let idsTemp = [];
    Object.values(Images).forEach(function (photo) {
        idsTemp.push(photo.id);
    });
    result[albumId].photoIds = idsTemp;
    return result;
}

function handleGetPhotosOfFbSuccess(albums, { albumId, photos }) {
    var result = {...albums};
    result[albumId].isGetPhotos = true;
    //var { data } = photos;
   
    let idsTemp = [];
    Object.values(photos).forEach(function (photo) {
        idsTemp.push(photo.id);
        //result[albumId].photoIds.push(photo.id);
    });
    var rest = result[albumId].photoIds.concat(idsTemp);
    result[albumId].photoIds = rest;
    return result;
}
