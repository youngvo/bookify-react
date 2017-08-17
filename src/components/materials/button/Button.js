import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Button.css';
// import Assets from './../../../assets/Assets';

export const colorType = {
    default:        'default',
    orange:         'orange',
    blue:           'blue',
    black:          'black',
    gray:           'gray',
    transparent:    'transparent',
    photoEdit:      'blue photo edit',
    textControl:    'textControl',
    layout:         'layout',
    fontIcon:       'fontIcon'
};

export default class Button extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isMouseHover: false
        }
    }

    onMouseEnter() {
        this.setState({
            isMouseHover: true
        })
    }

    onMouseLeave() {
        this.setState({
            isMouseHover: false
        })
    }

    renderButton(props) {
        let colorBackground = '';
        let styleButton = {};
        let className = props.enableClick ? 'enable ' : 'unable ';
        let backgroundImageUrl = props.defaultImageUrl;

        switch (props.type) {
            case colorType.orange:
                className += 'button-blurb-color button-blurb-orange ' + props.className;
                styleButton = {};
                break;
            case colorType.blue:
                className += 'button-blurb-color button-blurb-blue ' + props.className;
                styleButton = {};
                break;
            case colorType.black:
                className += 'button-blurb-color button-blurb-black ' + props.className;
                styleButton = {};
                break;
            case colorType.gray:
                className += 'button-blurb-color button-blurb-gray ' + props.className;
                styleButton = {};
                break;
            case colorType.transparent:
                className += 'button-blurb' + props.className;
                styleButton = {
                    background: 'transparent',
                    border: 'transparent'
                };
                break;
            case colorType.photoEdit:
                className += 'button-photo-edit ' + props.className;
                styleButton = {};
                backgroundImageUrl = this.state.isMouseHover ? props.hoverImageUrl : props.defaultImageUrl
                break;
            case colorType.textControl:
                className += props.className;
                styleButton = { background: colorBackground };
                const { onClick, onMouseDown, onMouseEnter, onMouseLeave } = this.props;
                return (
                    <div onClick={onClick} className={className} style={styleButton} onMouseDown={onMouseDown} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                        {
                            props.iconImage &&
                            <div className="button-blurb-content">
                                <div className="icon-image-wrapper">
                                    <img src={props.iconImage} alt='' />
                                </div>
                            </div>
                        }
                    </div>
                );
            case colorType.fontIcon:
                className += props.className;
                styleButton = { background: colorBackground };
                break;
            case colorType.layout:
                return (
                    props.iconImage ?
                        <div className="button-blurb-content">
                            <div className="button-layout-wrapper">
                                <img src={props.iconImage} alt="layout" />
                            </div>
                        </div> : null
                )
                break;
            default:
                className = "button-blurb btn-header-gd" + props.className;
                styleButton = { background: colorBackground };
                break;
        }

        const { onClick, onMouseDown, onMouseEnter, onMouseLeave, enableClick, onMouseUp } = this.props;

        const renderTextAndIcon = () => {
            if (props.textFirst) {
                return (
                    <div className="button-blurb-content">
                        <div className="mana-page">{props.text}</div>
                        <div className={"icon-in-button " + props.icon}></div>
                    </div>
                )
            }

            return (
                <div className="button-blurb-content">
                    <div className={"icon-in-button " + props.icon}></div>
                    <div className="mana-page"> {props.text}</div>
                </div>
            );
        }

        const renderFontIcon = () => {
            return (
                <div className="button-photo-edit-content"
                    onMouseEnter={this.onMouseEnter.bind(this)}
                    onMouseLeave={this.onMouseLeave.bind(this)} >
                    <div className="button-photto-font-icon">
                        {
                            props.iconType ? props.iconType : null
                        }
                    </div>
                    <span> {props.text} </span>
                </div>
            )
        }

        return (
            <div
                className={className} style={styleButton}
                onClick={enableClick ? onClick : null}
                onMouseDown={enableClick ? onMouseDown : null}
                onMouseEnter={enableClick ? onMouseEnter : null}
                onMouseLeave={enableClick ? onMouseLeave : null}
                onMouseUp={enableClick ? onMouseUp : null}
            >
                {
                    props.icon ? renderTextAndIcon() :
                        props.isFontIcon ? renderFontIcon() :
                             <div className="button-blurb-content">{props.text}</div>
                }
            </div>
        );
    }

    render() {
        return this.renderButton(this.props);
    }
}

export const ICON_BUTTON = {
    fill: <span className="font-icon-custom sprite sprite-fit-org"/>,
    fit: <span className="font-icon-custom sprite sprite-fill-org"/>,
    rotate: <span className="font-icon-custom sprite sprite-rotate-org"/>,
    remove: <span className="font-icon-custom sprite sprite-remove-org"/>,
    info: <span className="font-icon-custom sprite sprite-info"/>,
    bold: <span className="font-icon-text-edit-control-bold icon-bold"/>,
    italic: <span className="font-icon-text-edit-control-bold icon-italic"/>,
    underline: <span className="font-icon-text-edit-control-bold icon-underline"/>,
    leftAlign: <span className="font-icon-text-edit-control-bold icon-centerAlign"/>,
    centerAlign: <span className="font-icon-text-edit-control-bold icon-leftAlign"/>,
    rightAlign: <span className="font-icon-text-edit-control-bold icon-rightAlign"/>,
    removeStyle: <span className="font-icon-text-edit-control-bold icon-ResetStyleIcon"/>,
    layout:  <span className="font-icon-layout icon-LayoutsIcon"/>
}

Button.propTypes = {
    textFirst: PropTypes.bool,
    halfTop: PropTypes.string,
    halfBottom: PropTypes.string,
    text: PropTypes.string,
    icon: PropTypes.string,
    iconImage: PropTypes.string,
    enableClick: PropTypes.bool,
    onClick: PropTypes.any,
    className: PropTypes.string,
    type: PropTypes.string,
    onMouseDown: PropTypes.any,
};

Button.defaultProps = {
    halfTop: "#ffffff",
    halfBottom: "#dcdcdc",
    text: "",
    icon: "",
    iconImage: "",
    enableClick: true,
    onClick: () => { },
    className: "",
    type: colorType.default,
    onMouseDown: () => { }
};
