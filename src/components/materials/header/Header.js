import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './Header.css';
import LocaleUtils from './../../../utils/LocaleUtils';
import Assets from './../../../assets/Assets';
import {photoTypes} from './../../../constants/Constants';

const saveNowComponent = (savedAt, saveNow, onSaveNowClick) => {
    return (
        <div className="header-right-side-time-zone">
            <p>{savedAt}</p>
            <p className="header-save-now-btn" onClick={onSaveNowClick}>{saveNow}</p>
        </div>
    );
};

const statusHeader = (statusAction) => {
    return (
        <div className="header-right-side-time-zone">
            <span className="header-right-side-time-zone status-action">{statusAction}</span>
        </div>
    );
}
const renderErrorDialog = (photoType) => {
    let strErr = '';
    switch(photoType) {
        case photoTypes.FACEBOOK:
            strErr = LocaleUtils.instance.translate('statusView.failedToReachFacebook');
        break;
        case photoTypes.INSTAGRAM:
            strErr = LocaleUtils.instance.translate('statusView.failedToReachInstagram');
        break;
        case photoTypes.PX500:
            strErr = LocaleUtils.instance.translate('statusView.failedToReach500px');
        break;
        case photoTypes.FLICKR:
            strErr = LocaleUtils.instance.translate('statusView.failedToReachFlickr');
        break;
        case photoTypes.SMUGSMUG:
            strErr = LocaleUtils.instance.translate('statusView.failedToReachSmugMug');
        break;
    }
    return (
        <div className="failed-to-reach-server">{strErr}</div>
    );
}

const Header = (props) => {
    const { title, titleDetail, isShowSaveNow, onSaveNowClick, isShowInfoAction, statusAction, lastTimeSaved, selectedPhotos, isShowServicesErrorDialog, photoType } = props;
    let savedAt = LocaleUtils.instance.translate('statusView.lastSavedAt', { 0: lastTimeSaved});
    let saveNow = LocaleUtils.instance.translate('statusView.saveNow');
    let leftTitleStyle = selectedPhotos.length > 0 ? "header-left-text-color-change" : "header-left-text-color";
    return (
        <div className="header">
            <div className="header-left-side">
                <p>{title}</p>
                <h1 className={leftTitleStyle}>{titleDetail}</h1>
            </div>
            <div className="header-right-side">
                { isShowServicesErrorDialog === true ? renderErrorDialog(photoType): null}
                <div className="header-right-side-content">
                    {isShowInfoAction ? statusHeader(statusAction) : (isShowSaveNow && saveNowComponent(savedAt, saveNow, onSaveNowClick))}
                    <img src={Assets.instance.retrieveImageObjectURL('img_applogo')} alt="Blurb Logo" />
                </div>
            </div>
        </div>
    );
};

Header.propTypes = {
    title:          PropTypes.string,
    titleDetail:    PropTypes.string,
    isShowSaveNow:  PropTypes.bool,
    onSaveNowClick: PropTypes.func
};

const mapStateToProps = (state) => {
    const { bookDesignHeaderStatus } = state.appStatus;
    const { getPhotosData } = state;
    const {selectedPhotos} = getPhotosData;
    return {
        photoType: state.appStatus.rootStatus.photoType,
        isShowServicesErrorDialog: state.appStatus.rootStatus.isShowServicesErrorDialog,
        isShowInfoAction: bookDesignHeaderStatus.isShowInfoAction,
        statusAction: bookDesignHeaderStatus.statusAction,
        lastTimeSaved: bookDesignHeaderStatus.lastTimeSaved,
        selectedPhotos : Object.values(selectedPhotos.selectedPhotos)
    };
}

export default connect(
    mapStateToProps
)(Header);
