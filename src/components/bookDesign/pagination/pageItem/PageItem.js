import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Tooltip from 'rc-tooltip';

import './PageItem.css';
import 'rc-tooltip/assets/bootstrap_white.css';
import Assets from './../../../../assets/Assets';
import LocaleUtils from './../../../../utils/LocaleUtils';
import MiniPage from './../../../../containers/bookDesginPage/managePages/miniPage/MiniPage';
import MiniCover from './../../../../containers/bookDesginPage/managePages/miniCover/MiniCover';
import { trimSizes, bookFormats, FIELD_TYPE, COVER_SECTION, COVER_TYPE } from './../../../../constants/Constants';

class PageItem extends Component {

    renderPageItem(pageType, currentChoosingPage, numPage, isEmptyPage, handleOnClick) {
        const pageActive = {
            background: "rgba(50 , 200, 255, 1)"
        }
        const cellActive = {
            background: "white",
            color: "rgba(50 , 200, 255, 1)"
        }
        let isChoosing = currentChoosingPage === numPage;

        if (pageType === PageItem.pageTypes.cover) {
            return (
                <div className='page-item' style={isChoosing ? pageActive : null} onClick={handleOnClick} >
                    <div className='cover-item-cell' style={isChoosing ? cellActive : null}>
                        <p className='text-cover'>{LocaleUtils.instance.translate('label.cover_abbreviation')}</p>
                    </div>
                </div>
            );
        }

        return (
            <div className='page-item' style={isChoosing ? pageActive : null} onClick={handleOnClick}>
                <div className='left-item item-cell' style={isChoosing ? cellActive : null}>
                    <p className='text-page-number'>
                        {numPage === 0 ? '' : numPage}
                    </p>
                </div>
                <div className='right-item item-cell' style={isChoosing ? cellActive : null}>
                    <p className='text-page-number'>
                        {(numPage !== 0 && isEmptyPage) ? '' : numPage + 1}
                    </p>
                </div>
            </div>
        );
    }

    handleOnClick() {
        let { numPage, currentChoosingPage, onClick} = this.props;
        if (currentChoosingPage !== numPage) {
            onClick(numPage);
        }
    };

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

    getLayoutOfCover(coverSection) {
        let { covers, coverLayouts } = this.props;
        let allCoverLayouts = coverLayouts.CoverLayouts
        let coverData = covers[coverSection];
        let layoutGroupId = coverData.layout_group_id;
        let layouts = [];
        let numberPage = -1;

        if (coverSection===COVER_SECTION.FRONT_COVER || coverSection===COVER_SECTION.BACK_COVER) {
            layouts = allCoverLayouts['CoverLayout'];
            numberPage = coverSection === COVER_SECTION.FRONT_COVER ? -1 : 99999;
        }

        for (let i in layouts) {
            let layout = layouts[i];
            if (layout['$']['group_id'] === layoutGroupId) {
                let newLayout = this.parseLayoutToElementArray(layout, coverData, numberPage, layoutGroupId);
                return newLayout;
            }
        }

        return {};
    }

    getLayoutOfPage(numberPage) {
        let { pages, layouts } = this.props.book;
        let layout = {}
        let pageData = pages.present[numberPage];
        let { page_layout_id } = pageData;
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

                    layoutPage.push(element);
                }
            }
        }

        for (let key in pageData) {
            if (key === FIELD_TYPE.IMAGE) {
                for (let childKey in pageData[key]) {
                    for (let i in layoutPage) {
                        if (pageData[key][childKey].hasOwnProperty('$') && pageData[key][childKey].$.ref_id === layoutPage[i].id) {
                            layoutPage[i].image = pageData[key][childKey]['Image'];
                        }
                    }
                }
            } else if (key === FIELD_TYPE.TEXT) {
                for (let childKey in pageData[key]) {
                    for (let i in layoutPage) {
                        if (pageData[key][childKey].hasOwnProperty('$') && pageData[key][childKey].$.ref_id === layoutPage[i].id) {
                            layoutPage[i].text = pageData[key][childKey]['parsedText'];
                        }
                    }
                }
            }
        }

        return layoutPage;
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

    getCover(coverSection) {
        let { covers } = this.props.book;
        for (let key in covers) {
            if (coverSection === key) {
                return covers[key];
            }
        }
        return covers[0];
    }

    renderTwoPages(numPage) {
        const { amountPage } = this.props.paginationStatus;
        let leftPageIsNotPage = numPage === 0;
        let rightPageIsNotPage = numPage + 1 > amountPage;
        return (
            <div className="whole-mini-pages-present">
                <MiniPage
                    isTooltipMode={true}
                    numPage={numPage}
                    isPage={!leftPageIsNotPage}
                    cover={leftPageIsNotPage ? this.getCover(COVER_SECTION.FRONT_FLAP) : null}
                    theme={this.getThemeForBook()}
                    layout={leftPageIsNotPage ? null : this.getLayoutOfPage(numPage - 1)}
                    formatPage={this.getFormatPage()}
                />
                <MiniPage
                    isTooltipMode={true}
                    numPage={numPage + 1}
                    isPage={!rightPageIsNotPage}
                    cover={rightPageIsNotPage ? this.getCover(COVER_SECTION.BACK_FLAP) : null}
                    theme={this.getThemeForBook()}
                    layout={rightPageIsNotPage ? null : this.getLayoutOfPage(numPage)}
                    formatPage={this.getFormatPage()}
                />
            </div>
        );
    }

    renderCover(coverSection) {
        let { realWidth, realHeight } = this.getFormatPage();
        let sizePage = {
            width: realWidth,
            height: realHeight
        };
        let coverInfo = this.props.book.covers.coverInfo;
        let coverType = coverInfo.type ? coverInfo.type : COVER_TYPE.HARDCOVER_IMAGEWRAP;
        let cover = this.getCover(coverSection);
        let theme= this.getThemeForBook();
        let layout = this.getLayoutOfCover(coverSection);
        return (
            <div className="whole-mini-pages-present">
                <MiniCover
                    isTooltipMode={true}
                    coverType={coverType}
                    coverSection={coverSection}
                    cover={cover}
                    theme={theme}
                    layout={layout}
                    sizePage={sizePage}
                /> 
            </div>
        );
    }

    render() {
        let { numPage, pageType, isEmptyPage, currentChoosingPage, onClick} = this.props;
        
        let element = pageType !== 'cover' ? this.renderTwoPages(numPage) : numPage < 0 ? this.renderCover(COVER_SECTION.FRONT_COVER) : this.renderCover(COVER_SECTION.BACK_COVER);
        return (
            <Tooltip
                placement="bottom"
                overlay={element}
                arrowContent={<div className="rc-tooltip-arrow-inner" />}
            >
                {
                    this.renderPageItem(pageType, currentChoosingPage, numPage, isEmptyPage, this.handleOnClick.bind(this))
                }
            </Tooltip>
        );
    }
}

PageItem.pageTypes = {
    page: 'page',
    cover: 'cover'
};

PageItem.propTypes = {
    numPage: PropTypes.number,
    pageType: PropTypes.string,
    isEmptyPage: PropTypes.bool,
    currentChoosingPage: PropTypes.number,
    onClick: PropTypes.func
};

const mapStateToProps = (state) => {
    const { appStatus, project, themes, coverLayouts } = state;
    const { paginationStatus, rootStatus, bookDesignHeaderStatus } = appStatus;
    const { book } = project;
    const { covers } = book;
    const { amountPage } = paginationStatus;
    return { paginationStatus, book, covers, coverLayouts, themes, amountPage };
};

const mapDispatchToProps = (dispatch) => ({
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PageItem);
