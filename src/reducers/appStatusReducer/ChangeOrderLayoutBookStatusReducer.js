import {
    SHOW_CHANGE_ORDER_PHOTO,
    SHOW_CHANGE_LAYOUT_PHOTO,
    CLOSE_AUTO_CREATE_BOOK,
    CHANGE_ORDER_PHOTO,
    CHANGE_LAYOUT_PHOTO,
    KEEP_PAGES_MADE
} from '../../actions/appStatusActions/ChangeOrderLayoutBookStatusActions';
import {
    photoOrderTypes,
    photoLayoutTypes
} from './../../constants/Constants';

const changeOrderLayoutBookVODefault = {
    orderType: photoOrderTypes.OLDEST_FIRST,
    layoutType: photoLayoutTypes.layout_type_1,
    isShowChangeOrderPhoto: false,
    isShowChangeLayoutPhoto: false,
    isKeepPagesMade: true
};

export default function (changeOrderLayoutBookVO = changeOrderLayoutBookVODefault, action) {
    switch (action.type) {
        case SHOW_CHANGE_ORDER_PHOTO:
            return {
                ...changeOrderLayoutBookVO,
                isShowChangeOrderPhoto: !changeOrderLayoutBookVO.isShowChangeOrderPhoto,
                isShowChangeLayoutPhoto: false
            };
        case SHOW_CHANGE_LAYOUT_PHOTO:
            return {
                ...changeOrderLayoutBookVO,
                isShowChangeOrderPhoto: false,
                isShowChangeLayoutPhoto: !changeOrderLayoutBookVO.isShowChangeLayoutPhoto
            };
        case CHANGE_ORDER_PHOTO:
            return {
                ...changeOrderLayoutBookVO,
                isShowChangeOrderPhoto: false,
                orderType: action.orderType
            };
        case CHANGE_LAYOUT_PHOTO:
            return {
                ...changeOrderLayoutBookVO,
                isShowChangeLayoutPhoto: false,
                layoutType: action.layoutType
            };
        case KEEP_PAGES_MADE:
            return {
                ...changeOrderLayoutBookVO,
                isKeepPagesMade: !changeOrderLayoutBookVO.isKeepPagesMade
            };
        case CLOSE_AUTO_CREATE_BOOK:
            return {
                ...changeOrderLayoutBookVO,
                isShowChangeOrderPhoto: false,
                isShowChangeLayoutPhoto: false,
            };
        default:
            return changeOrderLayoutBookVO;
    }
};