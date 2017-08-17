import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import './Spine.css';
import { FIELD_TYPE, COVER_SECTION, TOP_TRIM_PERCENT_HEIGHT, LEFT_TRIM_PERCENT_WIDTH } from './../../../constants/Constants'
import TextField from './../../../components/bookDesign/textField/TextField';
import MiniTextField from './../../../containers/bookDesginPage/managePages/miniTextField/MiniTextField';
import { updateTextIntoCover } from './../../../actions/projectActions/bookActions/CoversActions';
import { toggleShowUnsupportCharactersPopup } from './../../../actions/appStatusActions/RootStatusActions';
import ChangeStylePage from './../../../components/bookDesign/page/changeLayout/ChangeStylePage';

class Spine extends Component {

    onChangeTextField(textObject, idLayout, idPage, idPageLayout) {
        this.props.onUpdateTextObject(textObject, idLayout, idPage, idPageLayout);
    }

    renderLayoutPreviewMode(layouts) {
        let { photoList } = this.props;
        var layoutArray = [];

        for (let index in layouts) {
            let idLayout = layouts[index].id;
            let idPage = layouts[index].idPage;
            let idPageLayout = layouts[index].page_layout_id;

            if (layouts[index].type === FIELD_TYPE.TEXT) {
                layoutArray.push(
                    <MiniTextField
                        ratio={1}
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

    renderlayout(layouts, numScaleTopCover) {
        var layoutArray = [];
        for (let index in layouts) {
            let idLayout = layouts[index].id;
            let idPage = -2;
            let idPageLayout = layouts[index].page_layout_id;

            if (layouts[index].type === FIELD_TYPE.TEXT) {
                layoutArray.push(
                    <TextField
                        unScaleNumber={this.props.unScaleNumber}    
                        idPage={idPage}
                        idLayout={idLayout}
                        idPageLayout={idPageLayout}
                        onChangeTextField={this.onChangeTextField.bind(this)}
                        textSource={layouts[index].text ? layouts[index].text : ''}
                        textStyle={this.getTextStyleById(layouts[index].style_id, this.props.theme)}
                        key={idLayout}
                        sizeHeight={layouts[index].height}
                        sizeWidth={layouts[index].width * numScaleTopCover}
                        positionX={layouts[index].x * numScaleTopCover}
                        positionY={layouts[index].y}
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
        return '#fff';
    }

    render() {
        let { cover, layout, theme, sizePage, manageButton, isShowChangeStyle, isPreview, trimSize, unScaleNumber } = this.props;
        let { background_id } = cover;
        let { Backgrounds } = theme;
        let numScaleTopCover = 1-TOP_TRIM_PERCENT_HEIGHT;
        let backgroundCover  = this.getBackgroundById(background_id, Backgrounds[0]['Background'])
        let spineStyle = {
            width: trimSize.spineSize.width,
            height: trimSize.spineSize.height,
            backgroundColor: backgroundCover
        }

        let styleAboveSpine = {
            left: trimSize.spineSize.width/7.5,
            right: trimSize.spineSize.width/7.5,
            background: backgroundCover
        }

        let styleBookSafeZone = { transform: 'scale('+ unScaleNumber + ')' };

        return (
            <div className="spine-book">
                <div className="spine-book-zone" style={spineStyle}>
					 <div className="above-spine-book" style={styleAboveSpine}>
							<div className="line-spine-book" />
							<div className="sha-spin-top" />
							<div className="sha-spin-bot" />
					</div>
                    {
                        isPreview ? this.renderLayoutPreviewMode(layout) : this.renderlayout(layout, numScaleTopCover)
                    }
                    {
                        manageButton
                    }
                    {
                        isShowChangeStyle && <div className="change-layout-border-background right-page" style={styleBookSafeZone}>
                            <ChangeStylePage positionOfPage='spine' display='main-page'/>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

const handleShowUnsupportedUnicodeCharacters = (dispatch) => {
    dispatch(toggleShowUnsupportCharactersPopup());
}

const onUpdateTextObject = (dispatch, textObject, idLayout, idPage, idPageLayout) => {
    let cover = { textObject, idLayout, idPage, idPageLayout };
    dispatch(updateTextIntoCover(cover));
}

Spine.propTypes = {
    trimSize: PropTypes.object,
    cover: PropTypes.object,
    layout: PropTypes.object,
    theme: PropTypes.object,
    sizePage: PropTypes.object,
    manageButton: PropTypes.object,
    isShowChangeStyle: PropTypes.bool,
    isPreview: PropTypes.bool,
    unScaleNumber: PropTypes.number
}

Spine.defaultProps = {
    isShowChangeStyle: false,
    unScaleNumber: 1
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleShowUnsupportedUnicodeCharacters: () => handleShowUnsupportedUnicodeCharacters(dispatch),
        onUpdateTextObject: (textObject, idLayout, idPage, idPageLayout) => onUpdateTextObject(dispatch, textObject, idLayout, idPage, idPageLayout)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Spine);
