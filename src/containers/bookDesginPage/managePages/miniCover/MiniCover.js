import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import './MiniCover.css';
import { FIELD_TYPE, COVER_SECTION, TOP_TRIM_PERCENT_HEIGHT, LEFT_TRIM_PERCENT_WIDTH, COVER_TYPE } from './../../../../constants/Constants';
import MiniImageField from './../../../../containers/bookDesginPage/managePages/miniImageField/MiniImageField';
import MiniTextField from './../../../../containers/bookDesginPage/managePages/miniTextField/MiniTextField';
import LocaleUtils from './../../../../utils/LocaleUtils';
import Tooltip  from 'rc-tooltip';

class MiniCover extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isShowSelectLayout: false
        }
        this.state = {
            position: {
                x: 0,
                y: 0
            }
        }
    }

    renderLayoutBirdEyeMode(layouts, numScaleLeftCover, numScaleTopCover, ratio) {
        let { photoList } = this.props;
        var layoutArray = [];

        for (let index in layouts) {
            let idLayout = layouts[index].id;
            let idPage = layouts[index].idPage;
            let idPageLayout = layouts[index].page_layout_id;

            if (layouts[index].type === FIELD_TYPE.IMAGE) {
                let imageSource = {};
                if (layouts[index].image) {
                    if (layouts[index].image.hasOwnProperty('src')) {
                        imageSource.imageUrl = layouts[index].image.src;
                    } else {
                        imageSource.imageUrl = layouts[index].image.imageUrl;
                    }

                    if (layouts[index].image.hasOwnProperty('rotation')) {
                        imageSource.rotation = layouts[index].image.rotation;
                    } else {
                        imageSource.rotation = 0;
                    }

                    if (layouts[index].image.hasOwnProperty('zoom_level')) {
                        imageSource.zoom_level = parseFloat(layouts[index].image.zoom_level);
                    } else {
                        imageSource.zoom_level = 100;
                    }

                    imageSource.fit_policy = layouts[index].image.fit_policy;

                    if (layouts[index].image.hasOwnProperty('x_shift') && layouts[index].image.hasOwnProperty('y_shift')) {
                        imageSource.x_shift = parseInt(layouts[index].image.x_shift, 10);
                        imageSource.y_shift = parseInt(layouts[index].image.y_shift, 10);
                    } else {
                        imageSource.x_shift = 0;
                        imageSource.y_shift = 0;
                    }

                    for (let key in photoList) {
                        if (layouts[index].image.src === photoList[key].imageUrl.replace('L','O')) {
                            imageSource.name = key;
                            imageSource.height = photoList[key].height;
                            imageSource.width = photoList[key].width;
                        }
                    }
                }

                layoutArray.push(
                    <MiniImageField
                        isPreview={true}
                        ratio={ratio}
                        idPage={idPage}
                        idLayout={idLayout}
                        idPageLayout={idPageLayout}
                        imageSource={layouts[index].image ? imageSource : false}
                        key={idLayout}
                        sizeHeight={layouts[index].height * numScaleTopCover}
                        sizeWidth={layouts[index].width * numScaleLeftCover}
                        positionX={layouts[index].x * numScaleLeftCover}
                        positionY={layouts[index].y * numScaleTopCover}
                    />
                );
            } else if (layouts[index].type === FIELD_TYPE.TEXT) {
                layoutArray.push(
                    <MiniTextField
                        isCover={true}    
                        isPreview={true}
                        ratio={ratio}
                        idPage={idPage}
                        idLayout={idLayout}
                        idPageLayout={idPageLayout}
                        textSource={layouts[index].text ? layouts[index].text : ''}
                        key={idLayout}
                        sizeHeight={layouts[index].height * numScaleTopCover}
                        sizeWidth={layouts[index].width * numScaleLeftCover}
                        positionX={layouts[index].x * numScaleLeftCover}
                        positionY={layouts[index].y * numScaleTopCover}
                    />
                );
            }
        }
        return (layoutArray);
    }

    getBackgroundById(id, listBackground) {
        for (let i in listBackground) {
            if (listBackground[i].$.id === id) {
                return listBackground[i].$.color;
            }
        }
        return '#ffffff';
    }

	renderSafeAndShadowLeftPage() {
        return (
            <div>
                <div className="page-shadow left-sha" />
                <div className="top-safe strip" />
                <div className="bot-safe strip" />
                <div className="left-safe strip" />
            </div>
        );
    }

    renderSafeAndShadowRightPage() {
        return (
            <div>
                <div className="page-shadow right-sha" />
                <div className="top-safe strip" />
                <div className="bot-safe strip" />
                <div className="right-safe strip" />
            </div>
        );
    }

    toggleShowChangeLayout() {
        this.setState({
            isShowSelectLayout: !this.state.isShowSelectLayout
        })
    }

    calculatorSize(realWidth, realHeight) {
        const height = this.props.isTooltipMode ? 50 : 100;
        let ratio = height/realHeight;
        let width = Math.round(realWidth * ratio);

        return {
            width,
            height,
            ratio
        }
    }

    renderSpineSVG(color, height, isFront) {
        let heightNumber = height + 5;
        let heightCoverPx = heightNumber + 'px';
        let dataLeft = "M.73,0H0V32.31H.06L0,562.65s-.67,10.85,6.33,23.5C14.47,600.9,27,597.87,27,597.87L27,32.31V27.25C-.56,23.63.73,0,.73,0Z";
        let dataRight = "M26.23,0H27V32.31H26.9L27,562.65s.67,10.85-6.33,23.5C12.49,600.9,0,597.87,0,597.87L0,32.31V27.25C27.52,23.63,26.23,0,26.23,0Z";
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                id="Layer_1" data-name="Layer 1"
                viewBox="0 0 26.98 597.87"
                height={heightCoverPx}
            >
                <defs>
                    <style>
                        {
                            `.cls-1 {
                                fill:${color}
                            }`
                        }
                    </style>
                </defs>
                <path className="cls-1" d={isFront ? dataLeft : dataRight} />
            </svg>
        );
    }

    render() {
        let {coverSection, cover, layout, theme, sizePage, arrowEvent, coverType, isPreview} = this.props;
        let coverclass = 'book-mini-cover';
        let { Backgrounds } = theme;
        let { background_id } = cover;
        let backgroundCover  = this.getBackgroundById(background_id, Backgrounds[0]['Background'])
        let numScaleLeftCover = 1-LEFT_TRIM_PERCENT_WIDTH;
        let numScaleTopCover = 1-TOP_TRIM_PERCENT_HEIGHT;
        let sizeCover = {
            width: sizePage.width * numScaleLeftCover,
            height: sizePage.height * numScaleTopCover,
        }
        let newCoverSize = this.calculatorSize(sizeCover.width, sizeCover.height);
        let { ratio } = newCoverSize;
        let spinClass = 'spin-on-cover';
        let aboveBookClass = 'above-book';
        let isFront = coverSection === COVER_SECTION.FRONT_COVER;
        if (isFront) {
           coverclass = 'book-mini-cover front-cover';
            spinClass = 'spin-on-cover spin-left';
            aboveBookClass = 'above-book above-book-on-front-cover';
        } else if (coverSection === COVER_SECTION.BACK_COVER) {
           coverclass = 'book-mini-cover back-cover';
            spinClass = 'spin-on-cover spin-right';
            aboveBookClass = 'above-book above-book-on-back-cover';
        }

		let styleCover = 	{

							}

        let stylePaper =    {
                                width: newCoverSize.width,
                                height: newCoverSize.height,
                                background: backgroundCover
                            }

        return (
            <div className={coverclass} style={styleCover}>
                <div className="spin-on-cover"> {this.renderSpineSVG(backgroundCover, newCoverSize.height, isFront)}</div>
				<div className="drak-sha"></div>
				<div className="back-drop"></div>
			<div className="above-book"></div>

				<div className="paper-book" style={stylePaper}>
					<div><div className="page-shadow"></div><div className="top-safe strip"></div><div className="bot-safe strip"></div><div className="left-safe strip"></div></div>

                {
                    this.renderLayoutBirdEyeMode(layout, numScaleLeftCover*numScaleLeftCover*ratio, numScaleTopCover*numScaleTopCover*ratio, ratio)
                }
				</div>
            </div>
        );
    }
}

MiniCover.propTypes = {
    coverSection: PropTypes.string,
    cover: PropTypes.object,
    layout: PropTypes.object,
    theme: PropTypes.object,
    sizePage: PropTypes.object,
    coverType: PropTypes.string,
    isPreview: PropTypes.bool
}

const mapStateToProps = (state) => {
    const { photoList } = state;

    return { photoList };
};

const mapDispatchToProps = (dispatch) => ({
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MiniCover);
