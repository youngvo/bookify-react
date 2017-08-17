import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';

import Config                   from './../../config/Config';
import Logger                   from './../../utils/Logger';
import Assets                   from './../../assets/Assets';

import BookDesignPage           from './../bookDesginPage/BookDesignPage';
import PreLoader                from './../../components/preLoader/PreLoader';
import UploaderManger           from './../autoCreateBookPage/uploaderManager/UploaderManager';
import AutoCreateBookPage       from './../autoCreateBookPage/AutoCreateBookPage';
import ChangeOrderLayoutBookPage    from './../changeOrderLayoutBookPage/ChangeOrderLayoutBookPage';
import SelectingPhotosPage          from './../selectingPhotosPage/SelectingPhotosPage';
import ChangeDesignPage             from './../changeDesignPage/ChangeDesignPage';
import PreviewBook              from '../previewBook/PreviewBook';
import Popup, { popupType } from './../../components/popup/Popup';
import Alert from './../../components/popup/Alert';
import ErrorPopup from './../../components/popup/errorPopup/ErrorPopup';
import ErrorDetailPopup from './../../components/popup/errorPopup/ErrorDetailPopup';
import LoginAlert from './../../components/popup/login/LoginAlert';
import FacebookPopup from './../../components/popup/facebookPopup/FacebookPopup';
import LimitPopup from './../../components/popup/limitPopup/LimitPopup';
import RegisterPopup from './../../components/popup/register/RegisterPopup';
import LargeImagePopup from './../../components/popup/uploadLargeImage/LargeImagePopup';
import WelcomePopup from './../../components/popup/welcomePopup/WelcomePopup';
import LoginPopup from './../../components/popup/login/LoginPopup';
import ImagesDuplicatePopup from './../../components/popup/imagesDuplicatePopup/ImagesDuplicatePopup';
import PopupWithThreeButtons from './../../components/popup/popupWithThreeButtons/PopupWithThreeButtons';
import AppServices      from './../../services/AppServices';
import LocaleUtils      from './../../utils/LocaleUtils';
import LocationUtils    from './../../utils/LocationUtils';
import Utils    from './../../utils/Utils';
import CTEventFactory from './../../utils/CTEventFactory';
import { photoTypes, LAYOUT_TYPE_TEXT_MISC } from './../../constants/Constants';
import { setBookInfo, toggleChangeLogoOfBook } from './../../actions/projectActions/bookActions/BookInfoActions';
import { setCovers } from './../../actions/projectActions/bookActions/CoversActions';
import { setPages, setPageLayout } from '../../actions/projectActions/bookActions/pagesActions/PagesActions';
import { setLayouts } from './../../actions/projectActions/bookActions/LayoutsActions';
import { setThemes } from './../../actions/themesActions/ThemesActions';
import { setAutoFlowLayouts } from './../../actions/autoFlowLayoutsActions/AutoFlowLayoutsActions';
import { setCoverLayouts } from './../../actions/coverLayoutsActions/CoverLayoutsActions';
import { setProjectInfo } from './../../actions/projectActions/ProjectInfoActions';
import { userLoginSuccess } from './../../actions/userActions/UserActions';
import { setAmountPage } from './../../actions/appStatusActions/PaginationStatusActions';
import { addUploaderToUploadingList } from './../../actions/getPhotosActions/UploadingPhotosActions';
import { photoListAct_addPhotosByLoadingProject } from './../../actions/photoListActions/PhotoListActions';
import { updateLastTimeSaved, toggleShowingInfoOfAction } from './../../actions/appStatusActions/BookDesignHeaderStatusActions';
import { setBookMetaData } from './../../actions/projectActions/bookActions/BookMetaDataActions';
import {
    showBookDesignScreen,
    showPreloader,
    toggleLargeImagePopup,
    toggleFacebookPopup,
    toggleAlert,
    toggleRegisterPopup,
    toggleLimitPopup,
    toggleWelcomeNewRegister,
    toggleWelcomeBackLogin,
    toggleReadyToOrderPopup,
    showPreviewBook,
    toggleShowCustomLogoPopup,
    toggleShowUnsupportCharactersPopup,
    toggleLoginAlert,
    togglePreventClosingPageEvent,
    toggleShowingErrorPopup,
    toggleImagesDuplicatedPopup,
    appCrashed,
    toggleShowingErrorDetailPopup,
    toggleShowingMissingAssetsPopup
} from './../../actions/appStatusActions/RootStatusActions';

export class Root extends Component {
    static propTypes = {
        rootStatus: PropTypes.object.isRequired,
        init: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            percentComplete: 0,
            isShowSaveBookPopup: false,
            shouldPublishingBook: false,
            doPublishBook: false,
            isFinishedBefore: false,
            isShowingUnpulishedChangesPopup: false,
            isDragActive: true
        }
        
        this.onToggleSaveBookPopup = this.onToggleSaveBookPopup.bind(this);
        this.checkingUserIsLoggedIn = this.checkingUserIsLoggedIn.bind(this);
        this.onCloseSaveBookPopup = this.onCloseSaveBookPopup.bind(this);
        this.saveProject = this.saveProject.bind(this);
        this.saveProjectSuccess = this.saveProjectSuccess.bind(this);
        this.saveProjectFailed = this.saveProjectFailed.bind(this);
        this.onDropPhotos = this.onDropPhotos.bind(this);
        this.confirmChangeCustomLogo = this.confirmChangeCustomLogo.bind(this);
        this.onCloseErrorPopup = this.onCloseErrorPopup.bind(this);
        this.onRestartApp = this.onRestartApp.bind(this);
        AppServices.trackCTEvent(CTEventFactory.instance.createAppLoadingEvent(), null, null);
    }

    componentWillMount(){
        document.title = 'Blurb Bookify'; //LocaleUtils.instance.translate('browser.title', { '0': 'Square', '1': 20 });
    }
    
    componentDidMount() {
        const { dispatchUserLoggedIn } = this.props;
        const { dispatch } = this.props;

        if (!Utils.isBrowerVersionSupported(Config.instance.retrieveSupportedBrowsers())) {
            this.setState({
                isShowBrowerDetectionPopup: true
            });
            return;
        }
        const thisRoot = this;

        const initSessionFinish = (res) => {
            Assets.instance.loadLogo(thisRoot.onAppLogoLoaded.bind(thisRoot), null);
            if (res.user) {
                dispatchUserLoggedIn(res.user);
            }
        };

        Config.instance.load(() => {
            Logger.instance.enabled = Config.instance.logging.enabled;
            Logger.instance.level = Config.instance.logging.level;
            CTEventFactory.instance.init();
            AppServices.trackCTEvent(CTEventFactory.instance.createAppStartedEvent(), null, null);
            AppServices.initSession(initSessionFinish.bind(thisRoot), function (error) {
                console.log('init session failed');
            });
        });
    }

    componentWillUnmount() {
        AppServices.dispose();
        clearInterval(this.timingSaveBook);
        clearTimeout(this.welcomeBackLogin);
        clearTimeout(this.welcomeNewRegister);
    }

    componentWillReceiveProps(nextProps) {
        const nextRootStatus = nextProps.rootStatus;
        const currRootStatus = this.props.rootStatus;

        if (nextRootStatus.isShowWelcomeNewRegister !== currRootStatus.isShowWelcomeNewRegister && nextRootStatus.isShowWelcomeNewRegister) {
            this.welcomeNewRegister = setTimeout(this.props.dispatchToggleWelcomeNewRegister, 1000);
        }
        else if (nextRootStatus.isShowWelcomeBackLogin !== currRootStatus.isShowWelcomeBackLogin && nextRootStatus.isShowWelcomeBackLogin) {
            this.welcomeBackLogin = setTimeout(this.props.dispatchToggleWelcomeBackLogin, 1000);
        }

        if (nextRootStatus.shouldPreventClosingPageEvent !== currRootStatus.shouldPreventClosingPageEvent) {
            this.togglePreventClosingPageEvent(nextRootStatus.shouldPreventClosingPageEvent);
        }

        if (nextProps.project.projectInfo.productId !== this.props.project.projectInfo.productId && nextProps.project.projectInfo.productId !== '') {
            this.setState({ isFinishedBefore: true });
        }
    }

    confirmLeaveToPage(event) {
        let message = 'Important: Please click on \'Save\' button to leave this page.';
        if (typeof event === 'undefined') {
            event = window.event;
        }
        if (event) {
            return event.returnValue = message;
        }
        return message;
    }

    togglePreventClosingPageEvent(turnOn) {
        if (turnOn) {
            window.addEventListener('beforeunload', this.confirmLeaveToPage);
        } else {
            window.removeEventListener('beforeunload', this.confirmLeaveToPage);
        }
    }

    onAppLogoLoaded() {
        this.props.preload(this);
        Assets.instance.loadAssets(this.onAssetsLoaded.bind(this), this.onProgress.bind(this));
    }

    onAssetsLoaded() {
        this.props.init(this);
    }

    onProgress(percentComplete) {
        this.setState({
            percentComplete: percentComplete
        });
    }

    onCloseSaveBookPopup() {
        this.setState({
            isShowSaveBookPopup: false
        });
    }

    updateReadyPublishingBook() {
        this.setState({ shouldPublishingBook: true });
    }

    saveProjectSuccess(res) {
        this.props.onSaveProject(res.project);
        this.props.dispatchShowingInfoOfAction('');
        this.props.onUpdateLastTimeSaved();
        if (this.props.rootStatus.isShowPreviewBookScreen && this.state.shouldPublishingBook) {
            this.setState({ doPublishBook: true });
        }
    }

    saveProjectFailed(err) {
        let saveProjectFailedMessages = LocaleUtils.instance.translate('statusView.failedToSaveProject');
        this.props.dispatchShowingInfoOfAction('');
        this.props.dispatchShowingInfoOfAction(saveProjectFailedMessages);
        setTimeout(() => this.props.dispatchShowingInfoOfAction(''), 2000);
    }

    saveProject(successHandler, failedHandler) {
        if (this.state.isFinishedBefore && !this.props.rootStatus.isShowPreviewBookScreen) {
            this.setState({
                isFinishedBefore: false,
                isShowingUnpulishedChangesPopup: true
            });
            return;
        }

        let { book, projectInfo } = this.props.project;
        const { photoList } = this.props;

        let { id, metadata } = projectInfo;
        let data = book.toBBFXmlString(photoList);
        let coverThumbnail = '/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx4BBQUFBwYHDggIDh4UERQeHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHv/AABEIAQQA/QMBEQACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/APsugAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgD5m/4KO/8kQ0b/sZIP/Sa5oA+maACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAPmb/go7/wAkQ0b/ALGSD/0muaAPpmgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgD5m/wCCjv8AyRDRv+xkg/8ASa5oA+maACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAPmb/go7/yRDRv+xkg/wDSa5oA+maACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAPmb/go7/yRDRv+xkg/9JrmgD6ZoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA+Zv+Cjv/ACRDRv8AsZIP/Sa5oA+maACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAPmb/AIKO/wDJENG/7GSD/wBJrmgD6ZoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA+Zv+Cjv/JENG/7GSD/ANJrmgD6ZoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA+Zv+Cjv/JENG/7GSD/0muaAPpmgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgD5m/4KO/8AJENG/wCxkg/9JrmgD6ZoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA+Zv8Ago7/AMkQ0b/sZIP/AEmuaAPpmgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgD5m/4KO/8kQ0b/sZIP8A0muaAPpmgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgD5m/4KO/8kQ0b/sZIP/Sa5oA+maACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAPmb/go7/wAkQ0b/ALGSD/0muaAPpmgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgD5m/wCCjv8AyRDRv+xkg/8ASa5oA+maACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAPmb/go7/yRDRv+xkg/wDSa5oA+maACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAPmb/go7/yRDRv+xkg/9JrmgD6ZoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA+Zv+Cjv/ACRDRv8AsZIP/Sa5oA+maACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAPmb/AIKO/wDJENG/7GSD/wBJrmgD6ZoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA+Zv+Cjv/JENG/7GSD/ANJrmgD6ZoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA+Zv+Cjv/JENG/7GSD/0muaAPpmgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgD5m/4KO/8AJENG/wCxkg/9JrmgD6ZoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA+Zv8Ago7/AMkQ0b/sZIP/AEmuaAPpmgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgD5m/4KO/8kQ0b/sZIP8A0muaAPpmgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgD5m/4KO/8kQ0b/sZIP/Sa5oA+maACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAPmb/go7/wAkQ0b/ALGSD/0muaAPpmgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgD5m/wCCjv8AyRDRv+xkg/8ASa5oA+maACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAPmb/go7/yRDRv+xkg/wDSa5oA+maACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAPmb/go7/yRDRv+xkg/9JrmgD6ZoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA+Zv+Cjv/ACRDRv8AsZIP/Sa5oA+maACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAPmb/AIKO/wDJENG/7GSD/wBJrmgD6ZoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA+Zv+Cjv/JENG/7GSD/ANJrmgDjP+G5/wDql3/lf/8AuegA/wCG5/8Aql3/AJX/AP7noAP+G5/+qXf+V/8A+56AD/huf/ql3/lf/wDuegA/4bn/AOqXf+V//wC56AD/AIbn/wCqXf8Alf8A/uegA/4bn/6pd/5X/wD7noAP+G5/+qXf+V//AO56AD/huf8A6pd/5X//ALnoAP8Ahuf/AKpd/wCV/wD+56AD/huf/ql3/lf/APuegA/4bn/6pd/5X/8A7noAP+G5/wDql3/lf/8AuegA/wCG5/8Aql3/AJX/AP7noAP+G5/+qXf+V/8A+56AD/huf/ql3/lf/wDuegA/4bn/AOqXf+V//wC56AD/AIbn/wCqXf8Alf8A/uegA/4bn/6pd/5X/wD7noAP+G5/+qXf+V//AO56AD/huf8A6pd/5X//ALnoAP8Ahuf/AKpd/wCV/wD+56AD/huf/ql3/lf/APuegA/4bn/6pd/5X/8A7noAP+G5/wDql3/lf/8AuegA/wCG5/8Aql3/AJX/AP7noAP+G5/+qXf+V/8A+56AD/huf/ql3/lf/wDuegA/4bn/AOqXf+V//wC56AD/AIbn/wCqXf8Alf8A/uegA/4bn/6pd/5X/wD7noA8z/aO/aQ/4XD4Hs/DP/CGf2J9m1JL77R/af2jdtilTZt8pMZ83Oc9unPAA//Z';
        let { title, version, restartapponsave, source_info, editlitemode, instant_book } = metadata;

        let saveProjectMessage = LocaleUtils.instance.translate('statusView.saving');
        this.props.dispatchShowingInfoOfAction(saveProjectMessage);
        let seft = this;

        AppServices.saveProject(
            id,
            data,
            coverThumbnail,
            title,
            (parseInt(version, 10) + 1).toString(),
            restartapponsave,
            instant_book,
            source_info,
            editlitemode,
            (response) => {
                seft.saveProjectSuccess(response);
                if (successHandler) successHandler(response);
            },
            (error) => {
                seft.saveProjectFailed(error);
                if (failedHandler) failedHandler(error);
            }
        );
    }

    checkingUserIsLoggedIn() {
        const { showRegisterPop, userStatus } = this.props;
        this.onCloseSaveBookPopup();

        if (userStatus.isLoggedIn) {
            this.saveProject();
        } else {
            showRegisterPop();
        }
    }

    onToggleSaveBookPopup() {
        if (!this.state.isShowSaveBookPopup) {
            this.setState({
                isShowSaveBookPopup: true
            });
        }
    }

    renderSaveBookPopup() {
        return (
            <Popup
                style= 'save-your-book'
                type={popupType.cancel_left_side}
                title={LocaleUtils.instance.translate('alert.registration_timeout_title')}
                content={LocaleUtils.instance.translate('alert.registration_timeout_message')}
                textLeftBtn={LocaleUtils.instance.translate('button.remind_me_later')}
                textRightBtn={LocaleUtils.instance.translate('button.save_my_book')}
                onClickLeftBtn={this.onCloseSaveBookPopup}
                onClickRightBtn={this.checkingUserIsLoggedIn}
            />
        );
    }

    renderUnsupportCharactersPopup() {
        return (
            <Popup
                style ='unsupported-characters-found'    
                oneBtn
                icon={Popup.iconType.warningIcon}
                type={popupType.cancel_right_side}
                title={LocaleUtils.instance.translate('alert.unsupported_characters.title.text_container')}
                content={LocaleUtils.instance.translate('alert.unsupported_characters.message.text_container')}
                textRightBtn={LocaleUtils.instance.translate('label.ok')}
                onClickRightBtn={this.props.dispatchToggleShowUnsupportCharactersPopup}
            />
        );
    }

    saveProjectHavePublishedBefore() {
        this.saveProject();
        this.setState({
            isShowingUnpulishedChangesPopup: false
        });
    }

    gotoPreviewBookScreen() {
        this.setState({ isShowingUnpulishedChangesPopup: false });
        this.props.dispatchGotoPreviewBook();
    }

    renderUnpublishedChangesPopup() {
        return (
            <Popup
                type={popupType.cancel_left_side}
                title={LocaleUtils.instance.translate('active_exit_dialog.title')}
                content={LocaleUtils.instance.translate('active_exit_dialog.message_1')}
                textLeftBtn={LocaleUtils.instance.translate('label.ok')}
                textRightBtn={LocaleUtils.instance.translate('active_exit_dialog.publish')}
                onClickLeftBtn={this.saveProjectHavePublishedBefore.bind(this)}
                onClickRightBtn={this.gotoPreviewBookScreen.bind(this)}
            />
        );
    }

    renderReadyToOrderPopup() {
        return (
            <Popup
                style='ready-to-order2'    
                type={popupType.cancel_left_side}
                title={LocaleUtils.instance.translate('dialog.title.ready_to_order')}
                content={LocaleUtils.instance.translate('dialog.text.ready_to_order')}
                textLeftBtn={LocaleUtils.instance.translate('label.cancel')}
                textRightBtn={LocaleUtils.instance.translate('label.preview')}
                onClickLeftBtn={this.props.onCloseReadyToOrderPopup}
                onClickRightBtn={this.props.dispatchShowPreviewBook}
            />
        );
    }

    renderFacebookPopup() {
        return (
            <FacebookPopup
                title={LocaleUtils.instance.translate('alert.facebook_image_quality_warning.title')}
                content={LocaleUtils.instance.translate('alert.facebook_image_quality_warning.message')}
                textBtn={LocaleUtils.instance.translate('label.ok')}
                onClickBtn={this.props.onCloseFacebookPopup}
            />
        );
    }

    renderLimitPopup(photoList) {
        let currentPic = Object.values(photoList).length;
        let remainPic = Config.instance.maxImageLimit - currentPic;
        return (
            <LimitPopup
                title={LocaleUtils.instance.translate('warnings.too_many_photos.title')}
                content={LocaleUtils.instance.translate('warnings.too_many_photos.message', { 0: Config.instance.maxImageLimit, 1: Config.instance.maxPagesInBook, 2: currentPic, 3: remainPic })}
                textLeftBtn={LocaleUtils.instance.translate('label.cancel')}
                textMiddleBtn={LocaleUtils.instance.translate('warnings.too_many_photos.booksmart')}
                textRightBtn={LocaleUtils.instance.translate('warnings.too_many_photos.upload_button', { 0: remainPic })}
                onClickLeftBtn={this.props.onCloseLimitPopup}
                onClickRightBtn={this.props.onCloseLimitPopup}
            />
        );
    }

    renderBrowserDetectionAlert() {
        return (
            <Alert
                title={LocaleUtils.instance.translate('alert.javascript.browsers_unsupported')}
                content={LocaleUtils.instance.translate('alert.javascript.browsers_supported_list')}
            />
        );
    }

    renderAlert(title, content, textBtn, onClickBtn, attachedData) {
        return (
            <Alert
                title={title}
                content={content}
                textBtn={textBtn}
                onClickBtn={onClickBtn ? onClickBtn : this.props.onCloseAlert}
                attachedData={attachedData}
            />
        );
    }

    onDropPhotos(acceptedFiles, rejectedFiles) {
        if (!this.state.isDragActive) {
            this.setState({ isDragActive: true });
            return;
        }

        const { photoList, dispatchDropPhotoFromOutsideApp } = this.props;
        const { isShowPreLoader, isShowingPopup } = this.props.rootStatus;

        if (isShowPreLoader || isShowingPopup) {
            return;
        }

        dispatchDropPhotoFromOutsideApp(photoList, acceptedFiles, rejectedFiles);
    }

    renderUploaderManager(projectID, uploadingPhotos) {
        return (
            <UploaderManger
                projectId={projectID}
                uploadingPhotos={uploadingPhotos}
            />
        );
    }

    getLayoutHaveLogo(pageLayouts) {
        for (let i in pageLayouts) {
            if (pageLayouts[i].$.type === LAYOUT_TYPE_TEXT_MISC.LOGO) {
                return pageLayouts[i];
            }
        }
    }

    gotoBookPricingPage() {
        window.open(LocaleUtils.instance.translate('urls.pricing'), '_blank');
    }

    confirmChangeCustomLogo() {
        const { project, dispatchChangeLayoutForLastPage } = this.props;
        let totalPages = project.book.pages.present.length;
        let logoPageId = totalPages - 1;
        let isLogoChanged = project.book.bookInfo.isLogoChanged;
        let PageLayout = project.book.layouts.PageLayout;
        let layoutFilted = project.book.layouts.typesOfLayouts[5];
        let newLayout = isLogoChanged ? PageLayout[0] : this.getLayoutHaveLogo(layoutFilted);

        dispatchChangeLayoutForLastPage([logoPageId], newLayout);
    }

    renderChangeLogoPopup() {
        const { isShowCustomeLogoPopup } = this.props.rootStatus;
        const { isLogoChanged } = this.props.project.book.bookInfo;

        let title = isLogoChanged ? 'clu.revert_menu.title' : 'clu.upgrade_menu.title';
        let content2 = isLogoChanged ? 'clu.revert_menu.text' : 'clu.upgrade_menu.text';
        let firstBtnString = 'label.pricing';
        let secondBtnString = 'label.cancel';
        let thirdBtnString = isLogoChanged ? 'clu.revert_menu.confirm' : 'clu.upgrade_menu.confirm';

        if (isShowCustomeLogoPopup) {
            return (
                <PopupWithThreeButtons
                    style='custom-logo'   
                    title={LocaleUtils.instance.translate(title)}
                    content2={LocaleUtils.instance.translate(content2)}
                    firstBtn={this.gotoBookPricingPage}
                    firstBtnString={LocaleUtils.instance.translate(firstBtnString)}
                    secondBtn={this.props.dispatchToggleCustomLogoPopup}
                    secondBtnString={LocaleUtils.instance.translate(secondBtnString)}
                    thirdBtn={this.confirmChangeCustomLogo}
                    thirdBtnString={LocaleUtils.instance.translate(thirdBtnString)}
                    onClose={this.props.dispatchToggleCustomLogoPopup}
                />
            );
        }
    }

    onCloseMissingAssetsPopup() {
        this.props.dispatchShowingMissingAssets(false);
    }

    renderMissingAssetsPopup() {
        const { isShowingMissingAssetsPopup, isRecoveredSuccess } = this.props.rootStatus;
        let title = isRecoveredSuccess ? 'recover.missingphotostream.success.title' : 'recover.missingphotostream.fail.title';
        let content = isRecoveredSuccess ? 'recover.missingphotostream.success.message' : 'recover.missingphotostream.fail.message';
    
        if (isShowingMissingAssetsPopup) {
            return (
                <Popup
                    style= 'missing-Assets-Popup'    
                    oneBtn
                    type={popupType.cancel_right_side}
                    title={LocaleUtils.instance.translate(title)}
                    content={LocaleUtils.instance.translate(content)}
                    textRightBtn={LocaleUtils.instance.translate('label.ok')}
                    onClickRightBtn={this.onCloseMissingAssetsPopup.bind(this)}
                />
            );
        }
    }

    onCloseErrorPopup() {
        this.props.dispatchShowingErrorPopup(null);
    }

    onRestartApp() {
        this.togglePreventClosingPageEvent(false);
        window.location.reload(true);
    }

    onDrapEnter(event) {   
        const dt = event.dataTransfer;
        
        if (dt.items && dt.items.length > 0 && dt.items[0].kind === 'string') {
            this.setState({
                isDragActive: false
            });
            return;
        }
    }

    render() {
        let classNameRoot = '';
        let { isShowSaveBookPopup, isShowingUnpulishedChangesPopup, isShowingMissingAssetsPopup } = this.state;
        let rootStatus = this.props.rootStatus;
        if (isShowSaveBookPopup || isShowingUnpulishedChangesPopup || rootStatus.isShowRegister || rootStatus.isShowSignIn ||
            rootStatus.isShowLargeImagePopup || rootStatus.isShowCustomeLogoPopup || rootStatus.imagesDuplicated.isShowingImagesDuplicated ||
            rootStatus.isShowingMissingAssetsPopup)
        {
            rootStatus.isShowingPopup = true;
            classNameRoot = "root-zone blur-effect";
        } else {
            classNameRoot = "root-zone";
            rootStatus.isShowingPopup = false;
        }
        let bookDesignFooterStatus = this.props.bookDesignFooterStatus;

        let orderType = bookDesignFooterStatus.isChangeSortingTypePhotos ? bookDesignFooterStatus.sortingType : '';
        if (rootStatus.isAppCrashed) {
          /*return (
            <div>
            {rootStatus.isShowingErrorPopup && rootStatus.error  && <ErrorPopup
                                                                        error={rootStatus.error}
                                                                        onClose={this.onCloseErrorPopup}
                                                                        leftBtnFunc={this.props.dispatchShowingErrorDetailPopup}
                                                                        rightBtnFunc={this.onRestartApp} />}
            {rootStatus.isShowingErrorDetailPopup && rootStatus.error && <ErrorDetailPopup
                                                                          errorMessage={rootStatus.error.errorMessage}
                                                                          errorStack={rootStatus.error.errorStack}
                                                                          onClose={this.props.dispatchShowingErrorDetailPopup} />}
            </div>
          );*/
        }
        return (
            <Dropzone
                className={classNameRoot}
                disableClick
                disablePreview={!this.state.isDragActive}
                accept="image/jpeg, image/png, image/jpg"
                onDrop={this.onDropPhotos}
                onDragEnter={this.onDrapEnter.bind(this)}
            >
                {rootStatus.isShowPreLoader && <PreLoader percentComplete={this.state.percentComplete} />}
                {rootStatus.isShowBookDesignScreen && <BookDesignPage checkingUserIsLoggedIn={this.checkingUserIsLoggedIn} />}
                {rootStatus.isShowAutoCreateBookScreen && <AutoCreateBookPage saveProject={this.saveProject} />}
                {rootStatus.isShowChangeOrderLayoutBookScreen && <ChangeOrderLayoutBookPage orderType={orderType} saveProject={this.saveProject} />}
                {rootStatus.isShowStartSelectPhotoScreen && <SelectingPhotosPage />}
                {rootStatus.isShowChangeBookDesignScreen && <ChangeDesignPage saveProject={this.saveProject} />}
                {rootStatus.isShowPreviewBookScreen && <PreviewBook saveProject={this.saveProject} readyPublishingBook={this.state.doPublishBook} updateReadyPublishingBook={this.updateReadyPublishingBook.bind(this)} />}
                {rootStatus.isShowRegister && <RegisterPopup saveProject={this.saveProject} />}
                {rootStatus.isShowSignIn && <LoginPopup saveProject={this.saveProject} />}
                {rootStatus.isShowLargeImagePopup && <LargeImagePopup photoName={rootStatus.photoName} onClose={this.props.onCloseLargeImagePopup} />}
                {rootStatus.isShowFacebookPopup && this.renderFacebookPopup()}
                {rootStatus.isShowLimitPopup && this.renderLimitPopup(this.props.photoList)}
                {this.state.isShowSaveBookPopup && this.renderSaveBookPopup()}
                {this.state.isShowBrowerDetectionPopup && this.renderBrowserDetectionAlert()}
                {rootStatus.isShowAlert && this.renderAlert(rootStatus.title, rootStatus.content, rootStatus.textBtn, rootStatus.onClickBtn, rootStatus.attachedData)}
                {rootStatus.isShowWelcomeNewRegister && <WelcomePopup isLogin={false} username={this.props.userStatus.userVO.username} />}
                {rootStatus.isShowWelcomeBackLogin && <WelcomePopup isLogin={true} username={this.props.userStatus.userVO.username} />}
                {rootStatus.isShowReadyToOrderPopup && this.renderReadyToOrderPopup()}
                {rootStatus.isShowUnsupportCharactersPopup && this.renderUnsupportCharactersPopup()}
                {this.renderUploaderManager(this.props.project.projectInfo.id, this.props.uploadingPhotos)}
                {this.renderChangeLogoPopup()}
                {rootStatus.isShowingLoginAlert && <LoginAlert />}
                {rootStatus.isShowingErrorPopup && rootStatus.error  && <ErrorPopup
                                                                            error={rootStatus.error}
                                                                            onClose={this.onCloseErrorPopup}
                                                                            leftBtnFunc={this.props.dispatchShowingErrorDetailPopup}
                                                                            rightBtnFunc={this.onRestartApp} />}
                {rootStatus.isShowingErrorDetailPopup && rootStatus.error && <ErrorDetailPopup
                                                                            errorMessage={rootStatus.error.errorMessage}
                                                                            errorStack={rootStatus.error.errorStack}
                                                                            onClose={this.props.dispatchShowingErrorDetailPopup} />}
                {rootStatus.imagesDuplicated.isShowingImagesDuplicated && <ImagesDuplicatePopup
                                                                                images={rootStatus.imagesDuplicated.images}
                                                                                onContinue={rootStatus.imagesDuplicated.continueFunc} />}
                {this.renderMissingAssetsPopup()}
                {this.state.isShowingUnpulishedChangesPopup && this.renderUnpublishedChangesPopup()}
            </Dropzone>
        );
    }
}

const dispatchDropPhotoFromOutsideApp = (dispatch, photoList, acceptedFiles, rejectedFiles) => {
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
                dispatch(addUploaderToUploadingList(photoTypes.COMPUTER, imagesAfterFilter.imagesFilted));
            }
            dispatch(toggleImagesDuplicatedPopup([], null));
        }));
    } else {
        dispatch(addUploaderToUploadingList(photoTypes.COMPUTER, imagesAfterFilter.imagesFilted));
    }
}

function requestCreateProject(project, photoList, createProjectFinish, createProjectFailed) {
    let { book } = project;

    let title = "";
    let version = "1";
    let restartAppOnSave = "false";
    let instant_book = "";
    let sourceInfo = "";
    let editLiteMode = "false";
    let cover_thumbnail = "";

    AppServices.createProject(
        book.toBBFXmlString(photoList),
        cover_thumbnail,
        title,
        version,
        restartAppOnSave,
        instant_book,
        sourceInfo,
        editLiteMode,
        createProjectFinish,
        createProjectFailed
    );
}

function preload(dispatch, root) {
    dispatch(showPreloader());
}

function init(dispatch, root) {
    let projectId = LocationUtils.instance.getParameterByName('project');

    const initFinish = () => {
        dispatch({type:'INIT'});
        dispatch(showBookDesignScreen());
        root.timingSaveBook = setInterval(root.onToggleSaveBookPopup, 600000);

        let format = root.props.project.book.bookInfo.format;
        let amountPage = root.props.project.book.pages.present.length;
        document.title = LocaleUtils.instance.translate('browser.title', { '0': format, '1': amountPage });

        //Catch closing page event or refresh page
        dispatch(togglePreventClosingPageEvent());
    };

    const createProjectFinish = (response) => {
        handleParseProjectInfo(response, dispatch);
        initFinish();
    };

    const loadLayoutsFinish = () => {
        let project = root.props.project;
        if (project.projectInfo.id && project.projectInfo.id !== '') {
            initFinish();
        } else {
            requestCreateProject(root.props.project, root.props.photoList, createProjectFinish.bind(this), function(error) {});
        }
    };

    const loadProjectFinish = (bookFormat) => {
        loadLayouts(bookFormat, loadLayoutsFinish.bind(this), function(error) {}.bind(this), dispatch);
    };

    const loadStarterProjectFinish = (response) => {
        const bookFormat = handleParseStarterProject(response, dispatch);
        AppServices.trackCTEvent(CTEventFactory.instance.createProjectCreatedEvent(getProjectLayoutName()), null, null);
        loadProjectFinish(bookFormat);
    };

    const loadExistProjectFinish = (response) => {
        const bookFormat = handleParseExistProject(response, root.props.photoList, dispatch);
        AppServices.trackCTEvent(CTEventFactory.instance.createProjectLoadedEvent(), null, null);
        loadProjectFinish(bookFormat);
    };

    if (projectId) {
        if (!root.props.userStatus.isLoggedIn) {
            root.props.dispatchToggleLoginAlert();
        } else {
            AppServices.loadImages(projectId,
                (response) => {
                    handleParseImages(response, dispatch);

                    AppServices.loadExistingProject(projectId, loadExistProjectFinish.bind(this),
                        (error) => {
                            AppServices.trackCTEvent(CTEventFactory.instance.createProjectLoadFailedEvent(), null, null);
                            showInvalidProjectAlert(dispatch);
                        });
                },
                (err) => {
                    toggleErrorConnectingToServerPopup(dispatch);
                }
            );
        }
    } else {
        const starterProjectLayoutName = getProjectLayoutName();
        AppServices.loadStarterProject(starterProjectLayoutName, loadStarterProjectFinish.bind(this), function (error) {});
    }
}

function toggleErrorConnectingToServerPopup(dispatch) {
    let message = LocaleUtils.instance.translate('error.server_unreachable');
    dispatch(toggleShowingErrorPopup({ type: 'error_connect', errorMessage: message, errorStack: null }));
}

function showInvalidProjectAlert(dispatch) {
  dispatch(toggleAlert(LocaleUtils.instance.translate('warnings.invalid_project.title'),
                        LocaleUtils.instance.translate('warnings.invalid_project.message'),
                        LocaleUtils.instance.translate('label.continue'), LocationUtils.instance.gotoMyBookPage, null));
}

function getProjectLayoutName() {
    let starterBookLayout = LocationUtils.instance.getParameterByName('starterbook');
    if (starterBookLayout) return starterBookLayout;

    let designerBookLayout = LocationUtils.instance.getParameterByName('designerbook');
    if (designerBookLayout) return `square_designerbook_${designerBookLayout}`;

    let yearBookLayout = LocationUtils.instance.getParameterByName('yearbook');
    if (yearBookLayout) return yearBookLayout;

    return 'square_cleansimple';
}

function loadLayouts(bookFormat, loadFinish, loadError, dispatch) {
    const loadAutoFlowLayoutsFinish = (response) => {
        handleParseAutoFlowLayouts(response, dispatch);
        loadFinish();
    };

    const loadThemesFinish = (response) => {
        handleParseThemes(response, dispatch);
        AppServices.loadAutoFlowLayouts(bookFormat, loadAutoFlowLayoutsFinish.bind(this), loadError);
    };

    const loadCoverLayoutsFinish = (response) => {
        handleParseCoverLayouts(response, dispatch);
        AppServices.loadThemes(loadThemesFinish.bind(this), loadError);
    };

    const loadPageLayoutsFinish = (response) => {
        handleParsePageLayouts(response, dispatch);
        AppServices.loadCoverLayouts(bookFormat, loadCoverLayoutsFinish.bind(this), loadError);
    };

    AppServices.loadPageLayouts(bookFormat, loadPageLayoutsFinish.bind(this), loadError);
}

function handleParseAutoFlowLayouts(response, dispatch) {
    dispatch(setAutoFlowLayouts(response));
}

function handleParseCoverLayouts(response, dispatch) {
    dispatch(setCoverLayouts(response));
}

function handleParseThemes(response, dispatch) {
    dispatch(setThemes(response.Themes.Theme));
}

function handleParsePageLayouts(response, dispatch) {
    dispatch(setLayouts(response.PageLayouts));
}

function handleParseProjectInfo(response, dispatch) {
    let { project } = response;
    dispatch(setProjectInfo(project));
}

function handleParseImages(response, dispatch) {
    let project_images = response.project_images[0];
    let photos = project_images.photos[0];

    if (photos.hasOwnProperty('photo') && photos.photo.length > 0) {
        dispatch(photoListAct_addPhotosByLoadingProject(photos.photo));
    }

    let NumImagesAffected = CTEventFactory.instance.getNumImagesAffected();
    if (NumImagesAffected > 0) {
        AppServices.trackCTEvent(CTEventFactory.instance.createErrrorMissingImagesEvent(NumImagesAffected), null, null);
    }
}

function handleReplaceImageSourceId(book, photoList) {
    const replaceImageSourceIdForImageContainers = (imageContainers) => {
        for (let i in imageContainers) {
            const imageContainer = imageContainers[i];

            if (!imageContainer.Image) continue;

            for (let photoKey in photoList) {
                const photo = photoList[photoKey];

                if (photo.id === imageContainer.Image.image_source_id) {
                    imageContainer.Image.image_source_id = photo.baseId;
                }
            }
        }
    };

    let covers = book.covers;
    if (covers.frontCover) replaceImageSourceIdForImageContainers(covers.frontCover.ImageContainer, photoList);
    if (covers.backCover) replaceImageSourceIdForImageContainers(covers.backCover.ImageContainer, photoList);
    if (covers.spine) replaceImageSourceIdForImageContainers(covers.spine.ImageContainer, photoList);
    if (covers.frontFlap) replaceImageSourceIdForImageContainers(covers.frontFlap.ImageContainer, photoList);
    if (covers.backFlap) replaceImageSourceIdForImageContainers(covers.backFlap.ImageContainer, photoList);
}

function handleParseExistProjectInfo(project, dispatch) {
    let projectInfo = {};
    let productIdKey = 'product-id';
    let createdAtKey ='created-at';
    let dateUploadedKey = 'date-uploaded';
    let updatedAtKey = 'updated-at';

    projectInfo.id = project.id[0];
    projectInfo[productIdKey] = project[productIdKey][0];
    let metadataOfProject = project.metadata[0];
    projectInfo.metadata = {};
    projectInfo.metadata.apiversion =  metadataOfProject.apiversion[0];
    projectInfo.metadata.editlitemode =  metadataOfProject.editlitemode[0];
    projectInfo.metadata.instant_book =  metadataOfProject.instant_book[0];
    projectInfo.metadata.restartapponsave =  metadataOfProject.restartapponsave[0];
    projectInfo.metadata.size =  metadataOfProject.size[0];
    projectInfo.metadata.source_info =  metadataOfProject.source_info[0];
    projectInfo.metadata.source_name =  metadataOfProject.source_name[0];
    projectInfo.metadata.title =  metadataOfProject.title[0];
    projectInfo.metadata.version =  metadataOfProject.version[0];
    projectInfo.metadata[createdAtKey] =  metadataOfProject[createdAtKey][0];
    projectInfo.metadata[dateUploadedKey] =  metadataOfProject[dateUploadedKey][0];
    projectInfo.metadata[updatedAtKey] =  metadataOfProject[updatedAtKey][0];

    dispatch(setProjectInfo(projectInfo));
}

function handleParseStarterProject(response, dispatch) {
    let project = response.project;
    let data = project.data[0];
    let book = data.Book[0];
    let contents = book.Contents[0];

    let covers = contents.Covers[0];
    let cover = covers.Cover[0];
    let coverInfo = cover.$;
    let backCover = cover.BackCover[0].$;
    let backFlap = cover.BackFlap[0].$;
    let frontCover = cover.FrontCover[0].$;
    let frontFlap = cover.FrontFlap[0].$;
    let spine = cover.Spine[0].$;

    let pages = contents.Pages[0].Page.map((pageJson) => (pageJson.$));

    dispatch(setBookInfo(book.$.format, book.$.theme));
    dispatch(setCovers(coverInfo, backCover, backFlap, frontCover, frontFlap, spine));
    dispatch(setPages(pages));

    return book.$.format;
}

function handleParseExistProject(response, photoList, dispatch) {
    let project = response.project[0];

    handleParseExistProjectInfo(project, dispatch);

    let data = project.data[0];
    let book = data.Book[0];
    let contents = book.Contents[0];

    let bookMetaData = book.BookMetaData[0];
    let covers = contents.Covers[0];
    let cover = covers.Cover[0];
    let coverInfo = cover.$;
    let backCover = parsePage(cover.BackCover[0], photoList, dispatch);
    let backFlap = parsePage(cover.BackFlap[0], photoList, dispatch);
    let frontCover = parsePage(cover.FrontCover[0], photoList, dispatch);
    let frontFlap = parsePage(cover.FrontFlap[0], photoList, dispatch);
    let spine = parsePage(cover.Spine[0], photoList, dispatch);

    let pages = parsePages(contents.Pages[0].Page, photoList, dispatch);

    dispatch(setBookMetaData(bookMetaData.Author[0], bookMetaData.AuthorEmail[0], bookMetaData.Subtitle[0],
        bookMetaData.Title[0], bookMetaData.CreatedContext ? bookMetaData.CreatedContext[0] : undefined));
    dispatch(setBookInfo(book.$.format, book.$.theme));
    dispatch(setCovers(coverInfo, backCover, backFlap, frontCover, frontFlap, spine));
    dispatch(setPages(pages));
    dispatch(setAmountPage(pages.length));

    return book.$.format;
}

function parsePages(pages, photoList, dispatch) {
    let newPages = [];
    for (let key in pages) {
        let page = parsePage(pages[key], photoList, dispatch);
        newPages.push(page);
    }

    return newPages;
}

function parsePage(page, photoList, dispatch) {
    let pageResult = {};

    if (page.$) {
        for (let childKey in page.$) {
            pageResult[childKey] = page.$[childKey];
        }
    }

    pageResult.ImageContainer = parseImageContainersOfPage(page.ImageContainer, photoList, dispatch);
    pageResult.TextContainer = parseTextContainersOfPage(page.TextContainer);

    return pageResult;
}

function replaceImageSouceIdByBaseId(image, photoList) {
    for (let photoKey in photoList) {
        const photo = photoList[photoKey];

        if (photo.id === image.image_source_id) {
            image.image_source_id = photo.baseId;
            return true;
        }
    }

    return false;
}

function recoveredMissingImages(projectId, image, dispatch) {
    const recoveredFail = (err) => {
        dispatchShowingMissingAssets(dispatch, false);
    }

    const recoveredSuccess = (response) => {
        let photos = response['project_images'][0]['photos'];

        if (photos.length > 0) {
            dispatchShowingMissingAssets(dispatch, true);
            
            AppServices.loadImages(projectId,
                (response) => {
                    let project_images = response.project_images[0];
                    let photos = project_images.photos[0];

                    for (let photo of photos.photo) {
                        if (photo.id[0] === image.image_source_id) {
                            image.image_source_id = photo.filename[0];
                            break;
                        }
                    }

                    handleParseImages(response, dispatch);
                },
                (err) => {
                    toggleErrorConnectingToServerPopup(dispatch);
                }
            );
        }
    }

    AppServices.recoveredMissingImages(projectId, image.image_source_id, recoveredSuccess, recoveredFail);
}

function parseImageContainersOfPage(imageContainers, photoList, dispatch) {
    if (!imageContainers) {
        return imageContainers;
    }

    let imageContainersResult = [];

    if (imageContainers.$) {
        for (let childKey in imageContainers.$) {
            imageContainersResult[childKey] = imageContainers.$[childKey];
        }
    }

    if (imageContainers.length > 0) {
        for (let index in imageContainers) {
            let imageContainer = imageContainers[index];
            let imageContainerResult = {};

            if (imageContainer.Image) {
                imageContainerResult.Image = imageContainer.Image[0].$;

                if (!replaceImageSouceIdByBaseId(imageContainerResult.Image, photoList)) {
                    let projectId = LocationUtils.instance.getParameterByName('project');
                    let missingImageId = imageContainerResult.Image.image_source_id;

                    recoveredMissingImages(projectId, imageContainerResult.Image, dispatch);
                }
            }
            if (imageContainer.$) {
                imageContainerResult.$ = imageContainer.$;
            }

            imageContainersResult[index] = imageContainerResult;
        }
    }

    return imageContainersResult;
}

function parseTextContainersOfPage(textContainers) {
    if (!textContainers) {
        return textContainers;
    }

    let textContainersResult = [];

    if (textContainers.$) {
        for (let childKey in textContainers.$) {
            textContainersResult[childKey] = textContainers.$[childKey];
        }
    }

    if (textContainers.length > 0) {
        for (let index in textContainers) {
            let textContainer = textContainers[index];
            let textContainerResult = {};

            if (textContainer.Text) {
                textContainerResult.Text = textContainer.Text[0];
            }
            if (textContainer.ParsedText) {
                textContainerResult.parsedText = textContainer.ParsedText[0];
            }
            if (textContainer.$) {
                textContainerResult.$ = textContainer.$;
            }

            textContainersResult[index] = textContainerResult;
        }
    }

    return textContainersResult;
}

const dispatchShowingMissingAssets = (dispatch, isRecoveredSuccess) => {
    dispatch(toggleShowingMissingAssetsPopup(isRecoveredSuccess));
}

const dispatchUserLoggedIn = (dispatch, user) => {
    dispatch(userLoginSuccess(user));
};

const showRegisterPop = (dispatch) => {
    dispatch(toggleRegisterPopup());
};

const onCloseFacebookPopup = (dispatch) => {
  dispatch(toggleFacebookPopup());
};

const onCloseLimitPopup = (dispatch) => {
  dispatch(toggleLimitPopup());
};

const onCloseAlert = (dispatch) => {
  dispatch(toggleAlert());
};

const onCloseLargeImagePopup = (dispatch) => {
    dispatch(toggleLargeImagePopup());
};

const onSaveProject = (dispatch, project) => {
    dispatch(setProjectInfo(project));
};

const onUpdateLastTimeSaved = (dispatch) => {
    dispatch(updateLastTimeSaved());
};

const dispatchShowingInfoOfAction = (dispatch, message) => {
    dispatch(toggleShowingInfoOfAction(message));
};

const dispatchToggleWelcomeNewRegister = (dispatch) => {
    dispatch(toggleWelcomeNewRegister());
};

const dispatchToggleWelcomeBackLogin = (dispatch) => {
    dispatch(toggleWelcomeBackLogin());
};

const onCloseReadyToOrderPopup = (dispatch) => {
    dispatch(toggleReadyToOrderPopup());
}

const dispatchGotoPreviewBook = (dispatch) => {
    dispatch(showPreviewBook());
}

const dispatchShowPreviewBook = (dispatch) => {
    dispatch(showPreviewBook());
    onCloseReadyToOrderPopup(dispatch);
};

const dispatchToggleCustomLogoPopup = (dispatch) => {
    dispatch(toggleShowCustomLogoPopup());
}

const dispatchToggleShowUnsupportCharactersPopup = (dispatch) => {
    dispatch(toggleShowUnsupportCharactersPopup());
}

const dispatchChangeLayoutForLastPage = (dispatch, pages, newLayout) => {
    dispatchToggleCustomLogoPopup(dispatch);    //close popup
    dispatch(toggleChangeLogoOfBook());
    dispatch(setPageLayout(pages, newLayout));
};

const dispatchToggleLoginAlert = (dispatch) => {
    dispatch(toggleLoginAlert());
}

const dispatchShowingErrorPopup = (dispatch, error) => {
    dispatch(toggleShowingErrorPopup(error));
}

const dispatchShowingErrorDetailPopup = (dispatch) => {
    dispatch(toggleShowingErrorDetailPopup());
}

const mapDispatchToProps = (dispatch) => {
    return {
        preload: (root) => { preload(dispatch, root) },
        init: (root) => { init(dispatch, root) },
        showRegisterPop: () => showRegisterPop(dispatch),
        onCloseLargeImagePopup: () => onCloseLargeImagePopup(dispatch),
        onCloseFacebookPopup: () => onCloseFacebookPopup(dispatch),
        onCloseLimitPopup: () => onCloseLimitPopup(dispatch),
        onCloseAlert: () => onCloseAlert(dispatch),
        onSaveProject: (project) => onSaveProject(dispatch, project),
        onUpdateLastTimeSaved: () => onUpdateLastTimeSaved(dispatch),
        dispatchUserLoggedIn: (user) => dispatchUserLoggedIn(dispatch, user),
        dispatchShowingInfoOfAction: (message) => dispatchShowingInfoOfAction(dispatch, message),
        dispatchToggleWelcomeNewRegister: () => dispatchToggleWelcomeNewRegister(dispatch),
        dispatchToggleWelcomeBackLogin: () => dispatchToggleWelcomeBackLogin(dispatch),
        onCloseReadyToOrderPopup: () => onCloseReadyToOrderPopup(dispatch),
        dispatchShowPreviewBook: () => dispatchShowPreviewBook(dispatch),
        dispatchDropPhotoFromOutsideApp: (photoList, acceptedFiles, rejectedFiles) => dispatchDropPhotoFromOutsideApp(dispatch, photoList, acceptedFiles, rejectedFiles),
        dispatchToggleCustomLogoPopup: () => dispatchToggleCustomLogoPopup(dispatch),
        dispatchToggleShowUnsupportCharactersPopup: () => dispatchToggleShowUnsupportCharactersPopup(dispatch),
        dispatchChangeLayoutForLastPage: (pages, newLayout) => dispatchChangeLayoutForLastPage(dispatch, pages, newLayout),
        dispatchToggleLoginAlert: () => dispatchToggleLoginAlert(dispatch),
        dispatchShowingErrorPopup: (error) => dispatchShowingErrorPopup(dispatch, error),
        dispatchShowingErrorDetailPopup: () => dispatchShowingErrorDetailPopup(dispatch),
        dispatchGotoPreviewBook: () => dispatchGotoPreviewBook(dispatch),
        dispatchShowingMissingAssets: (isRecoveredSuccess) => dispatchShowingMissingAssets(dispatch, isRecoveredSuccess)
    }
};

const mapStateToProps = (state) => {
    const { appStatus, project, userStatus, photoList, getPhotosData } = state;
    const { rootStatus, bookDesignHeaderStatus, bookDesignFooterStatus } = appStatus;

    return {
        rootStatus,
        project,
        userStatus,
        bookDesignHeaderStatus,
        bookDesignFooterStatus,
        photoList,
        uploadingPhotos: getPhotosData.uploadingPhotos

    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Root);
