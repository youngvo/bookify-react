import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './PopupWithThreeButtons.css'

import IconButton from './../../materials/iconButton/IconButton';
import Button, { colorType } from './../../materials/button/Button';
import LocaleUtils from './../../../utils/LocaleUtils';

const PopupWithThreeButtons = ({ shouldHide, type, style, title, content1, content2, firstBtn, firstBtnString, secondBtn, secondBtnString, thirdBtn, thirdBtnString, onClose }) => {
    function getClassNameForTitle(type) {
        switch (type) {
            case 'custom-logo':
                return 'content-custom-logo';
            case 'low-res':
                return 'low-res-pop';
            default:
                return '';
        }
    }

    function getStyleForTiTleWarning(type){
        switch (type) { 
            case 'image_text':
                return 'image-and-text-warning';
            case 'only_image':
                return 'low-res-popup';    
            default:
                return '';    
        }
    }

    function renderTitle() {
        return (
            <div className={"title-popup " + getClassNameForTitle(type)}>
                {title}
            </div>
        );
    }

    function getClassNameForContent(type) {
        switch (type) {
            case 'custom-logo':
                return '';
            case 'low-res':
                return '';
            default:
                return '';
        }
        
    }


    function getClassNameForContent2(type) {
        switch (type) {
            case 'custom-logo':
                return 'content-custom-logo';
            case 'low-res':
                return 'content-2-low-res-popup';
            default:
                return '';
        }
    }

    function renderContent() {
        return (
            <div className={getClassNameForContent(type)}>
                <p className={content2 ? 'content-popup-headsUp' : ''}>{content1}</p>
                {content2 ? <p className={getClassNameForContent2(type)}>{content2}</p> : ''}
            </div>
        );
    }

    function renderButtons() {
        return (
            <div className="bottom-popup-zone">
                <hr className="divider-popup" />
                <div className="group-button-item-popup group-three-btns">
                    <div className="group-buttons-left cancel-button">
                        <Button type={colorType.transparent} text={firstBtnString} onClick={firstBtn} />
                    </div>
                    <div className="group-buttons-right">
                        <Button type={colorType.transparent} text={secondBtnString} onClick={secondBtn} />
                        <Button type={colorType.blue} text={thirdBtnString} onClick={thirdBtn} />
                    </div>
                </div>
            </div>
        );
    }

    function getClassNameType(style){
        switch (style) {
            case 'custom-logo':
                return 'custom-log';
            case 'low-res':
                return 'low-res-popup';              
            default:
                return '';
        }
    }

    let visible = {
            display: shouldHide ? 'none' : null
    }            

    return (
        <div className="popup-wrapper popup-three-buttons" style={visible}>
            <div className={getStyleForTiTleWarning(type)+ " popup-zone " + getClassNameType(style)}>
                <div className="top-popup-zone">
                    <IconButton className="close-popup" type="close" onClick={onClose} />
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

PopupWithThreeButtons.propTypes = {
    shouldHide: PropTypes.boolean,
    type: PropTypes.string,
    title: PropTypes.string,
    content1: PropTypes.string,
    content2: PropTypes.string,
    firstBtn: PropTypes.func,
    firstBtnString: PropTypes.string,
    secondBtn: PropTypes.func,
    secondBtnString: PropTypes.string,
    thirdBtn: PropTypes.func,
    thirdBtnString: PropTypes.string,
    onClose: PropTypes.func
};

export default PopupWithThreeButtons;
