import React from 'react';
import { connect } from 'react-redux';

import AppServices from './../../services/AppServices';

import './../../styles/GeneralStyle.css';
import PreviewPages             from './../../components/previewPages/PreviewPages';
import Header                   from './../../components/materials/header/Header';
import Footer                   from './../../components/materials/footer/Footer';
import Button, { colorType }    from './../../components/materials/button/Button';
import LocaleUtils              from './../../utils/LocaleUtils';
import CTEventFactory           from './../../utils/CTEventFactory';
import Assets                   from './../../assets/Assets';
import PopupWithThreeButtons    from './../../components/popup/popupWithThreeButtons/PopupWithThreeButtons'
import BookOrderPopup           from './../../components/popup/bookOrder/BookOrderPopup';
import PublishingBookPopup      from './../../components/popup/publishingBookPopup/PublishingBookPopup';
import WelcomePopup             from './../../components/popup/welcomePopup/WelcomePopup';
import PublishFailedPopup       from './../../components/popup/publishFailedPopup/PublishFailedPopup';
import DustJacketFlapsPopup     from './../../components/popup/dustJacketFlapsPopup/DustJacketFlapsPopup';
import Popup, { popupType } from './../../components/popup/Popup';
import { photoTypes, COVER_TYPE } from './../../constants/Constants';
import { toggleRegisterPopup, showBookDesignScreen, togglePreventClosingPageEvent } from './../../actions/appStatusActions/RootStatusActions';

const StillGettingPhotosPopup = ({ onIgnorWarning, onCancel }) => {
    return (
        <Popup
            style="still-getting-book1"
            type={popupType.cancel_right_side}
            title={LocaleUtils.instance.translate('preflight.still_getting_photos.title')}
            icon={Popup.iconType.warningIcon}
            content={LocaleUtils.instance.translate('preflight.still_getting_photos.text')}
            textLeftBtn={LocaleUtils.instance.translate('preflight.button.ignore')}
            textRightBtn={LocaleUtils.instance.translate('preflight.button.cancel')}
            onClickLeftBtn={onIgnorWarning}
            onClickRightBtn={onCancel}
        />
    );
}

const WaitingUploadingFinishPopup = ({ onCloseWaitingPopup }) => {
    return (
        <Popup
            oneBtn
            style="still-getting-book1"
            type={popupType.cancel_right_side}
            title={LocaleUtils.instance.translate('preflight.still_getting_photos.title')}
            icon={Popup.iconType.warningIcon}
            content={LocaleUtils.instance.translate('preflight.still_getting_photos_used_in_book.text')}
            textLeftBtn={null}
            textRightBtn={LocaleUtils.instance.translate('preflight.button.cancel')}
            onClickLeftBtn={null}
            onClickRightBtn={onCloseWaitingPopup}
        />
    );
}

class PreviewBook extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hideBookWarningPopup: false,
            allImageAndTextOutOfContainer: false,
            imageOutOfContainer: false,
            textContentOutOfContainer: false,
            isStillGettinngPhotos: false, 
            isShowProgressPublishingPopup: false,
            isShowReadyOrderBookPopup: false,
            isShowPublishFailedPopup: false,
            isShowDustJacketFlapsPopup: false,
            isShowWaitingUploadingFinish: false,
            bookOrderUrl: null
        }

        this.finishBookClick = this.finishBookClick.bind(this);
        this.handleFinishBook = this.handleFinishBook.bind(this);
        this.openUrl = this.openUrl.bind(this);
        this.toggleShowReadyOrderBook = this.toggleShowReadyOrderBook.bind(this);
        this.turnOnProgressingPublishBook = this.turnOnProgressingPublishBook.bind(this);
        this.turnOffProgressingPublishBook = this.turnOffProgressingPublishBook.bind(this);
        this.toggleShowStillGettingPhotoPopup = this.toggleShowStillGettingPhotoPopup.bind(this);
        this.toggleBookWarningPopup = this.toggleBookWarningPopup.bind(this);
        this.ignoreWarningStillGettingPhoto = this.ignoreWarningStillGettingPhoto.bind(this);
        this.toggleShowPublishFailedPopup = this.toggleShowPublishFailedPopup.bind(this);
        this.gotoLinkContactCustomerSupport = this.gotoLinkContactCustomerSupport.bind(this);
        this.toggleShowDustJacketPopup = this.toggleShowDustJacketPopup.bind(this);
    }

    componentWillUpdate(nextProps) {
        if (nextProps.readyPublishingBook !== this.props.readyPublishingBook && nextProps.readyPublishingBook) {
            this.turnOnProgressingPublishBook();
            this.finishBookClick();
        }
    }

    openUrl() {
        if (this.state.bookOrderUrl) {
            window.location.replace(this.state.bookOrderUrl, '_self');
        }
    }

    turnOnProgressingPublishBook() {
        if (!this.state.isShowProgressPublishingPopup) {
            this.setState({
                isShowProgressPublishingPopup: true
            });
        }
    }

    turnOffProgressingPublishBook() {
        this.setState({
            isShowProgressPublishingPopup: false
        });
    }

    toggleShowReadyOrderBook(bookUrl) {
        if (this.state.isShowDustJacketFlapsPopup) {
            this.setState({
                bookOrderUrl: bookUrl    
            });
            return;
        }

        this.setState({
            isShowDustJacketFlapsPopup: false,
            isShowReadyOrderBookPopup: !this.state.isShowReadyOrderBookPopup,
            bookOrderUrl: bookUrl
        });

        setTimeout(() => { this.openUrl(); }, 3000);
    }

    toggleShowStillGettingPhotoPopup() {
        this.setState({
            isStillGettinngPhotos: !this.state.isStillGettinngPhotos,
            imageOutOfContainer: false
        });
    }

    toggleBookWarningPopup() {
        this.setState({
            isStillGettinngPhotos: false,
            hideBookWarningPopup: true
        });
    }

    toggleShowPublishFailedPopup() {
        this.setState({
            isShowProgressPublishingPopup: false,
            isShowPublishFailedPopup: !this.state.isShowPublishFailedPopup
        });
    }

    gotoLinkContactCustomerSupport() {
        let link = LocaleUtils.instance.translate('urls.contactCustomerSupport');
        this.toggleShowPublishFailedPopup();
        window.open(link, '_blank');
    }

    checkingHaveUploadingPhotos(uploadingPhotos) {
        for (let index in uploadingPhotos) {
            if (uploadingPhotos[index].uploadType === photoTypes.COMPUTER) {
                return true;
            }
        }
        return false;
    }

    toggleShowDustJacketPopup() {
        this.setState({
            isShowDustJacketFlapsPopup: !this.state.isShowDustJacketFlapsPopup
        });
    }

    checkingImageInDustJacketCover(imageContainer) {
        for (let image of imageContainer) {
            if (image.Image) {
                return true;
            }
        }

        return false;
    }

    checkingFlapContent(flap) {
        if (flap.ImageContainer && this.checkingImageInDustJacketCover(flap.ImageContainer))
            return true;

        let lastTextContainer = flap.TextContainer ? flap.TextContainer[flap.TextContainer.length - 1] : null;
        if (lastTextContainer && lastTextContainer.parsedText)
            return true;
        
        return false;
    }

    checkingDustJacketContent() {
        const { frontFlap, backFlap } = this.props.project.book.covers;

        if (this.checkingFlapContent(frontFlap) || this.checkingFlapContent(backFlap))
            return true;

        return false;
    }
    
    finishBookClick() {
        const { project, photoList, uploadingPhotos,
            isLoggedIn, dispatchShowRegisterPopup, checkImagesSourceInBookIsComplete } = this.props;
        const { allImageAndTextOutOfContainer, imageOutOfContainer, textContentOutOfContainer } = this.state;

        if (!isLoggedIn) {
            this.props.updateReadyPublishingBook();
            dispatchShowRegisterPopup();
            return;
        }

        if (!checkImagesSourceInBookIsComplete(project.book, photoList)) {
            this.setState({ isShowWaitingUploadingFinish: true });
        } else if (this.checkingHaveUploadingPhotos(uploadingPhotos)) {
            this.toggleShowStillGettingPhotoPopup();
        } else if (allImageAndTextOutOfContainer || imageOutOfContainer || textContentOutOfContainer) {
            this.setState({ hideBookWarningPopup: false });
        } else if (project.book.covers.coverInfo.type === COVER_TYPE.HARDCOVER_DUST_JACKET && this.checkingDustJacketContent()) {
            this.handleFinishBook();
            setTimeout(this.toggleShowDustJacketPopup, 5000);
        } else {
            this.handleFinishBook();
        }
    }

    ignoreWarningStillGettingPhoto() {
        if (this.state.isStillGettinngPhotos) {
            this.toggleShowStillGettingPhotoPopup();
        }
        this.handleFinishBook();
    }

    handleFinishBook() {
        const { project, saveProject, photoList, dispatchHandleFinishBook } = this.props;
        dispatchHandleFinishBook(project, saveProject, photoList, this.turnOnProgressingPublishBook,
            this.turnOffProgressingPublishBook, this.toggleShowReadyOrderBook, this.toggleShowPublishFailedPopup);
    }

    renderStillGettingPhotoPopup() {
        if (this.state.isStillGettinngPhotos) {
            return (
                <StillGettingPhotosPopup
                    onIgnorWarning={this.ignoreWarningStillGettingPhoto}
                    onCancel={this.toggleShowStillGettingPhotoPopup}
                />
            );
        }
    }

    ignoreBookWarningPopup() {
        this.toggleBookWarningPopup();
        this.handleFinishBook();
    }

    showPageHaveResolutionIsLow() {
        //dispatch an action show page which has resolution is too low
    }

    renderBookWarningPopup() {
        const { imageOutOfContainer, textContentOutOfContainer, allImageAndTextOutOfContainer } = this.state;
        let title, header, text;
        
        if (allImageAndTextOutOfContainer) {
            title = 'preflight.image_text.title';
            header = 'preflight.image_text.header';
            text = 'preflight.image_text.text';
        } else if (imageOutOfContainer) {
            title = 'preflight.image_only.title';
            header = 'preflight.image_only.header';
            text = 'preflight.image_only.text';
        } else {
            title = 'preflight.text_only.title';
            header = 'preflight.text_only.header';
            text = 'preflight.text_only.text';
        }

        if (allImageAndTextOutOfContainer || imageOutOfContainer || textContentOutOfContainer) {
            return (
                <PopupWithThreeButtons    
                    shouldHide={this.state.hideBookWarningPopup}
                    style= 'low-res'
                    type={allImageAndTextOutOfContainer ? 'image_text' : imageOutOfContainer ? 'only_image' : 'only_tetx'}
                    title={LocaleUtils.instance.translate(title)}
                    content1={LocaleUtils.instance.translate(header)}
                    content2={LocaleUtils.instance.translate(text)}
                    firstBtn={this.toggleBookWarningPopup}
                    firstBtnString={LocaleUtils.instance.translate('preflight.button.cancel')}
                    secondBtn={this.ignoreBookWarningPopup}
                    secondBtnString={LocaleUtils.instance.translate('preflight.button.ignore')}
                    thirdBtn={this.showPageHaveResolutionIsLow}
                    thirdBtnString={LocaleUtils.instance.translate('preflight.button.showme')}
                    onClose={this.toggleBookWarningPopup}
                />
            );
        }
    }

    renderPublishFailedPopup() {
        if (this.state.isShowPublishFailedPopup) {
            return (
                <PublishFailedPopup
                    style='publish-failed'     
                    continueMyBooks={this.toggleShowPublishFailedPopup}
                    gotoContactCustomerSupport={this.gotoLinkContactCustomerSupport}
                />
            );
        }
    }

    renderProgressPublishingBookPopup() {
        if (this.state.isShowProgressPublishingPopup) {
            return (
                <PublishingBookPopup />
            );
        }
    }

    renderReadyOrderBookPopup() {
        if (this.state.isShowReadyOrderBookPopup) {
            return (
                <BookOrderPopup gotoLink={this.openUrl}/>
            );
        }
    }

    onCloseDustJacketFlap() {
        if (this.state.bookOrderUrl) {
            this.setState({
                isShowDustJacketFlapsPopup: false,
                isShowReadyOrderBookPopup: true
            });
            setTimeout(() => this.openUrl(), 1500);
            return;
        }
        
        this.setState({
            isShowDustJacketFlapsPopup: false
        });
    }

    renderDustJacketFlapsPopup() {
        if (this.state.isShowDustJacketFlapsPopup) {
            return (
                <DustJacketFlapsPopup
                    onAgree={this.onCloseDustJacketFlap.bind(this)}
                />
            );
        }
    }

    renderWaitingUploadingFinishPopup() {
        if (this.state.isShowWaitingUploadingFinish) {
            return (
                <WaitingUploadingFinishPopup
                    onCloseWaitingPopup={() => { this.setState({ isShowWaitingUploadingFinish: false }) }}
                />
            );
        }
    }
    
    render() {
        const { dispatchEditBook } = this.props;
     
        const editBookBtn = <Button className="footer-btn" text={LocaleUtils.instance.translate('label.edit_book')} onClick={dispatchEditBook} />
        const finishBookBtn = <Button className="footer-btn" text={LocaleUtils.instance.translate('label.publish')} type={colorType.orange} onClick={this.finishBookClick} />

        let backgroundStyle = {
            background: "url(" + Assets.instance.retrieveImageObjectURL('img_background_white') + ")"
        };

        return (
            <div className="screen pre-book" style={backgroundStyle}>
                <Header
                    title={LocaleUtils.instance.translate('wizard.step.preview')}
                    titleDetail={LocaleUtils.instance.translate('wizard.title.preview')} />
                <div className="screen-body preview-book">
                    <PreviewPages />
                </div>
                <Footer
                    firstRightBtn={editBookBtn}
                    secondRightBtn={finishBookBtn}
                />
                {this.renderStillGettingPhotoPopup()}
                {this.renderBookWarningPopup()}
                {this.renderProgressPublishingBookPopup()}
                {this.renderReadyOrderBookPopup()}
                {this.renderPublishFailedPopup()}
                {this.renderDustJacketFlapsPopup()}
                {this.renderWaitingUploadingFinishPopup()}
            </div>
        );
    }
}

const dispatchEditBook = (dispatch) => {
    dispatch(showBookDesignScreen());
};

const dispatchShowRegisterPopup = (dispatch) => {
    dispatch(toggleRegisterPopup());
};

const checkImagesSourceInBookIsComplete = (book, photoList) => {
    const checkImagesSourceOfImageContainersInPage = (imageContainers, photoList) => {
        for (let i in imageContainers) {
            const imageContainer = imageContainers[i];

            if (!imageContainer.Image) return true;

            let photo = photoList[imageContainer.Image.image_source_id];
            if (!photo) return false;

            //if (photo.id === '' || !photo.imageUrl.indexOf(photo.id)) {
            if (photo.id === '' || photo.imageUrl.indexOf(photo.id) < 0) {
                return false;
            }
        }

        return true;
    };

    const checkImagesSourceInPages = (pages, photoList) => {
        for (let i in pages) {
            const page = pages[i];

            if (!checkImagesSourceOfImageContainersInPage(page.ImageContainer, photoList)) {
                console.log('return false by checkImagesSourceOfImageContainersInPage');
                return false;
            }
        }

        return true;
    };

    const checkImagesSourceInCovers = (covers, photoList) => {
        if (covers.frontCover && !checkImagesSourceOfImageContainersInPage(covers.frontCover.ImageContainer, photoList)) {
            return false;
        }
        if (covers.backCover && !checkImagesSourceOfImageContainersInPage(covers.backCover.ImageContainer, photoList)) {
            return false;
        }
        if (covers.spine && !checkImagesSourceOfImageContainersInPage(covers.spine.ImageContainer, photoList)) {
            return false;
        }
        if (covers.frontFlap && !checkImagesSourceOfImageContainersInPage(covers.frontFlap.ImageContainer, photoList)) {
            return false;
        }
        if (covers.backFlap && !checkImagesSourceOfImageContainersInPage(covers.backFlap.ImageContainer, photoList)) {
            return false;
        }

        return true;
    };

    return (checkImagesSourceInCovers(book.covers, photoList) && checkImagesSourceInPages(book.pages.present, photoList));
};

const dispatchHandleFinishBook = (project, saveProject, photoList,
                                  callBackShowProgress, callBackOffProgress, callBackShowOrder,
                                  callBackPublishFailed,  dispatch) => {
    const startGetPublishBookProgress = (bbfJobObject) => {
        const getPublishBookProgressSuccess = (response) => {
            let bbfJobObject = response['bbf-job'];
            let progress = bbfJobObject.status[0];

            if (progress === 'RUNNING' || progress === 'NEW') {
                let bbfJobId = bbfJobObject.id[0]['_'];
                AppServices.bbfGet(bbfJobId, getPublishBookProgressSuccess, getPublishBookProgressFailed);
            } else {
                let bookUrl = bbfJobObject['book-url'][0];
                saveProject(function() {
                    callBackOffProgress();
                    callBackShowOrder(bookUrl);
                }, function () { 
                    callBackPublishFailed();
                 });
            }
        };

        const getPublishBookProgressFailed = (error) => {
            callBackPublishFailed();
        };

        let bbfJobId = bbfJobObject.id[0]['_'];
        AppServices.bbfGet(bbfJobId, getPublishBookProgressSuccess, getPublishBookProgressFailed);
    };

    const bbfJobSuccess = (response) => {
        startGetPublishBookProgress(response['bbf-job']);
        let { projectInfo } = project;
        if (projectInfo.productId) {
          AppServices.trackCTEvent(CTEventFactory.instance.createProjectPublishEvent(), null, null);
        } else{
          AppServices.trackCTEvent(CTEventFactory.instance.createProjectRepublishEvent(), null, null);
        }
    };

    const bbfJobFailed = (error) => {
        callBackPublishFailed();
    };

    const saveProjectSuccess = () => {
        const { projectInfo } = project;

        if (projectInfo.productId) {
            AppServices.bbfReplace(projectInfo.id, projectInfo.productId, project.book.toBBFXmlString(photoList),
                project.book.covers.coverInfo.type, bbfJobSuccess.bind(this), bbfJobFailed.bind(this));
        } else {
            AppServices.bbf(projectInfo.id, project.book.toBBFXmlString(photoList),
                project.book.covers.coverInfo.type, bbfJobSuccess.bind(this), bbfJobFailed.bind(this));
        }
        dispatch(togglePreventClosingPageEvent());
    };

    saveProject(saveProjectSuccess, callBackPublishFailed);
    callBackShowProgress();
};

const mapStateToProps = (state) => {
    const { project, userStatus, photoList } = state;
    return {
        project,
        isLoggedIn: userStatus.isLoggedIn,
        photoList,
        uploadingPhotos: state.getPhotosData.uploadingPhotos,
    };
}

const mapDispatchToProps = (dispatch) => {
    return ({
        dispatchShowRegisterPopup: () => dispatchShowRegisterPopup(dispatch),
        dispatchEditBook: () => dispatchEditBook(dispatch),
        checkImagesSourceInBookIsComplete: (book, photoList) => checkImagesSourceInBookIsComplete(book, photoList),
        dispatchHandleFinishBook: (project, saveProject, photoList, callBackShowProgress, callBackOffProgress, callBackShowOrder, callBackPublishFailed) =>
            dispatchHandleFinishBook(project, saveProject, photoList, callBackShowProgress, callBackOffProgress, callBackShowOrder, callBackPublishFailed, dispatch)
    });
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PreviewBook);
