import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ColorPicker.css';
import IconButton from "../../../../materials/iconButton/IconButton";
import LocaleUtils from './../../../../../utils/LocaleUtils';
import Assets from './../../../../../assets/Assets';
import Button, { colorType } from "../../../../materials/button/Button";

export default class ColorPicker extends Component {

    constructor(props) {
        super(props)
        this.state = {
            colorArrStyle: this.props.colorArrStyle,
            displayArrStyles: this.props.displayArrStyle
        };
    }

    componentDidMount() {
        this.drawCanvas();
    }

    onMouseMove(e) {
        var canvas = document.getElementById('canvas').getContext('2d');
        var imageData = canvas.getImageData(e.nativeEvent.offsetX, e.nativeEvent.offsetY, 1, 1).data;
        this.state.colorArrStyle[0] = imageData;
        this.setState({
            colorArrStyle: this.state.colorArrStyle,
        });
    }

    onMouseLeave() {
        if (this.state.displayArrStyles[0] != "none") {
            this.state.colorArrStyle[0] = this.state.colorArrStyle[1];
            this.setState({
                colorArrStyle: this.state.colorArrStyle
            });
        }
    }

    onMouseDown(e) {
        e.preventDefault();
    }

    onMouseUp(e) {
        e.preventDefault();
        var canvas = document.getElementById('canvas').getContext('2d');
        var imageData = canvas.getImageData(e.nativeEvent.offsetX, e.nativeEvent.offsetY, 1, 1).data;
        var arr = this.state.displayArrStyles;
        var colorArr = this.state.colorArrStyle;
        if (this.state.displayArrStyles[0] === "none") {
            colorArr[1] = imageData;
            arr[0] = "block";
        } else if (this.state.displayArrStyles[1] === "none") {
            colorArr[2] = colorArr[1];
            colorArr[1] = imageData;
            arr[1] = "block";
        } else if (this.state.displayArrStyles[2] === "none") {
            colorArr[3] = colorArr[2];
            colorArr[2] = colorArr[1];
            colorArr[1] = imageData;
            arr[2] = "block";
        } else {
            colorArr[4] = colorArr[3];
            colorArr[3] = colorArr[2];
            colorArr[2] = colorArr[1];
            colorArr[1] = imageData;
            arr[3] = "block";
        }
        this.setState({
            displayArrStyles: arr,
            colorArrStyle: colorArr
        });
    }

    drawCanvas() {
        let c = document.getElementById("canvas");
        let ctx = c.getContext("2d");
        let imageObj = new Image();
        imageObj.src = Assets.instance.retrieveImageObjectURL('img_color_palette_landscape');
        imageObj.onload = function () {
            ctx.drawImage(imageObj, 0, 0, 212, 79);
        };
    }

    formatColor(arr) {
        return 'rgba(' + arr.join(', ') + ')';
    }

    clickDone(e) {
        e.preventDefault();
        this.props.handleDone(this.formatColor(this.state.colorArrStyle[0]));
    }

    onMouseDownSquare1(e) {
        e.preventDefault();
        this.state.colorArrStyle[0] = this.state.colorArrStyle[1];
        this.setState({ colorArrStyle: this.state.colorArrStyle })
    }

    onMouseDownSquare2(e) {
        e.preventDefault();
        this.state.colorArrStyle[0] = this.state.colorArrStyle[2];
        this.setState({ colorArrStyle: this.state.colorArrStyle })
    }

    onMouseDownSquare3(e) {
        e.preventDefault();
        this.state.colorArrStyle[0] = this.state.colorArrStyle[3];
        this.setState({ colorArrStyle: this.state.colorArrStyle })
    }

    onMouseDownSquare4(e) {
        e.preventDefault();
        this.state.colorArrStyle[0] = this.state.colorArrStyle[4];
        this.setState({ colorArrStyle: this.state.colorArrStyle })
    }

    render() {
        let styleCanvas = {
            cursor: "url(" + Assets.instance.retrieveImageObjectURL('img_eyedropper') + ") 0 18, auto"
        };
        let styleSquare = { backgroundColor: this.formatColor(this.state.colorArrStyle[0]) };
        let styleSquare1 = { backgroundColor: this.formatColor(this.state.colorArrStyle[1]), display: this.state.displayArrStyles[0] };
        let styleSquare2 = { backgroundColor: this.formatColor(this.state.colorArrStyle[2]), display: this.state.displayArrStyles[1] };
        let styleSquare3 = { backgroundColor: this.formatColor(this.state.colorArrStyle[3]), display: this.state.displayArrStyles[2] };
        let styleSquare4 = { backgroundColor: this.formatColor(this.state.colorArrStyle[4]), display: this.state.displayArrStyles[3] };

        return (
            <div className="picker-zone" onMouseDown={this.onMouseDown.bind(this)}>
                <div className="picker triangle"> </div>
                <IconButton className="picker-close" type={IconButton.type.close} onClick={this.props.handleClose} />
                <div className="picker-header">
                    <div className="picker-title-top">{LocaleUtils.instance.translate('colorpicker.label.pick_color_nobr')}</div>
                    <div className="color-val">
                    <div className="picker-title-R">
                        <label>R</label>
                        <div className="picker-number"> {this.state.colorArrStyle[0][0]} </div>
                    </div>
                    <div className="picker-title-G">
                        <label>G</label>
                        <div className="picker-number"> {this.state.colorArrStyle[0][1]} </div>
                    </div>
                    <div className="picker-title-B">
                        <label>B</label>
                        <div className="picker-number"> {this.state.colorArrStyle[0][2]} </div>
                    </div>
                    </div>    
                    
                </div>

                <div className="picker-body">
                    <div className="picker-body left" style={styleSquare}>
                    </div>
                    <div className="picker-body right">
                        <canvas className="picker-canvas" style={styleCanvas} width="212" height="79" id="canvas"
                            onMouseMove={this.onMouseMove.bind(this)}
                            onMouseLeave={this.onMouseLeave.bind(this)}
                            onMouseUp={this.onMouseUp.bind(this)}
                            onMouseDown={this.onMouseDown.bind(this)}
                            realtime />
                    </div>
                   
                </div>
                <hr className="picker-hr" />
                <div className="picker-footer">
                    <div className="title">{LocaleUtils.instance.translate('colorpicker.label.recent_picks')} </div>
                    <div className="picker-float-left">
                        <div className="square" style={styleSquare1} onMouseDown={this.onMouseDownSquare1.bind(this)}> </div>
                        <div className="square" style={styleSquare2} onMouseDown={this.onMouseDownSquare2.bind(this)}> </div>
                        <div className="square" style={styleSquare3} onMouseDown={this.onMouseDownSquare3.bind(this)}> </div>
                        <div className="square" style={styleSquare4} onMouseDown={this.onMouseDownSquare4.bind(this)}> </div>
                       
                    </div>
                    <div className="button-right">
                         <Button className="picker-button-done" text={LocaleUtils.instance.translate('button.done')} onMouseDown={this.clickDone.bind(this)} type={colorType.blue} />
                        </div>
                </div>
            </div>
        )
    }
}

ColorPicker.propTypes = {
    handleDone: PropTypes.func,
    handleClose: PropTypes.func,
    displayArrStyle: PropTypes.array,
    colorArrStyle: PropTypes.array
}

ColorPicker.defaultProps = {
    displayArrStyle: ["none", "none", "none", "none"],
    colorArrStyle: [[0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 0, 1]]
}
