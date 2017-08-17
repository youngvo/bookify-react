import React from 'react';

import './ErrorPopup.css';
import LocaleUtils from './../../../utils/LocaleUtils';
import Utils from './../../../utils/Utils';
import Button, { colorType } from './../../materials/button/Button';

const ErrorDetailPopup = ({ errorMessage, errorStack, onClose }) => {
    let osName = Utils.extractOSName();

    function renderTitle(){
        return (
            <div className="title-popup">
                {LocaleUtils.instance.translate('alert.error_diagnostic_dialog.title')}
            </div>
        );
    }

    function renderErrorBox() {
        return (
            <div className="error-box">
                <div className="error-box-content">
                    <div className="error-box-text">
                        <p>OS: {osName}</p>
                        <p>browser: {window.navigator.userAgent}</p>
                        <p>{Utils.JSVer()}</p>
                        <p>timestamp: {new Date().toUTCString()}</p>
                        <p>error: {errorMessage ? errorMessage : ''}</p>
                        <p>stack trace: </p>
                        <p>------------------------------------------------</p>
                        <p>{errorStack ? errorStack : 'null'}</p>
                    </div>
                </div>
            </div>
        );
    }

    function renderBtn() {
        return (
            <div className="group-button-item-popup">
                <Button type={colorType.blue} text={LocaleUtils.instance.translate('alert.error_diagnostic_dialog.close')} onClick={onClose} />
            </div>
        );
    }

    return (
        <div className="popup-wrapper">
            <div className="popup-zone error-detail-popup">
                <div className="top-popup-zone">
                    <div className="popup-item">
                        {renderTitle()}
                        {renderErrorBox()}
                    </div>
                </div>
                <div className="bottom-popup-zone">
                    <hr className="divider-popup" />
                    {renderBtn()}
                </div>
            </div>
        </div>
    );
}

export default ErrorDetailPopup;
