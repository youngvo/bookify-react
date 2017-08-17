import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Popup.css'

import IconButton from './../materials/iconButton/IconButton';
import Button, { colorType } from './../materials/button/Button';

export default class Popup extends Component {

    getIcon(icon) {
        switch (icon) {
            case Popup.iconType.warningIcon:
                return (
                    <span className="icon-WarningIcon">
                        <span className="path1" />
                        <span className="path2" />
                        <span className="path3" />
                        <span className="path4" />
                        <span className="path5" />
                        <span className="path6" />
                        <span className="path7" />
                    </span>
                );
            default:
                return;
        }
    }

    styleForContent(style) {
        switch (style) {
            case 'still-getting-book1':
                return 'content-still-getting-book1';

            case 'ready-to-order2':
                return 'content-ready-to-order2';   
            
            case 'unsupported-characters-found':
                return 'content-unsupported-characters-found';
            default:
        break;
        }
    }
    renderContent() {
        const { icon, content,style } = this.props;
        if (icon) {
            return (
                <div className="content-have-icon-popup">
                    <div className="icon-margin">
                        {this.getIcon(icon)}
                    </div>
                    <div className={"content-popup " + this.styleForContent(style)}>{content}</div>
                </div>
            );
        }
        return (
            <div className={"content-popup " + this.styleForContent(style)}>{content}</div>
        );
    }

    renderButtons() {
        const { textLeftBtn, textRightBtn, oneBtn, onClickLeftBtn, onClickRightBtn } = this.props;
        return (
            <div className="bottom-popup-zone">
                <hr className="divider-popup" />
                <div className="group-button-item-popup">
                    {oneBtn ? '' : <Button type={colorType.transparent} text={textLeftBtn} onClick={onClickLeftBtn} />}
                    <Button type={colorType.blue} text={textRightBtn} onClick={onClickRightBtn} />
                </div>
            </div>
        );
    }

    styleForPopupZone(style) {
        switch (style) {
            case 'still-getting-book1':
                return 'still-getting-book-1';
        
            case 'ready-to-order2':
                return 'ready-to-order2';    
            
            case 'save-your-book':
                return 'save-your-book-popup';
            
            case 'delete-pages-warning':
                return 'delete-pages-warning-popup';
            
            case 'unsupported-characters-found':
                return 'unsupported-characters-found-popup';    
                
            case 'missing-Assets-Popup':
                return 'error-connect-popup';

            case 'delete-pages-in-main-page':
                return 'delete-pages-in-main-page-popup';    
            default:
        break;
        }
    }

    render() {
        const { title, onClickLeftBtn, onClickRightBtn, type, oneBtn, style } = this.props;
        return (
            <div className="popup-wrapper">
                <div className={"popup-zone " + this.styleForPopupZone(style)}>
                    <div className="top-popup-zone">
                        {oneBtn ? '' : <IconButton className="close-popup" type="close" onClick={(type === popupType.cancel_left_side) ? onClickLeftBtn : onClickRightBtn} />}
                        <div className="popup-item">
                            <div className={"title-popup"}>
                                {title}
                            </div>
                            {this.renderContent()}
                        </div>
                    </div>
                    {this.renderButtons()}
                </div>
            </div>
        );
    }
}

export const popupType = {
    cancel_left_side: 'cancel_button_is_left_side',
    cancel_right_side: 'cancel_button_is_right_side'
}

Popup.iconType = {
    warningIcon: 'icon-warning',
}

Popup.propTypes = {
    oneBtn: PropTypes.boolean,
    type: PropTypes.string,
    title: PropTypes.string,
    icon: PropTypes.string,
    content: PropTypes.string,
    textLeftBtn: PropTypes.string,
    textRightBtn: PropTypes.string,
    onClickLeftBtn: PropTypes.func,
    onClickRightBtn: PropTypes.func,
};
