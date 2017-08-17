import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconButton from './../../materials/iconButton/IconButton';
import Button, { colorType } from './../../materials/button/Button';
import LocaleUtils from './../../../utils/LocaleUtils';

const DustJacketFlapsPopup = ({ onAgree }) => {

    function renderTitle() {
        return (
            <div className="title-popup">
                {LocaleUtils.instance.translate('alert.publish.flaps_have_been_designed.title')}
            </div>
        );
    }

    function renderContent() {
        return (
            <div className="content-popup">
                <p>{LocaleUtils.instance.translate('alert.publish.flaps_have_been_designed.message')}</p>
            </div>
        );
    }

    function renderButtons() {
        return (
            <div className="bottom-popup-zone">
                <hr className="divider-flap-popup" />
                <div className="group-button-item-popup">
                    <Button className="ok-btn" type={colorType.blue} text={LocaleUtils.instance.translate('label.ok')} onClick={onAgree} />
                </div>
            </div>
        );
    }

    return (
        <div className="popup-wrapper">
            <div className="popup-zone flap-popup-zone">
                <div className="top-popup-zone">
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

DustJacketFlapsPopup.propTypes = {
    onAgree: PropTypes.func.isRequired
};

export default DustJacketFlapsPopup;
