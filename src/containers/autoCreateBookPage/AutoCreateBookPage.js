import React from 'react';
import { connect } from 'react-redux';

import '../../styles/GeneralStyle.css';
import './AutoCreateBookPage.css'
import AutoCreateBook    from './../../components/autoCreateBook/AutoCreateBook';
import Header                   from './../../components/materials/header/Header';
import Footer                   from './../../components/materials/footer/Footer';
import Button           from './../../components/materials/button/Button';
import MenuGetPhotos    from './../../containers/menuGetPhotos/MenuGetPhotos';
import LocaleUtils      from './../../utils/LocaleUtils';
import Utils            from './../../utils/Utils';
import Assets           from './../../assets/Assets';
import Config from './../../config/Config';

import { toggleMenuGetPhotos } from '../../actions/appStatusActions/BookDesignHeaderStatusActions';
import {
    showBookDesignScreen,
    showChangeOrderLayoutScreen,
    toggleSignInPopup
} from '../../actions/appStatusActions/RootStatusActions';

import { setPageLayoutImageByAutoCreateBook } from './../../actions/projectActions/bookActions/pagesActions/PagesActions';

const AutoCreateBookPage = (props) => {
    let title       = LocaleUtils.instance.translate('label.auto_create');
    let titleDetail = LocaleUtils.instance.translate('wizard.title.book_design_method_selection');
    let getMorePhotosBtn = <Button
        text={LocaleUtils.instance.translate('wizard.nav.get_more_photos')}
        onClick={props.getMorePhotosClick}
    />
    const backgroundStyle = {
        background: "url(" + Assets.instance.retrieveImageObjectURL('img_background_white') + ")"
    };
    const menuPhotos = <div className="auto-create-book-menu-photo"><MenuGetPhotos photoImportOptions={Config.instance.photoImportOptions}/></div>

    const checkingUserIsLoggedIn = () => {
        if (props.isLoggedIn) {
            props.saveProject();
        } else {
            props.showSignInPopup();
        }
    };

    const onAutoCreateBookClick = () => {
        props.autoCreateBookClick(props.photoList, props.layout, props.pageLayout);
    };

    return (
        <div className="screen" style={backgroundStyle}>
            <Header
                title={title}
                titleDetail={titleDetail}
                isShowSaveNow={true}
                onSaveNowClick={checkingUserIsLoggedIn}
            />
            <div className="screen-body">
                <AutoCreateBook
                    autoCreateBookClick={onAutoCreateBookClick.bind(this)}
                    manuallyCreateBookClick={props.manuallyCreateBookClick}
                    changeOrderAndLayoutClick={props.changeOrderAndLayoutClick}
                />
            </div>
            <Footer
                isHideArrowBtn={true}
                leftBtn={getMorePhotosBtn}
            />
            {props.isShowMenuGetPhotos && menuPhotos}
        </div>
    );
};

const manuallyCreateBookClick = (dispatch) => {
    dispatch(showBookDesignScreen());
};

const autoCreateBookClick = (dispatch, photoList, layout, pageLayout) => {
    const getLayout = (layoutId, pageLayout) => {
        for (let i = 2; i < pageLayout.length; i++) {
            if (layoutId === pageLayout[i].$.id) {
                return pageLayout[i];
            }
        }
    };

    let photos = Object.values(photoList);
    let sortedPhotos = photos.sort(Utils.compareValues('updatedTime'));
    let layoutLeft = getLayout(layout.layoutIdLeft, pageLayout);
    let layoutRight = getLayout(layout.layoutIdRight, pageLayout);

    dispatch(setPageLayoutImageByAutoCreateBook(sortedPhotos, layoutLeft, layoutRight, true));
    dispatch(showBookDesignScreen());
};

const changeOrderAndLayoutClick = (dispatch) => {
    dispatch(showChangeOrderLayoutScreen());
};

const showSignInPopup = (dispatch) => {
    dispatch(toggleSignInPopup());
}

const cancelChangeOrderLayoutClick = (dispatch) => {
    dispatch(showBookDesignScreen());
}

const getMorePhotosClick = (dispatch) => {
    dispatch(toggleMenuGetPhotos());
}

const mapStateToProps = (state) => {
    const { lastTimeSaved, isShowMenuGetPhotos, isShowRegister, isShowSignIn } = state.appStatus.bookDesignHeaderStatus;
    const { photoList, autoFlowLayouts, project } = state;


    return {
        lastTimeSaved,
        isShowMenuGetPhotos,
        isShowRegister,
        isShowSignIn,
        isLoggedIn: state.userStatus.isLoggedIn,
        photoList,
        layout: autoFlowLayouts.layoutsOriginal[0],
        pageLayout: project.book.layouts.PageLayout,
    };
}

const mapDispatchToProps = (dispatch) => ({
    autoCreateBookClick: (photoList, layout, pageLayout) => autoCreateBookClick(dispatch, photoList, layout, pageLayout),
    changeOrderAndLayoutClick:      () => changeOrderAndLayoutClick(dispatch),
    cancelChangeOrderLayoutClick:   () => cancelChangeOrderLayoutClick(dispatch),
    manuallyCreateBookClick:        () => manuallyCreateBookClick(dispatch),
    showSignInPopup:                 () => showSignInPopup(dispatch),
    getMorePhotosClick:             () => getMorePhotosClick(dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AutoCreateBookPage);
