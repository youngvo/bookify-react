import React, { Component } from 'react';
import {connect} from 'react-redux';

import  './BookDesignPage.css';
import BookDesignHeader from './bookDesignHeader/BookDesignHeader';
import DesignPage from './designPage/DesginPage';
import ManagePages from './managePages/ManagePages';
import BookDesignFooter from './bookDesignFooter/BookDesignFooter';
import Popup, {popupType} from './../../components/popup/Popup';
import LocaleUtils from './../../utils/LocaleUtils';
import Config from './../../config/Config';
import Assets from './../../assets/Assets';

import { photoListAct_deletePhoto } from './../../actions/photoListActions/PhotoListActions';
import { selectPageOnPageTab } from './../../actions/appStatusActions/PaginationStatusActions';
import { addPageInBookAfterPage, deletePageInBook } from '../../actions/projectActions/bookActions/pagesActions/PagesActions';
import { toggleShowBookSafeZone, showManagePage } from './../../actions/appStatusActions/RootStatusActions';
            
class BookDesignPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            isMinimizeFooter: true, 
            isShowDeletePhotoConfirmPopup: false,
            isShowDeletePageWarningPopup: false,
            zoomValue: 100,
            isFocusingOnTextField: false
        }
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.confirmDeletePhoto = this.confirmDeletePhoto.bind(this);
        this.deletePhotoCard = this.deletePhotoCard.bind(this);
        
        this.goToNextPage = this.goToNextPage.bind(this);
        this.goToPreviousPage = this.goToPreviousPage.bind(this);

        this.addPageInBook = this.addPageInBook.bind(this);
        this.removePageInBook = this.removePageInBook.bind(this);

        this.toggleConfirmDeletePhotoPopup = this.toggleConfirmDeletePhotoPopup.bind(this);
        this.toggleConfirmDeletePagePopup = this.toggleConfirmDeletePagePopup.bind(this);
        this.onDeletePage = this.onDeletePage.bind(this);
        this.switchToEditPageOrManagePage = this.switchToEditPageOrManagePage.bind(this);
        this.toggleKeyBoardEvent = this.toggleKeyBoardEvent.bind(this);
    }

    changeModeFooter(value) {
        this.setState({
            isMinimizeFooter: !value
        });
    }

    updateUI() {
        this.setState({
            isLoaded: true
        });
    }

    addKeyboardPageEvent() {
        document.addEventListener('resize', this.updateUI.bind(this));
        document.addEventListener('keydown', this.handleKeyDown);
    }

    removeKeyboardPageEvent() {
        document.removeEventListener('resize', this.updateUI.bind(this));
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    toggleKeyBoardEvent(isFocusingOnTextField) {
        this.setState({
            isFocusingOnTextField
        });
    }

    componentDidMount() {
       this.addKeyboardPageEvent();
    }

    componentWillUnmount() {
       this.removeKeyboardPageEvent();
    }

    componentDidUpdate() {
        if (this.props.isShowingPopup || this.state.isFocusingOnTextField) {
            this.removeKeyboardPageEvent();
        } else {
            this.addKeyboardPageEvent();
        }
    }

    confirmDeletePhoto() {
        const { idsOfImageUsingList, photoIdClicking } = this.props;
        if (photoIdClicking !== -1) {
            if (idsOfImageUsingList.indexOf(photoIdClicking) >= 0) {
                this.toggleConfirmDeletePhotoPopup();
            } else {
                this.deletePhotoCard();
            }
        }
    }

    handleKeyDown(e) {
        switch (e.keyCode) {
            case 46:
                this.confirmDeletePhoto();
                break;
            case 37:
                this.goToPreviousPage();
                break;
            case 39:
                this.goToNextPage();
                break;
            default:
                break;
        }
    }

    toggleConfirmDeletePhotoPopup() {
        this.setState({
            isShowDeletePhotoConfirmPopup: !this.state.isShowDeletePhotoConfirmPopup
        });
    }

    onDeletePage() {
        const { paginationStatus, deletePage } = this.props;
        deletePage(paginationStatus.currentPage);
        if (this.state.isShowDeletePageWarningPopup) {
            this.toggleConfirmDeletePagePopup();
        }
    }

    deletePhotoCard() {
        const { photoIdClicking } = this.props;
        this.props.onDeletePhotoCard(photoIdClicking);
        if (this.state.isShowDeletePhotoConfirmPopup) {
            this.toggleConfirmDeletePhotoPopup();    
        }
        
    }

    goToPreviousPage() {
        let { paginationStatus, onClickChoosePage } = this.props;
        let currentPage = paginationStatus.currentPage;        
        let numPage = currentPage;
        
        if (currentPage > 0) {
            numPage = currentPage - 2;
        } else if (currentPage === 0) {
            numPage = currentPage - 1;
        }
        onClickChoosePage(numPage);
    }

    goToNextPage() {
        let { paginationStatus, amountPage, onClickChoosePage } = this.props;
        let currentPage = paginationStatus.currentPage;
        let numPage = currentPage;

        if (currentPage === -1) {
            numPage = currentPage + 1;
        } else if (currentPage >= 0 && currentPage < amountPage + 2) {
            numPage = currentPage + 2;
        }
        onClickChoosePage(numPage);
    }

    addPageInBook(position) {
        const { addNewPageInBookAfterPage, amountPage } = this.props;
        let maxPagesInBook = Config.instance.maxPagesInBook;
        if (amountPage < maxPagesInBook) {
            addNewPageInBookAfterPage(position);
        } else {
            alert('Max Pages in book is 440 pages. Can not add more.');
        }
    }

    removePageInBook() {
        const { amountPage } = this.props;
        if (amountPage <= 20) {
            alert(LocaleUtils.instance.translate('statusView.minPages', { 0: 20 }));
        } else {
            this.setState({
                isShowDeletePageWarningPopup: true
            });
        }
    }

    toggleConfirmDeletePagePopup() {
        this.setState({
            isShowDeletePageWarningPopup: !this.state.isShowDeletePageWarningPopup
        });
    }

    switchToEditPageOrManagePage() {
        const { showMangePageScreen, isShowManagePages} = this.props;
        showMangePageScreen(!isShowManagePages);
    }

    handleChangeZoomValue(value) {
        this.setState({
            zoomValue: value
        })
    }

    render() {
        const { amountPage, onClickChoosePage, onToggleShowBookSafeZone, isShowBookSafeZone, isShowManagePages } = this.props;
        let classNameBookDesignFooter = this.state.isMinimizeFooter ? 'book-design-footer mini-mode' : 'book-design-footer extend-mode';
        
        let backgroundImage = {
            background: 'url(' + Assets.instance.retrieveImageObjectURL('img_main_background') + ') repeat center center'
        };

        return (
            <div className="book-design-zone" style={backgroundImage}>
                <div className="book-design-half-top" id="bookDesignHeader">
                    <BookDesignHeader isShowManagePages={isShowManagePages} checkingUserIsLoggedIn={this.props.checkingUserIsLoggedIn} handleChangeZoomValue={this.handleChangeZoomValue.bind(this)}/>
                </div>
                {
                    isShowManagePages ?
                        <ManagePages
                            isMinimizeFooter={this.state.isMinimizeFooter}    
                            amountPage={amountPage}
                            addPageInBook={this.addPageInBook}
                            onClickChoosePage={onClickChoosePage}
                            goToEditPage={this.switchToEditPageOrManagePage} 
                        /> :
                        <DesignPage
                            zoomValue={this.state.zoomValue}
                            isMinimizeFooter={this.state.isMinimizeFooter}
                            onClickChoosePage={onClickChoosePage}
                            goToNextPage={this.goToNextPage}
                            goToPreviousPage={this.goToPreviousPage}
                            addPageInBook={this.addPageInBook}
                            removePageInBook={this.removePageInBook}
                            goToManagePages={this.switchToEditPageOrManagePage}
                            isShowBookSafeZone={isShowBookSafeZone}
                            onToggleShowBookSafeZone={onToggleShowBookSafeZone}
                            toggleKeyBoardEvent={this.toggleKeyBoardEvent}
                        />
                }
                <div className={classNameBookDesignFooter} id="bookDesignFooter">
                    <BookDesignFooter changeModeFooter={this.changeModeFooter.bind(this)} />
                </div>
                {
                    this.state.isShowDeletePhotoConfirmPopup &&
                    <Popup
                        type={popupType.cancel_left_side}    
                        title={LocaleUtils.instance.translate('delete.from_book.title')}
                        icon={Popup.iconType.warningIcon}
                        content={LocaleUtils.instance.translate('delete.from_book.message')}
                        textLeftBtn={LocaleUtils.instance.translate('delete.from_book.button.cancel')}
                        textRightBtn={LocaleUtils.instance.translate('delete.from_book.button.confirm')}
                        onClickLeftBtn={this.onCloseConfirmDeletePhotoPopup}
                        onClickRightBtn={this.deletePhotoCard}
                    />
                }
                {
                    this.state.isShowDeletePageWarningPopup &&
                    <Popup
                        style= 'delete-pages-in-main-page'    
                        type={popupType.cancel_right_side}    
                        title={LocaleUtils.instance.translate('alert.delete.pages.title')}
                        icon={Popup.iconType.warningIcon}
                        content={LocaleUtils.instance.translate('alert.delete.pages.message')}
                        textLeftBtn={LocaleUtils.instance.translate('alert.delete.pages.confirm')}
                        textRightBtn={LocaleUtils.instance.translate('alert.delete.pages.cancel')}
                        onClickLeftBtn={this.onDeletePage}
                        onClickRightBtn={this.toggleConfirmDeletePagePopup}
                    />
                }
            </div>
        );
    }
}

const onToggleShowBookSafeZone = (dispatch) => {
    dispatch(toggleShowBookSafeZone());
}

const onClickChoosePage = (dispatch, numPage) => {
    dispatch(selectPageOnPageTab(numPage));
};

const onDeletePhotoCard = (dispatch, basePhotoId) => {
    dispatch(photoListAct_deletePhoto(basePhotoId));
}

const addNewPageInBookAfterPage = (dispatch, position) => {
    dispatch(addPageInBookAfterPage(position));
}

const deletePage = (dispatch, numPage) => {
    dispatch(deletePageInBook(numPage));
}

const showMangePageScreen = (dispatch, isShowMangePage) => {
    dispatch(showManagePage(isShowMangePage));
}

const mapStateToProps = (state) => {
    const { appStatus, project, themes, coverLayouts } = state;
    const { paginationStatus, rootStatus } = appStatus;
    const { book } = project;

    return {
        paginationStatus,
        project,
        book,
        amountPage:book.pages.present.length,
        themes,
        coverLayouts,
        isShowBookSafeZone: rootStatus.isShowBookSafeZone,
        isShowingPopup: rootStatus.isShowingPopup,
        idsOfImageUsingList: rootStatus.idsOfImageUsingList,
        photoIdClicking: rootStatus.photoIdClicking,
        isShowManagePages: rootStatus.isShowManagePage
    };
}

const mapDispatchToProps = (dispatch) => ({
    onClickChoosePage: (numPage) => onClickChoosePage(dispatch, numPage),
    onDeletePhotoCard: (basePhotoId) => onDeletePhotoCard(dispatch, basePhotoId),
    addNewPageInBookAfterPage: (position) => addNewPageInBookAfterPage(dispatch, position),
    deletePage: (numPage) => deletePage(dispatch, numPage),
    onToggleShowBookSafeZone: () => onToggleShowBookSafeZone(dispatch),
    showMangePageScreen: (isShowMangePage) => showMangePageScreen(dispatch, isShowMangePage)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BookDesignPage);