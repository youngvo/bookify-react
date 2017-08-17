import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './SameColor.css';
import Assets      from './../../../../../assets/Assets';
import LocaleUtils from './../../../../../utils/LocaleUtils';
import IconButton from "../../../../materials/iconButton/IconButton";
import Button, {colorType} from "../../../../materials/button/Button";
import html2canvas from 'html2canvas';

const root = document.getElementById('root');
const isFirefox = typeof InstallTrigger !== 'undefined';

var changeColor = () => {
};

var resizeWindow = () => {
};

var chooseColor = () => {};

var context, context1, context2;
var color =  [255, 255, 255, 1];

export default class SameColor extends Component {

    constructor(props) {
        super(props)
        this.state = {
            colorStyle: [150, 150, 150, .95],
        };
        changeColor = this.changeColor.bind(this);
        resizeWindow = this.resizeWindow.bind(this);
        chooseColor = this.chooseColor.bind(this);
        this.captureScreen();
    }

    captureScreen() {
        html2canvas(root, {
            useCORS: true,
            onrendered: function (canvas) {
                context = canvas.getContext('2d');
            }
        });
        setTimeout(() => {
            document.addEventListener("mousemove", changeColor);
            document.addEventListener("mousedown", chooseColor);
            window.addEventListener("resize", resizeWindow);
        }, 1000);
        this.stopPointerEvents();
    }

    stopPointerEvents() {
        document.getElementById('bookDesignHeader').style.pointerEvents = "none";
        document.getElementById('bookDesignFooter').style.pointerEvents = "none";
        let imageFieldArr = document.getElementsByClassName('imageFieldWrapper');
        for (var index = 0; index < imageFieldArr.length; index++) {
            imageFieldArr[index].style.pointerEvents = 'none';
        }
        let textFieldArr = document.getElementsByClassName('text-field-wrapper');
        for (var index = 0; index < textFieldArr.length; index++) {
            textFieldArr[index].style.pointerEvents = 'none';
        }
    }

    chooseColor(e) {
        e.preventDefault();
        color = this.state.colorStyle;
    }

    formatColor(arr) {
        return 'rgba(' + arr.join(', ') + ')';
    }

    resizeWindow() {
        window.removeEventListener("resize", resizeWindow);
        this.captureScreen();
    }

    changeColor(e) {
        root.style.cursor = "url(" + Assets.instance.retrieveImageObjectURL('img_eyedropper') + ") 0 18, auto";
        var imageData;
        imageData = context.getImageData(e.clientX, e.clientY, 1, 1).data;
        this.setState({
            colorStyle: imageData,
        });
    }

    onMouseEnter() {
        this.setState({
            colorStyle: [120, 120, 120, .95]
        });
    }

    onMouseMove() {
        this.removeEvents();
    }

    onMouseLeave() {
        if (context || context1) {
            document.addEventListener("mousemove", changeColor);
        }
    }

    componentWillUnmount() {
        this.removeEvents();
        document.getElementById('bookDesignHeader').style.pointerEvents = 'auto';
        document.getElementById('bookDesignFooter').style.pointerEvents = 'auto';
        let imageFieldArr = document.getElementsByClassName('imageFieldWrapper');
        for (var index = 0; index < imageFieldArr.length; index++) {
            imageFieldArr[index].style.pointerEvents = 'auto';
        }
        let textFieldArr = document.getElementsByClassName('text-field-wrapper');
        for (var index = 0; index < textFieldArr.length; index++) {
            textFieldArr[index].style.pointerEvents = 'auto';
        }
    }

    handleClose(e) {
        e.preventDefault();
        this.props.handleClose();
    }

    clickDone(e) {
        e.preventDefault();
        this.props.handleDone(this.formatColor(color));
    }

    removeEvents() {
        document.removeEventListener("mousemove", changeColor);
        window.removeEventListener("resize", resizeWindow);
        document.removeEventListener("mousedown", chooseColor);
        root.style.cursor="auto";
    }

    render() {
        let { positionY, sizeHeight} = this.props;
        let styleWrapper = {
            top: positionY + sizeHeight,
        }

        var styleSquare = {backgroundColor: this.formatColor(this.state.colorStyle)};
        return (
            <div className="same-color-zone" style={styleWrapper}
                 onMouseMove={this.onMouseMove.bind(this)}
                 onMouseLeave={this.onMouseLeave.bind(this)}
                 onMouseEnter={this.onMouseEnter.bind(this)} >
                <div className="triangle"> </div>
                <span className="same-color-image icon-ColorPicker"><span className="path1"></span><span className="path2"></span></span>
                
                <div
                    className="same-color-label">{ LocaleUtils.instance.translate('colorpicker.label.sample_color') }</div>
                <div className="same-color-square" style={styleSquare}></div>
                <Button className="same-color-button" text={ LocaleUtils.instance.translate('button.done')}
                        type={colorType.blue}
                        onClick={this.clickDone.bind(this)}/>
                <IconButton className="same-color-close" type={IconButton.type.close}
                            onClick={this.handleClose.bind(this)}/>
            </div>
        )
    }
}

SameColor.propTypes = {
    handleDone: PropTypes.func,
    handleClose: PropTypes.func,
    positionY: PropTypes.number,
    sizeHeight: PropTypes.number
}
