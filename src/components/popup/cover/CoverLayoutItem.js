import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './CoverLayoutItem.css';
import { connect } from 'react-redux';
import {
    setCoverLayout
} from '../../../actions/projectActions/bookActions/CoversActions';
import {bookFormats} from './../../../constants/Constants';

let dividerLine = 0;
let height = 0;
let marginTop = 0;

class CoverLayoutItem extends Component {

    constructor(props) {
        super(props);
        this.coverLayoutItemClicked = this.coverLayoutItemClicked.bind(this);
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

    renderLineText(numberLines, divider) {
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
            let renderLine = this.renderLineText(parseInt(height/28), 28);
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

    coverLayoutItemClicked() {
        let {coverLayoutData, onClose, onClickChooseCoverLayout} = this.props;
        onClickChooseCoverLayout(coverLayoutData);
        onClose();
    }

    render() {
        let { coverLayoutData, layout_group_id } = this.props;
        let coverLayoutDataWidth = coverLayoutData.$.width;
        let coverLayoutDataHeight = coverLayoutData.$.height;
        let imageList = [];
        let textList = [];

        if (coverLayoutData.hasOwnProperty('ImageContainer')){
            let imageContainer = coverLayoutData['ImageContainer'];
            for (let index in coverLayoutData['ImageContainer']){
                imageList.push(imageContainer[index]);
            }
        }
        if (coverLayoutData.hasOwnProperty('TextContainer')){
            let textContainer = coverLayoutData['TextContainer'];
            for (let index in textContainer){
                textList.push(textContainer[index]);
            }
        }

        let renderText = this.renderText(textList);
        let renderImage = this.renderImage(imageList);

        let scale = 50/coverLayoutDataWidth;

        let layoutItemStyle = {
            width: coverLayoutDataWidth,
            height: coverLayoutDataHeight,
            transform: 'scale(' + scale + ')'
        }

        const styleLevel2 = {
            width: coverLayoutDataWidth*scale,
            height: coverLayoutDataHeight*scale
        }

        let classCoverZone = (layout_group_id === coverLayoutData.$.group_id) ? 'cover-layout-item-zone focus' : 'cover-layout-item-zone';
        return (
            <div className={classCoverZone}>
                <div className="layout-item-shadow" style={styleLevel2}>
                    <div className="layout-item-draw" style={layoutItemStyle} onClick={this.coverLayoutItemClicked}>
                        {renderImage}
                        {renderText}
                    </div>
                </div>
            </div>
        );
    }
};

CoverLayoutItem.propTypes = {
    coverLayoutData: PropTypes.object,
    onClose: PropTypes.func
};


const onChooseCoverLayout = (dispatch, newLayout) => {
    dispatch(setCoverLayout(-1, newLayout));
};

const mapStateToProps = (state) => {
    const {project} = state;
    const {book} = project;
    const {frontCover} = book.covers;
    const {layout_group_id} = frontCover;
    return {layout_group_id};
};

const mapDispatchToProps = (dispatch) => {
    return {
        onClickChooseCoverLayout: (newLayout) => onChooseCoverLayout(dispatch, newLayout)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CoverLayoutItem);
