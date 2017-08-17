import React, { Component } from 'react';
import { connect } from 'react-redux';
import Tooltip  from 'rc-tooltip';
import Dropdown from 'react-dropdown';

import './BookDesignFooter.css';
import LocaleUtils from './../../../utils/LocaleUtils';
import IconButton from './../../../components/materials/iconButton/IconButton';
import PhotoCard from './../../../components/bookDesign/photoCard/PhotoCard';
import ScrollBar from './../../../components/materials/scrollBar/ScrollBar';
import SortableContainer from './../../../libs/react-sortable-hoc/SortableContainer';
import SortableElement from './../../../libs/react-sortable-hoc/SortableElement';
import { arrayMove } from './../../../libs/react-sortable-hoc/utils';

import { showTypes, sortingTypes } from './../../../constants/Constants';
import { addNewImageIntoCover } from '../../../actions/projectActions/bookActions/CoversActions';
import { toggleShowHelpBubble } from './../../../actions/appStatusActions/BookDesignHeaderStatusActions';
import { changePhotoIsClicking, addImageIdIntoImagesChoosingList } from './../../../actions/appStatusActions/RootStatusActions';
import { updateImageIntoPage, addNewImageIntoPage, setPageLayout } from '../../../actions/projectActions/bookActions/pagesActions/PagesActions';
import {
    passPhotoListForFooter,
    changeShowTypeOfPhotos,
    changeSortTypeOfPhotos,
    changeSortingManualAllPhotos,
    changeSortingManualPhotosUsedInBook,
    changeSortingManualPhotosNotUsedInBook
} from './../../../actions/appStatusActions/BookDesignFooterStatusActions';
import ScrollArea from './../../../components/materials/scrollBarCustom/ScrollArea';
import Assets from './../../../assets/Assets';

let isFirstRender = true;

const PhotoCardItem = SortableElement(({ photoVO, onClick, isClicking }) =>
    <PhotoCard
        photoVO={photoVO}
        onClick={onClick}
        isClicking={isClicking}
    />
);

const PhotoCardList = SortableContainer(({ isExpand, photosList, disSortable, photoCardClick, photoIdClicking }) => {
    let styleWrapper = {
        display: isExpand ? 'block' : 'inline-flex'
    };

    return (
        <div style={styleWrapper} >
            {
                photosList.map((photo, index) => {
                    return (
                        <PhotoCardItem
                            key={index}
                            index={index}
                            photoVO={photo}
                            disabled={disSortable}
                            onClick={photoCardClick}
                            isClicking={photo.baseId === photoIdClicking}
                        />
                    );
                })
            }
        </div>
    );
})

const optionsShow = [
    { value: showTypes.SHOW_ALL_PHOTOS, label: LocaleUtils.instance.translate('ImageLibraryPane.FILTER_ALL') },
    { value: showTypes.SHOW_PHOTOS_USED, label: LocaleUtils.instance.translate('ImageLibraryPane.FILTER_USED_IN_BOOK') },
    { value: showTypes.SHOW_PHOTOS_NOT_USED, label: LocaleUtils.instance.translate('ImageLibraryPane.FILTER_NOT_USED_IN_BOOK') }
];

const optionsSort = [
    { value: sortingTypes.MY_SORTING, label: LocaleUtils.instance.translate('ImageLibraryPane.SORT_MANUAL') },
    { value: sortingTypes.OLDEST_DATE, label: LocaleUtils.instance.translate('ImageLibraryPane.SORT_DATE_TAKEN_ASCENDING') },
    { value: sortingTypes.RECENT_DATE, label: LocaleUtils.instance.translate('ImageLibraryPane.SORT_DATE_TAKEN_DESCENDING') },
    { value: sortingTypes.FILE_NAME_AZ, label: LocaleUtils.instance.translate('ImageLibraryPane.SORT_FILE_NAME_ASCENDING') }
];

class BookDesignFooter extends Component {
    constructor(props) {
        super(props);
        props.initSortingPhotos(Object.values(props.photoList));
        this.state = {
            isExpand : false,
            isLoadedFooter: false
        };
        this.photoCardClick = this.photoCardClick.bind(this);
        this.handleChangeFooterMode = this.handleChangeFooterMode.bind(this);
        this.onChangeSelectingSort = this.onChangeSelectingSort.bind(this);
        this.onChangeShowPhotos = this.onChangeShowPhotos.bind(this);
        this.onSortEnd = this.onSortEnd.bind(this);
    }

    handleChangeFooterMode() {
        this.resetPositionListPhotos();
        this.setState({
            isExpand : !this.state.isExpand
        });
        this.props.changeModeFooter(!this.state.isExpand);
    }

    onChangeShowPhotos(optionsShow) {
        switch (optionsShow.value) {
            case showTypes.SHOW_PHOTOS_USED:
                this.props.changeShowPhotos(showTypes.SHOW_PHOTOS_USED);
                break;
            case showTypes.SHOW_PHOTOS_NOT_USED:
                this.props.changeShowPhotos(showTypes.SHOW_PHOTOS_NOT_USED);
                break;
            default:
                this.props.changeShowPhotos(showTypes.SHOW_ALL_PHOTOS);
                break;
        }
    }

    componentWillReceiveProps(nextProps) {
        let nextPhotos = nextProps.photoList;
        let currentPhotos = this.props.bookDesignFooterStatus.photosListShown;
        if (Object.keys(nextPhotos).length !== currentPhotos.length) {
            this.props.initSortingPhotos(Object.values(nextPhotos));
        }
    }

    onChangeSelectingSort(optionsSort) {
        switch (optionsSort.value) {
            case sortingTypes.OLDEST_DATE:
                this.props.changeSortingPhotos(sortingTypes.OLDEST_DATE);
                break;
            case sortingTypes.RECENT_DATE:
                this.props.changeSortingPhotos(sortingTypes.RECENT_DATE);
                break;
            case sortingTypes.FILE_NAME_AZ:
                this.props.changeSortingPhotos(sortingTypes.FILE_NAME_AZ);
                break;
            default:
                this.props.changeSortingPhotos(sortingTypes.MY_SORTING);
                break;
        }
    }

    photoCardClick(basePhotoId) {
        this.props.onPhotoCardClick(basePhotoId);
    }

    addNewImageIntoBox(targetPageInfo, imageObject) {
        let pageVO = {
            imageObject: imageObject,
            idLayout: targetPageInfo[1],
            idPage: targetPageInfo[2],
            idPageLayout: targetPageInfo[3]
        };
        
        let isCover = targetPageInfo[2] === '-1' || targetPageInfo[2] === '99999' || targetPageInfo[2]==='-2' || targetPageInfo[2]==='-3' ? true : false;
        if (isCover) {
            this.props.addNewImageIntoImageFieldOnCover(pageVO);
        } else {
            this.props.addNewImageIntoImageFieldOnPage(pageVO);
        }
        
    }

    onSortEnd = ({ oldIndex, newIndex }, evt) => {
        const { showType, photosListShown } = this.props.bookDesignFooterStatus;
        let newPhotosList = arrayMove(photosListShown, oldIndex, newIndex);
        let targetPageInfo = null;
        let classList = evt.target.className.split(' ');
        for (let key in classList) {
            if (classList[key].toString().indexOf('keyBoxImage', 0) !== -1 ||
                classList[key].toString().indexOf('miniBoxImage', 0) !== -1) {
                targetPageInfo = classList[key].split('---');
                break;
            }
        }
        if (targetPageInfo && targetPageInfo.indexOf('logo') < 0) {
            this.addNewImageIntoBox(targetPageInfo, photosListShown[oldIndex]);
            this.props.dispatchAddImageIdIntoImageChoosingList([photosListShown[oldIndex].baseId]);
        } else {
            let targetClassId = evt.target.id;
            if (targetClassId === 'pageBookLeft' || targetClassId === 'pageBookRight') {
                let childNodes = document.getElementById(targetClassId).childNodes;
                for(let index = 0; index < childNodes.length; index++) {
                    let classList = childNodes[index].className.split(' ');
                    for (let key in classList) {
                        if (classList[key].toString().indexOf('keyBoxImage',0)!==-1) {
                            targetPageInfo = classList[key].split('---');
                            let currentPage = this.props.present[parseInt(targetPageInfo[2])];
                            for (let index = 0; index < currentPage.ImageContainer.length; index++){
                                if (typeof currentPage.ImageContainer[index].Image === 'undefined') {
                                    targetPageInfo[1] = currentPage.ImageContainer[index].$.ref_id;
                                    this.addNewImageIntoBox(targetPageInfo, photosListShown[oldIndex]);
                                    return;
                                } else {
                                    //change layout
                                }
                            }
                            return;
                        }
                    }
                }
                let { PageLayout } = this.props;
                let newLayout = PageLayout[10];
                let numPage = this.props.paginationStatus.currentPage;
                if (targetClassId === 'pageBookRight') numPage = numPage + 1;
                let listPagesChangeLayout = [];
                listPagesChangeLayout.push(numPage - 1);
                this.props.changeLayout(listPagesChangeLayout, newLayout);
                setTimeout(() => {
                    let childNodes = document.getElementById(targetClassId).childNodes;
                    for(let index = 0; index < childNodes.length; index++) {
                        let classList = childNodes[index].className.split(' ');
                        for (let key in classList) {
                            if (classList[key].toString().indexOf('keyBoxImage',0)!==-1) {
                                targetPageInfo = classList[key].split('---');
                                this.addNewImageIntoBox(targetPageInfo, photosListShown[oldIndex]);
                                return;
                            }
                        }
                    }
                }, 500);
            } else {
                if (showType === showTypes.SHOW_ALL_PHOTOS) {
                    this.props.sortingManualAllPhotos(newPhotosList);
                }
                else if (this.state.showType === showTypes.SHOW_PHOTOS_USED) {
                    this.props.sortingManualPhotosUsed(newPhotosList);
                }
                else {
                    this.props.sortingManualPhotosNotUsed(newPhotosList);
                }
            }
        }
    }

    renderPhotosList() {
        const { photosListShown, sortingType } = this.props.bookDesignFooterStatus;
        const disSortable = sortingType !== sortingTypes.MY_SORTING;
       
        return (
            <div className="footer-wrapper-photo" ref="footer_wrapper_photo" >
                <PhotoCardList
                    isExpand={this.state.isExpand}
                    photosList={photosListShown}
                    onSortEnd={this.onSortEnd}
                    disabled={disSortable}
                    photoCardClick={this.photoCardClick}
                    photoIdClicking={this.props.photoIdClicking}
                    axis='xy'
                />
            </div>
        );
    }

    renderSwitchModeIcon() {
        return (
            <div className="footer-change-mode-icon">
                <IconButton type={IconButton.type.arrowFooter} onClick={this.handleChangeFooterMode} />
            </div>
        );
    }

    renderShow() {
        let showTypes = optionsShow.filter(shower => shower.value === this.props.bookDesignFooterStatus.showType);
        return (
            <div className="bottom-footer-drop-up">
                <div className="head-lb"> {LocaleUtils.instance.translate('label.filter')}:</div>
                <Dropdown
                    options={optionsShow}
                    onChange={this.onChangeShowPhotos.bind(this)}
                    value={showTypes[0]}
                    onFocus={()=>{console.log("ON FOCUS")}}
                />
            </div>
        );
    }

    renderSortBy() {
        let sortingTypes = optionsSort.filter(sorting => sorting.value === this.props.bookDesignFooterStatus.sortingType);
        return (
            <div className="bottom-footer-drop-up par">
                <div className="head-lb"> {LocaleUtils.instance.translate('label.sort')}:</div>
                <Dropdown
                    options={optionsSort}
                    onChange={this.onChangeSelectingSort.bind(this)}
                    value={sortingTypes[0]}
                    onFocus={()=>{console.log("ON FOCUS")}}
                />
            </div>
        );
    }

    getWidthOfScrollBar() {
        return this.refs.footer_scrollbar.offsetWidth;
    }

    getParentSizeOfScrollBar() {
        return this.refs.top_footer_zone.offsetWidth;
    }

    getChildSizeOfScrollBar() {
        // return this.refs.footer_wrapper_photo.offsetWidth;
        return Object.values(this.props.photoList).length * 106;
    }

    onScrollThump(value) {
        this.refs.footer_wrapper_photo.style.transform = 'translate(' + value + 'px,0)';
    }

    resetPositionListPhotos() {
        this.refs.footer_wrapper_photo.style.transform = 'translate(0px,0)';
    }

    updateUI() {
        this.setState({
            isLoadedFooter: true
        })
    }

    componentDidMount() {
        this.setState({
            isLoadedFooter: true
        });
        window.addEventListener("resize", this.updateUI.bind(this));
    }

    renderScrollbar() {
        let parentSize = this.getParentSizeOfScrollBar();
        let childSize = this.getChildSizeOfScrollBar();
        return (
            <div className="scrollbar-footer-wrapper" >
                <ScrollBar
                    width={this.getWidthOfScrollBar()}
                    height={15}
                    parentSize={parentSize}
                    childSize={childSize}
                    onScrollThump={this.onScrollThump.bind(this)}
                    enable={!this.state.isExpand && childSize > parentSize}
                    type="horizontal"
                />
            </div>
        );
    }

    preventEventDefault(e) {
        e.preventDefault();
    }

    handleMouseDown() {
        this.node = this.refs.foot_main;
        let isFirefox = typeof InstallTrigger !== 'undefined';
        if (isFirefox) {
            this.node.addEventListener('dragstart', this.preventEventDefault);
        }
    }

    handleMouseUp() {
        this.node.removeEventListener('dragstart', this.preventEventDefault);
    }

    renderTopFooter(hasVerticalScrollbar) {
        let styleScrollBar = {};
        if (!hasVerticalScrollbar) {
            styleScrollBar.display = 'none';
        }
        return (
            <div className="top-footer-zone" ref="top_footer_zone">
                <ScrollArea
                    speed={1}
                    className="area"
                    smoothScrolling={true}
                    contentClassName="content"
                >
                    {this.renderPhotosList()}
                </ScrollArea>    
            </div>
        )    
    }

    render() {
        const { isShowHelpBubble, isShowManagePage } = this.props;
        let footerName = isFirstRender ? "footer-main" : !this.state.isExpand ? "footer-main minimize-mode" : "footer-main extend-mode";
        isFirstRender = false;
        let customStyleFooter = {
            backgroundImage: 'url(' + Assets.instance.retrieveImageObjectURL('img_footer_background') + ')',
            backgroundSize: '100% 100%',
        }
        return (
            <Tooltip placement="top" prefixCls="show-help-tooltip-custom-design-footer" visible={isShowHelpBubble && isShowManagePage}
                     align={{
                         offset: [0, -20],
                     }}
                     overlay={<div><IconButton type={IconButton.type.closeShowHelp} onClick={this.props.closeShowHelpBubble}/>
                         <div className="show-help-tooltip-custom-design-footer-text">{LocaleUtils.instance.translate("helpbubbles.image_library")}</div>
                     </div>}>
                <div className={footerName} ref="foot_main"
                    onMouseDown={this.handleMouseDown.bind(this)}
                    onMouseUp={this.handleMouseUp.bind(this)}
                >
                    <div className="footer-main-zone" style={customStyleFooter}>
                        {
                            this.renderTopFooter(this.state.isExpand)
                        }
                        <div className="line-middle-footer" />
                        <div className="bottom-footer-zone">
                            {this.renderSwitchModeIcon()}
                            {this.renderShow()}
                            {this.renderSortBy()}
                            <div className="footer-horizontal-scrollbar-custom" ref="footer_scrollbar">
                                {this.state.isLoadedFooter && this.renderScrollbar()}
                            </div>
                        </div>
                    </div>
                </div>
            </Tooltip>
        );
    }
}

const initSortingPhotos = (dispatch, photoList) => {
    dispatch(passPhotoListForFooter(photoList));
};

const changeShowPhotos = (dispatch, showType) => {
    dispatch(changeShowTypeOfPhotos(showType));
}

const changeSortingPhotos = (dispatch, sortingType) => {
    dispatch(changeSortTypeOfPhotos(sortingType, true));
}

const sortingManualAllPhotos = (dispatch, allPhotos) => {
    dispatch(changeSortingManualAllPhotos(allPhotos));
}

const sortingManualPhotosUsed = (dispatch, photosUsed) => {
    dispatch(changeSortingManualPhotosUsedInBook(photosUsed));
}

const sortingManualPhotosNotUsed = (dispatch, photosNotUsed) => {
    dispatch(changeSortingManualPhotosNotUsedInBook(photosNotUsed));
}

const onPhotoCardClick = (dispatch, basePhotoId) => {
    dispatch(changePhotoIsClicking(basePhotoId));
};

const addNewImageIntoImageFieldOnPage = (dispatch, pageVO) => {
    dispatch(addNewImageIntoPage(pageVO));
}

const addNewImageIntoImageFieldOnCover = (dispatch, pageVO) => {
    dispatch(addNewImageIntoCover(pageVO));
}


const dispatchAddImageIdIntoImageChoosingList = (dispatch, imageBaseIdList) => {
    dispatch(addImageIdIntoImagesChoosingList(imageBaseIdList));
}

const onChangeLayout = (dispatch, pagesChoosingList, newLayout) => {
    dispatch(setPageLayout(pagesChoosingList, newLayout));
};

const handleCloseShowHelpBubble = (dispatch) => {
    dispatch(toggleShowHelpBubble(false));
};

const mapStateToProps = (state) => {
    let { appStatus, photoList, project } = state;
    let { layouts, pages } = project.book;
    let { present } = pages;
    let { PageLayout } = layouts;
    let { rootStatus, bookDesignFooterStatus, paginationStatus, bookDesignHeaderStatus } = appStatus;
    let { photoIdClicking, isShowManagePage } = rootStatus;
    let { isShowHelpBubble } = bookDesignHeaderStatus;
    return { photoList, photoIdClicking, bookDesignFooterStatus, layouts, PageLayout, paginationStatus, isShowHelpBubble, isShowManagePage, present };
};

const mapDispatchToProps = (dispatch) => ({
    initSortingPhotos:          (photoList) => initSortingPhotos(dispatch, photoList),
    changeShowPhotos:           (showType) => changeShowPhotos(dispatch, showType),
    changeSortingPhotos:        (sortingType) => changeSortingPhotos(dispatch, sortingType),
    sortingManualAllPhotos:     (allPhotos) => sortingManualAllPhotos(dispatch, allPhotos),
    sortingManualPhotosUsed:    (photosUsed) => sortingManualPhotosUsed(dispatch, photosUsed),
    sortingManualPhotosNotUsed: (photosNotUsed) => sortingManualPhotosNotUsed(dispatch, photosNotUsed),
    onPhotoCardClick:           (basePhotoId) => onPhotoCardClick(dispatch, basePhotoId),
    addNewImageIntoImageFieldOnPage:  (pageVO) => addNewImageIntoImageFieldOnPage(dispatch, pageVO),
    addNewImageIntoImageFieldOnCover: (pageVO) => addNewImageIntoImageFieldOnCover(dispatch, pageVO),
    dispatchAddImageIdIntoImageChoosingList: (imageBaseIdList) => dispatchAddImageIdIntoImageChoosingList(dispatch, imageBaseIdList),
    changeLayout: (pagesChoosingList, newLayout) => onChangeLayout(dispatch, pagesChoosingList, newLayout),
    closeShowHelpBubble: () => handleCloseShowHelpBubble(dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BookDesignFooter);
