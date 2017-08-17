import {
    GET_PHOTOS,
    GET_PHOTOS_OF_INSTAGRAM,
    GET_PHOTOS_OF_500PX,
    GET_PHOTOS_OF_FLICKR,
    GET_PHOTOS_OF_SMUG,
} from '../../actions/getPhotosActions/PhotosActions';
import Utils from './../../utils/Utils';

/*
const photo = {
    id: '',
    name: '',
    picUrl: '',
    imageUrl: '',
    width: 0,
    height: 0,
    createdTime: '',
    updatedTime: '',
    albumId: ''
};
 */

//<photoId, photo>
var photosDefault = {};
export default function photosReducer(photos = photosDefault, action) {
    switch (action.type) {
        case 'INIT':
            return photosDefault;
        case GET_PHOTOS:
            return handleGetPhotos(photos, action.payload);
        case GET_PHOTOS_OF_INSTAGRAM:
            return handleGetPhotosOfInstagram(photos, action.payload);
        case GET_PHOTOS_OF_500PX:
            return handleGetPhotosOf500px(photos, action.payload);
        case GET_PHOTOS_OF_FLICKR:
            return handleGetPhotosOfFlickr(photos, action.payload);
		case GET_PHOTOS_OF_SMUG:
            return handleGetPhotosOfSmug(photos, action.payload);
        default:
        return photos;
    }
}

function handleGetPhotos(photos, { albumId, photoObjects }) {
    var result = {...photos};

    photoObjects.forEach(function (photoObject) {
        var photo = {};
        photo.id = photoObject.id;
        photo.name = photoObject.name;
        photo.picUrl = photoObject.picture;
        photo.imageUrl = photoObject.images[0].source;
        photo.width = photoObject.images[0].width;
        photo.height = photoObject.images[0].height;
        photo.createdTime = new Date(photoObject.created_time).toLocaleDateString();
        photo.updatedTime = new Date(photoObject.updated_time).toLocaleDateString();
        photo.albumId = albumId;

        result[photo.id] = photo;
    });

    return result;
}

function handleGetPhotosOfInstagram(photos, {albumId, photoObjects}){
    var result = {...photos};
    photoObjects.forEach(function (photoObject) {
        var photoCreatedDate = new Date(photoObject.created_time * 1000);

        var createdMonth = photoCreatedDate.getMonth();
        var monthText = Utils.getMonthName(createdMonth);
        var createdYear = photoCreatedDate.getFullYear();
        let photoName = monthText + "-" + createdYear;
        if (photoName === albumId) {
            var photo = {};
            photo.id = photoObject.id;
            photoObject.caption!== null ? photo.name = photoObject.caption.text : photo.name = '';
            photo.picUrl = photoObject.images.low_resolution.url;
            photo.imageUrl = photoObject.images.standard_resolution.url;
            photo.width = photoObject.images.standard_resolution.width;
            photo.height = photoObject.images.standard_resolution.height;
            photo.createdTime =new Date(photoObject.created_time * 1000).toLocaleDateString();
            photo.updatedTime = new Date(photoObject.created_time * 1000).toLocaleDateString();
            photo.albumId = albumId;
            
            result[photo.id] = photo;
        }
        
    });
    return result;
}

function handleGetPhotosOf500px(photoList, {albumId, photoObjects}){
    var result = {...photoList};

    var { photos } = photoObjects;

    photos.forEach(function (photoObject) {
        var photo = {};
        photo.id = photoObject.id;
        photo.name = photoObject.name;
        photo.picUrl = photoObject.images[0].url;
        photo.imageUrl = photoObject.images[1].url;
        photo.width = photoObject.width;
        photo.height = photoObject.height;
        photo.createdTime = new Date(photoObject.created_at).toLocaleDateString();
        photo.updatedTime = new Date(photoObject.created_at).toLocaleDateString();
        photo.albumId = albumId;

        result[photo.id] = photo;
    });
    return result;
}

function handleGetPhotosOfFlickr(photos, {albumId, photoObjects}){
    var result = {...photos};

    var { photo } = photoObjects;

    photo.forEach(function (photoObject) {
        var photoTemp = {};
        photoTemp.id = photoObject.id;
        photoTemp.name = photoObject.title;
        photoTemp.picUrl = photoObject.url_s;
        photoTemp.imageUrl = photoObject.url_o;
        photoTemp.width = photoObject.width_o;
        photoTemp.height = photoObject.height_o;
        photoTemp.createdTime = new Date(photoObject.datetaken).toLocaleDateString();
        photoTemp.updatedTime = new Date(photoObject.dateupload * 1000).toLocaleDateString();
        photoTemp.albumId = albumId;
        result[photoTemp.id] = photoTemp;
    });
    return result;
}

function handleGetPhotosOfSmug(photos, {albumId, photoObjects}){
    var result = {...photos};

    var { Images } = photoObjects

    Images.forEach(function (photoObject) {
        var photoTemp = {};
        photoTemp.id = photoObject.id;
        photoTemp.name = photoObject.FileName;
        photoTemp.picUrl = photoObject.ThumbURL;
        photoTemp.imageUrl = photoObject.LargeURL;
        photoTemp.width = photoObject.Width;
        photoTemp.height = photoObject.Height;
        photoTemp.createdTime = photoObject.LastUpdated;
        photoTemp.updatedTime = photoObject.LastUpdated;
        photoTemp.albumId = albumId;
        
        result[photoTemp.id] = photoTemp;
    });
    return result;
}
