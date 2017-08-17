import {
    SELECT_PHOTO, DE_SELECT_PHOTO
} from '../../actions/getPhotosActions/SelectedPhotosActions';

/*
const photo = {
    id: '',
    name: '',
    picUrl: '',
    imageUrl: '',
    width: 0,
    height: 0,
    createTime: '',
    updateTime: '',
    albumId: ''
};
*/

var selectedPhotosDefault = {
    selectedPhotos: {}, //<photoId: photo>
    albumsSelectedCount: {}, //<albumId, selectedCount>
    isSelectAll: 0,
};
export default function selectedPhotosReducer(selectedPhotos = selectedPhotosDefault, action) {
    switch (action.type) {
        case 'INIT':
        console.log('Init');
            return selectedPhotosDefault;
        case SELECT_PHOTO:
            return handleSelectPhoto(selectedPhotos, action.payload);
        case DE_SELECT_PHOTO:
            return handleDeselectPhoto(selectedPhotos, action.payload);
        default: return selectedPhotos;
    }
}

function handleSelectPhoto(selectedPhotos, { photo }) {
    var selectedPhotosResult = {...selectedPhotos.selectedPhotos};
    var albumsSelectedCountResult = {...selectedPhotos.albumsSelectedCount};

    selectedPhotosResult[photo.id] = photo;
    albumsSelectedCountResult[photo.albumId] ? albumsSelectedCountResult[photo.albumId]++ : albumsSelectedCountResult[photo.albumId] = 1;

    return {
        selectedPhotos: selectedPhotosResult,
        albumsSelectedCount: albumsSelectedCountResult,
        isSelectAll: 0
    };
}

function handleDeselectPhoto(selectedPhotos, { photo }) {
    var selectedPhotosResult = {...selectedPhotos.selectedPhotos};
    var albumsSelectedCountResult = {...selectedPhotos.albumsSelectedCount};

    delete selectedPhotosResult[photo.id];

    if (albumsSelectedCountResult[photo.albumId]) {
        albumsSelectedCountResult[photo.albumId]--;

        if (albumsSelectedCountResult[photo.albumId] <= 0) {
            delete albumsSelectedCountResult[photo.albumId];
        }
    }

    return {
        selectedPhotos: selectedPhotosResult,
        albumsSelectedCount: albumsSelectedCountResult,
        isSelectAll: 0
    };
}
