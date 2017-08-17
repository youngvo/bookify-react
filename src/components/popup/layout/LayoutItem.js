import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './LayoutItem.css';
import { connect } from 'react-redux';
import {
    setPageLayout
} from '../../../actions/projectActions/bookActions/pagesActions/PagesActions';
import {
    setRecentLayouts
} from '../../../actions/projectActions/bookActions/RecentLayoutsActions';
import {bookFormats, LAYOUT_TYPE_TEXT_MISC} from './../../../constants/Constants';
import LocaleUtils from './../../../utils/LocaleUtils';

let dividerLine = 0;
let height = 0;
let marginTop = 0;

class LayoutItem extends Component {

    constructor(props) {
        super(props);
        this.layoutItemClicked = this.layoutItemClicked.bind(this);
        this.initData();
    }

    initData() {
        let currentBookFormat = this.props.bookFormat;
        switch (currentBookFormat) {
            case bookFormats.PORTRAIT:
                dividerLine = 35;
                height = 12;
                marginTop = 27;
                break;
            case bookFormats.LANDSCAPE:
                height = 12;
                marginTop = 27;
                dividerLine = 35;
                break;
            case bookFormats.LARGE_LANDSCAPE:
                dividerLine = 35;
                height = 12;
                marginTop = 27;
                break;
            default:
                dividerLine = 28;
                height = 9;
                marginTop = 20;
                break;
        }
    }

    layoutItemClicked() {
        let { layoutData, numPage, onClose, pagesChoosingList, onClickChooseLayout } = this.props;
        let listPagesChangeLayout = [];
        if (typeof numPage !== 'undefined') {
            listPagesChangeLayout.push(numPage-1);
        } else {
            for (let index = 0; index < pagesChoosingList.length; index++) {
                listPagesChangeLayout.push(pagesChoosingList[index]-1);
            }
        }
        onClickChooseLayout(listPagesChangeLayout, layoutData);
        onClose();
    }

    renderLineText(numberLines) {
        let divLine = [];
        let style;
        for (let index = 0; index < numberLines; index++) {
            if (index === 0) {
                style = {
                    marginTop: 0,
                    height: height
                }
            } else {
                style = {
                    marginTop: marginTop,
                    height: height
                }
            }
            if (numberLines === 1) {
                style = {
                    marginTop: marginTop/2,
                    height: height
                }
            }
            let div = <div className="layout-item-draw-text-line" style={style}/>
            divLine.push(div);
        }
        return divLine;
    }

    renderText(textList) {
        let results = [];
        for (let index in textList) {
            let width = textList[index].$.width;
            let height =  textList[index].$.height;
            let x =  textList[index].$.x;
            let y = textList[index].$.y;
            let style = {
                width: width,
                height: height,
                left: x,
                top: y
            }
            let renderLine = this.renderLineText(parseInt(height/dividerLine));
            let div = <div className="layout-item-draw-text-child" style={style}>
                {renderLine}
            </div>;
            results.push(div);
        }
        return results;
    }

    renderImage(imageList) {
        let results = [];
        for (let index in imageList) {
            let width = imageList[index].$.width;
            let height =  imageList[index].$.height;
            let x =  imageList[index].$.x;
            let y = imageList[index].$.y;
            let style = {
                width: width,
                height: height,
                left: x,
                top: y
            }
            let div = <div className="layout-item-draw-image-child" style={style}></div>;
            results.push(div);
        }
        return results;
    }

    renderTextType(layoutData) {
        if (layoutData.$.hasOwnProperty('type')) {
            let type = layoutData.$.type;
            let text = '';
            let currentBookFormat = this.props.bookFormat;
            let marginLeftText = (currentBookFormat !== bookFormats.PORTRAIT) ? -8 : -10;
            let style = {
                marginLeft: marginLeftText
            }
            switch (type) {
                case LAYOUT_TYPE_TEXT_MISC.BLANK:
                    text = LocaleUtils.instance.translate('layout.blank');
                    break;
                case LAYOUT_TYPE_TEXT_MISC.COPYRIGHT:
                    text = LocaleUtils.instance.translate('layout.copyright');
                    break;
                case LAYOUT_TYPE_TEXT_MISC.TEXT_ONLY:
                    text = LocaleUtils.instance.translate('layout.text_only');
                    break;
                case LAYOUT_TYPE_TEXT_MISC.TITLE:
                    text = LocaleUtils.instance.translate('layout.title');
                    break;
                case LAYOUT_TYPE_TEXT_MISC.TWO_COLUMNS:
                    text = LocaleUtils.instance.translate('layout.two_column');
                    break;
                case LAYOUT_TYPE_TEXT_MISC.THREE_COLUMNS:
                    text = LocaleUtils.instance.translate('layout.three_column');
                    break;
                case LAYOUT_TYPE_TEXT_MISC.LOGO:
                    text = LocaleUtils.instance.translate('layout.logo');
                    break;
                case LAYOUT_TYPE_TEXT_MISC.CHAPTER:
                    text = LocaleUtils.instance.translate('layout.chapter');
                    break;
            }
            return (<span className="layout-item-text">{text}</span>);
        }
    }

    render() {
        let { layoutData, numPage, isRecentLayout, present } = this.props;
        let layoutDataWidth = layoutData.$.width;
        let layoutDataHeight = layoutData.$.height;
        let imageList = [];
        let textList = [];

        if (layoutData.hasOwnProperty('ImageContainer')){
            let imageContainer = layoutData['ImageContainer'];
            for (let index in layoutData['ImageContainer']){
                imageList.push(imageContainer[index]);
            }
        }
        if (layoutData.hasOwnProperty('TextContainer')){
            let textContainer = layoutData['TextContainer'];
            for (let index in textContainer){
                textList.push(textContainer[index]);
            }
        }

        let renderText = this.renderText(textList);
        let renderImage = this.renderImage(imageList);

        let scale = 50/layoutData.$.width;

        let layoutItemStyle = {
            width: layoutDataWidth,
            height: layoutDataHeight,
            transform: 'scale(' + scale + ')'
        }

        const styleLevel2 = {
            width: layoutDataWidth*scale,
            height: layoutDataHeight*scale
        }

        let renderTextType = this.renderTextType(layoutData);
		let classItemZone;
		if (typeof(numPage) !== 'undefined') {
            classItemZone = (present[numPage - 1].page_layout_id === layoutData.$.id && !isRecentLayout) ? 'layout-item-zone focus' : 'layout-item-zone';
        } else {
            classItemZone = (present[0].page_layout_id === layoutData.$.id && !isRecentLayout) ? 'layout-item-zone focus' : 'layout-item-zone';
        }

        return (
            <div className={classItemZone}>
                <div className="layout-item-shadow" style={styleLevel2}>
                    <div className="layout-item-draw" style={layoutItemStyle} onClick={this.layoutItemClicked}>
                        {renderImage}
                        {renderText}
                    </div>
                </div>
                {renderTextType}
            </div>
        );
    }
};

LayoutItem.propTypes = {
    layoutData: PropTypes.object,
    numPage: PropTypes.number,
    isRecentLayout: PropTypes.bool,
    onClose: PropTypes.func
};


const onChooseLayout = (dispatch, pagesChoosingList, newLayout) => {
    dispatch(setPageLayout(pagesChoosingList, newLayout));
    dispatch(setRecentLayouts(newLayout));
};

const mapStateToProps = (state) => {
    const { project, appStatus } = state;
    const { rootStatus } = appStatus;
    const { pagesChoosingList } = rootStatus;
    const { book } = project;
    const { bookInfo, pages, recentLayouts } = book;
    const { present } = pages;
    const bookFormat = bookInfo.format;
    return { bookFormat, present, pagesChoosingList, recentLayouts };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onClickChooseLayout: (pagesChoosingList, newLayout) => onChooseLayout(dispatch, pagesChoosingList, newLayout),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LayoutItem);
