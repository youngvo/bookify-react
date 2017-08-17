import React from 'react';
import PropTypes from 'prop-types';
import LocaleUtils from './../../../utils/LocaleUtils';
import IconButton from './../../materials/iconButton/IconButton';
import Button, { colorType } from './../../materials/button/Button';

const ErrorPopup = ({ error,errorType, leftBtnFunc, rightBtnFunc, onClose,style }) => {
    let title = '';
    let content = '';
    let textLeftBtn = '';
    let textRightBtn = '';

    switch (error.type) {
        case errorTypes.connect:
            title = LocaleUtils.instance.translate('error_dialog.fault.title');
            content = LocaleUtils.instance.translate('error_dialog.fault.message');
            textLeftBtn = LocaleUtils.instance.translate('error_dialog.details');
            textRightBtn = LocaleUtils.instance.translate('error_dialog.close');
            break;
        case errorTypes.crash_app:  
            title = LocaleUtils.instance.translate('error_dialog.crash.title');
            content = LocaleUtils.instance.translate('error_dialog.crash.message');
            textLeftBtn = LocaleUtils.instance.translate('error_dialog.details');
            textRightBtn = LocaleUtils.instance.translate('error_dialog.restart');
            break;
        default:  
            break;
    }


    function renderContent() {
        return (
            <div className="content-have-icon-popup">
                <div className="icon-margin">   
                    <span className="icon-WarningIcon">
                        <span className="path1" />
                        <span className="path2" />
                        <span className="path3" />
                        <span className="path4" />
                        <span className="path5" />
                        <span className="path6" />
                        <span className="path7" />
                    </span>
                </div>
                <div className={error.type === errorTypes.connect ? "content-popup" : "content-popup content-error-crash-app"}>{content}</div>
            </div>
        );
    }

    function renderButtons() {
        return (
            <div className="group-button-item-popup">
                <Button type={colorType.transparent} text={textLeftBtn} onClick={leftBtnFunc} />
                <Button type={colorType.blue} text={textRightBtn} onClick={rightBtnFunc} />
            </div>
        );
    }

    
    return (
        <div className="popup-wrapper">
            <div className={error.type === errorTypes.connect ? "popup-zone error-connect-popup" : "popup-zone error-crash-app-popup"}>
                <div className="top-popup-zone">
                    {<IconButton className="close-popup" type="close" onClick={onClose} />}
                    <div className="popup-item">
                        <div className="title-popup">
                            {title}
                        </div>
                        {renderContent()}
                    </div>
                </div>
                <div className="bottom-popup-zone">
                    <hr className="divider-popup" />
                    {renderButtons()}
                </div>
            </div>
        </div>
    );
}


export const errorTypes = {
    connect: 'error_connect',
    crash_app: 'error_crash_app',
}

ErrorPopup.propTypes = {
    error: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    leftBtnFunc: PropTypes.func.isRequired,
    rightBtnFunc: PropTypes.func.isRequired
};

export default ErrorPopup;
