import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './PublishFailedPopup.css'
import IconButton from './../../materials/iconButton/IconButton';
import Button, { colorType } from './../../materials/button/Button';
import LocaleUtils from './../../../utils/LocaleUtils';

const PublishFailedPopup = ({ continueMyBooks, gotoContactCustomerSupport }) => {

    function renderTitle() {
        return (
            <div className="title-popup">
                {LocaleUtils.instance.translate('alert.publish.error_title')}
            </div>
        );
    }

    function renderContent() {
        return (
            <div className="content-publish-failed">
                <p>{LocaleUtils.instance.translate('alert.publish.error_message')}</p>
            </div>
        );
    }

    function renderButtons() {
        return (
            <div className="bottom-popup-zone">
                <div className="group-button-item-popup">
                    <div className="group-button-publish-failed">
                        <Button type={colorType.transparent} text={LocaleUtils.instance.translate('alert.publish.my_store')} onClick={continueMyBooks} />
                        <Button type={colorType.blue} text={LocaleUtils.instance.translate('alert.publish.error_message.cust_sup')} onClick={gotoContactCustomerSupport} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="popup-wrapper">
            <div className="popup-zone publish-failed-popup">
                <div className="top-popup-zone">
                    <IconButton className="close-popup" type="close" onClick={continueMyBooks} />
                    <div className="popup-item">
                        {renderTitle()}
                        {renderContent()}
                    </div>
                </div>
                {renderButtons()}
            </div>
        </div>
    );
}

PublishFailedPopup.propTypes = {
    continueMyBooks: PropTypes.func,
    gotoContactCustomerSupport: PropTypes.func
};

export default PublishFailedPopup;
