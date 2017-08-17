import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LocaleUtils from './../../../../utils/LocaleUtils';
import './TextEditControl.css';
import Button, { colorType, ICON_BUTTON } from './../../../materials/button/Button';
import StyleButton from './StyleButton';
import Assets from './../../../../assets/Assets';
import Dropdown from './../../../../libs/react-dropdown';
import Config from './../../../../config/Config'
import Tooltip  from 'rc-tooltip';

const style = {
    bold: "BOLD",
    italic: "ITALIC",
    underline: "UNDERLINE"
}

let optionsFontType = [
    // { value: 'Times New Roman', label: 'Times New Roman' },
    // { value: 'arial', label: 'Arial' }
];

let optionFontSize = [
    // { value: '7', label: '7' },
    // { value: '72', label: '72' },
];

let fontItemOfDropdown = (font) => (
    <div className="item-font-dropdown" style={{fontFamily: font.family}}>
        {
            font.family
        }
		{
            font.italic ? <span className="icon-italic" /> : null
        }
        {
            font.bold ? <span className="icon-bold" /> : null
        }
    </div>
)

var currentStyle = {};

export default class TextEditControl extends Component {
    constructor(props) {
        super(props);

        let fonts = Config.instance.fonts;
        for (let i in fonts) {
            let font = { value: i, label: fontItemOfDropdown(fonts[i]) };
            optionsFontType.push(font);
        }

        let fontSizes = Config.instance.fontSizes;
        for (let i in fontSizes) {
            let fontSize = { value: fontSizes[i], label: <div className="item-font-dropdown">{fontSizes[i]}</div> }
            optionFontSize.push(fontSize);
        }

        this.styleList = this.getStyleAtFocusOfEditorState(props.editorState);

        this.state = {
            isLeftAlignClick: props.textAlignment === 'left',
            isCenterAlignClick: props.textAlignment === 'center',
            isRightAlignClick: props.textAlignment === 'right',
            isRemoveStyleMouseDown: false,
            fontValue: '',
            sizeValue: '',
            position: {
                x: 0,
                y: 0
            }
        }
        this.onChangeSelectingFontSize = (size) => this._onChangeSelectingFontSize(size);
        this.onChangeSelectingFontType = (font) => this._onChangeSelectingFontType(font);
        this.setDefautlFontAndSizeForText = () => this._setDefautlFontAndSizeForText();
        this.setStateValueFromStyleList = (editorState) => this._setStateValueFromStyleList(editorState);
        this.thisDOM = null;
        this.getThisDOM = (ref) => { this.thisDOM = ref; }
        this.setPositionState = this.setPositionState.bind(this);
    }

    componentDidMount() {
        this.thisDOM.addEventListener('click', (e)=>{e.preventDefault(), console.log("###")})
        if (!this.state.sizeValue && !this.state.fontValue) {
            this.setStateValueFromStyleList(this.props.editorState);
            this.setDefautlFontAndSizeForText();
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setStateValueFromStyleList(nextProps.editorState);
    }

    _setStateValueFromStyleList(editorState) {
        let styles = this.getStyleAtFocusOfEditorState(editorState);
        if (styles.length > 0)  {
            this.styleList = styles;
        } 
        // else {
        //     let lastBlock = editorState.getCurrentContent().getLastBlock();
        //     let chars = lastBlock.getCharacterList();
        //     let lastChar = chars.last();
        //     let stylesOfLastChar = null;
        //     if (lastChar && lastChar.hasStyle()) {
        //         stylesOfLastChar = lastChar.getStyle().toArray();
        //     }
        //     this.styleList = stylesOfLastChar;
        // }
        console.log("STYLE LIST ::::::", styles)
        for (let i in this.styleList) {
            if (!this.styleList[i]) continue;
            if (this.styleList[i].indexOf('size_style-')===0) {
                this.setState({ sizeValue: this.styleList[i].split('-')[1]})
            } else if (this.styleList[i].indexOf('font_style-')===0) {
                this.setState({ fontValue: this.styleList[i].split('-')[1]})
            }
        }
    }

    getStyleAtFocusOfEditorState(editorState) {
        return editorState.getCurrentInlineStyle().toArray();
    }

    setPositionState(e) {
        let rect = e.target.getBoundingClientRect();
        let xPos = e.pageX - rect.left - rect.width; //x position within the element
        let yPos = e.pageY - rect.top - rect.height;  //y position within the element
        this.setState({
            position: {
                x: xPos,
                y: yPos
            }
        })
    }

    setDefaultState() {
        this.setState({
            isLeftAlignClick: true,
            isCenterAlignClick: false,
            isRightAlignClick: false,
            isRemoveStyleMouseDown: false
        })
        this.props.handleLeftAlign();
        currentStyle = {};
    }

    _setDefautlFontAndSizeForText() {
        let { textDefaultStyle } = this.props;
        let font = 'font_style-' + textDefaultStyle.font;
        let size = 'size_style-' + textDefaultStyle.size;
        let color = textDefaultStyle.color;
        this.props.setFontAndSizeForText(font, size, color);
    }

    _onChangeSelectingFontType(optionsFontType) {
        this.setState({
            fontValue: optionsFontType.value
        })
        this.props.handleChangeFont(optionsFontType.value);
    }

    _onChangeSelectingFontSize(optionsFontSize) {
        this.setState({
            sizeValue: optionsFontSize.value
        })
        this.props.handleChangeSize(optionsFontSize.value);
    }

    onTextAlignLeftClick() {
        this.setState({
            isLeftAlignClick: true,
            isCenterAlignClick: false,
            isRightAlignClick: false
        })
        this.props.handleLeftAlign();
    }

    onTextAlignCenterClick() {
        this.setState({
            isCenterAlignClick: true,
            isLeftAlignClick: false,
            isRightAlignClick: false
        })
        this.props.handleMiddleAlign();
    }

    onTextAlignRightClick() {
        this.setState({
            isRightAlignClick: true,
            isCenterAlignClick: false,
            isLeftAlignClick: false
        })
        this.props.handleRightAlign();
    }

    onBoldClick() {
        this.setState({
            isBoldClick: !this.state.isBoldClick
        })
    }

    onItalicClick() {
        this.setState({
            isItalicClick: !this.state.isItalicClick
        })

    }

    onUnderlineClick() {
        this.setState({
            isUnderlineClick: !this.state.isUnderlineClick
        })
    }


    onTextRemoveStyleMouseDown(e) {
        e.preventDefault();
        this.setState({
            isRemoveStyleMouseDown: !this.state.isRemoveStyleMouseDown
        })

    }

    onTextRemoveStyleMouseUp(e) {
        e.preventDefault();
        this.setState({
            isRemoveStyleMouseDown: false
        })
        this.props.handleRemoveStyle();
        this.setDefaultState();
    }

    render() {
        currentStyle = this.props.editorState.getCurrentInlineStyle();
        let { styleTextEdit } = this.props;
        let leftAlignClassName = this.state.isLeftAlignClick ? "left-button-font-icon text-edit-icon boder-color btn-active " : "left-button-font-icon text-edit-icon grad-btn boder-color";
        let centerAlignClassName = this.state.isCenterAlignClick ? "center-button-font-icon text-edit-icon boder-color btn-active" : "center-button-font-icon text-edit-icon grad-btn boder-color";
        let rightAlignClassName = this.state.isRightAlignClick ? "right-button-font-icon text-edit-icon boder-color btn-active" : "right-button-font-icon text-edit-icon grad-btn boder-color";
        let removeStyleClassName = this.state.isRemoveStyleMouseDown ? "remove-button-font-icon text-edit-icon boder-color btn-active" : "remove-button-font-icon text-edit-icon grad-btn boder-color";
        let boldClassName = currentStyle.has("BOLD") ? "bold-button-font-icon text-edit-icon boder-color btn-active" : "bold-button-font-icon text-edit-icon grad-btn boder-color";
        let italicClassName = currentStyle.has("ITALIC") ? "italic-button-font-icon text-edit-icon boder-color btn-active" : "italic-button-font-icon text-edit-icon grad-btn boder-color";
        let underlineClassName = currentStyle.has("UNDERLINE") ? "underline-text-edit-icon text-edit-icon boder-color btn-active" : "underline-text-edit-icon button-font-icon text-edit-icon grad-btn boder-color";

        return (
            <div className={"text-edit-control-wrapper " + this.props.className} style={styleTextEdit} ref={this.getThisDOM} >
                <div className="text-edit-control-arrow" />
                <div className="text-edit-control-zone" >
                    <div className="font-type-drop-down">
                        <Dropdown
                            options={optionsFontType}
                            onChange={this.onChangeSelectingFontType.bind(this)}
                            value={this.state.fontValue}
                            onFocus={() => {}}
                        />
                    </div>
                    <div className="font-size-drop-down">
                        <Dropdown
                            options={optionFontSize}
                            onChange={this.onChangeSelectingFontSize.bind(this)}
                            value={this.state.sizeValue}
                            onFocus={() => {}}
                        />
                    </div>
                    <div className="text-edit-control-divider-line" />
                    <Tooltip placement='bottomRight' prefixCls='rc-tooltip-custom-page'
                             align={{
                                 offset: [this.state.position.x, this.state.position.y],
                             }}
                             overlay={LocaleUtils.instance.translate('colorpicker.label.pick_color')}>
                        <div className='tooltip-custom-div-wrapper' onMouseEnter={this.setPositionState}>
                            <Button className="pick-color-button text-edit-icon grad-btn boder-color"
                                type={colorType.textControl}
                                iconImage={Assets.instance.retrieveImageObjectURL('img_colorPicker')}
                                onMouseDown={(e) => this.props.handlePickColor(e)}
                            />
                        </div>
                    </Tooltip>
                    <Tooltip placement='bottomRight' prefixCls='rc-tooltip-custom-page'
                             align={{
                                 offset: [this.state.position.x, this.state.position.y],
                             }}
                             overlay={LocaleUtils.instance.translate('colorpicker.label.sample_color')}>
                        <div className='tooltip-custom-div-wrapper' onMouseEnter={this.setPositionState}>
                            <Button className="same-color text-edit-icon grad-btn boder-color"
                                    type={colorType.textControl}
                                    iconImage={Assets.instance.retrieveImageObjectURL('img_pickerColor')}
                                    onMouseDown={(e) => this.props.handleSameColor(e)}
                            />
                        </div>
                    </Tooltip>
                    <div className="text-edit-control-divider-line" />
                    <Tooltip placement='bottomRight' prefixCls='rc-tooltip-custom-page'
                             align={{
                                 offset: [this.state.position.x, this.state.position.y],
                             }}
                             overlay={LocaleUtils.instance.translate('tooltip.text_style.bold')}>
                        <div className='tooltip-custom-div-wrapper' onMouseEnter={this.setPositionState}>
                            <StyleButton
                                className={boldClassName}
                                iconType={ICON_BUTTON.bold}
                                onToggle={this.props.onToggle}
                                style={style.bold}
                            />
                        </div>
                    </Tooltip>
                    <Tooltip placement='bottomRight' prefixCls='rc-tooltip-custom-page'
                             align={{
                                 offset: [this.state.position.x, this.state.position.y],
                             }}
                             overlay={LocaleUtils.instance.translate('tooltip.text_style.italics')}>
                        <div className='tooltip-custom-div-wrapper' onMouseEnter={this.setPositionState}>
                            <StyleButton
                                className={italicClassName}
                                iconType={ICON_BUTTON.italic}
                                onToggle={this.props.onToggle}
                                style={style.italic}
                            />
                        </div>
                    </Tooltip>
                    <Tooltip placement='bottomRight' prefixCls='rc-tooltip-custom-page'
                             align={{
                                 offset: [this.state.position.x, this.state.position.y],
                             }}
                             overlay={LocaleUtils.instance.translate('tooltip.text_style.underline')}>
                        <div className='tooltip-custom-div-wrapper' onMouseEnter={this.setPositionState}>
                            <StyleButton
                                className={underlineClassName}
                                iconType={ICON_BUTTON.underline}
                                onToggle={this.props.onToggle}
                                style={style.underline}
                            />
                        </div>
                    </Tooltip>
                    <Button className={leftAlignClassName}
                        type={colorType.fontIcon}
                        onMouseDown={this.onTextAlignLeftClick.bind(this)}
                        iconType={ICON_BUTTON.leftAlign}
                        isFontIcon={true}
                        icon={false}
                    />
                    <Button className={centerAlignClassName}
                        type={colorType.fontIcon}
                        onMouseDown={this.onTextAlignCenterClick.bind(this)}
                        iconType={ICON_BUTTON.centerAlign}
                        isFontIcon={true}
                        icon={false}
                    />
                    <Button className={rightAlignClassName}
                        type={colorType.fontIcon}
                        onMouseDown={this.onTextAlignRightClick.bind(this)}
                        iconType={ICON_BUTTON.rightAlign}
                        isFontIcon={true}
                        icon={false}
                    />
                    <Button className={removeStyleClassName}
                        type={colorType.fontIcon}
                        onMouseDown={this.onTextRemoveStyleMouseDown.bind(this)}
                        onMouseUp={this.onTextRemoveStyleMouseUp.bind(this)}
                        iconType={ICON_BUTTON.removeStyle}
                        isFontIcon={true}
                        icon={false}
                    />
                </div>
            </div>
        )
    }
}

TextEditControl.propTypes = {
    scaleValue: PropTypes.number,
    handlePickColor: PropTypes.func,
    handleSameColor: PropTypes.func,
    handleUnderline: PropTypes.func,
    handleItalic: PropTypes.func,
    handleBold: PropTypes.func,
    handleLeftAlign: PropTypes.func,
    handleMiddleAlign: PropTypes.func,
    handleRightAlign: PropTypes.func,
    handleRemoveStyle: PropTypes.func,
    handleChangeSize: PropTypes.func,
    handleChangeFont: PropTypes.func,
    styleTextEdit: PropTypes.object,
    textAlignment: PropTypes.string,
    textDefaultStyle: PropTypes.object,
    setFontAndSizeForText: PropTypes.func
}
