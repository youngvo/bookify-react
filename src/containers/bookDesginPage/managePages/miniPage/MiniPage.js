import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Tooltip  from 'rc-tooltip';
import './MiniPage.css';
import LocaleUtils from './../../../../utils/LocaleUtils'
import MiniImageField from './../../../../containers/bookDesginPage/managePages/miniImageField/MiniImageField';
import MiniTextField from './../../../../containers/bookDesginPage/managePages/miniTextField/MiniTextField';
import { FIELD_TYPE } from './../../../../constants/Constants';
import {
    updateImageIntoPage,
    movePagesToAfterPage
} from './../../../../actions/projectActions/bookActions/pagesActions/PagesActions';
import Assets from './../../../../assets/Assets';

class MiniPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            position: {
                x: 0,
                y: 0
            }
        }
        this.setPositionState = this.setPositionState.bind(this);
        this.callUpdatePageChoosingList = this.callUpdatePageChoosingList.bind(this);
    }

    setPositionState(e) {
        let rect = e.target.getBoundingClientRect();
        let xPos = e.pageX - rect.left - rect.width; //x position within the element
        let yPos = e.pageY - rect.top - rect.height;  //y position within the element
        if(yPos >= -(rect.height/3) && yPos <= 0) yPos = (-yPos) - 50;
        if(xPos >= -(rect.width/3) && yPos <= 0) xPos = (-xPos) - 110;
        this.setState({
            position: {
                x: xPos,
                y: yPos
            }
        })
    }

    componentWillUpdate(nextProps) {
        if (nextProps.isChoosed !== this.props.isChoosed) {
            this.callUpdatePageChoosingList(nextProps.isChoosed);
        }
    }

    callUpdatePageChoosingList(miniPageIsChoosed) {
        const { onAddPagesIntoPageChoosingList, onRemovePagesOutToPageChoosingList, numPage } = this.props;
        if (miniPageIsChoosed) {
            onAddPagesIntoPageChoosingList([numPage]);
        } else {
            onRemovePagesOutToPageChoosingList([numPage])
        }
    }

    calculatorSize(realWidth, realHeight) {
        let height = this.props.isTooltipMode ? 50 : 100;
        let ratio = height/realHeight;
        let width = Math.round(realWidth * ratio);

        return {
            width,
            height,
            ratio
        }
    }

    renderlayout(layouts, ratio) {
        let { photoList, amountPage, isLogoChanged } = this.props;
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
                        ratio={ratio}
                        idPage={idPage}
                        isLogo={idPage === amountPage - 1}
                        isLogoChanged={isLogoChanged}
                        idLayout={idLayout}
                        idPageLayout={idPageLayout}
                        imageSource={layouts[index].image ? imageSource : false}
                        key={idLayout}
                        sizeHeight={Math.round(layouts[index].height * ratio)}
                        sizeWidth={Math.round(layouts[index].width * ratio)}
                        positionX={layouts[index].x * ratio}
                        positionY={layouts[index].y * ratio}
                    />
                );
            } else if (layouts[index].type === FIELD_TYPE.TEXT) {
                layoutArray.push(
                    <MiniTextField
                        ratio={ratio}
                        idPage={idPage}
                        idLayout={idLayout}
                        idPageLayout={idPageLayout}
                        textSource={layouts[index].text ? layouts[index].text : ''}
                        key={idLayout}
                        sizeHeight={layouts[index].height * ratio}
                        sizeWidth={layouts[index].width * ratio}
                        positionX={layouts[index].x * ratio}
                        positionY={layouts[index].y * ratio}
                    />
                );
            }
        }
        return (layoutArray);
    }

    renderFlapCover() {
        return <div className="flap-cover-content" > {LocaleUtils.instance.translate('endsheet_text')} </div>;
    }

    getBackgroundColorForPage(theme, backgroundId) {
        let colorBackground = '';
        let arrayBackground = theme['Backgrounds'][0]['Background'];
        for (let index = 0; index < arrayBackground.length; index++) {
            if (arrayBackground[index].$.id === backgroundId) {
                colorBackground = arrayBackground[index].$.color;
                break;
            }
        }
        return colorBackground;
    }

    getBackgroundImageForPage(theme, backgroundId) {
        let backgroundImage = '';
        let arrayBackground = theme['Backgrounds'][0]['Background'];
        for (let index = 0; index < arrayBackground.length; index++) {
            if (arrayBackground[index].$.id === backgroundId) {
                backgroundImage = arrayBackground[index].$.pattern_id;
                break;
            }
        }
        return backgroundImage;
    }


    getColorCoverBackground(theme, cover) {
        if (cover.hasOwnProperty('background_color')) {
            return cover['background_color'];
        }
        if (cover.hasOwnProperty('background_id')) {
            let background_id = cover['background_id'];
            let arrayBackground = theme["Backgrounds"][0]["Background"];

            for (let key in arrayBackground) {
                if (arrayBackground[key]["$"].id === background_id) {
                    return arrayBackground[key]["$"].color;
                }
            }
        }
        return this.getColorDefaultBackground(theme, false);
    }

    onDropMini(e) {
        e.preventDefault();
        e.stopPropagation();
        let classNameArr = e.target.className.split(' ');
        let classNamePageInfo = classNameArr[classNameArr.length - 1];
        let pageInfoArr = classNamePageInfo.split('---');
        let position = pageInfoArr[2];
        const { pagesChoosingList, dispatchMovePagesToAfterPage } = this.props;
        dispatchMovePagesToAfterPage(pagesChoosingList, position);
    }

    onDragEnterMini(e) {
        e.preventDefault();
        e.stopPropagation();
        // console.log('>>> onDragEnter');
    }

    onDragLeaveMini(e) {
        e.preventDefault();
        e.stopPropagation();
        // console.log('>>> onDragLeave');
    }

    onDragOverMini(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    onDragStartMini(e) {
        e.dataTransfer.setData('text', e.target);
    }

    render() {
        let { layout, theme, isPage, formatPage, present, numPage, isChoosed, onPageClick, amountPage } = this.props;
        let { ratioWidth, ratioHeight, realWidth, realHeight } = formatPage;
        let sizeMiniPage = this.calculatorSize(realWidth, realHeight);
        let { width, height, ratio } = sizeMiniPage;
        let stylePage = { width, height };

        if (!isPage) {
            stylePage.backgroundColor = '#ccc'; //this.getColorCoverBackground(theme, cover);
        } else {
            let backgroundId = present[numPage - 1].background_id;
            if (backgroundId.indexOf('pattern') !== -1) {
                let backgroundImage = this.getBackgroundImageForPage(theme, backgroundId);
                stylePage.backgroundImage = 'url(' + Assets.instance.retrieveImageObjectURL(backgroundImage) +')';
            }
            stylePage.backgroundColor = this.getBackgroundColorForPage(theme, backgroundId);
        }

        const isEvenPage = numPage % 2 === 0;
        const stylePageIsChoose = isChoosed ? (isEvenPage ? 'left-page-is-choosed' : 'right-page-is-choosed') : null;
        const onClick = () => {
            if (numPage !== 0 && numPage < amountPage) {
                onPageClick();
            }
        }

        return (
            <div className={"mini-page " + stylePageIsChoose}
                style={stylePage}
                onDrop={this.onDropMini.bind(this)}
                onDragOver={this.onDragOverMini.bind(this)}
                onDragEnter={this.onDragEnterMini.bind(this)}
                onDragLeave={this.onDragLeaveMini.bind(this)}
            >
                    <div className="mini-page-zone" onClick={onClick} onMouseEnter={this.setPositionState}>
                        {!isPage ? this.renderFlapCover() :
                            <Tooltip placement='bottomRight' prefixCls='rc-tooltip-custom-page'
                                     align={{
                                         offset: [this.state.position.x, this.state.position.y],
                                     }}
                                     overlay={LocaleUtils.instance.translate('tooltip.select_page')}>
                                <div className='mini-page-tooltip-custom'>
                                    {this.renderlayout(layout, ratio)}
                                </div>
                            </Tooltip>
                        }
                    </div>
                {
                    !isEvenPage ? < div className="mini-page-shadow left-shadow" /> : < div className="mini-page-shadow right-shadow" />
                }
                <div className={isEvenPage ? "whole-mini-pages-present remove-whole-page" : "mini-page-remove-btn"}>
                    {
                        stylePageIsChoose && <span onClick={this.props.deletePagesList} className="icon-DeletePageIconBEV"><span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span></span>
                    }
                </div>

                {
                    stylePageIsChoose &&
                    <span
                        className=" move-page"
                        draggable={true}
                        onDragStart={this.onDragStartMini.bind(this)}
                    >
                      <Tooltip placement='bottomRight' prefixCls='rc-tooltip-custom-page'
                               align={{
                                   offset: [this.state.position.x, this.state.position.y],
                               }}
                               overlay={LocaleUtils.instance.translate('tooltip.move_page_or_spread')}>
                            <span className="text-move" onMouseEnter={this.setPositionState}>{LocaleUtils.instance.translate('label.move_pages')}</span>
                      </Tooltip>
                    </span>
                }
            </div>
        );
    }
}

MiniPage.propTypes = {
    sizeHeight: PropTypes.number,
    sizeWidth: PropTypes.number,
    layout: PropTypes.object,
    formatPage: PropTypes.object,
    sizeBookDesign: PropTypes.number,
    isPage: PropTypes.bool,
    numPage: PropTypes.number,
    cover: PropTypes.object
}

const onUpdateImageObject = (dispatch, imageObject, idLayout, idPage, idPageLayout) => {
    let pageVO = { imageObject, idLayout, idPage, idPageLayout };
    dispatch(updateImageIntoPage(pageVO));
}

const mapStateToProps = (state) => {
    const { photoList, appStatus, project } = state;
    const { book } = project;
    const { pages } = book;
    const { present } = pages;
    return {
        photoList,
        amountPage: appStatus.paginationStatus.amountPage,
        pagesChoosingList: appStatus.rootStatus.pagesChoosingList,
        isLogoChanged: state.project.book.bookInfo.isLogoChanged,
        present
    };
}

const dispatchMovePagesToAfterPage = (dispatch, pagesChoosingList, position) => {
    dispatch(movePagesToAfterPage(pagesChoosingList, position));
}

const mapDispatchToProps = (dispatch) => ({
    onUpdateImageObject: (imageObject, idLayout, idPage, idPageLayout) => onUpdateImageObject(dispatch, imageObject, idLayout, idPage, idPageLayout),
    dispatchMovePagesToAfterPage: (pagesChoosingList, position) => dispatchMovePagesToAfterPage(dispatch, pagesChoosingList, position)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MiniPage);
