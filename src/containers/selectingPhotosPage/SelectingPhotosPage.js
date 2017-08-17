import React from 'react';
import { connect } from 'react-redux';

import './../../styles/GeneralStyle.css';
import SelectingPhoto  from './../../components/selectingPhoto/SelectingPhoto';
import Button, { colorType }    from './../../components/materials/button/Button';
import Header from './../../components/materials/header/Header';
import Footer from './../../components/materials/footer/Footer';
import Config from './../../config/Config';
import FBServices   from './../../services/FBServices';
import InstagramServices, {instagramTokenName}   from './../../services/InstagramServices';
import PX500Services   from './../../services/PX500Services';
import FlickrServices   from './../../services/FlickrServices';
import SmugmugServices   from './../../services/SmugmugServices';
import AppServices from './../../services/AppServices';
import LocaleUtils  from './../../utils/LocaleUtils';
import Utils  from './../../utils/Utils';
import CTEventFactory from './../../utils/CTEventFactory';
import Assets       from './../../assets/Assets';

import { toggleImagesDuplicatedPopup } from './../../actions/appStatusActions/RootStatusActions';
import {
    getAlbumsOfFB,
    getTaggedAlbumOfFB,
    getPhotosOfInstagramFailed,
    getInstagramAlbum,
    get500pxAlbum,
    getFlickerAlbum,
    getSmugmugAlbum,
} from './../../actions/getPhotosActions/AlbumsActions';

import {
    showGetPhotosForBook,
    showAutoCreateBookScreen,
    showBookDesignScreen,
    isConnecting,
    toggleLimitPopup,
    toggleServicesErrorDialog
} from './../../actions/appStatusActions/RootStatusActions';

import { photoTypes } from './../../constants/Constants';

import {
    addUploaderToUploadingList
} from './../../actions/getPhotosActions/UploadingPhotosActions';

const SelectingPhotosPage = (props) => {
    const { rootStatus, dispatchStartingSelectPhoto, photoList, selectedPhotos, dispatchShowingBookDesignScreen, dispatchContinueSelectedPhoto } = props;
    const { photoType, isConnecting, isShowGetPhotoForBook } = rootStatus;
    
    const title = LocaleUtils.instance.translate('label.get_photos');
    const titleDetail = LocaleUtils.instance.translate('wizard.title.select_photos_for_your_book');
    const currentSelectedPhotos = Object.values(selectedPhotos.selectedPhotos);
    const backgroundStyle = {
        background: "url(" + Assets.instance.retrieveImageObjectURL('img_background_white') + ")"
    };

    const onContinueClick = () => {
        dispatchContinueSelectedPhoto(currentSelectedPhotos, photoType, photoList);
    }

    const onStartSelectingPhoto = () => {
        dispatchStartingSelectPhoto(photoType);
    }

    let amountCurrentPhotos = Object.keys(photoList).length;
    let amountSelectedPhoto = currentSelectedPhotos.length;
    let maxImageLimit = parseInt(Config.instance.maxImageLimit, 10);

    const cancelBtn = <Button text={LocaleUtils.instance.translate('wizard.nav.cancel')} onClick={dispatchShowingBookDesignScreen} />
    const continueBtn = <Button className="footer-btn" text={LocaleUtils.instance.translate('wizard.nav.continue')}
        type={colorType.orange} onClick={onContinueClick} />

    return (
        <div className="screen" style={backgroundStyle}>
            <Header
                title={title}
                titleDetail={titleDetail}
            />
            <div className="screen-body">
                <SelectingPhoto
                    isConnecting={isConnecting}
                    photoType={photoType}
                    startSelectPhotoClick={onStartSelectingPhoto}
                    isShowGetPhotoForBook={isShowGetPhotoForBook}
                />
            </div>
            <Footer
                enableClickRightBtn={amountSelectedPhoto > 0 && amountCurrentPhotos + amountSelectedPhoto <= maxImageLimit}
                leftBtn={cancelBtn}
                firstRightBtn={continueBtn}
            />
        </div>
    );
}

var instagramChildWindow;
var flickrChildWindow;
var timeCheckDelay;

const dispatchShowingBookDesignScreen = (dispatch) => {
    dispatch(showBookDesignScreen());
}

const dispatchContinueSelectedPhoto = (dispatch, selectedPhotos, photoType, photoList) => {
    let amountCurrentPhotos = Object.keys(photoList).length;
    let amountSelectedPhoto = selectedPhotos.length;

    if (amountSelectedPhoto + amountCurrentPhotos > Config.instance.maxImageLimit) {
        dispatch(toggleLimitPopup());
        AppServices.trackCTEvent(CTEventFactory.instance.createTooManyPhotosDialogShownEvent(), null, null);
        return;

    }

    let imagesAfterFilter = Utils.filterSelectedImages(selectedPhotos, photoList, photoType);
    if (imagesAfterFilter.imagesDuplicated.length > 0) {
        dispatch(toggleImagesDuplicatedPopup(imagesAfterFilter.imagesDuplicated, function () {
            if (imagesAfterFilter.imagesFilted.length > 0) {
                goToAutoCreateBookScreen(dispatch, photoType, imagesAfterFilter.imagesFilted);
            }
            dispatch(toggleImagesDuplicatedPopup([], null));
        }));
    } else {
        goToAutoCreateBookScreen(dispatch, photoType, imagesAfterFilter.imagesFilted);
    }
}

const goToAutoCreateBookScreen = (dispatch, photoType, images) => {
    dispatch({ type: 'INIT' });
    dispatch(showAutoCreateBookScreen());
    dispatch(addUploaderToUploadingList(photoType, images));
}

const handleGetAlbumOfFB = (dispatch) => {
    const loginStatusTrue = function() {
        FBServices.getInstance().getAlbums(getAlbumsSuccess.bind(this));
        FBServices.getInstance().getAccounts(getAccountsSuccess.bind(this));
    };

    const loginStatusFalse = function(err) {
      FBServices.getInstance().login(loginSuccess.bind(this),loginFailed.bind(this));
      // alert("Login or get albumFaild", 'Failed');
      
    };

    const loginSuccess = function() {
        FBServices.getInstance().getAlbums(getAlbumsSuccess.bind(this), getAlbumOrTaggedAlbumFailed.bind(this));
        FBServices.getInstance().getAccounts(getAccountsSuccess.bind(this));
    };

    const getAlbumsSuccess = function(response) {
        dispatch(getAlbumsOfFB(response.data));
        //FBServices.getInstance().getTaggedAlbum(getTaggedAlbumSuccess.bind(this), getAlbumOrTaggedAlbumFailed.bind(this));
    };

    const getAccountsSuccess = function(response) {
        var {data} = response;
        if (data.length > 0) {
            data.forEach(function(account) {
                FBServices.getInstance().getAlbums(getAlbumsSuccess.bind(this), getAlbumOrTaggedAlbumFailed.bind(this), account.id);
            }, this);
        };
        FBServices.getInstance().getTaggedAlbum(getTaggedAlbumSuccess.bind(this), getAlbumOrTaggedAlbumFailed.bind(this));
    }

    const getTaggedAlbumSuccess = function(response) {
        dispatch(getTaggedAlbumOfFB(response.data));
        //show image list.
        dispatch(showGetPhotosForBook(photoTypes.FACEBOOK));
    };

    const getAlbumOrTaggedAlbumFailed = function() {
        loginStatusFalse.bind(this);
    };
    const loginFailed = function() {
        
    };

    FBServices.getInstance().getLoginStatus(loginStatusTrue.bind(this), loginStatusFalse.bind(this));
}

const handleGetInstagramPhotos = (dispatch) => {
    instagramChildWindow = InstagramServices.getInstance().openLoginWindow();
    timeCheckDelay = setInterval(checkInstagramChildIsClose.bind(null,dispatch), 1000);
}

const checkInstagramChildIsClose = (dispatch) => {
    const toggleErrorDialog = function () {
        dispatch(toggleServicesErrorDialog());
    };

    const handleGetInstagramUserPhotos = function(response) {
        var {meta, data} = response;
        if (meta.code != 200) {
            dispatch(isConnecting(false));
            console.log('-------HandelIns-------', response)
        } else {
            dispatch(getInstagramAlbum(data));
            dispatch(showGetPhotosForBook(photoTypes.INSTAGRAM));
            dispatch(isConnecting(false));
        }
    };

    if (instagramChildWindow.closed) {
        clearInterval(timeCheckDelay);
        var token = Utils.readCookie(instagramTokenName);
        if (token == "undefined") {
            console.log("User denied grant permission");
            dispatch(toggleServicesErrorDialog());
            setTimeout(toggleErrorDialog, 5000);
            dispatch(isConnecting(false));
        } else if (token.length >= 1 ) {
            InstagramServices.getInstance().setAccessToken(token);
            InstagramServices.getInstance().getUserPhotos((res) => {handleGetInstagramUserPhotos(res)});
            dispatch(isConnecting(true));
        }
    }
}

const handleGet500PxPhotos = (dispatch) => {
    const userLoginSuccess = function(response) {
        PX500Services.getInstance().getUserPhotos(getUserPhotosCallback);
    }

    const toggleErrorDialog = function () {
        dispatch(toggleServicesErrorDialog());
    };

    const userLoginFailed = function(response) {
        console.log("userLoginFailed", response);
        dispatch(toggleServicesErrorDialog());
        setTimeout(toggleErrorDialog, 5000);
        dispatch(isConnecting(false));
    }
    const getUserPhotosCallback = function(response) {
        var {status , data } = response;
        if (status !== 200) {
            userLoginFailed();
            dispatch(isConnecting(false));
        } else {
            dispatch(isConnecting(true))

            dispatch(get500pxAlbum(data));
            dispatch(showGetPhotosForBook(photoTypes.PX500));
            dispatch(isConnecting(false));
        }
    }
    //dispatch(isConnecting(true));
    PX500Services.getInstance().login(userLoginSuccess, userLoginFailed);
}

const checkFlickrChildIsClose = (dispatch) => {

    const getUserPhotosSuccess = function(response) {
        var { photos } = response;
        dispatch(getFlickerAlbum(photos));
        dispatch(showGetPhotosForBook(photoTypes.FLICKR));
        dispatch(isConnecting(false));
    };

    const toggleErrorDialog = function () {
        dispatch(toggleServicesErrorDialog());
    };

    const exchangeAcessTokenFailed = function(response) {
        dispatch(isConnecting(false));
        console.log("exchangeAcessTokenFailed", response);
        dispatch(toggleServicesErrorDialog());
        setTimeout(toggleErrorDialog, 5000);
    };

    const getOauthVerifierFailed = function() {
        dispatch(isConnecting(false));
        console.log("getOauthVerifierFailed");
        dispatch(toggleServicesErrorDialog());
        setTimeout(toggleErrorDialog, 5000);
        
    };

    const getUserPhotosFailed = function(ex) {
        console.log("getUserPhotosFailed", ex);
        dispatch(toggleServicesErrorDialog());
        setTimeout(toggleErrorDialog, 5000);
        dispatch(isConnecting(false));
    };

    const exchangeAcessTokenSuccess = function() {
        //FlickrServices.getInstance().checkAcessToken(checkAcessTokenCallback);
        FlickrServices.getInstance().getUserPhotos(getUserPhotosSuccess, getUserPhotosFailed);
    };

    // const checkAcessTokenCallback = function(response) {
    //     FlickrServices.getInstance().getUserPhotos(getUserPhotosSuccess, getUserPhotosFailed);
    // };

    const getOauthVerifierSuccess = function() {
        FlickrServices.getInstance().exchangeAcessToken( exchangeAcessTokenSuccess, exchangeAcessTokenFailed );
    };

    if (flickrChildWindow.closed) {
        clearInterval(timeCheckDelay);
        FlickrServices.getInstance().getOauthVerifierCookie(getOauthVerifierSuccess, getOauthVerifierFailed);
    }

}

const handleGetFlickrPhotos = function(dispatch) {
    const requestOauthTokenSuccess = function(result) {
        flickrChildWindow = FlickrServices.getInstance().authorizeUser();
        timeCheckDelay = setInterval(() => checkFlickrChildIsClose(dispatch), 1000);
    };

    const requestOauthTokenFailed = function(ex) {
        console.log("requestOauthTokenFailed", ex);
        dispatch(isConnecting(false));
    };

    FlickrServices.getInstance().requestOauthToken(requestOauthTokenSuccess, requestOauthTokenFailed);
    dispatch(isConnecting(true));
}

var smugWindow;
var checkSmug;

const handleGetSmugmugPhotos = (dispatch) => {

    const requestOauthTokenSuccess = function(result) {
        smugWindow = SmugmugServices.getInstance().authorizeUser();
        checkSmug = setInterval(() => checkSmugWindow(dispatch), 1000);
    };

    const requestOauthTokenFailed = function(ex) {
        console.log("CheckAcessTokenFailed", ex);
        dispatch(isConnecting(false));
    };

    SmugmugServices.getInstance().requestOauthToken(requestOauthTokenSuccess, requestOauthTokenFailed);
    dispatch(isConnecting(true));
}

const checkSmugWindow = function(dispatch) {

    const getUserAlbumsSuccess = function(result) {
        var { Albums } = result;
        dispatch(getSmugmugAlbum(Albums));
        dispatch(showGetPhotosForBook(photoTypes.SMUGSMUG));
        dispatch(isConnecting(false));
    };

    const getUserAlbumsFailed = function(ex) {
        console.log("getUserAlbumsFailed", ex);
        dispatch(isConnecting(false));
    };

    const toggleErrorDialog = function () {
        dispatch(toggleServicesErrorDialog());
    };

    const checkAcessTokenCallback = function(result) {
        var {code , message } = result;
        if (code) {
            console.log(" Your smugmug account is expried!");
            dispatch(toggleServicesErrorDialog());
            setTimeout(toggleErrorDialog, 5000);
            dispatch(isConnecting(false));
            return;
        } else {
            SmugmugServices.getInstance().getUserAlbums(getUserAlbumsSuccess, getUserAlbumsFailed);
        }

    };

    const ExchangeAcessTokenSuccess = function() {
        SmugmugServices.getInstance().checkAcessToken(checkAcessTokenCallback);
    };

    const getOauthVerifierSuccess = function() {
        SmugmugServices.getInstance().exchangeAcessToken(ExchangeAcessTokenSuccess);
    };

    const getOauthVerifierFailed = function() {
        console.log("getOauthVerifierFailed");
        dispatch(isConnecting(false));
    };

    if(smugWindow.closed) {
        clearInterval(checkSmug);
        // smugWindow = SmugmugServices.getInstance().getOauthVerifierCookie(getOauthVerifierSuccess, getOauthVerifierFailed);
        SmugmugServices.getInstance().exchangeAcessToken(ExchangeAcessTokenSuccess);
    }

}

const dispatchStartingSelectPhoto = (dispatch, photoType) => {
    switch (photoType) {
        case photoTypes.FACEBOOK:
            handleGetAlbumOfFB(dispatch);
            AppServices.trackCTEvent(CTEventFactory.instance.createImageImportAuthenticationStartedEvent(photoTypes.FACEBOOK), null, null);
            break;
        case photoTypes.INSTAGRAM:
            handleGetInstagramPhotos(dispatch);
            AppServices.trackCTEvent(CTEventFactory.instance.createImageImportAuthenticationStartedEvent(photoTypes.INSTAGRAM), null, null);
            break;
        case photoTypes.PX500:
            handleGet500PxPhotos(dispatch);
            AppServices.trackCTEvent(CTEventFactory.instance.createImageImportAuthenticationStartedEvent(photoTypes.PX500), null, null);
            break;
        case photoTypes.FLICKR:
            handleGetFlickrPhotos(dispatch);
            AppServices.trackCTEvent(CTEventFactory.instance.createImageImportAuthenticationStartedEvent(photoTypes.FLICKR), null, null);
            break;
        case photoTypes.SMUGSMUG:
            handleGetSmugmugPhotos(dispatch);
            AppServices.trackCTEvent(CTEventFactory.instance.createImageImportAuthenticationStartedEvent(photoTypes.SMUGSMUG), null, null);
            break
        default:
            return;
    }
}

const mapStateToProps = (state) => {
    const { appStatus, getPhotosData, photoList } = state;
    const { selectedPhotos } = getPhotosData;
    const { rootStatus } = appStatus;
    return {
        rootStatus,
        selectedPhotos,
        photoList
    };
}

const mapDispatchToProps = (dispatch) => ({
    dispatchShowingBookDesignScreen: () => dispatchShowingBookDesignScreen(dispatch),
    dispatchStartingSelectPhoto: (photoType) => dispatchStartingSelectPhoto(dispatch, photoType),
    dispatchContinueSelectedPhoto: (selectedPhotos, photoType, photoList) => dispatchContinueSelectedPhoto(dispatch, selectedPhotos, photoType, photoList),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SelectingPhotosPage);
