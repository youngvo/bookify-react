import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './LimitPopup.css'
import LocationUtils from './../../../utils/LocationUtils';
import CTEventFactory from './../../../utils/CTEventFactory';
import AppServices from './../../../services/AppServices';
import Button, { colorType } from './../../materials/button/Button';

export default class LimitPopup extends Component {

    renderContent() {
        const {content } = this.props;
        return (
                <div className="lm-content-have-icon-popup">
                <span className="icon-WarningIcon">
                    <span className="path1" />
                    <span className="path2" />
                    <span className="path3" />
                    <span className="path4" />
                    <span className="path5" />
                    <span className="path6" />
                    <span className="path7" />
                </span>
                    <div className="lm-content-popup">{content}</div>
                </div>
            );
    }
    onClick() {
        AppServices.trackCTEvent(CTEventFactory.instance.createNavigatedToBookWrightEvent(), null, null);
        return window.open(window.location.protocol + "//" + 'www.blurb.com/bookwright','_target');
    }

    renderButtons() {
        const { textLeftBtn, textMiddleBtn, textRightBtn, onClickLeftBtn, onClickRightBtn } = this.props;
        return (
            <div className="lm-bottom-popup-zone">
                <hr className="lm-divider-popup" />
                <div className="lm-group-button-item-popup">
                    <div className="lm-cancel-button">
                        <Button type={colorType.transparent} text={textLeftBtn} onClick={onClickLeftBtn} />
                    </div>
                    <div className="group-buttons-right">
                        <Button type={colorType.blue} text={textMiddleBtn} onClick={this.onClick} />
                        <Button type={colorType.blue} text={textRightBtn} onClick={onClickRightBtn} />
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const { title, onClickLeftBtn } = this.props;
        const styles = {
            popup: {
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
            }
        };
        return (
            <div className="lm-popup-wrapper">
                <div className="lm-popup-zone">
                    <div className="lm-top-popup-zone">
                        <div className="lm-popup-item">
                            <div className="lm-title-popup">
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

LimitPopup.propTypes = {
    title: PropTypes.string,
    icon: PropTypes.string,
    content: PropTypes.any,
    textLeftBtn: PropTypes.string,
    textRightBtn: PropTypes.string,
    onClickLeftBtn: PropTypes.func,
    onClickRightBtn: PropTypes.func,
};
