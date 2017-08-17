import React from 'react';
import { connect } from 'react-redux';

import './../../styles/GeneralStyle.css';
import ChangeOrderLayoutBook from './../../components/changeOrderLayoutBook/ChangeOrderLayoutBook';
import Header from './../../components/materials/header/Header';
import Footer from './../../components/materials/footer/Footer';
import LocaleUtils      from './../../utils/LocaleUtils';
import CTEventFactory   from './../../utils/CTEventFactory';
import AppServices   from './../../services/AppServices';
import Button, { colorType }    from './../../components/materials/button/Button';
import Assets from './../../assets/Assets';

import { showBookDesignScreen, toggleSignInPopup } from './../../actions/appStatusActions/RootStatusActions';
import { changeSortTypeOfPhotos } from '../../actions/appStatusActions/BookDesignFooterStatusActions';
import {
    changeKeepPagesMade,
    toggleChangeLayoutPhoto,
    toggleChangeOrderPhoto,
    changeOrderPhoto
} from '../../actions/appStatusActions/ChangeOrderLayoutBookStatusActions';

import { changeCurrChooseLayout } from './../../actions/autoFlowLayoutsActions/AutoFlowLayoutsActions';
import { setPageLayoutImageByAutoCreateBook } from './../../actions/projectActions/bookActions/pagesActions/PagesActions';

import { photoOrderTypes, sortingTypes } from './../../constants/Constants';
import Utils from './../../utils/Utils';

const ChangeOrderLayoutBookPage = (props) => {
    const title         = LocaleUtils.instance.translate('label.auto_create');
    const titleDetail   = LocaleUtils.instance.translate('wizard.auto_create.title');

    const cancelBtn = <Button
        text={LocaleUtils.instance.translate('wizard.nav.cancel')}
        onClick={props.cancelChangeOrderLayoutClick}
    />;

    const handleAutoCreateClick = () => {
        let orderType = props.orderType === '' ? props.changeOrderLayoutStatus.orderType : props.orderType;
        props.autoCreateMyBookClick(props.photoList, orderType, props.currChooseLayout, props.PageLayout, props.changeOrderLayoutStatus.isKeepPagesMade);
        AppServices.trackCTEvent(CTEventFactory.instance.createAutoFlowUsedEvent(orderType, props.changeOrderLayoutStatus.isKeepPagesMade, false), null, null);
    };

    const autoCreateBookBtn = <Button
        text={LocaleUtils.instance.translate('wizard.auto_create.create')}
        type={colorType.orange}
        onClick={handleAutoCreateClick.bind(this)}
    />;

    let changeOrderLayoutVO = {
        layoutsOriginal:            props.layoutsOriginal,
        currChooseLayout:           props.currChooseLayout,
        onChangeOrderClick:         props.onChangeOrderClick,
        onChangeLayoutClick:        props.onChangeLayoutClick,
        onOrderTypeClick:           props.onOrderTypeClick,
        onLayoutTypeClick:          props.onLayoutTypeClick,
        onChangeKeepPagesMade:      props.onChangeKeepPagesMade,
        isKeepPagesMade:            props.changeOrderLayoutStatus.isKeepPagesMade,
        isShowChangeLayoutPhoto:    props.changeOrderLayoutStatus.isShowChangeLayoutPhoto,
        isShowChangeOrderPhoto:     props.changeOrderLayoutStatus.isShowChangeOrderPhoto,
        orderType:                  props.orderType === '' ? props.changeOrderLayoutStatus.orderType : props.orderType,
        layoutType:                 props.changeOrderLayoutStatus.layoutType,
        photoList:                  Object.values(props.photoList)
    };
    const backgroundStyle = {
        background: "url(" + Assets.instance.retrieveImageObjectURL('img_background_white') + ")"
    };

    const checkingUserIsLoggedIn = () => {
        if (props.isLoggedIn) {
            props.saveProject();
        } else {
            props.showSignInPopup();
        }
    };

    return (
        <div className="screen" style={backgroundStyle}>
            <Header
                title={title}
                titleDetail={titleDetail}
                isShowSaveNow={true}
                onSaveNowClick={checkingUserIsLoggedIn} />
            <div className="screen-body">
                <ChangeOrderLayoutBook changeOrderLayoutVO={changeOrderLayoutVO} />
            </div>
            <Footer
                leftBtn={cancelBtn}
                firstRightBtn={autoCreateBookBtn} />
        </div>
    )
};

const showSignInPopup = (dispatch) => {
    dispatch(toggleSignInPopup());
};

const cancelChangeOrderLayoutClick = (dispatch) => {
    dispatch(showBookDesignScreen());
    dispatch(toggleChangeOrderPhoto());
};

const onChangeKeepPagesMade = (dispatch) => {
    dispatch(changeKeepPagesMade());
};

const onChangeOrderClick = (dispatch) => {
    dispatch(toggleChangeOrderPhoto());
};

const onOrderTypeClick = (dispatch, orderType) => {
    dispatch(changeOrderPhoto(orderType));
    dispatch(changeSortTypeOfPhotos(orderType, false));
};

const onChangeLayoutClick = (dispatch) => {
    dispatch(toggleChangeLayoutPhoto());
};

const onLayoutTypeClick = (dispatch, chooseLayout) => {
    dispatch(changeCurrChooseLayout(chooseLayout));
};

const autoCreateMyBookClick = (dispatch, photoList, orderType, currChooseLayout, PageLayout, isKeepPagesMade) => {
    const sortPhotosByOrderType = (photos, orderType) => {
        switch (orderType) {
            case sortingTypes.FILE_NAME_AZ:
            case photoOrderTypes.FILENAME:
                return photos.sort(Utils.compareValues('name'));

            case sortingTypes.OLDEST_DATE:
            case photoOrderTypes.OLDEST_FIRST:
                return photos.sort(Utils.compareValues('updatedTime'));

            case sortingTypes.RECENT_DATE:
            case photoOrderTypes.NEWEST_FIRST:
                return photos.sort(Utils.compareValues('updatedTime', 'desc'));

            default: //sortingTypes.MY_SORTING
                return photos;
        }
    };
    const getLayout = (layoutId, pageLayout) => {
        for (let i = 2; i < pageLayout.length; i++) {
            if (layoutId === pageLayout[i].$.id) {
                return pageLayout[i];
            }
        }
    };

    let sortedPhotos = sortPhotosByOrderType(Object.values(photoList), orderType);
    let layoutLeft = getLayout(currChooseLayout.layoutIdLeft, PageLayout);
    let layoutRight = getLayout(currChooseLayout.layoutIdRight, PageLayout);

    dispatch(setPageLayoutImageByAutoCreateBook(sortedPhotos, layoutLeft, layoutRight, isKeepPagesMade));
    dispatch(showBookDesignScreen());
};


const mapStateToProps = (state) => {
    const { appStatus, photoList, userStatus, autoFlowLayouts, project } = state;
    const { bookDesignHeaderStatus, changeOrderLayoutStatus } = appStatus;

    const { layoutsOriginal, currChooseLayout } = autoFlowLayouts;

    return {
        layoutsOriginal,
        currChooseLayout,
        PageLayout:project.book.layouts.PageLayout,
        bookDesignHeaderStatus,
        changeOrderLayoutStatus,
        photoList,
        isLoggedIn: userStatus.isLoggedIn
    };
};

const mapDispatchToProps = (dispatch) => ({
    autoCreateMyBookClick: (photoList, orderType, currChooseLayout, PageLayout, isKeepPagesMade) => autoCreateMyBookClick(dispatch, photoList, orderType, currChooseLayout, PageLayout, isKeepPagesMade),
    onChangeKeepPagesMade: () => onChangeKeepPagesMade(dispatch),
    onChangeOrderClick: () => onChangeOrderClick(dispatch),
    onChangeLayoutClick: () => onChangeLayoutClick(dispatch),
    onOrderTypeClick: (orderType) =>  onOrderTypeClick(dispatch, orderType),
    onLayoutTypeClick: (layout) => onLayoutTypeClick(dispatch, layout),
    cancelChangeOrderLayoutClick: () => cancelChangeOrderLayoutClick(dispatch),
    showSignInPopup: () => showSignInPopup(dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChangeOrderLayoutBookPage);
