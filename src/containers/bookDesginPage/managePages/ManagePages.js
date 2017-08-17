import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './ManagePages.css';
import WholeMiniPages from './wholeMiniPage/WholeMiniPages';
import MiniCover from './miniCover/MiniCover';
import LocaleUtils from './../../../utils/LocaleUtils';
import SelectAndApplyLayout from './selectAndApplyLayout/SelectAndApplyLayout';
import Tooltip  from 'rc-tooltip';
import IconButton from './../../../components/materials/iconButton/IconButton';
import {
    toggleShowHelpBubble
} from './../../../actions/appStatusActions/BookDesignHeaderStatusActions';
import { trimSizes, bookFormats, FIELD_TYPE, COVER_SECTION, COVER_TYPE } from './../../../constants/Constants';
// import ScrollArea from 'react-scrollbar';
import ScrollArea from './../../../components/materials/scrollBarCustom/ScrollArea';

class ManagePages extends Component {

    renderAllPages() {
        const { amountPage, goToEditPage, addPageInBook, onClickChoosePage, isShowHelpBubble } = this.props;
        let wholePages = [];
        let pages;
        for (let numPage = 0; numPage < amountPage + 2; numPage = numPage + 2) {
            if (numPage === 12) {
                pages = <Tooltip placement="top" prefixCls="show-help-tooltip-custom-manage-page" visible={isShowHelpBubble}
                         align={{
                             offset: [0, -20],
                         }}
                         overlay={<div><IconButton type={IconButton.type.closeShowHelp} onClick={this.props.closeShowHelpBubble}/>
                             <div className="show-help-tooltip-custom-manage-page-text">{LocaleUtils.instance.translate("helpbubbles.zoom_page")}</div>
                         </div>}>
                <WholeMiniPages
                    key={numPage}
                    numPage={numPage}
                    goToEditPage={goToEditPage}
                    addPageInBook={addPageInBook}
                    onClickChoosePage={onClickChoosePage}
                /></Tooltip>;
            } else {
                pages = <WholeMiniPages
                    key={numPage}
                    numPage={numPage}
                    goToEditPage={goToEditPage}
                    addPageInBook={addPageInBook}
                    onClickChoosePage={onClickChoosePage}
                />;
            }
            wholePages.push(pages);
        }
        return wholePages;
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
        } else if (coverSection===COVER_SECTION.SPINE) {
            numberPage = -2;
            layouts = allCoverLayouts['SpineLayout'];
        } else if (coverSection===COVER_SECTION.FRONT_FLAP) {
            numberPage = -3;
            layouts = allCoverLayouts['FlapLayout'];
        } else if (coverSection===COVER_SECTION.BACK_FLAP) {
            numberPage = -4;
            layouts = allCoverLayouts['FlapLayout'];
        }


        for (let i in layouts) {
            let layout = layouts[i];
            if (layout['$']['group_id'] === layoutGroupId) {
                console.log("coverlayout::::", layout)
                let newLayout = this.parseLayoutToElementArray(layout, coverData, numberPage, layoutGroupId);
                return newLayout;
            }
        }

        return {};
    }

    parseLayoutToElementArray(layout, pageData, numberPage, page_layout_id) {
        let layoutPage = [];

        for (let key in layout) {
            if (key === FIELD_TYPE.IMAGE) {
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

        let layoutPageResult = this.mapDataToLayout(layoutPage, pageData);

        return layoutPageResult;
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

    calculatorSize(realWidth, realHeight) {
        const height = 100;
        let ratio = height/realHeight;
        let width = realWidth * ratio;

        return {
            width,
            height,
            ratio
        }
    }

    render() {
        const { isMinimizeFooter, covers } = this.props;
        let { coverInfo } = covers;
        let allPages = this.renderAllPages();
        let pageMode = isMinimizeFooter ? 'book-design-manage-pages mini-mode' : 'book-design-manage-pages extend-mode';
        let { realWidth, realHeight } = this.getFormatPage();
        let miniWidth = this.calculatorSize(realWidth, realHeight).width;
        let sizePage = {
            width: realWidth,
            height: realHeight
        }
        let coverType = coverInfo.type ? coverInfo.type : COVER_TYPE.HARDCOVER_IMAGEWRAP;
        return (
            <div className={pageMode}>
                <SelectAndApplyLayout />
                <div className="manage-pages-controller">
                </div>
                <div className="manage-pages-present-all-pages">
                    <ScrollArea
                        speed={0.6}
                        className="area"
                        smoothScrolling={true}
                        contentClassName="content"
                    >
                        <div className="whole-mini-pages" >
                            <MiniCover
                                coverType={coverType}
                                coverSection={COVER_SECTION.FRONT_COVER}
                                cover={this.getCover(COVER_SECTION.FRONT_COVER)}
                                theme={this.getThemeForBook()}
                                layout={this.getLayoutOfCover(COVER_SECTION.FRONT_COVER)}
                                sizePage={sizePage}
                            />
                        </div>
                        {allPages}
                        <div className="whole-mini-pages" style={{width: miniWidth*2}} >
                            <MiniCover
                                coverType={coverType}
                                coverSection={COVER_SECTION.BACK_COVER}
                                cover={this.getCover(COVER_SECTION.BACK_COVER)}
                                theme={this.getThemeForBook()}
                                layout={this.getLayoutOfCover(COVER_SECTION.BACK_COVER)}
                                sizePage={sizePage}
                            />
                        </div>
                    </ScrollArea>
                </div>
            </div>
        );
    }
}

ManagePages.propTypes = {
    isMinimizeFooter: PropTypes.bool,
    amountPage: PropTypes.number,
    goToEditPage: PropTypes.func,
    addPageInBook: PropTypes.func,
    onClickChoosePage: PropTypes.func,
}

const mapStateToProps = (state) => {
    let { appStatus, project, themes, coverLayouts } = state;
    const { book } = project;
    const { covers } = book;
    let { bookDesignHeaderStatus } = appStatus;
    let { isShowHelpBubble } = bookDesignHeaderStatus;

    return {isShowHelpBubble, themes, coverLayouts, covers, book};
};

const handleCloseShowHelpBubble = (dispatch) => {
    dispatch(toggleShowHelpBubble(false));
};

const mapDispatchToProps = (dispatch) => ({
    closeShowHelpBubble: () => handleCloseShowHelpBubble(dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ManagePages);
