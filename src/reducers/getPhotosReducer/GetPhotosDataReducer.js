import albumsReducer from './AlbumsReducer';
import photosReducer from './PhotosReducer';
import selectedPhotosReducer    from './SelectedPhotosReducer';
import uploadingPhotosReducer   from './UploadingPhotosReducer';

let getPhotosDataDefault = {
    albums: {}, //{albumId: album}
    photos: {}, //{photoId: photo}
    selectedPhotos: {}, //{photoId: photo}
    uploadingPhotos: [] //[{photoType, photos[]}]
};
export default function getPhotosReducer(getPhotosData = getPhotosDataDefault, action) {
    return {
        albums: albumsReducer(getPhotosData.albums, action),
        photos: photosReducer(getPhotosData.photos, action),
        selectedPhotos: selectedPhotosReducer(getPhotosData.selectedPhotos, action),
        uploadingPhotos: uploadingPhotosReducer(getPhotosData.uploadingPhotos, action)
    };
};
