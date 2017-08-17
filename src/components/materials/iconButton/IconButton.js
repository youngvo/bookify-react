import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './IconButton.css';

export default class IconButton extends Component {
    renderIconButton(props) {
        var style = {};
        var styleSmall = {
            width: 18,
            height: 18
        };
        var className = props.className + ' icon-button-blurb';
        var iconClassName = '';

        switch (props.type) {
            case IconButton.type.close:
                iconClassName = 'icon-CloseIconCleanActive';
                style = styleSmall;
                return (
                    <div className={className} onClick={props.onClick} style={style}>
                        <div className={iconClassName}>

                        </div>
                    </div>
                );
            case IconButton.type.info:
                iconClassName = 'info icon ';
                style = styleSmall;
                return (
                    <div className={className} onClick={props.onClick} style={style}>
                        <div className={iconClassName}>
                            &#8505;
                        </div>
                    </div>
                );
            case IconButton.type.arrowFooter:
                iconClassName = 'icon-ExpandPhotostreamIcon icon ';
                break;
            case IconButton.type.arrowPagination:
                return (
                    //<img onClick={props.onClick} src={props.icon} className={props.className + " img-arrow"} alt="arrow" />/
                    <span onClick={props.onClick} className={props.className + " img-arrow"}></span>
                );
            case IconButton.type.changeLayout:
                iconClassName = ' icon-ShuffleIcon';
                break;
            case IconButton.type.selectLayout:
                iconClassName = ' icon-LayoutsIcon';
                break;
            case IconButton.type.selectBackgroundAndBorder:
                iconClassName = ' icon-PageBackgroundIcon';
                break;
            case IconButton.type.closeShowHelp:
                iconClassName = 'icon-CloseIconCleanActive';
                style = styleSmall;
                return (
                    <div className='show-help-tooltip-close-btn' onClick={props.onClick}>
                        <div className={iconClassName}>
                        </div>
                    </div>
                );
                break;
            default:
                iconClassName = 'icon-PageBackgroundIcon';
        }

        return (
            <div className={className} onClick={props.onClick ? props.onClick : null} style={style} onMouseDown={props.onMouseDown ? props.onMouseDown : null}>
                <div className={iconClassName}>
                </div>
            </div>
        );
    }

    render() {
        return this.renderIconButton(this.props);
    }
}

IconButton.type = {
    default: 'default',
    close: 'close',
    info: 'info',
    arrowFooter: 'arrowFooter',
    arrowPagination: 'arrowPagination',
    changeLayout: 'changeLayout',
    selectLayout: 'selectLayout',
    selectBackgroundAndBorder: 'selectLayoutAndBorder',
    closeShowHelp: 'closeShowHelp'
};

IconButton.propTypes = {
    icon:       PropTypes.string,
    onClick:    PropTypes.func,
    onMouseDown: PropTypes.func,
    className:  PropTypes.string,
    type:       PropTypes.string
};

IconButton.defaultProps = {
    icon:       '',
    onClick:    ()=>{console.log("null function at iconButton")},
    onMouseDown: ()=>{console.log("null function at iconButton")},
    className:  '',
    type:       IconButton.type.default
};
