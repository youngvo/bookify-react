import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import { showStartSelectPhoto } from '../../../actions/appStatusActions/RootStatusActions'
import Asset from './../../../assets/Assets';
import SelectingAlbums from './selectingAlbums/SelectingAlbums';
import SelectingImages from './selectingImages/SelectingImages';
import LocaleUtils from './../../../utils/LocaleUtils';
import Config from './../../../config/Config';

import FBServices from './../../../services/FBServices';
import SmugmugServices from './../../../services/SmugmugServices';
import InstagramServices from './../../../services/InstagramServices';
import PX500Services from './../../../services/PX500Services';
import FlickrServices from './../../../services/FlickrServices';
import { selectPhoto, deselectPhoto } from './../../../actions/getPhotosActions/SelectedPhotosActions';
import { photoTypes } from '../../../constants/Constants'
import './SelectingPhotos.css';
import Utils from './../../../utils/Utils';
import {
    toggleFacebookPopup
} from './../../../actions/appStatusActions/RootStatusActions';


const FB_PHOTOS_COOKIE_NAME =  "fb_photos";
const FB_PHOTOS_COOKIE_VALUE =  "PhoTos";

class SelectingPhotos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentAlbumChoose: null,
        };
    }
    checkWindowFocus() {
        if (!document.hidden){
            var loginStatusTrue = () => {

            };
            var loginStatusFalse = (response) => {
                this.props.redirectToSelectingPhotoPage(this.props.albumType);
            };
            if(this.props.albumType === photoTypes.FACEBOOK) {
                FBServices.getInstance().getLoginStatus(loginStatusTrue.bind(this), loginStatusFalse.bind(this));
                
            };
        }
    }

    componentDidMount() {
        if(this.props.albumType === photoTypes.FACEBOOK) {
            window.onfocus = this.checkWindowFocus.bind(this);
        }
        
        if (this.props.albumType === photoTypes.FACEBOOK && Utils.readCookie(FB_PHOTOS_COOKIE_NAME) === '') {
            document.cookie = FB_PHOTOS_COOKIE_NAME + "=" + FB_PHOTOS_COOKIE_VALUE;
            this.props.toggleFacebookPopup();
        }
    }

    onAlbumClick(album) {
        this.setState({ currentAlbumChoose: album });
    }

    backToAlbumList() {
        this.setState({ currentAlbumChoose: null });
    }

    renderSocialLogo(photoType) {
        switch (photoType) {
            case photoTypes.FACEBOOK:
                return (
                    <img src={Config.instance.retrieveImageUrl("img_facebook")} alt={photoType} />
                );
            case photoTypes.INSTAGRAM:
                return (
                    <img src={Config.instance.retrieveImageUrl("img_instagram")} alt={photoType} />
                );
            case photoTypes.PX500:
                return (
                    <img src={Config.instance.retrieveImageUrl("img_500px")} alt={photoType} />
                );
            case photoTypes.FLICKR:
                return (
                    <img src={Config.instance.retrieveImageUrl("img_flickr")} alt={photoType} />
                );
            case photoTypes.SMUGSMUG:
                return (
                    <img src={Config.instance.retrieveImageUrl("img_smug")} alt={photoType} />
                );
            default:
                return;      
        }

    }

    renderUserLoginInfo(logoutSocial, photoType) {
        var loginName = '';
        switch (photoType) {
            case photoTypes.FACEBOOK:
                loginName = FBServices.getInstance().getUserName();
                break;
            case photoTypes.INSTAGRAM:
                loginName = InstagramServices.getInstance().getUserName();
                break;
            case photoTypes.PX500:
                loginName = PX500Services.getInstance().getUserName();
                break;
            case photoTypes.SMUGSMUG:
                loginName = SmugmugServices.getInstance().getUserName();
                break;
            case photoTypes.FLICKR:
                loginName = FlickrServices.getInstance().getUserName();
                break;
        }
        return (
            <div className="content-left-user-login" >
                <div className="content-left-user-login-wrapper">
                    <div className="content-left-user-login-logo">
                        {this.renderSocialLogo(photoType)}
                    </div>
                    <div className="content-left-user-login-name">
                        <div className="content-left-user-login-name-wrapper">
                            <span className="content-left-user-login-span"> {LocaleUtils.instance.translate('import.hdr.loggedInAs')} {loginName} </span>
                            <span className="log-out" onClick={logoutSocial.bind(null, photoType)}>logout</span>
                            <div className="separate">|</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderSelectAllorNoneText (selectAll, deSelectAll, currentAlbumChoose, photos) {
        return (
            <div className="select-all-or-none">
                <span className="select-text">{LocaleUtils.instance.translate('import.select')} </span>
                <span className="select-link-text"
                    onClick={() => (selectAll(currentAlbumChoose, photos))}>{LocaleUtils.instance.translate('import.select.all')} </span>
                <span className="separate">|</span>
                <span className="select-link-text"
                    onClick={() => (deSelectAll(currentAlbumChoose, photos))}> {LocaleUtils.instance.translate('import.select.none')} </span>
            </div>
        );
    }

    renderSelectTextByPhotoType(photoType) {
        var selectText = " ";
        switch (photoType) {
            case photoTypes.FACEBOOK:
                selectText = LocaleUtils.instance.translate('import.select_photo_albums',{0: LocaleUtils.instance.translate('import.facebook.album.plural') })
                break;
            case photoTypes.INSTAGRAM:
                selectText = LocaleUtils.instance.translate('import.select_photo_albums',{0: LocaleUtils.instance.translate('import.instagram.album.plural') })
                break;
            case photoTypes.PX500:
                selectText = LocaleUtils.instance.translate('import.select_photo_albums',{0: LocaleUtils.instance.translate('import.500px.album.plural') })
                break;
            case photoTypes.SMUGSMUG:
                selectText = LocaleUtils.instance.translate('import.select_photo_albums',{0: LocaleUtils.instance.translate('import.smugmug.album.plural') })
                break;
            case photoTypes.FLICKR:
                selectText = LocaleUtils.instance.translate('import.select_photo_albums',{0: LocaleUtils.instance.translate('import.flickr.album.plural') })
                break;
        }
        
        return (
            <div className="content-left-title-span">{selectText}</div>
        )
    }

    renderDescriptionTextOfSmug () {
        return (
            <div className="content-left-smug-text">{LocaleUtils.instance.translate('import.smugmug.external_album_warning')}</div>
        );
    }

    render() {
        const { logoutSocial, selectAll, deSelectAll, albumType, photos } = this.props;
        return (
            <div className="content-left" onClick={this.checkWindowFocus.bind(this)} ref="selecting_photo">
                <div>
                    {this.renderUserLoginInfo(logoutSocial, albumType)}
                
                    <div className="content-left-title" >
                        {this.renderSelectTextByPhotoType(albumType)}
                        {
                            this.state.currentAlbumChoose ?
                                this.renderSelectAllorNoneText(selectAll, deSelectAll, this.state.currentAlbumChoose, photos)
                                : null
                        }
                    </div>
                </div>
                {
                    albumType === photoTypes.SMUGSMUG ?
                        this.renderDescriptionTextOfSmug()
                        :
                        null
                }
                <div className="content-left-separate-wrapper"><hr className="content-left-separate" /></div>
                {
                    !this.state.currentAlbumChoose ?
                        <SelectingAlbums onAlbumClick={this.onAlbumClick.bind(this)} albumType={albumType} /> :
                        <SelectingImages
                            currentAlbumChooseId={this.state.currentAlbumChoose.id}
                            backToAlbumList={this.backToAlbumList.bind(this)}
                            albumType={albumType} />
                }
            </div>
        );
    }
}

const selectAll = (dispatch, album, photos) => {
    album.photoIds.forEach(function(element) {
        if (!photos[element].isSelected) {
            dispatch(selectPhoto(photos[element]));
        }
    }, this);
}

const deSelectAll = (dispatch, album, photos) => {
    album.photoIds.forEach(function(element) {
        if (photos[element].isSelected) {
            dispatch(deselectPhoto(photos[element]));
        }
    }, this);
}

const logoutSocial = (dispatch, photoType) => {
    switch (photoType) {
        case photoTypes.FACEBOOK:
            FBServices.getInstance().logout();
            break;
        case photoTypes.INSTAGRAM:
            InstagramServices.getInstance().logoutUser();
            break;
        case photoTypes.PX500:
            PX500Services.getInstance().logout();
            break;
        case photoTypes.SMUGSMUG:
            SmugmugServices.getInstance().logoutUser();
            break;
        case photoTypes.FLICKR:
            FlickrServices.getInstance().logoutUser();
            break;
    }
    dispatch(showStartSelectPhoto(photoType));
    dispatch({ type: 'INIT' });
}

const mapStateToProps = (state, ownProps) => {
    const { getPhotosData } = state;
    const { photos } = getPhotosData;
    const { selectedPhotos } = getPhotosData;
    return {
        selectedPhotos: selectedPhotos.selectedPhotos,
        photos,
    };
}

const showFacebookPopup = (dispatch) => {
    dispatch(toggleFacebookPopup());
}
const redirectToSelectingPhotoPage = (dispatch, photoType) => {
    dispatch(showStartSelectPhoto(photoType));
    dispatch({ type: 'INIT' });
}

const mapDispatchToProps = (dispatch) => ({
    logoutSocial: logoutSocial.bind(null, dispatch),
    selectAll: selectAll.bind(null, dispatch),
    deSelectAll: deSelectAll.bind(null, dispatch),
    toggleFacebookPopup: showFacebookPopup.bind(null, dispatch),
    redirectToSelectingPhotoPage: redirectToSelectingPhotoPage.bind(null, dispatch)
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SelectingPhotos);
