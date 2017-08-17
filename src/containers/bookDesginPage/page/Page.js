import React, { Component } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import './Page.css';

import ImageField   from './../../../components/bookDesign/imageField/ImageField';
import TextField from './../../../components/bookDesign/textField/TextField';
import AddPageIcon from './../../../components/bookDesign/page/addpage/AddPageIcon';
import RemovePageIcon from './../../../components/bookDesign/page/removePage/RemovePageIcon';
import ChangeStylePage from './../../../components/bookDesign/page/changeLayout/ChangeStylePage';
import PopupWithThreeButtons from './../../../components/popup/popupWithThreeButtons/PopupWithThreeButtons';
import { FIELD_TYPE, COVER_SECTION, themesOriginal } from './../../../constants/Constants';
import LocaleUtils from './../../../utils/LocaleUtils';
import LocalUtils from './../../../utils/LocaleUtils'
import Tooltip  from 'rc-tooltip';
import IconButton  from './../../../components/materials/iconButton/IconButton';
import { toggleShowHelpBubble } from './../../../actions/appStatusActions/BookDesignHeaderStatusActions';
import { toggleChangeLogoOfBook } from './../../../actions/projectActions/bookActions/BookInfoActions';
import { toggleShowCustomLogoPopup, toggleShowUnsupportCharactersPopup } from './../../../actions/appStatusActions/RootStatusActions';
import {
    updateImageIntoPage,
    removePhotoInPage,
    updateTextIntoPage,
    setPageLayout
} from '../../../actions/projectActions/bookActions/pagesActions/PagesActions';
import Assets from '../../../assets/Assets';

class Page extends Component {

    constructor(props) {
        super(props)
        this.state = {
            numPage: props.numPage,
            position: {
                x: 0,
                y: 0
            }
        }
        this.onAddPage = this.onAddPage.bind(this);
        this.setPositionState = this.setPositionState.bind(this);
        this.onChangeLayoutAutoPageLeft = this.onChangeLayoutAutoPageLeft.bind(this);
        this.onChangeLayoutAutoPageRight = this.onChangeLayoutAutoPageRight.bind(this);
    }

    onAddPage() {
        const { numPage, addPageInBook } = this.props;
        let position;
        if (numPage > 2) {
            if (numPage % 2 === 0) {
                position = numPage - 2;
            } else {
                position = numPage - 1;
            }
        } else {
            position = 2;
        }

        addPageInBook(position);
    }

    onChangeImageField(imageObject, idLayout, idPage, idPageLayout) {
        this.props.onUpdateImageObject(imageObject, idLayout, idPage, idPageLayout);
    }

    onRemovePhotoInPage(idLayout, idPage, idPageLayout) {
        this.props.handleRemovePhotoInPage(idLayout, idPage, idPageLayout);
    }

    onChangeTextField(textObject, idLayout, idPage, idPageLayout) {
        this.props.onUpdateTextObject(textObject, idLayout, idPage, idPageLayout);
    }

    onChangeLayoutAutoPageLeft() {
        let { currentPage } = this.props;
        this.changeLayoutRandom(currentPage -1);
    }

    onChangeLayoutAutoPageRight() {
        let { currentPage } = this.props;
        this.changeLayoutRandom(currentPage);
    }

    changeLayoutRandom(pageNumber) {
        let { typesOfLayouts, present } = this.props;
        let layoutId = present[pageNumber].page_layout_id;
        for (let i = 0; i < typesOfLayouts.length; i++) {
            let layoutList = typesOfLayouts[i];
            for (let j = 0; j < layoutList.length; j++) {
                if (layoutList[j].$.id === layoutId) {
                    let layoutNext =  j < layoutList.length - 1 ? layoutList[j+1] : layoutList[0];
                    this.props.onChangeAutoLayout([pageNumber], layoutNext);
                    return;
                }
            }
        }
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

    renderlayout(layouts) {
        let { photoList, totalPage, unScaleNumber } = this.props;
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
                        themeKey={this.props.bookInfo.theme}    
                        toggleShowCustomeLogoPopup={this.props.dispatchToggleCustomLogoPopup}
                        isLogoChanged={this.props.isLogoChanged}
                        isLogo={idPage === totalPage - 1}
                        idPage={idPage}
                        idLayout={idLayout}
                        idPageLayout={idPageLayout}
                        onChangeImageField={this.onChangeImageField.bind(this)}
                        imageSource={layouts[index].image ? imageSource : false}
                        key={idLayout}
                        sizeHeight={layouts[index].height}
                        sizeWidth={layouts[index].width}
                        positionX={layouts[index].x}
                        positionY={layouts[index].y}
                        onRemovePhotoInPage={this.onRemovePhotoInPage.bind(this)}
                    />
                )
            } else if (layouts[index].type === FIELD_TYPE.TEXT) {
                layoutArray.push(
                    <TextField
                        unScaleNumber={unScaleNumber}    
                        themeKey={this.props.bookInfo.theme}    
                        idPage={idPage}
                        idLayout={idLayout}
                        idPageLayout={idPageLayout}
                        onChangeTextField={this.onChangeTextField.bind(this)}
                        textSource={layouts[index].text ? layouts[index].text : ''}
                        textStyle={this.getTextStyleById(layouts[index].style_id, this.props.theme)}
                        key={idLayout}
                        sizeHeight={layouts[index].height}
                        sizeWidth={layouts[index].width}
                        positionX={layouts[index].x}
                        positionY={layouts[index].y}
                        toggleKeyBoardEvent={this.props.toggleKeyBoardEvent}
                        handleShowUnsupportedUnicodeCharacters={this.props.handleShowUnsupportedUnicodeCharacters}
                    />
                )
            }
        }
        return (layoutArray);
    }

    renderFlapCover() {
        return <div className="flap-cover-content">{LocalUtils.instance.translate('endsheet_text')}</div>;
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            numPage: nextProps.numPage
        });
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
            let arrayBackground = theme['Backgrounds'][0]['Background'];

            for (let key in arrayBackground) {
                if (arrayBackground[key]['$'].id === background_id) {
                    return arrayBackground[key]['$'].color;
                }
            }
        }
        return this.getColorDefaultBackground(theme, false);
    }

    renderAddRemovePageIcon(currentPage, amountPage, style, unScaleNumber) {
        if (style === 'remove-first') {
            if (currentPage === amountPage) {
                return (
                    <div className="add-remove-left-page">
                        <AddPageIcon onClick={this.onAddPage} />
                    </div>
                );
            }

            return (
                <div className="add-remove-left-page">
                    <RemovePageIcon onClick={this.props.removePageInBook} />
                    <AddPageIcon onClick={this.onAddPage} />
                </div>
            );
        }

        if (currentPage === 1) {    //style === 'add-first'
            return (
                <div className="add-remove-right-page">
                    <AddPageIcon onClick={this.onAddPage} />
                </div>
            );
        }

        return (
            <div className="add-remove-right-page">
                <AddPageIcon onClick={this.onAddPage} />
                <RemovePageIcon onClick={this.props.removePageInBook} />
            </div>
        );
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

    renderArrowPageBtn(isEvenPage, onClick) {
        if (isEvenPage) {
            return (
                <Tooltip placement='bottomRight' prefixCls='rc-tooltip-custom-page'
                         align={{
                             offset: [this.state.position.x, this.state.position.y],
                         }}
                         overlay={LocaleUtils.instance.translate('tooltip.previous_page')}>
                    <div className='nav-arrow icon-wingLeft' onClick={onClick}
                         onMouseEnter={this.setPositionState.bind(this)}
                        >
                        <div className="inside icon-ArrowLeft">
                        </div>
                    </div>
                </Tooltip>
            );
        }

        return (
            <Tooltip placement='bottomRight' prefixCls='rc-tooltip-custom-page'
                     align={{
                         offset: [this.state.position.x, this.state.position.y],
                     }}
                     overlay={LocaleUtils.instance.translate('tooltip.next_page')}>
                    <div className='nav-arrow icon-wingRight' onClick={onClick}
                         onMouseEnter={this.setPositionState}>
                        <div className="inside icon-ArrowRight">
                        </div>
                    </div>
            </Tooltip>
        );
    }

    renderSafeAndShadowLeftPage() {
        return (
            this.props.isPage ?
            <div>
                <div className="page-shadow left-sha" />
                <div className="top-safe strip" />
                <div className="bot-safe strip" />
                <div className="left-safe strip" />
            </div>
            :
            <div>
                <div className="page-shadow left-sha" />
            </div>
        );
    }

    renderSafeAndShadowRightPage() {
        return (
            this.props.isPage ?
            <div>
                <div className="page-shadow right-sha" />
                <div className="top-safe strip" />
                <div className="bot-safe strip" />
                <div className="right-safe strip" />
            </div>
            :
            <div>
                <div className="page-shadow right-sha" />
            </div>
        );
    }

    render() {
        let { layout, theme, isPage, present, numPage, totalPage, sizePage, idPage, isShowHelpBubble, unScaleNumber,
            isShowSelectLayoutPageLeft, isShowSelectLayoutPageRight, isShowSelectBackgroundsAndBordersPageLeft, isShowSelectBackgroundsAndBordersPageRight } = this.props;

        let stylePage = {...sizePage};
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

        const justChangeBackgroundAndOrderLeftSide = <ChangeStylePage
            positionOfPage={'left'}
            justChangeBackgroundAndBorder={true}
            numPage={numPage}
            display='main-page'
        />;

        const changeStyleLeftSidePage = <ChangeStylePage
                                            positionOfPage='left'
                                            onChangeLayoutAuto={this.onChangeLayoutAutoPageLeft}
                                            numPage={numPage}
											display='main-page'
                                        />;

        const changeStyleRightSidePage =
            <Tooltip placement='top' prefixCls='show-help-tooltip-custom-page'
                     visible={isShowHelpBubble}
                     overlay={<div><IconButton type={IconButton.type.closeShowHelp} onClick={this.props.closeShowHelpBubble}/>
                         <div className='show-help-tooltip-custom-page-text'>{LocaleUtils.instance.translate('helpbubbles.page_design')}</div></div>}>
                <div className='show-help-tooltip-custom-page-wrapper'>
                    <ChangeStylePage
                        positionOfPage='right'
                        onChangeLayoutAuto={this.onChangeLayoutAutoPageRight}
                        numPage={numPage}
						display='main-page'
                    />
                </div>
            </Tooltip>;

        let styleLeftPage = {
            transform: 'scale(' + unScaleNumber + ')',
            zIndex: (isShowSelectLayoutPageLeft || isShowSelectBackgroundsAndBordersPageLeft) ? 50: 0
        }

        let styleRightPage = {
            transform: 'scale(' + unScaleNumber + ')',
            zIndex: (isShowSelectLayoutPageRight || isShowSelectBackgroundsAndBordersPageRight) ? 50: 0
        }

        return (
            <div className="page-zone-single">
                {
                    isEvenPage  && numPage > 0 && this.renderAddRemovePageIcon(numPage, totalPage, 'remove-first', unScaleNumber)
                }
                {
                    isEvenPage && this.renderArrowPageBtn(isEvenPage, this.props.goToPreviousPage)
                }
                <div className="change-layout-border-background left-page" style={styleLeftPage}>
                    {
                        isEvenPage ? numPage === 0 ? null : numPage === totalPage ?
                            justChangeBackgroundAndOrderLeftSide : changeStyleLeftSidePage : null
                    }
                </div>
                <div className={"page-zone "} style={stylePage} id={idPage}>
                    {
                        !isPage ? this.renderFlapCover() : this.renderlayout(layout)
                    }
                    {
                        !isEvenPage ? this.renderSafeAndShadowLeftPage() : this.renderSafeAndShadowRightPage()
					}
                </div>
                <div className="change-layout-border-background right-page" style={styleRightPage}>
                    {
                        (!isEvenPage && numPage < totalPage) ? changeStyleRightSidePage : null
                    }
                </div>
                {
                    !isEvenPage && this.renderArrowPageBtn(isEvenPage, this.props.goToNextPage)
                }
                {
                    !isEvenPage && numPage < totalPage && this.renderAddRemovePageIcon(numPage, totalPage, 'add-first', unScaleNumber)
                }
            </div>
        );
    }
}

Page.propTypes = {
    idPage: PropTypes.string,
    sizeHeight: PropTypes.number,
    sizeWidth: PropTypes.number,
    layout: PropTypes.object,
    formatPage: PropTypes.object,
    theme: PropTypes.object,
    sizeBookDesign: PropTypes.number,
    isPage: PropTypes.bool,
    numPage: PropTypes.number,
    cover: PropTypes.object,
    totalPage: PropTypes.number,
    goToPreviousPage: PropTypes.func,
    goToNextPage: PropTypes.func,
    unScaleNumber: PropTypes.number
}

const handleRemovePhotoInPage = (dispatch, idLayout, idPage, idPageLayout) => {
    dispatch(removePhotoInPage({ idLayout, idPage, idPageLayout }));
}

const onUpdateImageObject = (dispatch, imageObject, idLayout, idPage, idPageLayout) => {
    let pageVO = { imageObject, idLayout, idPage, idPageLayout };
    dispatch(updateImageIntoPage(pageVO));
}

const onUpdateTextObject = (dispatch, textObject, idLayout, idPage, idPageLayout) => {
    let pageVO = { textObject, idLayout, idPage, idPageLayout };
    dispatch(updateTextIntoPage(pageVO));
}

const handleCloseShowHelpBubble = (dispatch) => {
    dispatch(toggleShowHelpBubble(false));
};

const onChangeLayout = (dispatch, page, newLayout) => {
    dispatch(setPageLayout(page, newLayout));
};

const dispatchChangeLogoOfBook = (dispatch) => {
    dispatch(toggleChangeLogoOfBook());
}

const dispatchToggleCustomLogoPopup = (dispatch) => {
    dispatch(toggleShowCustomLogoPopup());
}

const handleShowUnsupportedUnicodeCharacters = (dispatch) => {
    dispatch(toggleShowUnsupportCharactersPopup());
}

const mapStateToProps = (state) => {
    const { photoList, appStatus, project } = state;
    const { bookDesignHeaderStatus, paginationStatus, rootStatus } = appStatus;
    const { isShowSelectLayoutPageLeft, isShowSelectLayoutPageRight, isShowSelectBackgroundsAndBordersPageLeft, isShowSelectBackgroundsAndBordersPageRight } = rootStatus;
    const { currentPage } = paginationStatus;
    const { isShowHelpBubble } = bookDesignHeaderStatus;
    const { book } = project;
    const { layouts, pages, bookInfo } = book;
    const { typesOfLayouts } = layouts;
    const { present } = pages;
    return {
        isLogoChanged: book.bookInfo.isLogoChanged,
        photoList,
        isShowHelpBubble,
        present,
        typesOfLayouts,
        currentPage,
        isShowSelectLayoutPageLeft,
        isShowSelectLayoutPageRight,
        isShowSelectBackgroundsAndBordersPageLeft,
        isShowSelectBackgroundsAndBordersPageRight,
        bookInfo
    };
}

const mapDispatchToProps = (dispatch) => ({
    handleShowUnsupportedUnicodeCharacters: () => handleShowUnsupportedUnicodeCharacters(dispatch),
    onUpdateImageObject: (imageObject, idLayout, idPage, idPageLayout) => onUpdateImageObject(dispatch, imageObject, idLayout, idPage, idPageLayout),
    handleRemovePhotoInPage: (idLayout, idPage, idPageLayout) => handleRemovePhotoInPage(dispatch, idLayout, idPage, idPageLayout),
    onUpdateTextObject: (textObject, idLayout, idPage, idPageLayout) => onUpdateTextObject(dispatch, textObject, idLayout, idPage, idPageLayout),
    closeShowHelpBubble: () => handleCloseShowHelpBubble(dispatch),
    onChangeAutoLayout: (page, newLayout) => onChangeLayout(dispatch, page, newLayout),
    dispatchToggleCustomLogoPopup: () => dispatchToggleCustomLogoPopup(dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Page);
