import React from 'react';
import { connect } from 'react-redux';

import './PreviewPages.css';
import LocaleUtils from './../../utils/LocaleUtils';
import Button from './../../components/materials/button/Button';
import PreviewPage from './previewPage/PreviewPage';
import Pagination from './../../components/bookDesign/pagination/Pagination';
import Cover from './../../containers/bookDesginPage/cover/Cover';
import Spine from './../../containers/bookDesginPage/spine/Spine';
import Flap from './../../containers/bookDesginPage/flap/Flap';
import Assets from './../../assets/Assets';

import { trimSizes, bookFormats, FIELD_TYPE, COVER_SECTION, COVER_TYPE } from './../../constants/Constants'
import { selectPageOnPageTab } from './../../actions/appStatusActions/PaginationStatusActions';

class PreviewPages extends React.Component {
    constructor(props) {
        super(props);

        this.handleKeyDown = this.handleKeyDown.bind(this);        
        this.goToNextPage = this.goToNextPage.bind(this);;
        this.goToPreviousPage = this.goToPreviousPage.bind(this);
        this.goToCover = this.goToCover.bind(this);
    }

    addKeyboardPageEvent() {
        document.addEventListener('keydown', this.handleKeyDown);
    }

    removeKeyboardPageEvent() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    componentDidMount() {
        this.addKeyboardPageEvent();
    }

    componentWillUnmount() {
        this.removeKeyboardPageEvent();
    }

    componentDidUpdate() {
        if (this.props.isShowingPopup) {
            this.removeKeyboardPageEvent();
        } else {
            this.addKeyboardPageEvent();
        }
    }

    handleKeyDown(e) {
        switch (e.keyCode) {
            case 37:
                this.goToPreviousPage();
                break;
            case 39:
                this.goToNextPage();
                break;
            default:
                break;
        }
    }
    
    goToPreviousPage() {
        let { currentPage, onClickChoosePage } = this.props;
        let numPage = currentPage;

        if (currentPage > 0) {
            numPage = currentPage - 2;
        } else if (currentPage === 0) {
            numPage = currentPage - 1;
        }
        onClickChoosePage(numPage);
    }

    goToNextPage() {
        let { amountPage, currentPage, onClickChoosePage } = this.props;
        let numPage = currentPage;

        if (currentPage === -1) {
            numPage = currentPage + 1;
        } else if (currentPage >= 0 && currentPage < amountPage + 2) {
            numPage = currentPage + 2;
        }
        onClickChoosePage(numPage);
    }

    goToCover(coverSection) {
        let amountPage = this.props.amountPage;
        let pageNum = -1;
        switch (coverSection) {
            case COVER_SECTION.BACK_COVER:
                pageNum = amountPage + 2;
                break;
            case COVER_SECTION.SPINE:
                pageNum = -2;
                break;
            case COVER_SECTION.FRONT_FLAP:
                pageNum = -3;
                break;
            case COVER_SECTION.BACK_FLAP:
                pageNum = -4;    
                break;
            default:
                break;
        }

        this.props.onClickChoosePage(pageNum);
    }

    getSizeBookDesign() {
        return {
            heightBook: window.innerHeight - 262, //this.props.isMinimizeFooter ? window.innerHeight - 262 : window.innerHeight - 462,
            widthBook: window.innerWidth
        }
    }

    getFormatPage() {
        let type = {
            ratioWidth: 1,
            ratioHeight: 1,
            realWidth: 600,
            realHeight: 600
        };
        for (let key in trimSizes) {
            if (bookFormats[key] === this.props.book.bookInfo.format) {
                let object = trimSizes[key];
                type.realHeight = object.height;
                type.realWidth = object.width;
                let ratio = object.sizeDescription;
                let ratioStringArr = ratio.split('x');
                type.ratioWidth = ratioStringArr[0];
                type.ratioHeight = ratioStringArr[1];
            }
        }
        return type;
    }

    parseLayoutToElementArray(layout, pageData, numPage, page_layout_id) {
        let layoutPage = [];

        for (let key in layout) {
            if (key === FIELD_TYPE.LOCK_IMAGE) {
                for (let index in layout[key]) {
                    let field = layout[key][index].$;
                    let element = {};

                    element.type = FIELD_TYPE.IMAGE;
                    element.id = field.id;
                    element.idPage = numPage;
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
                    element.idPage = numPage;
                    element.page_layout_id = page_layout_id;
                    element.x = parseInt(field.x, 10);
                    element.y = parseInt(field.y, 10);
                    element.width = parseInt(field.width, 10);
                    element.height = parseInt(field.height, 10);
                    element.image = '';

                    layoutPage.push(element);
                }
            } else if (key === FIELD_TYPE.TEXT) {
                for (let index in layout[key]) {
                    let field = layout[key][index].$;
                    let element = {};

                    element.type = key;
                    element.id = field.id;
                    element.idPage = numPage;
                    element.page_layout_id = page_layout_id;
                    element.x = parseInt(field.x, 10);
                    element.y = parseInt(field.y, 10);
                    element.width = parseInt(field.width, 10);
                    element.height = parseInt(field.height, 10);
                    element.style_id = field.style_id;
                    element.binding = field.binding;
                    element.two_way = field.two_way;

                    layoutPage.push(element);
                }
            }
        }

        for (let key in pageData) {
            if (key === FIELD_TYPE.IMAGE) {
                for (let childKey in pageData[key]) {
                    let container = pageData[key][childKey];
                    for (let i in layoutPage) {
                        if (container.hasOwnProperty('$') && container.$.ref_id === layoutPage[i].id) {
                            layoutPage[i].image = container['Image'];
                        }
                    }
                }
            } else if (key === FIELD_TYPE.TEXT) {
                for (let childKey in pageData[key]) {
                    let container = pageData[key][childKey];
                    for (let i in layoutPage) {
                        if (container.hasOwnProperty('$') && container.$.ref_id === layoutPage[i].id) {
                            layoutPage[i].text = container['parsedText'];
                        }
                    }
                }
            }
        }
        return layoutPage;
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
        } else if (coverSection === COVER_SECTION.FRONT_FLAP || coverSection === COVER_SECTION.BACK_FLAP) {
            numberPage = coverSection === COVER_SECTION.FRONT_FLAP ? -3 : -4;
            layouts = allCoverLayouts['FlapLayout'];
        }
         
        for (let i in layouts) {
            let layout = layouts[i];
            if (layout.$.group_id === layoutGroupId && layout.$.cover_type === coverType) {
                let newLayout = this.parseLayoutToElementArray(layout, coverData, numberPage, layoutGroupId);
                return newLayout;
            }
        }

        return {};
    }

    getLayoutOfPage(numPage) {
        let layout = {}
        let { book, pages } = this.props;
        let { layouts } = book;
        let pageData = pages.present[numPage];
        let { page_layout_id } = pageData;
        let layoutArray = layouts.PageLayout;

        for (let key in layoutArray) {
            if (layoutArray[key].$.id === page_layout_id) {
                layout = layoutArray[key];
                break;
            }
        }
        let newLayout = this.parseLayoutToElementArray(layout, pageData, numPage, page_layout_id);
        return newLayout;
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

    calculatorSize(heightBook, widthBook, ratioWidth, ratioHeight) {
        var heightPage = heightBook ;
        var widthPage = heightPage / ratioHeight * ratioWidth;
        
        if (widthPage * 2 > widthBook) {
            widthPage = (widthBook / 2) ;
            heightPage = widthPage / ratioWidth * ratioHeight;
        }

        return {
            width: widthPage,
            height: heightPage
        }
    }

    calculatorScale() {
        let { heightBook } = this.getSizeBookDesign();
        let {realHeight } = this.getFormatPage();

        let numberScale = (heightBook - window.innerHeight*0.08) / realHeight;
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

    renderFlap(isPreview, hideContent, coverType, coverSection, sizePage) {
        return (
            <Flap
                isPreview={isPreview}
                hideContent={hideContent}
                trimSize={this.getCoverTrimsBy(coverType)}
                coverSection={coverSection}
                cover={this.getCover(coverSection)}
                theme={this.getThemeForBook()}
                layout={this.getLayoutOfCover(coverSection, coverType)}
                sizePage={sizePage}
            />
        );
    }

    renderCoverBySection(coverSection) {
        let { sizePage } = this.getSizePageAndNumberScale();
        let { coverInfo } = this.props.covers;
        let coverType = coverInfo.type ? coverInfo.type : COVER_TYPE.HARDCOVER_IMAGEWRAP;
        let coverElement = null;

        switch(coverSection) {
            case COVER_SECTION.FRONT_COVER:
            case COVER_SECTION.BACK_COVER:
                let arrowEvent = coverSection === COVER_SECTION.FRONT_COVER ? this.goToNextPage : this.goToPreviousPage;
                coverElement = (
                    <div className="preview-book-cover center-zone">
                        <Cover
                            trimSize={this.getCoverTrimsBy(coverType)}
                            isPreview={true}
                            coverType={coverType}
                            coverSection={coverSection}
                            cover={this.getCover(coverSection)}
                            theme={this.getThemeForBook()}
                            layout={this.getLayoutOfCover(coverSection, coverType)}
                            sizePage={sizePage}
                            arrowEvent={arrowEvent}
                        />
                    </div>
                );
                break;
            case COVER_SECTION.SPINE:
                coverElement = (
                    <div className="preview-book-cover center-zone">
                        <Spine
                            isPreview={true}
                            trimSize={this.getCoverTrimsBy(coverType)}
                            cover={this.getCover(coverSection)}
                            theme={this.getThemeForBook()}
                            layout={this.getLayoutOfCover(coverSection, coverType)}
                            sizePage={sizePage}
                        />
                    </div>
                );
                break;
            case COVER_SECTION.FRONT_FLAP:
                coverElement = (
                    <div className="preview-book-cover center-zone">
                        {this.renderFlap(true, false, coverType, COVER_SECTION.FRONT_FLAP, sizePage)}
                        {this.renderFlap(true, true, coverType, COVER_SECTION.BACK_FLAP, sizePage)}
                    </div>
                );
                break;
            case COVER_SECTION.BACK_FLAP:  
                coverElement = (
                    <div className="preview-book-cover center-zone">
                        {this.renderFlap(true, true, coverType, COVER_SECTION.FRONT_FLAP, sizePage)}
                        {this.renderFlap(true, false, coverType, COVER_SECTION.BACK_FLAP, sizePage)}
                    </div>
                );
                break;
            default:  
                break; 
        }

        return coverElement;
    }

    renderCoverTitle(coverType) {
        let cover = 'imageWrap';
        if (coverType === COVER_TYPE.SOFTCOVER) {
            cover = 'softCover';
        } else if (coverType === COVER_TYPE.HARDCOVER_DUST_JACKET) {
            cover = 'dustJacket';
        }
        
        return (
            <div className="preview-book-cover cover-title">
                {LocaleUtils.instance.translate(`coverCreator.${cover}`)}
            </div>
        );
    }

    renderButton(pageId, className, text, onClick) {
        let btnActive = pageId === this.props.currentPage ? ' btn-active' : '';
        return (
            <Button
                className={className + btnActive}
                text={LocaleUtils.instance.translate(text)}
                onClick={onClick}
            />
        );
    }

    renderCoverButtons(coverType) {
        const { amountPage } = this.props;
        const isUsingDustJacketCover = coverType === COVER_TYPE.HARDCOVER_DUST_JACKET;

        return (
            <div className="preview-book-cover cover-buttons">
                {isUsingDustJacketCover && this.renderButton(-3, ' no-rd-l', 'label.front_flap', () => this.goToCover(COVER_SECTION.FRONT_FLAP))}
                {this.renderButton(-1, ' no-rd-l', 'label.front_cover', () => this.goToCover(COVER_SECTION.FRONT_COVER))}
                {this.renderButton(-2, ' no-rd-c', 'label.spine', () => this.goToCover(COVER_SECTION.SPINE))}
                {this.renderButton(amountPage + 2, ' no-rd-r', 'label.back_cover', () => this.goToCover(COVER_SECTION.BACK_COVER))}
                {isUsingDustJacketCover && this.renderButton(-4, ' no-rd-r', 'label.back_flap', () => this.goToCover(COVER_SECTION.BACK_FLAP))}
            </div>
        );
    }

    renderCover(coverSection, coverType) {
        return (
            <div className="preview-book-cover" >
                {this.renderCoverTitle(coverType)}
                <div className="cover-zone">
                    {this.renderCoverBySection(coverSection)}
                </div>
                {this.renderCoverButtons(coverType)}
            </div>
        );
    }

    renderPages() {
        const { currentPage, amountPage, covers } = this.props;
        let leftPageIsNotPage = currentPage === 0;
        let rightPageIsNotPage = currentPage + 1 > amountPage;
        let { sizePage } = this.getSizePageAndNumberScale();

        if (currentPage < 0) {
            let coverSection = COVER_SECTION.FRONT_COVER;
            if (currentPage === -2) coverSection = COVER_SECTION.SPINE;
            else if (currentPage === -3) coverSection = COVER_SECTION.FRONT_FLAP;
            else if (currentPage === -4) coverSection = COVER_SECTION.BACK_FLAP;

            return this.renderCover(coverSection, covers.coverInfo.type);
        } else if (currentPage > amountPage) {
            return this.renderCover(COVER_SECTION.BACK_COVER, covers.coverInfo.type);
        }

        return (
            <div className="preview-pages">
                <PreviewPage
                    numPage={currentPage}
                    isPage={!leftPageIsNotPage}
                    cover={leftPageIsNotPage ? this.getCover(COVER_SECTION.FRONT_FLAP) : null}
                    theme={this.getThemeForBook()}
                    layout={leftPageIsNotPage ? null : this.getLayoutOfPage(currentPage - 1)}
                    formatPage={this.getFormatPage()}
                    sizeBookDesign={this.getSizeBookDesign()}
                    goToPreviousPage={this.goToPreviousPage}
                    sizePage={sizePage}
                />
                <PreviewPage
                    numPage={currentPage + 1}
                    isPage={!rightPageIsNotPage}
                    cover={rightPageIsNotPage ? this.getCover(COVER_SECTION.BACK_FLAP) : null}
                    theme={this.getThemeForBook()}
                    layout={rightPageIsNotPage ? null : this.getLayoutOfPage(currentPage)}
                    formatPage={this.getFormatPage()}
                    sizeBookDesign={this.getSizeBookDesign()}
                    goToNextPage={this.goToNextPage}
                    sizePage={sizePage}
                />
            </div>
        );
    }

    render() {
        let { sizePage, numberScale } = this.getSizePageAndNumberScale();
        let stylePreviewBook = { transform: 'scale('+numberScale+')' }
        return (
            <div className="preview-book-content">
                <Pagination
                    currentPage={this.props.currentPage}
                    amountPage={this.props.amountPage}
                    onClickChoosePage={this.props.onClickChoosePage}
                />
                <div className="preview-book-content-pages" style={stylePreviewBook}>
                    {this.renderPages()}
                </div>
                
            </div>
        );
    }
}

const onClickChoosePage = (dispatch, numPage) => {
    dispatch(selectPageOnPageTab(numPage));
};

const mapStateToProps = (state) => {
    const { appStatus, project, themes, coverLayouts } = state;
    const { paginationStatus, rootStatus } = appStatus;
    const { book } = project;
    const { pages, covers } = book;
    const { isShowingPopup } = rootStatus;

    return {
        currentPage: paginationStatus.currentPage,
        amountPage: book.pages.present.length,
        book,
        covers,
        pages,
        themes,
        coverLayouts,
        isShowingPopup
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        onClickChoosePage: (numPage) => onClickChoosePage(dispatch, numPage),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PreviewPages);