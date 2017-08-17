import React, { Component } from 'react';
import { connect } from 'react-redux';

import './SelectingImages.css';
import LocaleUtils from './../../../../utils/LocaleUtils';
import NormalAlbum from '../../../../components/getPhotosForBook/albumTypes/normalAlbum/NormalAlbum';
import PhotoList from '../../../../components/getPhotosForBook/photoList/PhotoList';

import { getPhotosOfAlbumById,
        //  getPhotosOfTaggedAlbum,
         getPhotosOfInstagram,
         getPhotosOf500px,
         getPhotosOfFlickr,
         getPhotosOfSumg,
} from '../../../../actions/getPhotosActions/PhotosActions';
import { getPhotosOfAlbumSuccess, getPhotosOfSmugSuccess, getPhotosOfFbSuccess } from '../../../../actions/getPhotosActions/AlbumsActions';
import { selectPhoto, deselectPhoto } from '../../../../actions/getPhotosActions/SelectedPhotosActions';

import FBServices from '../../../../services/FBServices';
import InstagramServices from '../../../../services/InstagramServices';
import PX500Services from '../../../../services/PX500Services';
import FlickrServices from '../../../../services/FlickrServices';
import SmugmugServices from '../../../../services/SmugmugServices';

import {photoTypes} from './../../../../constants/Constants';

import {
    FB_TAGGED_ALBUM_ID,
    INSTAGRAM_ALBUM_ID,
    PX500_ALBUM_ID,
    FLICKR_ALBUM_ID,
} from '../../../../reducers/getPhotosReducer/AlbumsReducer';

class SelectingImages extends Component {
    // constructor(props){
    //     super(props)
    // }
    componentDidMount() {
        const {currentAlbumChooseId, albums, getPhotosOfAlbum , albumType } = this.props;
        let album = this.getCurrentAlbumChoose(currentAlbumChooseId, albums);
        getPhotosOfAlbum(album, albumType);
    }

    renderBackToAlbumListButton(album, backToAlbumList) {
        return (
            <div className="list-photo-left">
                <div className="see-all-album-wrapper">
                    <span className="triangle1"></span>
                    <div className="see-all-album" onClick={backToAlbumList}> { LocaleUtils.instance.translate('import.button.see_all_sets', {0: LocaleUtils.instance.translate('import.picasa.album.plural')}) }</div>
                </div>
                {<NormalAlbum album={album} />}
            </div>
        );
    }

    getPhotosByPhotoIds(photoIds, photos, selectedPhotos) {
        return (
            photoIds.map((photoId) => {
                let photo = photos[photoId];
                if (photo) {
                    photo.isSelected = !!selectedPhotos[photoId];
                    return photo;
                }
            })
        );
    }

    getCurrentAlbumChoose(currentAlbumChooseId, albums) {
        return albums[currentAlbumChooseId];
    }

    render() {
        const { currentAlbumChooseId, albums, photos, selectedPhotos, backToAlbumList, onPhotoCellClick } = this.props;
        let album = this.getCurrentAlbumChoose(currentAlbumChooseId, albums);

        return (
            <div className="list-photo-container">
                {this.renderBackToAlbumListButton(album, backToAlbumList)}
                <div className="list-photo-right">
                    <div className="content-left-content">
                        {album.isGetPhotos && <PhotoList
                            isSelected={false}
                            photos={this.getPhotosByPhotoIds(album.photoIds, photos, selectedPhotos)}
                            onPhotoCellClick={onPhotoCellClick}
                        />}
                    </div>
                </div>
            </div>
        );
    }
}

const getPhotosSuccess = (dispatch, id, response) => {
    var data ;
    if (response.photos) {
        data = response.photos.data;
    } else {
        data = response.data;
    }
    if(response.count <= 100){ 
        dispatch(getPhotosOfAlbumById(id, data));
        dispatch(getPhotosOfFbSuccess(id, data));
        return;
    }
    if((response.photos && response.photos.paging.next != undefined) || ( response && response.paging.next)) {
        FBServices.getInstance().getPhotosOfAlbum(null, getPhotosSuccess.bind(this, dispatch, id), response);

    }
    dispatch(getPhotosOfAlbumById(id, data));
    dispatch(getPhotosOfFbSuccess(id, data));
}

const getPhotosTaggedSuccess = (dispatch, response) => {
    var {data} = response;
    dispatch(getPhotosOfAlbumById(FB_TAGGED_ALBUM_ID, data));
    dispatch(getPhotosOfFbSuccess(FB_TAGGED_ALBUM_ID, data));
}

const getInsPhotosSuccess = (dispatch, id, response) => {
    const { data } = response;
    dispatch(getPhotosOfInstagram(id, data));
    dispatch(getPhotosOfAlbumSuccess(id));
}

const get500PxPhotosSuccess = (dispatch, response) => {
    const { data } = response;
    dispatch(getPhotosOf500px(PX500_ALBUM_ID, data));
    dispatch(getPhotosOfAlbumSuccess(PX500_ALBUM_ID));
}

const getFlickrPhotosSuccess = (dispatch, response) => {
    console.log('getUserPhoto Flick',response);
    var { photos } = response;
    dispatch(getPhotosOfFlickr(FLICKR_ALBUM_ID, photos));
    dispatch(getPhotosOfAlbumSuccess(FLICKR_ALBUM_ID));
}

const getSmugPhotosSuccess = (dispatch, album, response) => {
    var { Album } = response
    dispatch(getPhotosOfSumg(album.id, Album));
    dispatch(getPhotosOfSmugSuccess(album.id, Album));
}

const getPhotosOfAlbum = (dispatch, album, sourcePhoto) => {
    if (album.picUrls.length === 0 || album.isGetPhotos) {
        return ;
    }
        let getPhotosSuccessBinded = getPhotosSuccess.bind(this, dispatch, album.id);
        let getPhotosTaggedSuccessBinded = getPhotosTaggedSuccess.bind(this, dispatch);
        let getInsPhotosSuccessBinded = getInsPhotosSuccess.bind(this, dispatch, album.id);
        let get500PxPhotosSuccessBinded = get500PxPhotosSuccess.bind(this, dispatch);
        let getFlickrPhotosSuccessBinded = getFlickrPhotosSuccess.bind(this, dispatch);
        let getSmugPhotosSuccessBinded = getSmugPhotosSuccess.bind(this, dispatch, album);
    switch (sourcePhoto) {
        case photoTypes.FACEBOOK:
            if (album.id !== FB_TAGGED_ALBUM_ID) {
                FBServices.getInstance().getPhotosOfAlbum(album.id, getPhotosSuccessBinded);
            } else {
                FBServices.getInstance().getPhotosOfTaggedAlbum(getPhotosTaggedSuccessBinded);
            }
            break;
        case photoTypes.INSTAGRAM:
            InstagramServices.getInstance().getUserPhotos(getInsPhotosSuccessBinded);
            break;
        case photoTypes.PX500:
            PX500Services.getInstance().getUserPhotos(get500PxPhotosSuccessBinded);
            break;
        case photoTypes.FLICKR:
            FlickrServices.getInstance().getUserPhotos(getFlickrPhotosSuccessBinded)
            break;
        case photoTypes.SMUGSMUG:
            var hashes = album.id.split('-');
            let albumID = hashes[0];
            let  albumKey= hashes[1];
            SmugmugServices.getInstance().getUserPhotosByAlbumId(albumID, albumKey, getSmugPhotosSuccessBinded)
            break;
      default:
    }
}

const onPhotoCellClick = (dispatch, photo, isSelected) => {
    isSelected ? dispatch(selectPhoto(photo)) : dispatch(deselectPhoto(photo));
}

const mapStateToProps = (state) => {
    const { getPhotosData } = state;
    const { albums, photos, selectedPhotos } = getPhotosData;
    return {
        albums,
        photos,
        selectedPhotos: selectedPhotos.selectedPhotos
    };
}

const mapDispatchToProps = (dispatch) => ({
    getPhotosOfAlbum: getPhotosOfAlbum.bind(this, dispatch),
    onPhotoCellClick: onPhotoCellClick.bind(this, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SelectingImages);
