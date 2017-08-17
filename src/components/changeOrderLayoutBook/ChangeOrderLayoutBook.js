import React, { Component } from 'react';

import './ChangeOrderLayoutBook.css';
import LocaleUtils      from './../../utils/LocaleUtils';
import Assets           from './../../assets/Assets';
import PhotoOrders from './photoOrders/PhotoOrders';
import PhotoLayouts from './photoLayouts/PhotoLayouts';
import Checkbox from 'rc-checkbox';
import {
    photoOrderTypes,
    photoLayoutTypes,
    sortingTypes
} from './../../constants/Constants';
import Tooltip     from 'rc-tooltip';
import IconButton  from './../materials/iconButton/IconButton';

export const getOrderStr = (orderType) => {
    switch (orderType) {
        case (photoOrderTypes.NEWEST_FIRST):
            return LocaleUtils.instance.translate('wizard.auto_create.photos.newest_first');
        case (photoOrderTypes.FILENAME):
            return LocaleUtils.instance.translate('wizard.auto_create.photos.filename');
            break;
        case (photoOrderTypes.MANUAL):
            return LocaleUtils.instance.translate('wizard.auto_create.photos.manual');
        case (sortingTypes.RECENT_DATE):
            return LocaleUtils.instance.translate('wizard.auto_create.photos.newest_first');
        case (sortingTypes.FILE_NAME_AZ):
            return LocaleUtils.instance.translate('wizard.auto_create.photos.filename');
        case (sortingTypes.MY_SORTING):
            return LocaleUtils.instance.translate('wizard.auto_create.photos.manual');
        default:
            return LocaleUtils.instance.translate('wizard.auto_create.photos.oldest_first');
    }
}

// export const getPhotoLayout = (layoutType) => {
//     switch (layoutType) {
//         case photoLayoutTypes.layout_type_1:
//             return Assets.instance.retrieveImageObjectURL('img_page_layout_01');
//         case photoLayoutTypes.layout_type_2:
//             return Assets.instance.retrieveImageObjectURL('img_page_layout_02');
//         case photoLayoutTypes.layout_type_3:
//             return Assets.instance.retrieveImageObjectURL('img_page_layout_03');
//         default:
//             return Assets.instance.retrieveImageObjectURL('img_page_layout_04');
//     }
// };

const changeOrderComponent = (changeOrderLayoutVO) => {
    let orderType = getOrderStr(changeOrderLayoutVO.orderType);

    let firstPhoto = {};
    let photos = changeOrderLayoutVO.photoList;
    if (photos && photos.length > 0) firstPhoto = photos[0];
    let secondPhoto = photos.length >= 2 ? photos[1] : firstPhoto;

    return (
        <div className="change-order-layout-component partleft">
            <div className="change-order-layout-content-top">
                <div className="change-layout-order-image">
                    <div className="thumb">
                        <img src={firstPhoto.picUrl} alt="" />
                    </div>
                    <div className="change-order-layout-arrow-next-image">
                        <img src={Assets.instance.retrieveImageObjectURL('img_arrow_next')} alt="arrow next" />
                    </div>
                    <div className="thumb">
                        <img src={secondPhoto.picUrl} alt="" />
                    </div>
                </div>
                <div className="change-layout-order-text">
                    <p>{LocaleUtils.instance.translate('wizard.auto_create.photo_order_prompt')}</p>
                    <p>{orderType}</p>
                </div>

            </div>
            <div className="auto-create-book-content-box-button change-button" onMouseDown={changeOrderLayoutVO.onChangeOrderClick} >
                <span>{LocaleUtils.instance.translate('wizard.auto_create.change')}</span>
            </div>
            {
                changeOrderLayoutVO.isShowChangeOrderPhoto &&
                <PhotoOrders
                    firstPhoto={firstPhoto}
                    secondPhoto={secondPhoto}
                    onCloseChangeOrderPhoto={changeOrderLayoutVO.onChangeOrderClick}
                    checkedOrderType={changeOrderLayoutVO.orderType}
                    onOrderTypeClick={changeOrderLayoutVO.onOrderTypeClick}
                />
            }
        </div>
    )
}

const changeLayoutComponent = (layoutsOriginal, currChooseLayout, onChangeLayoutClick, onLayoutTypeClick, isShowChangeLayoutPhoto) => {
    let currImageUrl = Assets.instance.retrieveImageObjectURL(currChooseLayout.imageName);

    return (
        <div className="change-order-layout-component partright">
            <div className="change-order-layout-content-top" >
                <div className="change-layout-order-image-right">
                    <img src={currImageUrl} alt={currImageUrl} />
                </div>
                <div className="change-layout-order-text">
                    <p>{LocaleUtils.instance.translate('wizard.auto_create.page_layout_prompt')}</p>
                </div>

            </div>
            <div className="auto-create-book-content-box-button change-button" onMouseDown={onChangeLayoutClick} >
                <span>{LocaleUtils.instance.translate('wizard.auto_create.change')}</span>
            </div>
            {
                isShowChangeLayoutPhoto &&
                <PhotoLayouts
                    currChooseLayout={currChooseLayout}
                    layouts={layoutsOriginal}
                    onLayoutTypeClick={onLayoutTypeClick}
                    onCloseChangeLayoutPhoto={onChangeLayoutClick}
                />
            }
        </div>
    )
};

class KeepPagesMade extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowToolTip: false,
        }
    }

    onMouseEnter(){
        this.setState({
            isShowToolTip: true
        });
    }

    onMouseLeave(){
        this.setState({
            isShowToolTip: false
        });
    }

    render () {
        let localeString = LocaleUtils.instance.translate('wizard.auto_create.how_it_works');
        return (
            <div className="change-layout-order-suggestion">
                <label className="how-this-work-label">
                    <Checkbox  checked={this.props.isKeepPagesMade}
                               onChange={this.props.onChangeKeepPagesMade}
                    /> &nbsp;
                    {LocaleUtils.instance.translate('wizard.auto_create.keep_pages')}
                </label>
                &nbsp;
                <Tooltip prefixCls="how-to-this-work-tooltip" placement="topRight"
                         overlay={
                             <div className="how-to-this-work-tooltip-inner">
                                 <IconButton className="tooltip-button-how-to-this-work" type={IconButton.type.close}/>
                                 {localeString}
                             </div>}
                         visible={this.state.isShowToolTip}
                >
                     <span className="change-layout-order-suggestion-how-work"
                            onMouseEnter={this.onMouseEnter.bind(this)}
                            onMouseLeave={this.onMouseLeave.bind(this)}
                     >
                         {LocaleUtils.instance.translate('wizard.auto_create.how_does_this_work')}
                    </span>
                </Tooltip>
            </div>
        );
    }
};

const ChangeOrderLayoutBook = ({changeOrderLayoutVO}) => {
    return (
        <div className="change-order-layout-book">
            <div className="change-order-layout-content">
                {changeOrderComponent(changeOrderLayoutVO)}
                {changeLayoutComponent(changeOrderLayoutVO.layoutsOriginal, changeOrderLayoutVO.currChooseLayout,
                                        changeOrderLayoutVO.onChangeLayoutClick, changeOrderLayoutVO.onLayoutTypeClick,
                                        changeOrderLayoutVO.isShowChangeLayoutPhoto)}
            </div>
            <div className="change-order-layout-book-keep-pages">
                <KeepPagesMade isKeepPagesMade={changeOrderLayoutVO.isKeepPagesMade}
                               onChangeKeepPagesMade={changeOrderLayoutVO.onChangeKeepPagesMade}
                />
            </div>
        </div>

    );
}

export default ChangeOrderLayoutBook;
