import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';

import './PhotoEditControl.css';
import LocaleUtils from './../../../../utils/LocaleUtils';
import Button,  { colorType, ICON_BUTTON } from './../../../materials/button/Button';
import Assets from './../../../../assets/Assets';

const Handle = Slider.Handle;
var valueSlider = 0;
const handle = (props) =>
    {
        const { value, dragging, index, ...restProps } = props;
        valueSlider = value;
        return (
            <Tooltip
                prefixCls="rc-slider-tooltip"
                overlay={getValueFromZoomBarToPhoto(value)}
                visible={dragging}
                placement="top"
                key={index}
            >
                <Handle {...restProps} />
            </Tooltip>
    );
};

function getValueFromZoomBarToPhoto(value) {
    let valueShow;
    if (value<1) {
        valueShow = value + 0.05;
    } else {
        valueShow = 1 + (value-1)*4;
    }
    return Math.round(valueShow*100)/100;
}

export default class PhotoEditControl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sliderValue: valueSlider
        };
    }

    onChangeSilder(valueSlider) {
        this.props.handleChangeValueSlider(getValueFromZoomBarToPhoto(valueSlider));
    }

    onMouseUp() {
        this.props.handleMouseUp(this.state.sliderValue);
    }
	


    renderRevertLogoBtn(isEditLogo, handleRevertLogo) {
        if (isEditLogo) {
            return (
				
                <div className="revert-logo-btn">                    
                    <div className="revert-btn">
                        <Button
                            text={LocaleUtils.instance.translate('clu.revert_label')}
                            onClick={handleRevertLogo}
                            type={colorType.blue}
                        />
                    </div>
                </div>
            );
        }
    }

    render() {
        const { className, style, isEditLogo, handleRevertLogo} = this.props;
        let enablePhotoEditControl = this.props.enable ? " enable" : " disable";

        return (
            <div className={"photo-edit-control-wrapper " + className} style={style}>
                <div className="photo-edit-control-arrow" />
                <div className={"photo-edit-control-zone" + enablePhotoEditControl} >
                    <div className='photo-edit-control-slider'
                        onMouseUp={this.onMouseUp.bind(this)} >
                        <span className="character-zoombar minus">-</span>
                        <span className="character-zoombar zoom">{LocaleUtils.instance.translate('label.zoom')}</span>
                        <span className="character-zoombar plus">+</span>
                        <div className="character-zoombar triangle-down" />
                        <Slider ref="slider_zoom"
                            min={0}
                            max={2}
                            step={0.02}
                            value={this.props.scaleValue}
                            onChange={(sliderValue) => {
                                this.setState({ sliderValue });
                                this.onChangeSilder(sliderValue, this.state.sliderValue);
                            }}
                            handle={handle}
                        />
                    </div>
                    <div className="photo-edit-control-divider-line" />
                    <Button
                        text={LocaleUtils.instance.translate('label.fit_policy.fill')}
                        onClick={this.props.handleFill}
                        type={colorType.photoEdit}
                        iconType={ICON_BUTTON.fill}
                        isFontIcon={true}
                    />
                    <div className="photo-edit-control-divider-line"
                    />
                    <Button
                        text={LocaleUtils.instance.translate('label.fit_policy.fit')}
                        onClick={this.props.handleFit}
                        type={colorType.photoEdit}
                        iconType={ICON_BUTTON.fit}
                        isFontIcon={true}
                    />
                    <div className="photo-edit-control-divider-line" />
                    <Button
                        text={LocaleUtils.instance.translate('label.rotate')}
                        onClick={this.props.handleRotate}
                        type={colorType.photoEdit}
                        iconType={ICON_BUTTON.rotate}
                        isFontIcon={true}
                    />
                    <div className="photo-edit-control-divider-line" />

                    <Button
                        text={LocaleUtils.instance.translate('label.info')}
                        onClick={this.props.handleInfo}
                        type={colorType.photoEdit}
                        iconType={ICON_BUTTON.info}
                        isFontIcon={true}
                    />
                    <div className="photo-edit-control-divider-line" />
                    <Button
                        text={LocaleUtils.instance.translate('label.remove')}
                        onClick={this.props.handleRemove}
                        type={colorType.photoEdit}
                        iconType={ICON_BUTTON.remove}
                        isFontIcon={true}
                    />
					<div className="photo-edit-control-divider-line" />
                    {this.renderRevertLogoBtn(isEditLogo, handleRevertLogo)}
                </div>
            </div>
        );
    }
}

PhotoEditControl.propTypes = {
    scaleValue: PropTypes.number,
    handleFill: PropTypes.func,
    handleFit: PropTypes.func,
    handleRotate: PropTypes.func,
    handleInfo: PropTypes.func,
    handleRemove: PropTypes.func,
    handleMouseUp: PropTypes.func,
    handleChangeValueSlider: PropTypes.func,
    enable: PropTypes.bool,
    styel: PropTypes.object
}
