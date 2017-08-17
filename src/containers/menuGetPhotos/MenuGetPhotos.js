import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import  { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import Tooltip  from 'rc-tooltip';
import onClickOutsize from 'react-onclickoutside';

import './MenuGetPhotos.css'
import Utils from './../../utils/Utils';
import Config from './../../config/Config';
import LocaleUtils  from './../../utils/LocaleUtils';
import Assets       from './../../assets/Assets';
import IconButton           from './../../components/materials/iconButton/IconButton';
import FBServices           from './../../services/FBServices';
import InstagramServices    from './../../services/InstagramServices';
import FlickrServices       from './../../services/FlickrServices';
import PX500Services        from './../../services/PX500Services';
import SmugmugServices      from './../../services/SmugmugServices';

import { photoTypes } from './../../constants/Constants';
import { toggleMenuGetPhotos } from './../../actions/appStatusActions/BookDesignHeaderStatusActions';
import { addUploaderToUploadingList } from './../../actions/getPhotosActions/UploadingPhotosActions';
import {
    getAlbumsOfFB,
    getTaggedAlbumOfFB,
    getInstagramAlbum,
    get500pxAlbum,
    getFlickerAlbum,
    getPhotosOfInstagramSuccess,
    getPhotosOfInstagramFailed,
    getSmugmugAlbum,
} from './../../actions/getPhotosActions/AlbumsActions';
import {
    showAutoCreateBookScreen,
    showStartSelectPhoto,
    showGetPhotosForBook,
    toggleLargeImagePopup,
    toggleAlert,
    toggleImagesDuplicatedPopup
} from './../../actions/appStatusActions/RootStatusActions';


class MenuGetPhotos extends Component {
    constructor(props) {
        super(props)
        this.state = {
            position: {
                x: 0,
                y: 0
            }
        }
        this.setPositionState = this.setPositionState.bind(this);
    }

    setPositionState(e) {
        let rect = e.target.getBoundingClientRect();
        let xPos = e.pageX - rect.left - rect.width; //x position within the element
        let yPos = e.pageY - rect.top - rect.height;  //y position within the element
        this.setState({
            position: {
                x: xPos,
                y: yPos
            }
        })
    }

    handleClickOutside() {
        this.props.onClose();
    }

    renderTitle() {
        return (
            <div className="div-text">
                <p>{LocaleUtils.instance.translate('contextual_menu.title.get_photos')}</p>
                <Tooltip placement='bottomRight' prefixCls='rc-tooltip-custom-page-footer'
                         align={{
                             offset: [this.state.position.x, this.state.position.y],
                         }}
                         overlay={LocaleUtils.instance.translate('tooltip.close')}>
                    <div className='menu-get-photos-tooltip-custom' onMouseEnter={this.setPositionState}>
                        <IconButton className="close-menu-photo" type={IconButton.type.close} onClick={this.props.onClose} />
                    </div>
                </Tooltip>
            </div>
        );
    }

    uploadingPhotoFromComputer(acceptedFiles, rejectedFiles) {
        const { photoList, dispatchUploadingPhotoFromComputer } = this.props;
        dispatchUploadingPhotoFromComputer(photoList, acceptedFiles, rejectedFiles);
    }

    renderMenuPhotoItems() {
        let { photoImportOptions, onMenuPhotoItemFlickrClick, onMenuPhotoItem500pxClick,
            onMenuPhotoItemInstagramClick, onMenuPhotoItemFBClick, onMenuPhotoItemSmugClick } = this.props;
        return (
            <div className='size-menu-photo'>
                {
                    photoImportOptions['opt_local'].enabled == 1 &&
                    <GetPhotosFromComputer onDropPhotosFromComputer={this.uploadingPhotoFromComputer.bind(this)} />
                }
                {
                    photoImportOptions['opt_flickr'].enabled == 1 &&
                    <MenuPhotoItem  urlImage={Assets.instance.retrieveImageObjectURL('img_flickr')}
                                    text={LocaleUtils.instance.translate('start.import.from_flickr')}
                                    onClick={onMenuPhotoItemFlickrClick} />
                }
                {
                    photoImportOptions['opt_500px'].enabled == 1 &&
                    <MenuPhotoItem  urlImage={Assets.instance.retrieveImageObjectURL('img_500px')}
                                    text={LocaleUtils.instance.translate('start.import.from', { 0: LocaleUtils.instance.translate('start.import.500px') })}
                                    onClick={onMenuPhotoItem500pxClick} />
                }
                {
                    photoImportOptions['opt_instagram'].enabled == 1 &&
                    <MenuPhotoItem  urlImage={Assets.instance.retrieveImageObjectURL('img_instagram')}
                                    text={LocaleUtils.instance.translate('start.import.from', { 0: LocaleUtils.instance.translate('start.import.instagram') })}
                                    onClick={onMenuPhotoItemInstagramClick} />
                }
                {
                    photoImportOptions['opt_facebook'].enabled == 1 &&
                    <MenuPhotoItem  urlImage={Assets.instance.retrieveImageObjectURL('img_facebook')}
                                    text={LocaleUtils.instance.translate('start.import.from', { 0: LocaleUtils.instance.translate('start.import.facebook') })}
                                    onClick={onMenuPhotoItemFBClick} />
                }
                {
                    photoImportOptions['opt_smugmug'].enabled == 1 &&
                    <MenuPhotoItem  urlImage={Assets.instance.retrieveImageObjectURL('img_smug')}
                                    text={LocaleUtils.instance.translate('start.import.from', { 0: LocaleUtils.instance.translate('start.import.smugmug') })}
                                    onClick={onMenuPhotoItemSmugClick} />
                }
            </div>
        );
    };


    render() {
        return (
            <div className="menu-photo-component">
                <div className="triangle"></div>
                <div className="menu-photo">
                    {PX500Services.getInstance().init500Px()}
                    {FBServices.getInstance().initFbSDK()}
                    { this.renderTitle() }
                    { this.renderMenuPhotoItems() }
                </div>
            </div>
        );
    };
}

const GetPhotosFromComputer = ({ onDropPhotosFromComputer }) => (
    <Dropzone className="photo-computer" onDrop={onDropPhotosFromComputer} accept="image/jpeg, image/png, image/jpg" >
        <MenuPhotoItem
            urlImage={Assets.instance.retrieveImageObjectURL('img_laptop')}
            text={LocaleUtils.instance.translate('start.import.from_my_computer')} />
    </Dropzone>
);

const MenuPhotoItem = ({ urlImage, text, onClick }) => (
    <div className="menu-photo-item" onClick={onClick}>
        <div className="image-menu-photo-zone">
            <img className="image-menu-photo" src={urlImage} alt="Album" />
        </div>
        <div className="info-menu-photo">
            <p className="name-menu-photo">{text}</p>
        </div>
    </div>
);

const onClose = (dispatch) => {
    dispatch(toggleMenuGetPhotos());
};

const switchTOAutoCreateBookScreen = (dispatch) => {
    dispatch(showAutoCreateBookScreen());
};

const dispatchUploadingPhotoFromComputer = (dispatch, photoList, acceptedFiles, rejectedFiles) => {
    onClose(dispatch);

    if (rejectedFiles.length > 0) {
        dispatch(toggleAlert(LocaleUtils.instance.translate('unsupported_image_format.title'),
            LocaleUtils.instance.translate('unsupported_image_format.body'),
            LocaleUtils.instance.translate('label.ok'), null, rejectedFiles)
        );
    }

    if (acceptedFiles.length === 0) {
        return;
    }

    const MAX_PHOTO_SIZE = parseInt(Config.instance.pdfBookMaxImageLimit, 10) * 1024 * 1024;    //25MB
    for (let file of acceptedFiles) {
        if (file.size > MAX_PHOTO_SIZE) {
            dispatch(toggleLargeImagePopup(file.name));
            return;
        }
    }

    let imagesAfterFilter = Utils.filterSelectedImages(acceptedFiles, photoList, photoTypes.COMPUTER);
    if (imagesAfterFilter.imagesDuplicated.length > 0) {
        dispatch(toggleImagesDuplicatedPopup(imagesAfterFilter.imagesDuplicated, function () {
            if (imagesAfterFilter.imagesFilted.length > 0) {
                goToAutoCreateBookScreen(dispatch, photoTypes.COMPUTER, imagesAfterFilter.imagesFilted);
            }
            dispatch(toggleImagesDuplicatedPopup([], null));
        }));
    } else {
        goToAutoCreateBookScreen(dispatch, photoTypes.COMPUTER, imagesAfterFilter.imagesFilted);
    }
}

const goToAutoCreateBookScreen = (dispatch, photoType, images) => {
    switchTOAutoCreateBookScreen(dispatch);
    dispatch(addUploaderToUploadingList(photoType, images));
}

const onMenuGetPhotoFBClick = (dispatch) => {
    var loginStatusTrue = () => {
        FBServices.getInstance().getAlbums(getAlbumsSuccess.bind(this));
        FBServices.getInstance().getAccounts(getAccountsSuccess.bind(this));
    }

    var loginStatusFalse = () => {
      console.log("Login or get albumFaild", 'Failed');
      dispatch(showStartSelectPhoto(photoTypes.FACEBOOK));
    }

    var loginSuccess = () => {
        FBServices.getInstance().getAlbums(getAlbumsSuccess.bind(this), getAlbumOrTaggedAlbumFailed.bind(this));
    }

    var getAlbumsSuccess = (response) => {
        dispatch(getAlbumsOfFB(response.data));

        //FBServices.getInstance().getTaggedAlbum(getTaggedAlbumSuccess.bind(this), getAlbumOrTaggedAlbumFailed.bind(this));
    }

    var getAccountsSuccess = (response) => {
        var {data} = response;
        if (data.length > 0) {
            data.forEach(function(account) {
                FBServices.getInstance().getAlbums(getAlbumsSuccess.bind(this), getAlbumOrTaggedAlbumFailed.bind(this), account.id);
            }, this);
        };
        FBServices.getInstance().getTaggedAlbum(getTaggedAlbumSuccess.bind(this), getAlbumOrTaggedAlbumFailed.bind(this));
    }

    var getTaggedAlbumSuccess = (response) => {
        dispatch(getTaggedAlbumOfFB(response.data));
        //show image list.
        dispatch(showGetPhotosForBook(photoTypes.FACEBOOK));
    }

    var getAlbumOrTaggedAlbumFailed = () => {
        loginStatusFalse.bind(this);

        dispatch(showStartSelectPhoto(photoTypes.FACEBOOK));
    }

    FBServices.getInstance().getLoginStatus(loginStatusTrue.bind(this), loginStatusFalse.bind(this));
    onClose(dispatch);
}

const onMenuGetPhotoFlickrClick = (dispatch) => {
    var getUserAlbumsSuccess = (response) => {
        var {stat } = response;
        if (stat === "ok") {
            var {photos} = response;
            dispatch(getFlickerAlbum(photos));
            dispatch(showGetPhotosForBook(photoTypes.FLICKR));
        } else {
            dispatch(showStartSelectPhoto(photoTypes.FLICKR));
        }
    };

    var getUserAlbumsFailed = (ex) => {
        dispatch(showStartSelectPhoto(photoTypes.FLICKR));
    };

    FlickrServices.getInstance().getUserPhotos(getUserAlbumsSuccess, getUserAlbumsFailed)
    onClose(dispatch);
}

const onMenuGetPhoto500pxClick = (dispatch) => {
    var getUserCallback = (response) => {
        var { data } = response;
        var { status } = data;
        if (status === 401) {
            dispatch(showStartSelectPhoto(photoTypes.PX500));
        } else {
            PX500Services.getInstance().getUserPhotos(getUserPhotosCallback);
        }
    }
    var getUserPhotosCallback = (response) => {
        var { status, data } = response;
        if (status === 400) {
            dispatch(showStartSelectPhoto(photoTypes.PX500));
        } else {
            dispatch(get500pxAlbum(data));
            dispatch(showGetPhotosForBook(photoTypes.PX500));
        }
    }
    PX500Services.getInstance().getUser(getUserCallback);
    onClose(dispatch);
}

const onMenuGetPhotoInstagramClick = (dispatch) => {
    InstagramServices.getInstance().getUserPhotos((response) => { handleGetInstagramUserPhotos(response) }, (err) => { handleGetInstagramUserPhotosFailed(err) } );
    var handleGetInstagramUserPhotos = function (response) {
        var { meta, data } = response;

        if (meta.code !== 200) {
            dispatch(showStartSelectPhoto(photoTypes.INSTAGRAM));
        } else {
            dispatch(getInstagramAlbum(data));
            dispatch(showGetPhotosForBook(photoTypes.INSTAGRAM));
        }
        onClose(dispatch);
    };
    var handleGetInstagramUserPhotosFailed = function (response) {
        alert('Failed to connect to Instagram Server');
    }
}

const onMenuGetPhotoSmugClick = (dispatch) => {
    var checkAcessTokenCallback = (result) => {
        var { stat, code} = result;

        var getUserAlbumsSuccess = (result) => {
            var { Albums } = result;
            dispatch(getSmugmugAlbum(Albums));
            dispatch(showGetPhotosForBook(photoTypes.SMUGSMUG));
        };

        var getUserAlbumsFailed = (ex) => {
            dispatch(showStartSelectPhoto(photoTypes.SMUGSMUG));
        };

        if (stat === 'fail') {
            dispatch(showStartSelectPhoto(photoTypes.SMUGSMUG));
        } else {
            SmugmugServices.getInstance().getUserAlbums(getUserAlbumsSuccess, getUserAlbumsFailed)
        }
    };

    SmugmugServices.getInstance().checkAcessToken(checkAcessTokenCallback);
    onClose(dispatch);
}

const mapStateToProps = (state) => {
    return {
        photoList: state.photoList
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        onClose:                        onClose.bind(null, dispatch),
        dispatchUploadingPhotoFromComputer: (photoList, acceptedFiles, rejectedFiles) => dispatchUploadingPhotoFromComputer(dispatch, photoList, acceptedFiles, rejectedFiles),
        onMenuPhotoItemFlickrClick:     onMenuGetPhotoFlickrClick.bind(null, dispatch),
        onMenuPhotoItem500pxClick:      onMenuGetPhoto500pxClick.bind(null, dispatch),
        onMenuPhotoItemInstagramClick:  onMenuGetPhotoInstagramClick.bind(null, dispatch),
        onMenuPhotoItemFBClick:         onMenuGetPhotoFBClick.bind(null, dispatch),
        onMenuPhotoItemSmugClick:       onMenuGetPhotoSmugClick.bind(null, dispatch),
    };
}

MenuGetPhotos.propTypes = {
    photoImportOptions: PropTypes.object.isRequired,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(onClickOutsize(MenuGetPhotos))
