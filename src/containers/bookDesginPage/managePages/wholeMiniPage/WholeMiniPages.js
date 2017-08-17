import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Tooltip  from 'rc-tooltip';

import './WholeMiniPages.css';
import MiniPage from './../miniPage/MiniPage';
import Assets from './../../../../assets/Assets';
import Config from './../../../../config/Config';
import Popup from './../../../../components/popup/Popup';
import LocaleUtils from './../../../../utils/LocaleUtils';
import Button from './../../../../components/materials/button/Button';
import IconButton from './../../../../components/materials/iconButton/IconButton';
import AddPageIcon from './../../../../components/bookDesign/page/addpage/AddPageIcon';
import { trimSizes, bookFormats, FIELD_TYPE, COVER_SECTION } from './../../../../constants/Constants';
import { toggleShowHelpBubble } from './../../../../actions/appStatusActions/BookDesignHeaderStatusActions';
import { deletePagesListInBook, deletePagesContentInBook } from './../../../../actions/projectActions/bookActions/pagesActions/PagesActions';
import {
    addPagesIntoPageChoosingList,
    removePagesOuttoPageChoosingList,
    resetPagesChoosing
} from './../../../../actions/appStatusActions/RootStatusActions';

class WholeMiniPages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isInsideMiniPage: false,
            isShowDeletePagesPopup: false,
            leftMiniPageIsClicked: this.checkPageIsChoosing(props.pagesChoosingList, props.numPage),
            rightMiniPageIsClicked: this.checkPageIsChoosing(props.pagesChoosingList, props.numPage + 1),
            position: {
                x: 0,
                y: 0
            }
        };
        this.toggleShowingEditPageBtn = this.toggleShowingEditPageBtn.bind(this);
        this.closeShowingEditPageBtn = this.closeShowingEditPageBtn.bind(this);
        this.addPageAtPosition = this.addPageAtPosition.bind(this);
        this.editPage = this.editPage.bind(this);
        this.onLeftMiniPageClick = this.onLeftMiniPageClick.bind(this);
        this.onRightMiniPageClick = this.onRightMiniPageClick.bind(this);
        this.checkPageIsChoosing = this.checkPageIsChoosing.bind(this);
        this.toggleConfirmDeletePagesContentPopup = this.toggleConfirmDeletePagesContentPopup.bind(this);
        this.agreeDeletePagesContent = this.agreeDeletePagesContent.bind(this);
        this.deletePagesList = this.deletePagesList.bind(this);
        this.checkingPagesHaveContent = this.checkingPagesHaveContent.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { numPage } = this.props;
        this.setState({
            leftMiniPageIsClicked: (nextProps.pagesChoosingList.indexOf(numPage) >= 0),
            rightMiniPageIsClicked: (nextProps.pagesChoosingList.indexOf(numPage + 1) >= 0)
        });
    }

    checkPageIsChoosing(pagesChoosingList, numPage) {
        if (pagesChoosingList.length === 0) {
            return false;
        }

        for (let index in pagesChoosingList) {
            if (pagesChoosingList[index] === numPage) {
                return true;
            }
        }

        return false;
    }

    checkPageHasContent(page) {
        for (let key in page) {
            if (key === FIELD_TYPE.IMAGE || key === FIELD_TYPE.LOCK_IMAGE || key === FIELD_TYPE.TEXT) {
                return true;
            }
        }
        return false;
    }

    checkingPagesHaveContent() {
        const { pagesChoosingList, book } = this.props;
        const pages = book.pages.present;
        for (let index in pagesChoosingList) {
            let page = pages[pagesChoosingList[index] - 1];
            if (this.checkPageHasContent(page)) {
                return true;
            }
        }

        return false;
    }

    deletePagesList() {
        const { dispatchDeletePagesList,  pagesChoosingList, paginationStatus } = this.props;

        let currentAmountPage = paginationStatus.amountPage;
        let minPagesInBook = parseInt(Config.instance.minPagesInBook, 10);
        let totalPageNeededDelete = pagesChoosingList.length;

        if (currentAmountPage === minPagesInBook) {
            if (this.checkingPagesHaveContent()) {
                this.toggleConfirmDeletePagesContentPopup()
            }
            return; //do nothing
        }

        if (totalPageNeededDelete % 2 === 0) {
            let totalPagesCanBeDelete = currentAmountPage - minPagesInBook;
            let pages = [...pagesChoosingList];
            if (totalPageNeededDelete > totalPagesCanBeDelete) {
                pages = pagesChoosingList.slice(totalPageNeededDelete - totalPagesCanBeDelete, );
            }
            dispatchDeletePagesList(pages);
        } else {
            this.toggleConfirmDeletePagesContentPopup();
        }
    }

    agreeDeletePagesContent() {
        const { dispatchDeletePagesContent, pagesChoosingList, dispatchResetPagesChoosingToEmpty } = this.props;
        if (this.state.isShowDeletePagesPopup) {
            this.toggleConfirmDeletePagesContentPopup();
            dispatchDeletePagesContent(pagesChoosingList);
            dispatchResetPagesChoosingToEmpty();
        }
    }

    toggleConfirmDeletePagesContentPopup() {
        this.setState({
            isShowDeletePagesPopup: !this.state.isShowDeletePagesPopup
        });
    }

    onLeftMiniPageClick() {
        this.setState({
            leftMiniPageIsClicked: !this.state.leftMiniPageIsClicked
        });
    }

    onRightMiniPageClick() {
        this.setState({
            rightMiniPageIsClicked: !this.state.rightMiniPageIsClicked
        });
    }

    toggleShowingEditPageBtn(e) {
        let rect = e.target.getBoundingClientRect();
        let xPos = e.pageX - rect.left - rect.width; //x position within the element
        let yPos = e.pageY - rect.top - rect.height;  //y position within the element
        this.setState({
            isShowEditPageBtn: true,
            position: {
                x: xPos,
                y: yPos
            }
        })
    }

    closeShowingEditPageBtn() {
        this.setState({
            isShowEditPageBtn: false,
        });
    }

    addPageAtPosition() {
        const { numPage, addPageInBook } = this.props;
        let position = numPage > 2 ? numPage : 2;
        addPageInBook(position);
    }

    editPage() {
        const { numPage, onClickChoosePage, goToEditPage } = this.props;
        onClickChoosePage(numPage);
        goToEditPage();
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
            else  if (key === FIELD_TYPE.IMAGE) {
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

    getSizeBookDesign() {
        return {
            heightBook: this.props.isMinimizeFooter ? window.innerHeight - 262 : window.innerHeight - 462,
            widthBook: window.innerWidth
        }
    }

    getWidthShadowCenter() {
        return window.innerWidth / 30;
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

    renderAddPageIcon(numPage) {
        const { amountPage, isShowHelpBubble } = this.props;
        if (numPage < amountPage) {
            if (numPage === 13) {
                return (
                    <Tooltip placement="bottom" prefixCls="show-help-tooltip-custom-whole-mini-page" visible={isShowHelpBubble}
                             align={{
                                 offset: [0, 10],
                             }}
                             overlay={<div><IconButton type={IconButton.type.closeShowHelp} onClick={this.props.closeShowHelpBubble}/>
                                 <div className="show-help-tooltip-custom-whole-mini-page-text">{LocaleUtils.instance.translate("helpbubbles.add_pages")}</div>
                             </div>}>
                        <div className="add-right-page">
                            <AddPageIcon onClick={this.addPageAtPosition} />
                        </div>
                    </Tooltip>
                );
            } else {
                return (
                    <div className="add-right-page">
                        <AddPageIcon onClick={this.addPageAtPosition} />
                    </div>
                );
            }
        }
    }

    renderTwoPages(numLeftPage, numRightPage, amountPage) {
        const { leftMiniPageIsClicked, rightMiniPageIsClicked } = this.state;

        let leftPageIsNotPage = numLeftPage === 0;
        let rightPageIsNotPage = numRightPage > amountPage;
        const styleWholePage = (leftMiniPageIsClicked && rightMiniPageIsClicked) ? 'whole-page-is-choosed' : null;
        return (
            <div className="whole-mini-pages-present">
                <div className={'whole-mini-pages-present ' + styleWholePage}>
                    <MiniPage
                        numPage={numLeftPage}
                        isPage={!leftPageIsNotPage}
                        cover={leftPageIsNotPage ? this.getCover(COVER_SECTION.FRONT_FLAP) : null}
                        theme={this.getThemeForBook()}
                        layout={leftPageIsNotPage ? null : this.getLayoutOfPage(numLeftPage - 1)}
                        formatPage={this.getFormatPage()}
                        sizeBookDesign={this.getSizeBookDesign()}
                        onPageClick={this.onLeftMiniPageClick}
                        isChoosed={this.state.leftMiniPageIsClicked}
                        nextPageIsChoosed={this.state.rightMiniPageIsClicked}
                        onAddPagesIntoPageChoosingList={this.props.onAddPagesIntoPageChoosingList}
                        onRemovePagesOutToPageChoosingList={this.props.onRemovePagesOutToPageChoosingList}
                        deletePagesList={this.deletePagesList}
                    />
                    <MiniPage
                        numPage={numRightPage}
                        isPage={!rightPageIsNotPage}
                        cover={rightPageIsNotPage ? this.getCover(COVER_SECTION.BACK_FLAP) : null}
                        theme={this.getThemeForBook()}
                        layout={rightPageIsNotPage ? null : this.getLayoutOfPage(numLeftPage)}
                        formatPage={this.getFormatPage()}
                        sizeBookDesign={this.getSizeBookDesign()}
                        onPageClick={this.onRightMiniPageClick}
                        isChoosed={this.state.rightMiniPageIsClicked}
                        nextPageIsChoosed={this.state.leftMiniPageIsClicked}
                        onAddPagesIntoPageChoosingList={this.props.onAddPagesIntoPageChoosingList}
                        onRemovePagesOutToPageChoosingList={this.props.onRemovePagesOutToPageChoosingList}
                        deletePagesList={this.deletePagesList}
                    />
                </div>
                {
                    styleWholePage &&
                    <span
                        className="whole-mini-page move-whole-page"
                        draggable={true}
                        onDragStart={this.onDragStartWhole.bind(this)}
                    >
                          <Tooltip placement='bottomRight' prefixCls='rc-tooltip-custom-page'
                                   align={{
                                       offset: [this.state.position.x, this.state.position.y],
                                   }}
                                   overlay={LocaleUtils.instance.translate('tooltip.move_page_or_spread')}>
                                <span className="text-move">{LocaleUtils.instance.translate('label.move_pages')}</span>
                          </Tooltip>
                    </span>
                }
                {
                    !rightPageIsNotPage && this.renderAddPageIcon(numLeftPage + 1, amountPage)
                }
            </div>
        );
    }

    onDragStartWhole(e) {
        e.dataTransfer.setData('text', e.target);
    }

    renderEditPageBtn(display) {
        let displayBtn = { opacity: display ? 1 : 0 }

        return (
            <div style={displayBtn} className="whole-mini-page edit-page-btn" >
                <Button
                    onClick={this.editPage}
                    icon='icon-ViewSpreadIcon'
                    text={LocaleUtils.instance.translate('label.view_spread')}
                />
            </div>
        );
    }

    renderNumPages(numLeftPage, numRightPage, amountPage) {
        const front_sheet = LocaleUtils.instance.translate('label.front_sheet');
        const back_sheet = LocaleUtils.instance.translate('label.back_sheet');

        return (
            <div className="whole-mini-page number-page">
                <span>{numLeftPage === 0 ? front_sheet : numLeftPage}</span>
                &nbsp;
                <span className="icon-PageNumberDivider" />
                &nbsp;
                <span>{(numRightPage > amountPage) ? back_sheet : numRightPage}</span>
            </div>
        );
    }

    render() {
        const { numPage, paginationStatus } = this.props;

        return (
            <div
                className="whole-mini-pages"
                onMouseEnter={this.toggleShowingEditPageBtn}
                onMouseLeave={this.closeShowingEditPageBtn}
            >
                {this.renderTwoPages(numPage, numPage + 1, paginationStatus.amountPage)}
                {this.renderEditPageBtn(this.state.isShowEditPageBtn)}
                {this.renderNumPages(numPage, numPage + 1, paginationStatus.amountPage)}
                {
                    this.state.isShowDeletePagesPopup &&
                    <Popup
                        style='delete-pages-warning'    
                        title={LocaleUtils.instance.translate('alert.delete.pages.title')}
                        icon={Popup.iconType.warningIcon}
                        content={LocaleUtils.instance.translate('alert.delete.pages.messageBirdEye')}
                        textLeftBtn={LocaleUtils.instance.translate('alert.delete.pages.confirm')}
                        textRightBtn={LocaleUtils.instance.translate('alert.delete.pages.cancel')}
                        onClickLeftBtn={this.agreeDeletePagesContent}
                        onClickRightBtn={this.toggleConfirmDeletePagesContentPopup}
                    />
                }
            </div>
        );
    }
}

WholeMiniPages.propTypes = {
    numPage: PropTypes.number,
    goToEditPage: PropTypes.func,
    addPageInBook: PropTypes.func,
    onClickChoosePage: PropTypes.func,
}

const onAddPagesIntoPageChoosingList = (dispatch, idPages) => {
    dispatch(addPagesIntoPageChoosingList(idPages));
}

const onRemovePagesOutToPageChoosingList = (dispatch, idPages) => {
    dispatch(removePagesOuttoPageChoosingList(idPages));
}

const dispatchDeletePagesList = (dispatch, pages) => {
    dispatch(deletePagesListInBook(pages));
    dispatchResetPagesChoosingToEmpty(dispatch);
}

const dispatchDeletePagesContent = (dispatch, pages) => {
    dispatch(deletePagesContentInBook(pages));
}

const dispatchResetPagesChoosingToEmpty = (dispatch) => {
    dispatch(resetPagesChoosing());
}

const handleCloseShowHelpBubble = (dispatch) => {
    dispatch(toggleShowHelpBubble(false));
};

const mapStateToProps = (state) => {
    const { appStatus, project, themes } = state;
    const { paginationStatus, rootStatus, bookDesignHeaderStatus } = appStatus;
    const { isShowHelpBubble } = bookDesignHeaderStatus;
    const { book } = project;
    const {  pagesChoosingList } = rootStatus;
    const { amountPage } = paginationStatus;
    return { paginationStatus, book, themes,  pagesChoosingList, isShowHelpBubble, amountPage };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onAddPagesIntoPageChoosingList: (idPages) => onAddPagesIntoPageChoosingList(dispatch, idPages),
        onRemovePagesOutToPageChoosingList: (idPages) => onRemovePagesOutToPageChoosingList(dispatch, idPages),
        dispatchDeletePagesList: (pages) => dispatchDeletePagesList(dispatch, pages),
        dispatchDeletePagesContent: (pages) => dispatchDeletePagesContent(dispatch, pages),
        dispatchResetPagesChoosingToEmpty: () => dispatchResetPagesChoosingToEmpty(dispatch),
        closeShowHelpBubble: () => handleCloseShowHelpBubble(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WholeMiniPages);
