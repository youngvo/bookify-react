import React, {Component} from 'react';
import {connect} from 'react-redux';
import './SelectAndApplyLayout.css';
import LocaleUtils from './../../../../utils/LocaleUtils';
import Dropdown from 'react-dropdown';
import Assets from './../../../../assets/Assets';
import Button, {colorType, ICON_BUTTON} from './../../../../components/materials/button/Button';
import LayoutPopup from './../../../../components/popup/layout/LayoutPopup';
import {
    addPagesIntoPageChoosingList,
    removePagesOuttoPageChoosingList,
    resetPagesChoosing
} from './../../../../actions/appStatusActions/RootStatusActions';
import {
    updateTextStyleOfPages
} from './../../../../actions/projectActions/bookActions/pagesActions/PagesActions';
import Tooltip  from 'rc-tooltip';
import Config from './../../../../config/Config';
import StyleButton from './../../../../components/bookDesign/textField/textEditControl/StyleButton';
import ColorPicker from './../../../../components/bookDesign/textField/textEditControl/colorPicker/ColorPicker';

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

const optionsFontType = [
    // {value: ' ', label: <div className="item-font-dropdown"/>}
    // {value: 'arial', label: 'Arial'}
];

const optionFontSize = [
    // {value: ' ', label: <div className="item-font-dropdown"/>}
    // {value: '8', label: '8'}
];

class SelectAndApplyLayout extends Component {

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

        this.state = {
            fontValue: ' ',
            sizeValue: ' ',
            isShowSelectLayoutPopup: false,
            choosingAllLeftPages: false,
            choosingAllRightPages: false,
            pagesChoosingListLength: props.pagesChoosingList.length,
            position: {
                x: 0,
                y: 0
            },
            isBoldClick: false,
            isItalicClick: false,
            isUnderlineClick: false,
            isLeftAlignClick: false,
            isCenterAlignClick: false,
            isRightAlignClick: false,
            isShowColorPicker: false
        }
        this.setPositionState = this.setPositionState.bind(this);
        this.toggleSelectLayoutPopup = this.toggleSelectLayoutPopup.bind(this);
        this.allLeftClick = this.allLeftClick.bind(this);
        this.allRightClick = this.allRightClick.bind(this);
        this.deselectAllPages = this.deselectAllPages.bind(this);
        this.checkAllLeftPageOrRightIsChoosed = this.checkAllLeftPageOrRightIsChoosed.bind(this);
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

    componentDidMount() {
        this.checkAllLeftPageOrRightIsChoosed(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.pagesChoosingList.length !== this.state.pagesChoosingListLength) {
            this.checkAllLeftPageOrRightIsChoosed(nextProps);
            this.setState({
                pagesChoosingListLength: nextProps.pagesChoosingList.length,
                fontValue: ' ',
                sizeValue: ' ',
                isBoldClick: false,
                isItalicClick: false,
                isUnderlineClick: false,
                isLeftAlignClick: false,
                isCenterAlignClick: false,
                isRightAlignClick: false
            })
        }
    }

    checkAllLeftPageOrRightIsChoosed(props) {
        const {amountPage, pagesChoosingList} = props;
        let amountLeftPageIsChoosed = 0, amountRightPageIsChoosed = 0;

        if (pagesChoosingList.length === 0) {
            return this.setState({
                choosingAllLeftPages: false,
                choosingAllRightPages: false
            })
        }

        for (let i in pagesChoosingList) {
            if (pagesChoosingList[i] % 2 === 0) {
                amountLeftPageIsChoosed++;
            } else {
                amountRightPageIsChoosed++;
            }
        }

        let amountLeftPage = amountPage / 2 - 1;
        let amountRightPage = amountPage / 2;

        this.setState({
            choosingAllLeftPages: (amountLeftPage === amountLeftPageIsChoosed),
            choosingAllRightPages: (amountRightPage === amountRightPageIsChoosed)
        });
    }

    allLeftClick() {
        let idPages = [];
        for (let i = 2; i < this.props.amountPage; i = i + 2) {
            idPages.push(i);
        }
        if (!this.state.choosingAllLeftPages) {
            this.props.dispatchAddPagesIntoPageChoosingList(idPages);
        } else {
            this.props.dispatchRemovePagesOutToPageChoosingList(idPages);
        }
    }

    allRightClick() {
        let idPages = [];
        for (let i = 1; i < this.props.amountPage; i = i + 2) {
            idPages.push(i);
        }
        if (!this.state.choosingAllRightPages) {
            this.props.dispatchAddPagesIntoPageChoosingList(idPages);
        } else {
            this.props.dispatchRemovePagesOutToPageChoosingList(idPages);
        }
    }

    deselectAllPages() {
        this.props.dispatchResetPagesChoosingList();
    }

    onChangeSelectingFontType(optionsFontType) {
        this.setState({
            fontValue: optionsFontType.value
        })
        this.handleUpdateStyleTextOfPages('font_style-'+optionsFontType.value, true);
    }

    onChangeSelectingFontSize(optionsFontSize) {
        this.setState({
            sizeValue: optionsFontSize.value
        })
        this.handleUpdateStyleTextOfPages('size_style-'+optionsFontSize.value, true);
    }

    toggleSelectLayoutPopup() {
        this.setState({
            isShowSelectLayoutPopup: !this.state.isShowSelectLayoutPopup
        })
    }

    handleUpdateStyleTextOfPages(style, enable) {
        this.props.dispatchUpdateTextStyleOfPage(style, enable, this.props.pagesChoosingList);
    }

    handleBoldClick() {
        this.setState({
            isBoldClick: !this.state.isBoldClick
        })
        this.handleUpdateStyleTextOfPages('BOLD', !this.state.isBoldClick);
    }

    handleItalicClick() {
        this.setState({
            isItalicClick: !this.state.isItalicClick
        })
        this.handleUpdateStyleTextOfPages('ITALIC', !this.state.isItalicClick);
    }

    handleUnderlineClick() {
        this.setState({
            isUnderlineClick: !this.state.isUnderlineClick
        })
        this.handleUpdateStyleTextOfPages('UNDERLINE', !this.state.isUnderlineClick);
    }

    handleLeftAlignClick() {
        this.setState({
            isLeftAlignClick: !this.state.isLeftAlignClick,
            isCenterAlignClick: false,
            isRightAlignClick: false
        })
        this.handleUpdateStyleTextOfPages('alignment-left', !this.state.isLeftAlignClick);
    }

    handleCenterAlignClick() {
        this.setState({
            isLeftAlignClick: false,
            isCenterAlignClick: !this.state.isCenterAlignClick,
            isRightAlignClick: false
        })
        this.handleUpdateStyleTextOfPages('alignment-center', !this.state.isCenterAlignClick);
    }

    handleRightAlignClick() {
        this.setState({
            isLeftAlignClick: false,
            isCenterAlignClick: false,
            isRightAlignClick: !this.state.isRightAlignClick
        })
        this.handleUpdateStyleTextOfPages('alignment-right', !this.state.isRightAlignClick);
    }

    handleChooseColor(color) {
        this.handleUpdateStyleTextOfPages(rgbToHex(color), true);
    }

    handleCloseColorPicker() {
        this.setState({
            isShowColorPicker: false
        })
    }

    handlePickColor() {
        this.setState({
            isShowColorPicker: !this.state.isShowColorPicker
        })
    }

    handleSameColor() {

    }

    renderSelectLayoutBlock1() {
        return (
            <div className="select-and-apply-layout-block1">
                <div className="select-and-apply-layout-block1-large-title">
                    {LocaleUtils.instance.translate('bev.panel.title')}
                </div>
                <div className="select-and-apply-layout-block1-small-title">
                    {LocaleUtils.instance.translate('bev.panel.num_selected', {0: this.state.pagesChoosingListLength})}
                </div>
            </div>
        );
    }

    renderSelectLayoutBlock2() {
        const {choosingAllLeftPages, choosingAllRightPages} = this.state;
        let allLeftClass = choosingAllLeftPages ? 'all-left-choosed' : null;
        let allRightClass = choosingAllRightPages ? 'all-right-choosed' : null;
        let allChoosedClass = (choosingAllLeftPages && choosingAllRightPages) ? 'all-pages-choosed' : null;
        let allBoxClass = (choosingAllLeftPages && choosingAllRightPages) ? 'allBox-choose' : 'allBox';
        return (
            <div className="select-and-apply-layout-block2">
                <div className="select-and-apply-layout-block2-title">
                    {LocaleUtils.instance.translate('bev.panel.select')}
                </div>
                <div className={'select-and-apply-layout-block2-mini-book ' + allChoosedClass}>
                    <div className={allBoxClass}>
                        <div className={'select-and-apply-layout-block2-page-left ' + allLeftClass}>
                            <div className="left-sha"/>
                            <div
                                className="select-and-apply-layout-block2-page-text"
                                onClick={allChoosedClass ? null : this.allLeftClick}
                            >
                                {LocaleUtils.instance.translate('bev.panel.all_left')}
                            </div>
                        </div>
                        <div className={'select-and-apply-layout-block2-page-right ' + allRightClass}>
                            <div className="right-sha"/>
                            <div
                                className="select-and-apply-layout-block2-page-text"
                                onClick={allChoosedClass ? null : this.allRightClick}
                            >
                                {LocaleUtils.instance.translate('bev.panel.all_right')}
                            </div>
                        </div>
                    </div>
                </div>
                <Button
                    className="select-and-apply-layout-block2-button"
                    type={colorType.gray}
                    text={LocaleUtils.instance.translate('bev.panel.deselect_all_pages')}
                    onClick={this.deselectAllPages}
                />
            </div>
        );
    }

    renderSelectLayoutBlock3() {
        let leftAlignClassName = this.state.isLeftAlignClick ? "select-and-apply-layout-block3-align-left btn-active " : "select-and-apply-layout-block3-align-left";
        let centerAlignClassName = this.state.isCenterAlignClick ? "select-and-apply-layout-block3-align-center btn-active" : "select-and-apply-layout-block3-align-center";
        let rightAlignClassName = this.state.isRightAlignClick ? "select-and-apply-layout-block3-align-right btn-active" : "select-and-apply-layout-block3-align-right";
        let boldClassName = this.state.isBoldClick ? "bold-button-font-icon text-edit-icon boder-color btn-active" : "bold-button-font-icon text-edit-icon grad-btn boder-color";
        let italicClassName = this.state.isItalicClick ? "italic-button-font-icon text-edit-icon boder-color btn-active" : "italic-button-font-icon text-edit-icon grad-btn boder-color";
        let underlineClassName = this.state.isUnderlineClick ? "underline-text-edit-icon text-edit-icon boder-color btn-active" : "underline-text-edit-icon button-font-icon text-edit-icon grad-btn boder-color";
        return (
            <div className="select-and-apply-layout-block3">
                {
                    this.state.isShowColorPicker ?
                    <ColorPicker 
                        handleDone={this.handleChooseColor.bind(this)}
                        handleClose={this.handleCloseColorPicker.bind(this)}
                        displayArrStyle={["none", "none", "none", "none"]}
                         />
                    : null
                }
                <div className="select-and-apply-layout-block3-title">
                    {LocaleUtils.instance.translate('bev.panel.select_font_options')}
                </div>
                <div className="swap-font">
                    <div className="select-and-apply-layout-block3 drop-down-font-type">
                        <Dropdown
                            options={optionsFontType}
                            onChange={this.onChangeSelectingFontType.bind(this)}
                            value={this.state.fontValue}
                            onFocus={() => {
                                console.log("ON FOCUS")
                            }}
                        />
                    </div>
                </div>

                <div className="swap-size-color">
                    <div className="select-and-apply-layout-block3 drop-down-font-size">
                        <Dropdown
                            options={optionFontSize}
                            onChange={this.onChangeSelectingFontSize.bind(this)}
                            value={this.state.sizeValue}
                            onFocus={() => {
                                console.log("ON FOCUS")
                            }}
                        />
                    </div>
                    <Tooltip placement='bottomRight' prefixCls='rc-tooltip-custom-page'
                            align={{
                                offset: [this.state.position.x, this.state.position.y],
                            }}
                            overlay={LocaleUtils.instance.translate('colorpicker.label.pick_color')}>
                        <div className="select-and-apply-layout-block3-pick-color">
                            <Button type={colorType.textControl}
                                iconImage={Assets.instance.retrieveImageObjectURL('img_colorPicker')}
                                onMouseDown={this.handlePickColor.bind(this)}
                            />
                        </div>
                    </Tooltip>
                    <Tooltip placement='bottomRight' prefixCls='rc-tooltip-custom-page'
                            align={{
                                offset: [this.state.position.x, this.state.position.y],
                            }}
                            overlay={LocaleUtils.instance.translate('colorpicker.label.sample_color')}>
                        <div className="select-and-apply-layout-block3-same-color">
                            <Button type={colorType.textControl}
                                iconImage={Assets.instance.retrieveImageObjectURL('img_pickerColor')}
                                onMouseDown={this.handleSameColor.bind(this)}
                            />
                        </div>
                    </Tooltip>
                </div>
                <div className="swap-style-font">
                    <Tooltip placement='bottomRight' prefixCls='rc-tooltip-custom-page'
                            align={{
                                offset: [this.state.position.x, this.state.position.y],
                            }}
                            overlay={LocaleUtils.instance.translate('tooltip.text_style.bold')}>
                        <div className='tooltip-custom-div-wrapper' onMouseEnter={this.setPositionState}>
                            <Button className={boldClassName} //className="select-and-apply-layout-block3-bold"
                                    type={colorType.fontIcon}
                                    iconType={ICON_BUTTON.bold}
                                    isFontIcon={true}
                                    onMouseDown={this.handleBoldClick.bind(this)}
                            />
                        </div>
                    </Tooltip>
                    <Tooltip placement='bottomRight' prefixCls='rc-tooltip-custom-page'
                            align={{
                                offset: [this.state.position.x, this.state.position.y],
                            }}
                            overlay={LocaleUtils.instance.translate('tooltip.text_style.italics')}>
                        <div className='tooltip-custom-div-wrapper' onMouseEnter={this.setPositionState}>
                            <Button className={italicClassName} //className="select-and-apply-layout-block3-italic"
                                    type={colorType.fontIcon}
                                    iconType={ICON_BUTTON.italic}
                                    isFontIcon={true}
                                    onMouseDown={this.handleItalicClick.bind(this)}
                            />
                        </div>
                    </Tooltip>
                    <Tooltip placement='bottomRight' prefixCls='rc-tooltip-custom-page'
                            align={{
                                offset: [this.state.position.x, this.state.position.y],
                            }}
                            overlay={LocaleUtils.instance.translate('tooltip.text_style.underline')}>
                        <div className='tooltip-custom-div-wrapper' onMouseEnter={this.setPositionState}>
                            <Button className={underlineClassName} //className="select-and-apply-layout-block3-underline"
                                    type={colorType.fontIcon}
                                    iconType={ICON_BUTTON.underline}
                                    isFontIcon={true}
                                    onMouseDown={this.handleUnderlineClick.bind(this)}
                            />
                        </div>
                    </Tooltip>
                    <Button className={leftAlignClassName} //className="select-and-apply-layout-block3-align-left"
                        type={colorType.fontIcon}
                        onClick={()=>{}}
                        iconType={ICON_BUTTON.leftAlign}
                        isFontIcon={true}
                        icon={false}
                        onMouseDown={this.handleLeftAlignClick.bind(this)}
                    />
                    <Button className={centerAlignClassName} //className="select-and-apply-layout-block3-align-center"
                        type={colorType.fontIcon}
                        onClick={()=>{}}
                        iconType={ICON_BUTTON.centerAlign}
                        isFontIcon={true}
                        icon={false}
                        onMouseDown={this.handleCenterAlignClick.bind(this)}
                    />
                    <Button className={rightAlignClassName} //className="select-and-apply-layout-block3-align-right"
                        type={colorType.fontIcon}
                        onClick={()=>{}}
                        iconType={ICON_BUTTON.rightAlign}
                        isFontIcon={true}
                        icon={false}
                        onMouseDown={this.handleRightAlignClick.bind(this)}
                    />
                </div>
            </div>
        );
    }

    renderSelectLayoutBlock4() {
        return (
            <div className="select-and-apply-layout-block4">
                <div className="select-and-apply-layout-block4-title">
                    {LocaleUtils.instance.translate('title.layout_menu')}
                </div>
                <Tooltip placement='bottomRight' prefixCls='rc-tooltip-custom-page'
                         align={{
                             offset: [this.state.position.x, this.state.position.y],
                         }}
                         overlay={LocaleUtils.instance.translate('tooltip.change_page_layout')}>
                    <div className='tooltip-custom-div-wrapper layout-manage-page' onMouseEnter={this.setPositionState}>
                        <Button className="select-and-apply-layout-block4-button-select-layout"
                                type={colorType.fontIcon}
                                iconType={ICON_BUTTON.layout}
                                isFontIcon={true}
                                onClick={this.toggleSelectLayoutPopup}/>
                        {this.state.isShowSelectLayoutPopup && <LayoutPopup display="manage-page" onClose={this.toggleSelectLayoutPopup}/>}
                    </div>
                </Tooltip>
            </div>
        );
    }

    render() {
        return (
            <div className="select-and-apply-layout-zone">
                {this.renderSelectLayoutBlock1()}
                <hr className="select-and-apply-layout-block1-hr"/>
                {this.renderSelectLayoutBlock2()}
                <hr className="select-and-apply-layout-block1-hr"/>
                {this.renderSelectLayoutBlock3()}
                <hr className="select-and-apply-layout-block1-hr"/>
                {this.renderSelectLayoutBlock4()}
            </div>
        );
    }
}

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

const dispatchAddPagesIntoPageChoosingList = (dispatch, idPages) => {
    dispatch(addPagesIntoPageChoosingList(idPages));
}

const dispatchRemovePagesOutToPageChoosingList = (dispatch, idPages) => {
    dispatch(removePagesOuttoPageChoosingList(idPages));
}

const dispatchResetPagesChoosingList = (dispatch) => {
    dispatch(resetPagesChoosing());
}

const dispatchUpdateTextStyleOfPage = (dispatch, style, enable, pagesChoosingList) => {
    dispatch(updateTextStyleOfPages(style, enable, pagesChoosingList));
}

const mapStateToProps = (state) => {
    return {
        amountPage: state.appStatus.paginationStatus.amountPage,
        pagesChoosingList: state.appStatus.rootStatus.pagesChoosingList,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchAddPagesIntoPageChoosingList: (idPages) => dispatchAddPagesIntoPageChoosingList(dispatch, idPages),
        dispatchRemovePagesOutToPageChoosingList: (idPages) => dispatchRemovePagesOutToPageChoosingList(dispatch, idPages),
        dispatchResetPagesChoosingList: () => dispatchResetPagesChoosingList(dispatch),
        dispatchUpdateTextStyleOfPage: (style, enable, pagesChoosingList) => dispatchUpdateTextStyleOfPage(dispatch, style, enable, pagesChoosingList)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SelectAndApplyLayout);