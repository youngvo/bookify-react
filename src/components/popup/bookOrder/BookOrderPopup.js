import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './BookOrderPopup.css';
import LocaleUtils from './../../../utils/LocaleUtils';

const BookOrderPopup = ({ gotoLink }) => {

    function renderTitle() {
        return (
            <div className="title-popup">
                {LocaleUtils.instance.translate('dialog.publish_complete.title')}
            </div>
        );
    }

    function renderContent(){
        return (
            <div className="content-popup content-order-popup">
                <span>{LocaleUtils.instance.translate('dialog.publish_complete.text') + ' '}</span>
                <span className="content-popup link" onClick={gotoLink}>
                    {LocaleUtils.instance.translate('dialog.publish_complete.link')}
                </span>
            </div>
        );
    }

    return (
        <div className="popup-wrapper">
            <div className="popup-zone book-order">
                <div className="top-popup-zone">
                    <div className="popup-item">
                        {renderTitle()}
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookOrderPopup;
