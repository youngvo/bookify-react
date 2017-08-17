import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './PreviewPage.css';
import LocaleUtils from './../../../utils/LocaleUtils';
import Utils from './../../../utils/Utils';
import MiniImageField from './../../../containers/bookDesginPage/managePages/miniImageField/MiniImageField';
import MiniTextField from './../../../containers/bookDesginPage/managePages/miniTextField/MiniTextField';
import { FIELD_TYPE } from './../../../constants/Constants';
import {
    updateImageIntoPage,
} from './../../../actions/projectActions/bookActions/pagesActions/PagesActions';
import Tooltip  from 'rc-tooltip';

class PreviewPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            position: {
                x: 0,
                y: 0
            }
        }
        this.setPositionState = this.setPositionState.bind(this);
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

    renderlayout(layouts) {
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
                        if (layouts[index].image.src === Utils.replaceLowImageByOrigin(photoList[key].imageUrl)) {
                            imageSource.name = key;
                            imageSource.height = photoList[key].height;
                            imageSource.width = photoList[key].width;
                        }
                    }
                }

                layoutArray.push(
                    <MiniImageField
                        isPreview={true}
                        idPage={idPage}
                        isLogo={idPage === amountPage - 1}
                        isLogoChanged={isLogoChanged}
                        idLayout={idLayout}
                        idPageLayout={idPageLayout}
                        imageSource={layouts[index].image ? imageSource : false}
                        key={idLayout}
                        sizeHeight={layouts[index].height}
                        sizeWidth={layouts[index].width}
                        positionX={layouts[index].x}
                        positionY={layouts[index].y}
                    />
                );
            } else if (layouts[index].type === FIELD_TYPE.TEXT) {
                layoutArray.push(
                    <MiniTextField
                        idPage={idPage}
                        idLayout={idLayout}
                        idPageLayout={idPageLayout}
                        textSource={layouts[index].text ? layouts[index].text : ''}
                        key={idLayout}
                        sizeHeight={layouts[index].height}
                        sizeWidth={layouts[index].width}
                        positionX={layouts[index].x}
                        positionY={layouts[index].y}
                    />
                );
            }
        }
        return (layoutArray);
    }

    renderFlapCover() {
        return (
            <div className="flap-cover-content" >
                {LocaleUtils.instance.translate('endsheet_text')}
            </div>
        );
    }

    getColorDefaultBackground(theme, isForPage = true) {
        let idDefaultBackground;
        if (isForPage) {
            idDefaultBackground = theme['Defaults'][0]['DefaultPageBackground'][0].$.id;
        } else {
            idDefaultBackground = theme['Defaults'][0]['DefaultCoverBackground'][0].$.id;
        }
        let colorDefaultBackground = '';
        let arrayBackground = theme['Backgrounds'][0]['Background'];

        for (let key in arrayBackground) {
            if (arrayBackground[key]['$'].id === idDefaultBackground) {
                colorDefaultBackground = arrayBackground[key]['$'].color;
                break;
            }
        }

        return colorDefaultBackground;
    }

    getColorCoverBackground(theme, cover) {
        if (cover.hasOwnProperty('background_color')) {
            return cover['background_color'];
        }
        if (cover.hasOwnProperty('background_id')) {
            let background_id = cover['background_id'];
            let arrayBackground = theme['Backgrounds'][0]['Background'];

            for (let key in arrayBackground) {
                if (arrayBackground[key]['$'].id === background_id) {
                    return arrayBackground[key]['$'].color;
                }
            }
        }
        return this.getColorDefaultBackground(theme, false);
    }

    renderArrowPageBtn(isEvenPage, onClick) {
        if (isEvenPage) {
            return (
                <Tooltip
                    placement='bottomRight'
                    prefixCls='rc-tooltip-custom-page'
                    align={{ offset: [this.state.position.x, this.state.position.y] }}
                    overlay={LocaleUtils.instance.translate('tooltip.previous_page')}
                >
                    <div className="nav-arrow icon-wingLeft" onClick={onClick} onMouseEnter={this.setPositionState}>
                        <div className="inside icon-ArrowLeft" />
                    </div>
                </Tooltip>
            );
        }

        return (
            <Tooltip placement='bottomRight' prefixCls='rc-tooltip-custom-page'
                     align={{
                         offset: [this.state.position.x, this.state.position.y],
                     }}
                     overlay={LocaleUtils.instance.translate('tooltip.next_page')} >
                <div className="nav-arrow icon-wingRight" onClick={onClick} onMouseEnter={this.setPositionState}>
                    <div className="inside icon-ArrowRight" />
                </div>
            </Tooltip>
        );
    }

    render() {
        let { layout, theme, isPage, formatPage, sizeBookDesign, cover, numPage, sizePage } = this.props;
        let { realWidth, realHeight } = formatPage;

        let colorBackground = '';
        let stylePage = {...sizePage};

        if (!isPage) {
            colorBackground = this.getColorCoverBackground(theme, cover);
        } else {
            colorBackground = this.getColorDefaultBackground(theme, true);
        }
        const isEvenPage = numPage % 2 === 0;

        return (
            <div className={'preview-page ' + (isEvenPage ? 'preview-left-page' : 'preview-right-page')} style={stylePage}>
				<div className="flap"><div className="dust-jacket"></div></div>

				<div className="center-flap"></div>
						<div className="book-dummy-1"></div>
						<div className="book-dummy-2"></div>
						<div className="book-dummy-3"></div>
						<div className="book-dummy-4"></div>
						<div className="book-dummy-5"></div>

                {isEvenPage && this.renderArrowPageBtn(isEvenPage, this.props.goToPreviousPage)}
                {!isPage ? this.renderFlapCover() : <div className="dummy-page"> {this.renderlayout(layout)} </div> }
                {!isEvenPage ? < div className="mini-page-shadow left-shadow" /> : < div className="mini-page-shadow right-shadow" />}
                {!isEvenPage && this.renderArrowPageBtn(isEvenPage, this.props.goToNextPage)}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const { photoList, appStatus } = state;

    return {
        photoList,
        amountPage: appStatus.paginationStatus.amountPage,
        isLogoChanged: state.project.book.bookInfo.isLogoChanged,
    };
}

const mapDispatchToProps = (dispatch) => ({

});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PreviewPage);
