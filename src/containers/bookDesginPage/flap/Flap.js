import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import './Flap.css';
import { FIELD_TYPE, COVER_SECTION, TOP_TRIM_PERCENT_HEIGHT, LEFT_TRIM_PERCENT_WIDTH } from './../../../constants/Constants'
import ImageField   from './../../../components/bookDesign/imageField/ImageField';
import TextField from './../../../components/bookDesign/textField/TextField';
import MiniImageField from './../managePages/miniImageField/MiniImageField';
import MiniTextField from './../managePages/miniTextField/MiniTextField';
import {
    updateImageIntoCover,
    updateTextIntoCover,
    removePhotoInCover
} from './../../../actions/projectActions/bookActions/CoversActions';
import { toggleShowUnsupportCharactersPopup } from './../../../actions/appStatusActions/RootStatusActions';

class Flap extends Component {

    onChangeImageField(imageObject, idLayout, idPage, idPageLayout) {
        this.props.onUpdateImageObject(imageObject, idLayout, idPage, idPageLayout);
    }

    onRemovePhotoInPage(idLayout, idPage, idPageLayout) {
        this.props.handleRemovePhotoInCover(idLayout, idPage, idPageLayout);
    }

    onChangeTextField(textObject, idLayout, idPage, idPageLayout) {
        this.props.onUpdateTextObject(textObject, idLayout, idPage, idPageLayout);
    }

    renderFlapInPreview(layouts, numScaleLeftCover, numScaleTopCover) {
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
                        if (layouts[index].image.src === photoList[key].imageUrl.replace('L', 'O')) {
                            imageSource.name = photoList[key].name;
                            imageSource.height = photoList[key].height;
                            imageSource.width = photoList[key].width;
                        }
                    }
                }

                layoutArray.push(
                    <MiniImageField
                        isPreview={true}    
                        idPage={idPage}
                        idLayout={idLayout}
                        idPageLayout={idPageLayout}
                        onChangeImageField={this.onChangeImageField.bind(this)}
                        imageSource={layouts[index].image ? imageSource : false}
                        key={idLayout}
                        sizeHeight={layouts[index].height * numScaleTopCover}
                        sizeWidth={layouts[index].width * numScaleLeftCover}
                        positionX={layouts[index].x * numScaleLeftCover}
                        positionY={layouts[index].y * numScaleTopCover}
                        onRemovePhotoInPage={this.onRemovePhotoInPage.bind(this)}
                    />
                )
            } else if (layouts[index].type === FIELD_TYPE.TEXT) {
                layoutArray.push(
                    <MiniTextField
                        isPreview={true}    
                        idPage={idPage}
                        idLayout={idLayout}
                        idPageLayout={idPageLayout}
                        onChangeTextField={this.onChangeTextField.bind(this)}
                        textSource={layouts[index].text ? layouts[index].text : ''}
                        textStyle={this.getTextStyleById(layouts[index].style_id, this.props.theme)}
                        key={idLayout}
                        sizeHeight={layouts[index].height * numScaleTopCover}
                        sizeWidth={layouts[index].width * numScaleLeftCover}
                        positionX={layouts[index].x * numScaleLeftCover}
                        positionY={layouts[index].y * numScaleTopCover}
                        toggleKeyBoardEvent={this.props.toggleKeyBoardEvent}
                        handleShowUnsupportedUnicodeCharacters={this.props.handleShowUnsupportedUnicodeCharacters}
                    />
                )
            }
        }
        return (layoutArray);
    }

    renderlayout(layouts, numScaleLeftCover, numScaleTopCover) {
        let { photoList, unScaleNumber } = this.props;
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
                            imageSource.name = photoList[key].name;
                            imageSource.height = photoList[key].height;
                            imageSource.width = photoList[key].width;
                        }
                    }
                }

                layoutArray.push(
                    <ImageField
                        unScaleNumber={unScaleNumber}    
                        idPage={idPage}
                        idLayout={idLayout}
                        idPageLayout={idPageLayout}
                        onChangeImageField={this.onChangeImageField.bind(this)}
                        imageSource={layouts[index].image ? imageSource : false}
                        key={idLayout}
                        sizeHeight={layouts[index].height * numScaleTopCover}
                        sizeWidth={layouts[index].width * numScaleLeftCover}
                        positionX={layouts[index].x * numScaleLeftCover}
                        positionY={layouts[index].y * numScaleTopCover}
                        onRemovePhotoInPage={this.onRemovePhotoInPage.bind(this)}
                    />
                )
            } else if (layouts[index].type === FIELD_TYPE.TEXT) {
                layoutArray.push(
                    <TextField
                        unScaleNumber={unScaleNumber}    
                        idPage={idPage}
                        idLayout={idLayout}
                        idPageLayout={idPageLayout}
                        onChangeTextField={this.onChangeTextField.bind(this)}
                        textSource={layouts[index].text ? layouts[index].text : ''}
                        textStyle={this.getTextStyleById(layouts[index].style_id, this.props.theme)}
                        key={idLayout}
                        sizeHeight={layouts[index].height * numScaleTopCover}
                        sizeWidth={layouts[index].width * numScaleLeftCover}
                        positionX={layouts[index].x * numScaleLeftCover}
                        positionY={layouts[index].y * numScaleTopCover}
                        toggleKeyBoardEvent={this.props.toggleKeyBoardEvent}
                        handleShowUnsupportedUnicodeCharacters={this.props.handleShowUnsupportedUnicodeCharacters}
                    />
                )
            }
        }
        return (layoutArray);
    }

    getTextStyleById(style_id, theme) {
        let textStyleList = theme.TextStyles[0].TextStyle;
        for (let i in textStyleList) {
            if (textStyleList[i].$.id === style_id) {
                return textStyleList[i].$
            }
        }
        return {};
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

    render() {
        let { coverSection, cover, layout, theme, sizePage, trimSize, isPreview, hideContent } = this.props;
        let coverclass = 'book-flap';
        let flapClass = '';
        let shadow = null;
        if (coverSection === COVER_SECTION.FRONT_FLAP) {
            coverclass = 'book-flap front-flap';
            flapClass = 'front-flap-zone';
            shadow = this.renderSafeAndShadowRightPage();
        } else if (coverSection === COVER_SECTION.BACK_FLAP) {
            coverclass = 'book-flap back-flap';
            flapClass = 'back-flap-zone';
            shadow = this.renderSafeAndShadowLeftPage();
        }
        let { Backgrounds } = theme;
        let { background_id } = cover;
        let backgroundCover = this.getBackgroundById(background_id, Backgrounds[0]['Background'])
        let numScaleLeftCover = 1; // = 1-LEFT_TRIM_PERCENT_WIDTH;
        let numScaleTopCover = 1; // 1-TOP_TRIM_PERCENT_HEIGHT;

        let sizeCover = {
            width: trimSize.size.width, //sizePage.width * numScaleLeftCover + sizePage.height * numScaleTopCover * 0.125,
            height: trimSize.size.height //sizePage.height * numScaleTopCover,
        }
        let sizeFlap = {
            //width: (sizePage.width-300) * numScaleLeftCover + sizePage.height * numScaleTopCover * 0.125,
            width: trimSize.flapSize.width,
            // height: trimSize.flapSize.height
        }

        let styleCover = {
            ...sizeCover
        }
        let styleFlap = {
            ...sizeFlap,
            background: backgroundCover,
        }

        const renderLayoutContent = () => {
            return (
                <div className={flapClass} style={styleFlap}>
                    {isPreview ? this.renderFlapInPreview(layout, numScaleLeftCover, numScaleTopCover) :
                        this.renderlayout(layout, numScaleLeftCover, numScaleTopCover)}
                </div>
            );
        }

        return (
            <div className={coverclass} style={styleCover}>
                <div className="page-flap">
                    <div className="top-border-flap"></div>
                    <div className="bottom-border-flap"></div>
                    <div className="full-top-border-flap"></div>
                    <div className="full-bot-border-flap"></div>
                    {!hideContent && renderLayoutContent()}
                    {shadow}
                </div>
            </div>
        );
    }
}

const handleShowUnsupportedUnicodeCharacters = (dispatch) => {
    dispatch(toggleShowUnsupportCharactersPopup());
}

const handleRemovePhotoInCover = (dispatch, idLayout, idPage, idPageLayout) => {
    dispatch(removePhotoInCover({ idLayout, idPage, idPageLayout }));
}

const onUpdateImageObject = (dispatch, imageObject, idLayout, idPage, idPageLayout) => {
    let cover = { imageObject, idLayout, idPage, idPageLayout };
    dispatch(updateImageIntoCover(cover));
}

const onUpdateTextObject = (dispatch, textObject, idLayout, idPage, idPageLayout) => {
    let cover = { textObject, idLayout, idPage, idPageLayout };
    dispatch(updateTextIntoCover(cover));
}

Flap.propTypes = {
    isPreview: PropTypes.bool,
    trimSize: PropTypes.object,
    coverSection: PropTypes.string,
    cover: PropTypes.object,
    layout: PropTypes.object,
    theme: PropTypes.object,
    sizePage: PropTypes.object,
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleShowUnsupportedUnicodeCharacters: () => handleShowUnsupportedUnicodeCharacters(dispatch),
        onUpdateImageObject: (imageObject, idLayout, idPage, idPageLayout) => onUpdateImageObject(dispatch, imageObject, idLayout, idPage, idPageLayout),
        onUpdateTextObject: (textObject, idLayout, idPage, idPageLayout) => onUpdateTextObject(dispatch, textObject, idLayout, idPage, idPageLayout),
        handleRemovePhotoInCover: (idLayout, idPage, idPageLayout) => handleRemovePhotoInCover(dispatch, idLayout, idPage, idPageLayout)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Flap);
