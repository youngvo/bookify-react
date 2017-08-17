import React, { Component } from 'react';
import PropTypes from 'prop-types';
import onClickOutsize from 'react-onclickoutside';
import LocaleUtils from '../../../utils/LocaleUtils';
import CTEventFactory from '../../../utils/CTEventFactory';
import {Editor, EditorState, RichUtils, Modifier, ContentState, CharacterMetadata, ContentBlock } from 'draft-js';
import generateRandomKey from 'draft-js/lib/generateRandomKey'
import Immutable from 'immutable';
import Assets      from './../../../assets/Assets';
import './TextField.css';
import ColorPicker from './textEditControl/colorPicker/ColorPicker';
import SameColor from './textEditControl/sameColor/SameColor';
import Tooltip  from 'rc-tooltip';
import AppServices from '../../../services/AppServices';
import TextEditControl from './textEditControl/TextEditControl';
import { themesOriginal } from './../../../constants/Constants'

let styleMap = {};

let defaultStyle = "black";

function rgbToHex(color){
    let rgb = color.toString();
    if (rgb.indexOf('rgb',0)!=-1) {
        rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return (rgb && rgb.length === 4) ? '#' +
        ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
    } else {
        return color;
    }
}

function getBlockStyle(block) {
    switch (block.getType()) {
        case 'blockquote': return 'RichEditor-blockquote';
        default: return null;
    }
}

class TextField extends Component {
    constructor(props) {
        super(props);

        this.makeDefaultStyleMapFromTextStyle(props.textStyle);
        this.defaultStyleArray = this.makeDefaultStyleStringArrayFromTextStyle(props.textStyle);

        this.state = {
            isMouseEnter: false,
            click_flag: false,
            click_pick_color: false,
            click_same_color: false,
            editorState: props.textSource ?
                                this.getEditorState(props.textSource)
                                : EditorState.createEmpty(),
            textAlignment: props.textSource ? props.textSource.alignment ? props.textSource.alignment : 'left' : 'left',
            // isHasNewColor: false,
            displayStyleColorPicker: ["none", "none", "none", "none"],
            position: {
                x: 0,
                y: 0
            }
        };

        this.preTextObject = props.textSource;
        this.removeKeyOfTextObject(this.preTextObject);
        this.preTimeOut = null;

        this.setDomEditorRef = ref => this.domEditor = ref;
        this.focus = () => { this.domEditor.focus(); }
        this.onChange = (editorState) => this.updateEditorState(editorState);
        this.handleKeyCommand = (command) => this._handleKeyCommand(command);
        this.onTab = (e) => this._onTab(e);
        this.toggleBlockType = (type) => this._toggleBlockType(type);
        this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
        this.toggleInlineStyleWithType = (style, type) => this._toggleInlineStyleWithType(style, type);
        this.resetStyle = () => this.removeStyle();
        // this.toggleColor = (toggledColor) => this._toggleInlineStyleWithType(toggledColor, 'color');
        this.setColor = (color) => this._setColor(color);

        this.setPositionState = this.setPositionState.bind(this);
        this.hasRemoveUnsupportedCharacters = false;
        this.forceFresh = false;
        this.firstRender = true;
        this.isHideEditControl = false;
    }

    makeDefaultStyleStringArrayFromTextStyle(textStyle) {
        let styleList = []
        if (textStyle.color) {
            styleList.push(textStyle.color);
        }
        if (textStyle.font) {
            styleList.push('font_style-'+textStyle.font);
        }
        if (textStyle.size) {
            styleList.push('size_style-'+textStyle.size);
        }

        return styleList;
    }

    makeDefaultStyleMapFromTextStyle(textStyle) {
        if (textStyle.color) {
            styleMap[textStyle.color] = { color: textStyle.color };
        }
        if (textStyle.font) {
            styleMap['font_style-'+textStyle.font] = { fontFamily: textStyle.font };
        }
        if (textStyle.size) {
            styleMap['size_style-'+textStyle.size] = { fontSize: textStyle.size };
        }
    }

    componentWillReceiveProps(nextProps) {
        if(this.hasRemoveUnsupportedCharacters || this.forceFresh) {
            this.hasRemoveUnsupportedCharacters = false;
            this.forceFresh = false;
            this.setState({
                editorState: nextProps.textSource ?
                            this.getEditorState(nextProps.textSource)
                            : EditorState.createEmpty()
            })
        }
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

    removeKeyOfTextObject(textObject) {
        if (!textObject) return;

        for (let key in textObject) {
            if (key === 'alignment') continue;
            textObject[key].key = '';
        }
    }

    addStyleIntoStyleMap(styleKey, styleType) {
        styleMap[styleKey] = styleType;
    }

    parseSpansOfTextFlowToTextEditor(editorObject, spanArr) {
        for (let i in spanArr) {
            let textInSpan = '';
            let styleInSpan = {};
            let arrStyle = [];

            if (typeof spanArr[i] === 'string') {
                textInSpan = spanArr[i];
            } else {
                if (spanArr[i].hasOwnProperty('$')) {
                    styleInSpan = spanArr[i]['$'];
                }
                if (spanArr[i].hasOwnProperty('_')) {
                    textInSpan = spanArr[i]['_'].toString();
                }
            }

            if (styleInSpan.fontWeight && styleInSpan.fontWeight === 'bold') arrStyle.push('BOLD');
            if (styleInSpan.fontStyle && styleInSpan.fontStyle === 'italic') arrStyle.push('ITALIC');
            if (styleInSpan.textDecoration && styleInSpan.textDecoration === 'underline') arrStyle.push('UNDERLINE');
            if (styleInSpan.color) arrStyle.push(styleInSpan.color);
            if (styleInSpan.fontFamily) arrStyle.push('font_style-'+styleInSpan.fontFamily);
            if (styleInSpan.fontSize) arrStyle.push('size_style-'+styleInSpan.fontSize);

            editorObject.text = editorObject.text + textInSpan;
            let sizeCharacterList = Object.keys(editorObject.characterList).length;

            if (textInSpan.length > 0) {
                for (let j = 0; j < textInSpan.length; j++) {
                    editorObject.characterList[sizeCharacterList+j] = {
                        style: arrStyle,
                        entity: null
                    };
                }
            }
        }
    }

    parseTextFlowToTextEditor(pArr) {
        let textEditorObject = {};

        pArr.forEach((p, index) => {
            let editorObject = {
                key: generateRandomKey(),
                text: '',
                type: 'unstyled',
                characterList: {},
                depth: 0,
                data: {}
            };

            if (p.span) {
                this.parseSpansOfTextFlowToTextEditor(editorObject, p.span);
            }

            textEditorObject[index] = editorObject;

            textEditorObject.alignment = 'left';
            if (p.$ && p.$.textAlign) textEditorObject.alignment = p.$.textAlign;
        });

        return textEditorObject;
    }

    parseTextSource(textSource) {
        let textFlowString = '';
        if (textSource.hasOwnProperty('_')) { textFlowString = textSource['_']; }
        if (textFlowString === '') { return null; }

        let parseString = require('xml2js').parseString;
        let textFlowObject = {};
        parseString(textFlowString, (err, result) => {
            if (result.hasOwnProperty('TextFlow')) {
                textFlowObject = result['TextFlow'];
            }
        });

        if (!textFlowObject.p) {
            return null;
        }

        return this.parseTextFlowToTextEditor(textFlowObject.p);
    }

    getEditorState(textObject) {
        const { Record, List, Set, Map, Repeat, OrderedSet } = Immutable;
        let arrayBlock = [];

        for ( let key in textObject ) {
            if ( key === 'alignment' ) continue;
            let chaList = textObject[key].characterList;
            let characterList = [];
            for ( let k in chaList ) {
                let chaRecord = CharacterMetadata.create({ style:OrderedSet(), entity: null} );
                for ( let i in chaList[k].style ) {
                    let style = chaList[k].style[i];
                    if ( style.indexOf('#',0)!==-1 ) { //color style
                        this.addStyleIntoStyleMap(style, { color: style });
                    } else if ( style.indexOf('size_style-',0)!==-1 ) {
                        let strArr = style.split('-');
                        this.addStyleIntoStyleMap(style, { fontSize: strArr[1] });
                    } else if( style.indexOf('font_style-',0)!==-1 ) {
                        let strArr = style.split('-');
                        this.addStyleIntoStyleMap(style, { fontFamily: strArr[1] });
                    }
                    chaRecord = CharacterMetadata.applyStyle(chaRecord, style);
                }

                characterList.push(chaRecord);
            }

            let newcContentBlock = new ContentBlock({
                key: generateRandomKey(),
                text: textObject[key].text,
                type: 'unstyled',
                characterList: List(characterList)
            });

            arrayBlock.push(newcContentBlock);
        }

        let state = ContentState.createFromBlockArray(arrayBlock);
        return EditorState.createWithContent(state);
    }

    updateEditorState(editorState) {
        let selection = editorState.getSelection();
        let currentContent = editorState.getCurrentContent();
        if (!this.firstRender && !currentContent.hasText()) {
            for (let i in this.defaultStyleArray) {
                editorState = RichUtils.toggleInlineStyle(editorState, this.defaultStyleArray[i]);
            }
        }

        this.setState({editorState});

        if (this.preTimeOut) {
            clearTimeout(this.preTimeOut);
        }

        if (this.forceFresh) this.handleUpdateTextContainer(editorState);
        else {
            this.preTimeOut = setTimeout(this.handleUpdateTextContainer.bind(this, editorState), 400);
        }
    }

    isUnicode(str) {
        // Unicode range 0 to 255
        return /^[\u0000-\u00ff]*$/.test(str);
    }

    formatText(text) {
        // replace mdashes and ndashes
        text = text.replace( /–/g, "-" );
        text = text.replace( /—/g, "-" );
                    
        // replace "smart quotes"
        text = text.replace( /[“”]/g, '"' ); 
        text = text.replace( /[‘’]/g, "'" );

        return text;
    }

    convertEllipses(text) {
        // replace ellipses
        return text.replace( /…/g, "..." );
    }

    convertTab(text) {
        return text.replace( /\t|\v/g, "    " ); // tabs should convert to spaces, rather than stripped out
    }

    isTabChar(char) {
        return char === '\t' || char === '\v' || char === '	';
    }

    isEllipses(char) {
        return char === '…';
    }

    handleUpdateTextContainer(editorState) {
        let cS = editorState.getCurrentContent();
        if(!cS.hasText()) {
            this.updateTextContainer(null);
            return;
        }
        let arrayBlock = cS.getBlocksAsArray();
        let arrayBlockObject = {};
        let hasUnsupportedUnicodeCharacters = false;

        for (let key in arrayBlock) {
            let block = arrayBlock[key];
            let blockObject = {};

            blockObject.key = '';
            blockObject.type = 'unstyled';
            blockObject.text = '';
            let textOfBlock = this.formatText(block.getText());
            
            blockObject.characterList = {};

            let chaList = block.getCharacterList();
            let chaListObject = {};

            let index = 0;
            for ( let i=0; i < chaList.size; i++ ) {
                let cha = chaList.get(i);
                let chaObject = {};
                let chaStr = textOfBlock.charAt(i).toString();
                if (!this.isUnicode(chaStr)) {
                    hasUnsupportedUnicodeCharacters = true;
                    this.hasRemoveUnsupportedCharacters = true;
                    continue;
                }
                if (this.isTabChar(chaStr)) {
                    blockObject.text += this.convertTab(chaStr);
                    chaObject.style = cha.get('style').toArray();
                    chaObject.entity = null;
                    chaListObject[index] = chaObject;
                    chaListObject[index+1] = chaObject;
                    chaListObject[index+2] = chaObject;
                    chaListObject[index+3] = chaObject;
                    index = index+4;
                } else if (this.isEllipses(chaStr)) {
                    blockObject.text += this.convertEllipses(chaStr);
                    chaObject.style = cha.get('style').toArray();
                    chaObject.entity = null;
                    chaListObject[index] = chaObject;
                    chaListObject[index+1] = chaObject;
                    chaListObject[index+2] = chaObject;
                    index = index+3;
                } else {
                    blockObject.text += chaStr;
                    chaObject.style = cha.get('style').toArray();
                    chaObject.entity = null;
                    chaListObject[index] = chaObject;
                    index++;
                }
            }
            blockObject.characterList = chaListObject;

            blockObject.depth = 0;
            blockObject.data = {};
            arrayBlockObject[key] = blockObject;
        }

        let textObject = {...arrayBlockObject};
        textObject.alignment = this.state.textAlignment;

        if(this.checkTextObjectIsChanged(textObject) || this.forceFresh) {
            this.preTextObject = textObject;
            this.updateTextContainer(textObject);
        }
        if (hasUnsupportedUnicodeCharacters) {
            this.props.handleShowUnsupportedUnicodeCharacters();
        }
    }

    checkTextObjectIsChanged(textObject) {
        const jsonTextObject = JSON.stringify(textObject);
        const jsonPreTextObject = JSON.stringify(this.preTextObject);

        return (jsonTextObject !== jsonPreTextObject);
    }

    updateTextContainer(textObject) {
        let { idLayout, idPage, idPageLayout } = this.props;
        this.props.onChangeTextField(textObject, idLayout, idPage, idPageLayout);
    }

    _setColor(color) {
        let newColor = rgbToHex(color);
        styleMap[newColor] = {
            color: newColor
        }
        this.toggleInlineStyleWithType(newColor, 'color');
    }

    //------------------key command--------------------
    _handleKeyCommand(command) {
        const {editorState} = this.state;
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return true;
        }
        return false;
    }

    _onTab(e) {
        const maxDepth = 4;
        this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
    }

    _toggleBlockType(blockType) {
        this.onChange(
            RichUtils.toggleBlockType(
                this.state.editorState,
                blockType
            )
        );
    }

    _toggleInlineStyle(inlineStyle) {
        this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        );
    }

    _toggleInlineStyleWithType(inlineStyle, type) {
        this.forceFresh = true;
        let {editorState} = this.state;
        const selection = editorState.getSelection();

        const currentStyle = editorState.getCurrentInlineStyle();

        if (selection.isCollapsed()) {
            this.forceFresh = false;
        }

        console.log("INASASASAS::::", inlineStyle, type)
        editorState = currentStyle.reduce((state, style) => {
            if (type==='size' && style.indexOf('size_style-')===0) return RichUtils.toggleInlineStyle(state, style);
            if (type==='font' && style.indexOf('font_style-')===0) return RichUtils.toggleInlineStyle(state, style);
            if (type==='color' && style.indexOf('#')===0) return RichUtils.toggleInlineStyle(state, style);
            return state;
        }, editorState);

        // If the inlineStyle is being toggled on, apply it.
        if (!currentStyle.has(inlineStyle)) {
            editorState = RichUtils.toggleInlineStyle( editorState, inlineStyle );
        }

        if (!editorState.getCurrentContent().hasText()) {
            this.setState({editorState});
            return;
        }

        this.onChange(editorState);
    }

    removeStyle() {
        let editorState = this.state.editorState;
        let selectionState = editorState.getSelection();
        let currentContent = editorState.getCurrentContent();

        let newcurrentContent = currentContent;
        for ( let key in styleMap) {
            newcurrentContent = Modifier.removeInlineStyle(newcurrentContent,selectionState,key);
        }

        for (let i in this.defaultStyleArray) {
            newcurrentContent = Modifier.applyInlineStyle(newcurrentContent,selectionState,this.defaultStyleArray[i]);
        }

        this.onChange(
            EditorState.createWithContent(newcurrentContent)
        );

        let anchorKey = selectionState.getAnchorKey();
        let currentContentBlock = currentContent.getBlockForKey(anchorKey);
        let start = selectionState.getStartOffset();
        let end = selectionState.getEndOffset();
        let lenghtBlock = currentContentBlock.getLength();

        if (start===0 && end===lenghtBlock) {
            this.handleLeftAlign();
        }
    }

    isEmpty() {
        let editorState = this.state.editorState;
        let currentContent = editorState.getCurrentContent();
        let hasText = currentContent.hasText();
        return !hasText;
    }

    handlePickColor(e) {
        e.preventDefault();
        this.isHideEditControl = true;
        this.setState({
            click_pick_color: true
        });
    }

    handleDoneColorPicker(color) {
        this.isHideEditControl = false;
        this.setState({
            click_pick_color: false
        })
        this.setColor(color);
    }

    handleCloseColorPicker() {
        this.isHideEditControl = false;
        this.setState({
            click_pick_color: false
        })
    }

    handleLeftAlign() {
        this.setState({
            textAlignment : "left"
        });
        this.focus();
    }

    handleCenterAlign() {
        this.setState({
            textAlignment : "center"
        });
        this.focus();
    }

    handleRightAlign() {
        this.setState({
            textAlignment : "right"
        });
        this.focus();
    }

    handleClickOutside() {
        this.setState({
            click_flag: false,
            click_pick_color: false,
        });
        this.props.toggleKeyBoardEvent(false);
    }

    clickInside() {
        this.focus();
        if (!this.state.click_flag) {
            this.setState({
                click_flag: true,
                isMouseEnter: false,
                click_pick_color: false,
                click_same_color: false,
                // editorState: EditorState.moveFocusToEnd(this.state.editorState)
            });
        } 
        this.props.toggleKeyBoardEvent(true);
    }

    onMouseEnter() {
        this.setState({
            isMouseEnter: true
        })
    }

    onMouseLeave() {
        this.setState({
            isMouseEnter: false
        })
    }

    handleSameColor(e) {
        e.preventDefault();
        this.setState({
            click_same_color: true,
            click_flag: false,
        });
    }

    handleCloseSameColor() {
        this.setState({
            click_same_color: false,
            click_flag: true,
        });
    }

    handleDoneSameColor(color) {
        this.setState({
            // isHasNewColor: true,
            click_same_color: false,
            click_flag: true
        })
        this.setColor(color);
    }

    handleChangeSize(size) {
        styleMap['size_style-'+size] = {
            fontSize: parseInt(size)
        }
        this.toggleInlineStyleWithType('size_style-'+size, 'size');
    }

    handleChangeFont(font) {
        styleMap['font_style-'+font] = {
            fontFamily: font
        }
        this.toggleInlineStyleWithType('font_style-'+font, 'font');
        AppServices.trackCTEvent(CTEventFactory.instance.createFontSelectedEvent(font), null, null);
    }

    setFontAndSizeForText(font, size, color) {
        // let currentStyles = this.state.editorState.getCurrentInlineStyle().toArray();
        if (this.firstRender && !this.state.editorState.getCurrentContent().hasText()) {
            console.log("setFontAndSizeForText")
            this.setState({
                editorState:
                RichUtils.toggleInlineStyle(
                    RichUtils.toggleInlineStyle(
                        RichUtils.toggleInlineStyle(
                            this.state.editorState,
                            font
                        ),
                        size
                    ),
                    color
                )
            });
            this.firstRender = false;
        }
    }

    isLightTheme(theme) {
        if (theme === themesOriginal.ELEGANT || theme === themesOriginal.VIEW_FINDER) {
            return true;
        }

        return false;
    }

    render() {
        let { positionX, positionY, sizeHeight, sizeWidth, textStyle, themeKey, unScaleNumber } = this.props;
        let styleCanvas = {
            cursor : "url("+Assets.instance.images.eyedropper+") 0 18, auto"
        }
        let styleWrapper = {
            width: sizeWidth,
            height: sizeHeight,
            left: positionX,
            top: positionY,
        }
        let style =     {
            // height:             sizeHeight,
            // width:              sizeWidth,
            textAlign:          this.state.textAlignment,
            // backgroundColor:    this.state.click_flag ? "rgba(255, 50, 50, 0.01)" : this.state.isMouseEnter ? "rgba(55, 50, 250, 0.05)" : "rgba(255, 50, 50, 0.01)",
            // border:             this.state.click_flag ? "solid 1px #80ffff" : this.state.isMouseEnter ? "solid 1px #80ffff" : "solid 1px rgba(0, 0, 0, 0.0)"
        }
        const {editorState, textAlignment} = this.state;
        let className = 'RichEditor-editor';
        let styleTextEditControl = {
            // transform: 'scale('+1/numberScale+')',
            // transformOrigin: '' + 1/numberScale * 100 + '%'
            top: sizeHeight,
            display: this.isHideEditControl ? 'none' : '',
            transform: 'scale(' + unScaleNumber + ')'
        }
        let textEditControl = 
                <TextEditControl className="text-edit-control"
                    styleTextEdit={styleTextEditControl}
                    editorState={editorState}
                    textDefaultStyle={textStyle}
                    textAlignment={textAlignment}
                    onToggle={this.toggleInlineStyle}
                    handlePickColor={this.handlePickColor.bind(this)}
                    handleLeftAlign={this.handleLeftAlign.bind(this)}
                    handleMiddleAlign={this.handleCenterAlign.bind(this)}
                    handleRightAlign={this.handleRightAlign.bind(this)}
                    handleRemoveStyle={this.resetStyle}
                    handleSameColor={this.handleSameColor.bind(this)}
                    handleChangeSize={this.handleChangeSize.bind(this)}
                    handleChangeFont={this.handleChangeFont.bind(this)}
                    setFontAndSizeForText={this.setFontAndSizeForText.bind(this)}
                    />
        let sameColor =  <SameColor
            sizeHeight={sizeHeight}
            positionY={positionY}
            handleClose={this.handleCloseSameColor.bind(this)}
            handleDone={this.handleDoneSameColor.bind(this)}/>

        let colorPicker =  <ColorPicker
            displayArrStyle={this.state.displayStyleColorPicker}
            handleClose={this.handleCloseColorPicker.bind(this)}
            handleDone={this.handleDoneColorPicker.bind(this)} />
        
        let textFieldClassName = 'text-field-wrapper';

        if (this.isLightTheme(themeKey)) {
            textFieldClassName += ' light';
        } else textFieldClassName += ' dark';

        if (this.state.click_flag) {
            textFieldClassName += ' selected'
        }

        let textFieldZoneClassName = this.state.click_flag ? "text-field-zone selected" : "text-field-zone";

        return (
            <div className='textFieldWrapper'>
                <div className={textFieldClassName} style={styleWrapper}>
                    <div className={textFieldZoneClassName}
                        style={style}
                        onClick={this.clickInside.bind(this)}
                        onMouseEnter={this.onMouseEnter.bind(this)}
                        onMouseLeave={this.onMouseLeave.bind(this)} >
                        {
                            !this.state.click_flag ?
                            this.isEmpty() ?
                                <Tooltip placement='bottomRight' prefixCls='rc-tooltip-custom-page'
                                         align={{
                                             offset: [this.state.position.x, this.state.position.y],
                                         }}
                                         overlay={LocaleUtils.instance.translate('TextContainerComponent.defaultPlaceholderTextResourceId')}>
                                    <div className="text-field-placeholder" onMouseEnter={this.setPositionState}>
                                        {LocaleUtils.instance.translate("TextContainerComponent.defaultPlaceholderTextResourceId")}
                                    </div>
                                </Tooltip>
                                : null
                            : null
                        }
                        <div className={className}  onClick={this.focus} >
                            <Editor
                                blockStyleFn={getBlockStyle}
                                customStyleMap={styleMap}
                                editorState={editorState}
                                handleKeyCommand={this.handleKeyCommand}
                                onChange={this.onChange}
                                onTab={this.onTab}
                                placeholder=""
                                ref={this.setDomEditorRef}
                                spellCheck={true} />
                        </div>
                    </div>
                    {
                        this.state.click_flag ? textEditControl : null
                    }
                    {this.state.click_pick_color ? colorPicker :  null}
                </div>
                <div>
                    {this.state.click_same_color ? sameColor : null}
                </div>
            </div>
        );
    }
}

export default onClickOutsize(TextField);

TextField.propTypes = {
    sizeHeight:     PropTypes.number,
    sizeWidth:      PropTypes.number,
    positionX:      PropTypes.number,
    positionY:      PropTypes.number,
    // numberScale:    PropTypes.number,
    textStyle:      PropTypes.object,
    textSource:     PropTypes.object,
    idPage:         PropTypes.number,
    idLayout:       PropTypes.string,
    idPageLayout:   PropTypes.string,
    onChangeTextField: PropTypes.func,
    handleShowUnsupportedUnicodeCharacters: PropTypes.func
}
