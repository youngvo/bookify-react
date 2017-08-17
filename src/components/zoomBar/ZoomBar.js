import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Tooltip      from 'rc-tooltip';
import Slider       from 'rc-slider';

import 'rc-slider/assets/index.css';
import './ZoomBar.css';

const Handle = Slider.Handle;
var valueSlider = 0;

const handle = (props) => {
    const { value, dragging, index, ...restProps } = props;
    valueSlider = value;
    return (
        <Tooltip
            prefixCls="rc-tooltip-custom"
            overlay={value+'%'}
            visible={dragging}
            placement="top"
            key={index} >
            <Handle {...restProps} />
        </Tooltip>
    );
};

export default class ZoomBar extends Component {
    constructor(props){
        super(props);
        this.state = {
            sliderValue: valueSlider
        };
    };

    onChangeSlider(valueSlider, sliderValue) {
        this.props.handleChangeZoomValue(valueSlider);
        console.log(valueSlider);
        console.log(sliderValue);
    };


    render() {
        return (
            <div className='slider-on-header'>
                <div className='slider-minus'>-</div>
                <Slider ref="slider_on_header" value={this.state.sliderValue} min={100} max={300} step={1}
                        onChange={(sliderValue) => {
                            this.setState({ sliderValue });
                            this.onChangeSlider(sliderValue, this.state.sliderValue);
                        }}
                        handle={handle}>
                </Slider >
                <div className='slider-plus'>+</div>
            </div>
        )
    }
}

ZoomBar.propTypes = {
    handleChangeZoomValue: PropTypes.func
}
