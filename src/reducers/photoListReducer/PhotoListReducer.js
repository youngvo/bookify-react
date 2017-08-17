import xml2js from 'xml2js';
import { photoTypes } from './../../constants/Constants';
import Utils from './../../utils/Utils';

import {
    ADD_PHOTOS_BY_COMPUTER_BEFORE_UPLOADING,
    ADD_PHOTOS_BY_SERVICE_BEFORE_UPLOADING,
    ADD_PHOTOS_BY_COMPUTER,
    ADD_PHOTOS_BY_SERVICE,
    ADD_PHOTOS_BY_LOADING_PROJECT,
    DELETE_PHOTO_CARD
} from './../../actions/photoListActions/PhotoListActions';

//<url:photo> (photo = {baseId, id, name, picUrl, imageUrl, contentType, size, createdTime, updatedTime, width, height})
let photoListDefault = {};

export default function photoListReducer(photoList = photoListDefault, action) {

    switch (action.type) {
        case ADD_PHOTOS_BY_COMPUTER_BEFORE_UPLOADING:
            return handleAddPhotosByComputerBeforeUploading(photoList, action.payload);
        case ADD_PHOTOS_BY_SERVICE_BEFORE_UPLOADING:
            return handleAddPhotosByServiceBeforeUploading(photoList, action.payload);
        case ADD_PHOTOS_BY_COMPUTER:
            return handleAddPhotosByComputer(photoList, action.payload);
        case ADD_PHOTOS_BY_SERVICE:
            return handleAddPhotosByService(photoList, action.payload);
        case ADD_PHOTOS_BY_LOADING_PROJECT:
            return handleAddPhotosByLoadingProject(photoList, action.payload);
        case DELETE_PHOTO_CARD:
            return handleDeletePhoto(photoList, action.photoId);
        default:
            return photoList;
    }
}

function createPhoto(baseId, id, name, picUrl, imageUrl, contentType, size, createdTime, updatedTime, width, height) {
    return {
        baseId,
        id,
        name,
        picUrl,
        imageUrl,
        contentType,
        size,
        createdTime,
        updatedTime,
        width,
        height
    }
}

function handleAddPhotosByComputerBeforeUploading(photoList, { photos }) {
    let photoListResult = {...photoList};

    photos.forEach((photo) => {
        const newPhoto = createPhoto(photo.name, '', photo.name, photo.preview, photo.preview,
                                     photo.type, photo.size, '', photo.lastModified, 0, 0);

        photoListResult[newPhoto.baseId] = newPhoto;
    });

    return photoListResult;
}

function handleAddPhotosByServiceBeforeUploading(photoList, { photos, uploadType }) {
    let photoListResult = {...photoList};

    photos.forEach((photo) => {
        let baseId = photo.imageUrl;
        if (uploadType !== photoTypes.PX500) {
            baseId = Utils.getImageNameFromImageUrl(photo.imageUrl);
        }

        const newPhoto = createPhoto(baseId, '', photo.name, photo.picUrl, photo.imageUrl,
                                     '', 0, photo.createdTime, photo.updatedTime, photo.width, photo.height);

        photoListResult[newPhoto.baseId] = newPhoto;
    });

    return photoListResult;
}

function parsePhotoSourceOfComputer(photoSourceFromComputer) {
    let photo = null;

    xml2js.parseString(photoSourceFromComputer, function (err, json) {
        const photoRes = json.response.photo[0];
        const baseId = photoRes['filename'][0];

        photo = createPhoto(baseId, photoRes['id'][0], photoRes['filename'][0],
                            photoRes['url'][0], photoRes['url'][0].replace('T', 'L'), photoRes['content-type'][0],
                            photoRes['size'][0], photoRes['date-uploaded'][0], photoRes['date-taken'][0],
                            photoRes['width'][0], photoRes['height'][0]);
    });

    return photo;
}

function handleAddPhotosByComputer(photoList, { photoSourceFromComputer }) {
    const photo = parsePhotoSourceOfComputer(photoSourceFromComputer);

    if (!photo) return photoList;

    let photoListResult = {...photoList};
    photoListResult[photo.baseId] = photo;

    return photoListResult;
}

function handleAddPhotosByService(photoList, { photosSourceFromService }) {
    let photoListResult = {...photoList};

    photosSourceFromService.forEach(function(photoSource) {
        const photoInfo = photoSource['photo'][0];
        const photoSourceUrl = photoSource['url'][0];

        let baseId = photoInfo['filename'][0];
        if (photoSourceUrl.indexOf('500px') >= 0) {
            baseId = photoSourceUrl;
        }

        let photo = createPhoto(baseId, photoInfo['id'][0], photoInfo['filename'][0],
                                photoInfo['url'][0], photoInfo['url'][0].replace('T', 'L'), photoInfo['content-type'][0],
                                photoInfo['size'][0], (new Date(photoInfo['created-at'][0])).toString(), photoInfo['date-taken'][0],
                                photoInfo['width'][0], photoInfo['height'][0]);

        photoListResult[photo.baseId] = photo;
    });

    return photoListResult;
}

function handleAddPhotosByLoadingProject(photoList, { photosSourceFromProject }) {
    let photoListResult = {...photoList};

    photosSourceFromProject.forEach((photoSource) => {
        let newPhoto = createPhoto(photoSource['filename'][0], photoSource.id[0], photoSource['filename'][0],
                                    photoSource.url[0], photoSource.urls[0].large[0], photoSource['content-type'][0],
                                    photoSource.size[0], photoSource['created-at'][0], photoSource['date-taken'][0],
                                    photoSource['width'][0], photoSource['height'][0]);

        photoListResult[newPhoto.baseId] = newPhoto;
    });

    return photoListResult;
}

// function handleAddPhotos(photoList, photos, uploadType) {
//     console.log('handleAddPhotos: ', photos);
//
//     let result = { ...photoList };
//     for (let index in photos) {
//         const photo = photos[index];
//
//         if (uploadType === photoTypes.PX500){
//             result[photo.id] = photo;
//         } else {
//             result[photo.name] = photo;
//         }
//     }
//
//     return result;
// }

function handleDeletePhoto(photoList, basePhotoId) {
    let newPhotoList = {...photoList};
    delete newPhotoList[basePhotoId];
    
    return newPhotoList;
}
