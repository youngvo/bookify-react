import React from 'react';
import './LargeImagePopup.css'
import LocaleUtils              from './../../../utils/LocaleUtils';
import Button, {colorType}      from './../../materials/button/Button';

const LargeImagePopup = ({photoName, onClose}) => {
    return (
        <div className="large-image-popup-wrapper">
            <div className="large-image-popup">
                <div
                    className="large-image-popup-title">{LocaleUtils.instance.translate('warnings.image_corrupt.title')}</div>
                <div className="large-image-popup-middle">
                    <div className="large-image-popup-content">
                        <div className="large-image-popup-text-content">
                            {LocaleUtils.instance.translate('unsupported_image_format.title')}
                            <p/>
                            {LocaleUtils.instance.translate('label.filename') + ': ' + photoName}
                            <br/>
                            {LocaleUtils.instance.translate('popup_large_image.error')}
                        </div>
                    </div>
                </div>
                <div className="large-image-popup-text-content-hr">
                    <hr/>
                </div>
                <div className="large-image-popup-bottom">
                    <Button
                        className="large-image-popup-button-continue"
                        type={colorType.blue}
                        text={LocaleUtils.instance.translate('label.continue')}
                        onClick={onClose}
                    />
                </div>
            </div>
        </div>
    );
};

export default LargeImagePopup;
