import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Checkbox from 'rc-checkbox';
import Tooltip from 'rc-tooltip';

import './DesignPage.css';
import Assets from './../../../assets/Assets';
import Pagination from './../../../components/bookDesign/pagination/Pagination';
import Page from './../../../containers/bookDesginPage/page/Page';
import Cover from './../../../containers/bookDesginPage/cover/Cover';
import Spine from './../../../containers/bookDesginPage/spine/Spine';
import Flap from './../../../containers/bookDesginPage/flap/Flap';
import CoverTypeSelector from './../../../containers/bookDesginPage/coverTypeSelector/CoverTypeSelector';
import Button from './../../../components/materials/button/Button';
import LocaleUtils from './../../../utils/LocaleUtils';
import { trimSizes, bookFormats, FIELD_TYPE, COVER_SECTION, COVER_TYPE } from './../../../constants/Constants'
import { setCoverType } from './../../../actions/projectActions/bookActions/CoversActions'
import IconButton  from './../../../components/materials/iconButton/IconButton';
import {
    toggleShowHelpBubble
} from './../../../actions/appStatusActions/BookDesignHeaderStatusActions';
import ChangeStylePage from './../../../components/bookDesign/page/changeLayout/ChangeStylePage';
import ScrollArea from './../../../components/materials/scrollBarCustom/ScrollArea';

class DesignPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isShowChangeLayoutLeftPage: false,
            isShowChangeLayoutRightPage: false,
            updateSize: 0
        }
        this.toggleShowChangeLayoutLeftPage = this.toggleShowChangeLayoutLeftPage.bind(this);
        this.toggleShowChangeLayoutRightPage = this.toggleShowChangeLayoutRightPage.bind(this);
    }

    updateWindowSize() {
        this.setState({
            updateSize: this.state.updateSize++
        })
    }

    preventEventDefault(e) {
        e.preventDefault();
    }

    componentDidMount() {
        this.node = this.refs.book_design_content_zone;
        let isFirefox = typeof InstallTrigger !== 'undefined';
        if (isFirefox) {
            this.node.addEventListener('dragstart', this.preventEventDefault);
        }

        window.addEventListener("resize", this.updateWindowSize.bind(this));
    }

    componentWillUnmount() {
        let isFirefox = typeof InstallTrigger !== 'undefined';
        if (isFirefox) {
            this.node.removeEventListener('dragstart', this.preventEventDefault);
        }
    }

    toggleShowChangeLayoutLeftPage() {
        this.setState({
            isShowChangeLayoutLeftPage: !this.state.isShowChangeLayoutLeftPage,
            isShowChangeLayoutRightPage: false
        });
    }

    toggleShowChangeLayoutRightPage() {
        this.setState({
            isShowChangeLayoutRightPage: !this.state.isShowChangeLayoutRightPage,
            isShowChangeLayoutLeftPage: false
        });
    }

    getThemeForBook() {
        let themes = this.props.themes;
        let { theme } = this.props.book.bookInfo;
        for (let key in themes) {
            if (themes[key].$.id === theme) {
                return themes[key];
            }
        }
        return {};
    }

    getLayoutOfCover(coverSection, coverType) {
        let { covers, coverLayouts } = this.props;
        let allCoverLayouts = coverLayouts.CoverLayouts;
        let coverData = covers[coverSection];
        let layoutGroupId = coverData.layout_group_id;
        let layouts = [];
        let numberPage = -1;

        if (coverSection === COVER_SECTION.FRONT_COVER || coverSection === COVER_SECTION.BACK_COVER) {
            layouts = allCoverLayouts['CoverLayout'];
            numberPage = coverSection === COVER_SECTION.FRONT_COVER ? -1 : 99999;
        } else if (coverSection === COVER_SECTION.SPINE) {
            numberPage = -2;
            layouts = allCoverLayouts['SpineLayout'];
        } else if (coverSection === COVER_SECTION.FRONT_FLAP) {
            numberPage = -3;
            layouts = allCoverLayouts['FlapLayout'];
        } else if (coverSection === COVER_SECTION.BACK_FLAP) {
            numberPage = -4;
            layouts = allCoverLayouts['FlapLayout'];
        }


        // let layoutCoverId = coverType === COVER_TYPE.HARDCOVER_DUST_JACKET ? 'blurb.dj.' : coverType === COVER_TYPE.SOFTCOVER ? 'blurb.sc.' : 'blurb.iw.' + layoutGroupId;
        for (let i in layouts) {
            let layout = layouts[i];
            if (layout.$.group_id === layoutGroupId && layout.$.cover_type === coverType) {
                let newLayout = this.parseLayoutToElementArray(layout, coverData, numberPage, layoutGroupId);
                return newLayout;
            }
        }

        return {};
    }

    getLayoutOfPage(numberPage) {
        let layout = {}
        let { book, pages, pastPages } = this.props;
        let { layouts } = book;
        let pageData = pages[numberPage];
        let { page_layout_id } = pageData;
        // let pastLayputID = pastPages[numberPage] ? pastPages[numberPage].page_layout_id : page_layout_id;
        let layoutArray = layouts.PageLayout;

        for (let key in layoutArray) {
            if (layoutArray[key].$.id === page_layout_id) {
                layout = layoutArray[key];
                break;
            }
        }

        let newLayout = this.parseLayoutToElementArray(layout, pageData, numberPage, page_layout_id);
        return newLayout;
    }

    makeSymmetryX(x0, widthElement, widthPage) {
        return widthPage - x0 - widthElement;
    }

    parseLayoutToElementArray(layout, pageData, numberPage, page_layout_id) {
        let layoutPage = [];

        for (let key in layout) {
            if (key === FIELD_TYPE.LOCK_IMAGE) {
                for (let index in layout[key]) {
                    let field = layout[key][index].$;
                    let element = {};

                    element.type = FIELD_TYPE.IMAGE;
                    element.id = field.id;
                    element.idPage = numberPage;
                    element.page_layout_id = page_layout_id;
                    element.x = parseInt(field.x, 10);
                    element.y = parseInt(field.y, 10);
                    element.width = parseInt(field.width, 10);
                    element.height = parseInt(field.height, 10);
                    let image = {
                        image_source_id: 'logo_blurb',
                        src: Assets.instance.retrieveImageObjectURL('img_applogo'),
                        x_shift: 0,
                        y_shift: 0,
                        fit_policy: 'fit',
                        zoom_level: '100',
                        rotation: 0,
                    }
                    element.image = image;

                    layoutPage.push(element);
                }
            }
            else if (key === FIELD_TYPE.IMAGE) {
                for (let index in layout[key]) {
                    let field = layout[key][index].$;
                    let element = {};

                    element.type = key;
                    element.id = field.id;
                    element.idPage = numberPage;
                    element.page_layout_id = page_layout_id;
                    element.x = parseInt(field.x, 10);
                    element.y = parseInt(field.y, 10);
                    element.width = parseInt(field.width, 10);
                    element.height = parseInt(field.height, 10);
                    element.image = '';

                    if (numberPage % 2 === 0 && numberPage >= 0) element.x = this.makeSymmetryX(element.x, element.width, this.getFormatPage().realWidth);

                    layoutPage.push(element);
                }
            } else if (key === FIELD_TYPE.TEXT) {
                for (let index in layout[key]) {
                    let field = layout[key][index].$;
                    let element = {};

                    element.type = key;
                    element.id = field.id;
                    element.idPage = numberPage;
                    element.page_layout_id = page_layout_id;
                    element.x = parseInt(field.x, 10);
                    element.y = parseInt(field.y, 10);
                    element.width = parseInt(field.width, 10);
                    element.height = parseInt(field.height, 10);
                    element.style_id = field.style_id;
                    element.binding = field.binding;
                    element.two_way = field.two_way;

                    if (numberPage % 2 === 0 && numberPage >= 0) element.x = this.makeSymmetryX(element.x, element.width, this.getFormatPage().realWidth);

                    layoutPage.push(element);
                }
            }
        }

        return this.mapDataToLayout(layoutPage, pageData);
    }

    mapDataToLayout(layoutPage, pageData) {

        for (let i in layoutPage) {
            if (layoutPage[i].type === FIELD_TYPE.IMAGE) {
                if (pageData.ImageContainer) {
                    for (let k in pageData.ImageContainer) {
                        let container = pageData.ImageContainer[k];
                        if (container.$ && container.$.ref_id === layoutPage[i].id) {
                            layoutPage[i].image = container.Image;
                        }
                    }
                }
            } else if (layoutPage[i].type === FIELD_TYPE.TEXT) {
                if (pageData.TextContainer) {
                    for (let k in pageData.TextContainer) {
                        let container = pageData.TextContainer[k];
                        if (container.$ && container.$.ref_id === layoutPage[i].id) {
                            layoutPage[i].text = container.parsedText;
                        }
                    }
                }
            }
        }

        return layoutPage;
    }

    getFormatPage() {
        let type = {
            ratioWidth: 7,
            ratioHeight: 7,
            realWidth: 495,
            realHeight: 495
        };
        for (let key in trimSizes) {
            if (bookFormats[key] === this.props.book.bookInfo.format) {
                let object = trimSizes[key];
                type.realHeight = object.height;
                type.realWidth = object.width;
                let ratio = object.sizeDescription;
                let ratioStringArr = ratio.split("x");
                type.ratioWidth = ratioStringArr[0];
                type.ratioHeight = ratioStringArr[1];
            }
        }
        return type;
    }

    getSizeBookDesign() {
        return {
            heightBook: this.props.isMinimizeFooter ? window.innerHeight - 262 : window.innerHeight - 462,
            widthBook: window.innerWidth
        }
    }

    getCover(coverSection) {
        let { covers } = this.props.book;
        for (let key in covers) {
            if (coverSection === key) {
                return covers[key];
            }
        }
        return covers[0];
    }

    calculatorScale() {
        let { heightBook } = this.getSizeBookDesign();
        let {realHeight } = this.getFormatPage();
        let cusHeight = (heightBook - window.innerHeight*0.08);
        if (cusHeight < 350) cusHeight = 350;

        let numberScale = cusHeight / realHeight;
        return numberScale;
    }

    getSizePageAndNumberScale() {
        let { realWidth, realHeight } = this.getFormatPage();
        let sizePage = {
            width: realWidth,
            height: realHeight
        }
        let numberScale = this.calculatorScale();

        return {
            sizePage,
            numberScale
        }
    }

    renderManagePagesButton() {
        let { isShowHelpBubble, goToManagePages, zoomValue } = this.props;
        let { numberScale } = this.getSizePageAndNumberScale();
        let styleManageButton = { transform: 'scale(' + 1 / (numberScale * zoomValue / 100) + ')' };
        return (
            <Tooltip
                placement='left'
                prefixCls='show-help-tooltip-custom-design-page'
                visible={isShowHelpBubble}
                overlay={
                    <div>
                        <IconButton type={IconButton.type.closeShowHelp} onClick={this.props.closeShowHelpBubble} />
                        <div className='show-help-tooltip-custom-design-page-text'>
                            {LocaleUtils.instance.translate('helpbubbles.arrange_pages')}
                        </div>
                    </div>
                }
            >
                <div className='book-manage-pages' style={styleManageButton}>
                    <Button
                        textFirst={false}
                        onClick={goToManagePages}
                        icon='icon-ViewAllPagesIcon'
                        text={LocaleUtils.instance.translate('label.view_all_pages')} />
                </div>
            </Tooltip>
        );
    }

    getCoverTrimsBy(coverType) {
        let trim = {};
        for (let key in trimSizes) {
            if (bookFormats[key] === this.props.book.bookInfo.format) {
                trim = trimSizes[key];
                break;
            }
        }
        let trimSizeByCoverType = trim.coverTrims[coverType];

        return trimSizeByCoverType;
    }

    renderFlap(coverType, coverSection, sizePage, toggleKeyBoardEvent) {
        return (
            <Flap
                trimSize={this.getCoverTrimsBy(coverType)}
                coverSection={coverSection}
                cover={this.getCover(coverSection)}
                theme={this.getThemeForBook()}
                layout={this.getLayoutOfCover(coverSection, coverType)}
                sizePage={sizePage}
                toggleKeyBoardEvent={toggleKeyBoardEvent}
            />
        );
    }

    renderCoverByType(coverSection, coverType) {
        let { sizePage, numberScale } = this.getSizePageAndNumberScale();
        let coverElement = null;
		const { isShowBookSafeZone, onToggleShowBookSafeZone, zoomValue, toggleKeyBoardEvent } = this.props;
        const classShowSafeZone = isShowBookSafeZone ? 'show-book-safe-zone' : '';
        let manageButton = this.renderManagePagesButton();

        let numScale = numberScale*zoomValue/100 * 0.85;
        let styleBookCoverDesignZone = { 'transform': 'scale('+ numScale + ')' };
        let unScaleNumber = 1/(numberScale*zoomValue/100) / 0.85;
        let styleBookSafeZone = { transform: 'scale('+ unScaleNumber + ')' };

        switch(coverSection) {
            case COVER_SECTION.FRONT_COVER:
            case COVER_SECTION.BACK_COVER:
                let arrowEvent = coverSection === COVER_SECTION.FRONT_COVER ? this.props.goToNextPage : this.props.goToPreviousPage;
				coverElement = (
									<div className="book-cover-design-zone" style={styleBookCoverDesignZone}>
										<div className="book-safe-zone">
											<Checkbox checked={isShowBookSafeZone} onChange={onToggleShowBookSafeZone} />
											<span className="book-safe-zone-bold-style">{' ' + LocaleUtils.instance.translate('label.show_safe_zones_title') + ': '}</span>
											<span>{LocaleUtils.instance.translate('label.show_safe_zones_message') + ' '}</span>
											<a className="book-safe-zone-what-is-that" href={LocaleUtils.instance.translate('urls.safeZoneInfo')} target="_blank">
												{LocaleUtils.instance.translate('label.what_is_this')}
											</a>
										</div>
										<div className={'book-safe-zone-border ' + classShowSafeZone}>
											<Cover
                                                trimSize={this.getCoverTrimsBy(coverType)}
                                                coverType={coverType}
												coverSection={coverSection}
												cover={this.getCover(coverSection)}
												theme={this.getThemeForBook()}
												layout={this.getLayoutOfCover(coverSection, coverType)}
												sizePage={sizePage}
												arrowEvent={arrowEvent}
												isShowBookSafeZone={isShowBookSafeZone}
                                                onToggleShowBookSafeZone={onToggleShowBookSafeZone}
                                                toggleKeyBoardEvent={this.props.toggleKeyBoardEvent}
                                                unScaleNumber={unScaleNumber}
											/>
                                            { manageButton }
										</div>
									</div>
								);
                break;
            case COVER_SECTION.SPINE:
                coverElement = (
                    <div className="book-cover-design-zone" style={styleBookCoverDesignZone}>
                        <Spine
                            coverType={coverType}
                            trimSize={this.getCoverTrimsBy(coverType)}
                            cover={this.getCover(coverSection)}
                            theme={this.getThemeForBook()}
                            layout={this.getLayoutOfCover(coverSection, coverType)}
                            sizePage={sizePage}
                            manageButton={manageButton}
                            toggleKeyBoardEvent={this.props.toggleKeyBoardEvent}
                            isShowChangeStyle={true}
                            unScaleNumber={unScaleNumber}
                        />
                    </div>
                )
                break;
            case COVER_SECTION.FRONT_FLAP:
            case COVER_SECTION.BACK_FLAP:
                coverElement = (
                    <div className="book-cover-design-zone" style={styleBookCoverDesignZone}>
                        <div className="flap-swap-book">
                            {this.renderFlap(coverType, COVER_SECTION.FRONT_FLAP, sizePage, toggleKeyBoardEvent)}
                            {this.renderFlap(coverType, COVER_SECTION.BACK_FLAP, sizePage, toggleKeyBoardEvent)}
                            {manageButton}
                        </div>
						<div className="flap-swap-book">
                            <Flap
                                coverType={coverType}
                                trimSize={this.getCoverTrimsBy(coverType)}
                                coverSection={COVER_SECTION.FRONT_FLAP}
                                cover={this.getCover(COVER_SECTION.FRONT_FLAP)}
                                theme={this.getThemeForBook()}
                                layout={this.getLayoutOfCover(COVER_SECTION.FRONT_FLAP, coverType)}
                                sizePage={sizePage}
                                toggleKeyBoardEvent={this.props.toggleKeyBoardEvent}
                                unScaleNumber={unScaleNumber}
                            />
                            <Flap
                                coverType={coverType}
                                trimSize={this.getCoverTrimsBy(coverType)}
                                coverSection={COVER_SECTION.BACK_FLAP}
                                cover={this.getCover(COVER_SECTION.BACK_FLAP)}
                                theme={this.getThemeForBook()}
                                layout={this.getLayoutOfCover(COVER_SECTION.BACK_FLAP, coverType)}
                                sizePage={sizePage}
                                toggleKeyBoardEvent={this.props.toggleKeyBoardEvent}
                                unScaleNumber={unScaleNumber}
                            />
                            { manageButton }
                            <div className="change-layout-border-background right-page" style={styleBookSafeZone}>
                                <ChangeStylePage positionOfPage='flap' display='main-page'/>
                            </div>
						</div>
                    </div>
                );
                break;
            default:
                break;
        }

        return coverElement;
    }

    onChangeCoverSection(coverSection) {
        let amountPage = Object.keys(this.props.pages).length;
        let pageNumber = -1;
        switch (coverSection) {
            case COVER_SECTION.BACK_COVER:
                pageNumber = amountPage + 2;
                break;
            case COVER_SECTION.SPINE:
                pageNumber = -2;
                break;
            case COVER_SECTION.FRONT_FLAP:
            case COVER_SECTION.FRONT_FLAP:
                pageNumber = -3;
                break;
            default: pageNumber = -1;
        }

        this.props.onClickChoosePage(pageNumber);
    }

    onChangeCoverType(coverType) {
        this.props.onSelectCoverType(coverType);
    }

    renderCoverTypeSelector(coverSection, coverType) {
        return <div className="design-cover-box">
            <CoverTypeSelector
                coverSection={coverSection}
                coverType={coverType}
                onChangeCoverSection={this.onChangeCoverSection.bind(this)}
                onChangeCoverType={this.onChangeCoverType.bind(this)}/>
        </div>;
    }

    renderCover(coverSection, coverType) {
        return (
            <div className="book-cover-design" >
                {
                    this.renderCoverTypeSelector(coverSection, coverType)
                }
                {
                    this.renderCoverByType(coverSection, coverType)
                }
            </div>
        );
    }

    renderTwoPages(currentPage, amountPage) {
        let leftPageIsNotPage = currentPage === 0;
        let rightPageIsNotPage = currentPage + 1 > amountPage;

        const { isShowBookSafeZone, onToggleShowBookSafeZone, zoomValue } = this.props;
        const classShowSafeZone = isShowBookSafeZone ? 'show-book-safe-zone' : '';

        let { sizePage, numberScale } = this.getSizePageAndNumberScale();
        let styleDoublePages = { transform: 'scale('+ numberScale*zoomValue/100 + ')' };
        let unScaleNumber = 1/(numberScale*zoomValue/100);
        let styleBookSafeZone = { transform: 'scale('+ unScaleNumber + ')' };
        

        return (
            <div className="book">
                <ScrollArea
                    speed={1}
                    className="area"
                    smoothScrolling={true}
                    contentClassName="content"
                >
                    <div className="book-safe-zone-double-pages" style={styleDoublePages}>
                        <div className="book-safe-zone" style={styleBookSafeZone}>
                            <Checkbox checked={isShowBookSafeZone} onChange={onToggleShowBookSafeZone} />
                            <span className="book-safe-zone-bold-style">{' ' + LocaleUtils.instance.translate('label.show_safe_zones_title') + ': '}</span>
                            <span>{LocaleUtils.instance.translate('label.show_safe_zones_message') + ' '}</span>
                            <a className="book-safe-zone-what-is-that" href={LocaleUtils.instance.translate('urls.safeZoneInfo')} target="_blank">
                                {LocaleUtils.instance.translate('label.what_is_this')}
                            </a>
                        </div>
                        <div className={'book-safe-zone-border ' + classShowSafeZone}>
                            <Page
                                unScaleNumber={unScaleNumber}
                                idPage='pageBookLeft'
                                numPage={currentPage}
                                totalPage={amountPage}
                                isPage={!leftPageIsNotPage}
                                cover={leftPageIsNotPage ? this.getCover(COVER_SECTION.FRONT_FLAP) : null}
                                theme={this.getThemeForBook()}
                                layout={leftPageIsNotPage ? null : this.getLayoutOfPage(currentPage - 1)}
                                sizePage={sizePage}
                                goToPreviousPage={this.props.goToPreviousPage}
                                addPageInBook={this.props.addPageInBook}
                                removePageInBook={this.props.removePageInBook}
                                isShowChangeLayoutLeftPage={this.state.isShowChangeLayoutLeftPage}
                                toggleShowChangeLayoutLeftPage={this.toggleShowChangeLayoutLeftPage}
                                toggleKeyBoardEvent={this.props.toggleKeyBoardEvent}
                            />
                            <Page
                                unScaleNumber={unScaleNumber}
                                idPage='pageBookRight'
                                numPage={currentPage + 1}
                                totalPage={amountPage}
                                isPage={!rightPageIsNotPage}
                                cover={rightPageIsNotPage ? this.getCover(COVER_SECTION.BACK_FLAP) : null}
                                theme={this.getThemeForBook()}
                                layout={rightPageIsNotPage ? null : this.getLayoutOfPage(currentPage)}
                                sizePage={sizePage}
                                goToNextPage={this.props.goToNextPage}
                                addPageInBook={this.props.addPageInBook}
                                removePageInBook={this.props.removePageInBook}
                                isShowChangeLayoutRightPage={this.state.isShowChangeLayoutRightPage}
                                toggleShowChangeLayoutRightPage={this.toggleShowChangeLayoutRightPage}
                                toggleKeyBoardEvent={this.props.toggleKeyBoardEvent}
                            />
                        </div>
                        { this.renderManagePagesButton() }
                    </div>
                </ScrollArea>
            </div>
        );
    }

    renderBook() {
        let { currentPage, covers, amountPage } = this.props;
        let { coverInfo } = covers;
        let coverType = coverInfo.type ? coverInfo.type : COVER_TYPE.HARDCOVER_IMAGEWRAP;

        if (currentPage < 0) {
            let coverSection = COVER_SECTION.FRONT_COVER;
            if (currentPage === -2) coverSection = COVER_SECTION.SPINE;
            if (currentPage === -3 || currentPage === -4) coverSection = COVER_SECTION.FRONT_FLAP;

            return this.renderCover(coverSection, coverType);
        }
        if (currentPage > amountPage) {
            return this.renderCover(COVER_SECTION.BACK_COVER, coverType);
        }

        return this.renderTwoPages(currentPage, amountPage);
    }

    render() {
        let pageMode = this.props.isMinimizeFooter ? 'book-view-zone mini-mode' : 'book-view-zone extend-mode';
        return (
            <div className="book-design-content-zone" ref="book_design_content_zone">
                <Pagination
                    currentPage={this.props.currentPage}
                    amountPage={this.props.amountPage}
                    onClickChoosePage={this.props.onClickChoosePage}
                    {...this.props}
                />
                <div className={pageMode} ref="book_design_zone">
                    {
                        this.renderBook()
                    }
                </div>
            </div>
        );
    }
}

DesignPage.propTypes = {
    isMinimizeFooter: PropTypes.bool,
    onClickChoosePage: PropTypes.func,
    goToNextPage: PropTypes.func,
    goToPreviousPage: PropTypes.func,
    addPageInBook: PropTypes.func,
    removePageInBook: PropTypes.func,
    goToManagePages: PropTypes.func,
    zoomValue: PropTypes.number
}

const onSelectCoverType = (dispach, coverType) => {
    dispach(setCoverType(coverType));
}

const handleCloseShowHelpBubble = (dispatch) => {
    dispatch(toggleShowHelpBubble(false));
};


const mapStateToProps = (state) => {
    const { appStatus, project, themes, coverLayouts } = state;
    const { paginationStatus, bookDesignHeaderStatus } = appStatus;
    const { isShowHelpBubble } = bookDesignHeaderStatus;
    const { book } = project;
    const { pages, covers } = book;
    const pastPages = pages.past.length > 0 ? pages.past[pages.past.length-1] : [];

    return {
        currentPage: paginationStatus.currentPage,
        amountPage: book.pages.present.length,
        project,
        book,
        covers,
        pages:pages.present,
        pastPages,
        themes,
        coverLayouts,
        isShowHelpBubble
    };
};

const mapDispatchToProps = (dispatch) => ({
    onSelectCoverType: (coverType)=>onSelectCoverType(dispatch,coverType),
    closeShowHelpBubble: () => handleCloseShowHelpBubble(dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DesignPage);
