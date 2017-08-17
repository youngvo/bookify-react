import {
    CHANGE_SHOW_TYPE_OF_PHOTOS,
    CHANGE_SORTING_TYPE_OF_PHOTOS,
    SORTING_MANUAL_ALL_PHOTOS,
    SORTING_MANUAL_PHOTOS_USED,
    SORTING_MANUAL_PHOTOS_NOT_USED,
    PASS_PHOTOS_TO_FOOTER
} from './../../actions/appStatusActions/BookDesignFooterStatusActions';
import Utils from './../../utils/Utils';
import {
    showTypes,
    sortingTypes
} from './../../constants/Constants';

let bookDesignFooterVODefault = {
    showType: showTypes.SHOW_ALL_PHOTOS,
    sortingType: sortingTypes.MY_SORTING,
    photosListShown: [],
    allPhotos_SortingManual: [],
    photosUsed_SortingManual: [],
    photosNotUsed_SortingManual: [],
    isChangeSortingTypePhotos: false
};

const sortPhotosBy = (photos, sortingType) => {
    switch (sortingType) {
        case sortingTypes.FILE_NAME_AZ:
            return photos.sort(Utils.compareValues('name'));

        case sortingTypes.OLDEST_DATE:
            return photos.sort(Utils.compareValues('updatedTime'));

        case sortingTypes.RECENT_DATE:
            return photos.sort(Utils.compareValues('updatedTime', 'desc'));

        default: //sortingTypes.MY_SORTING
            return photos;
    }
};

const getPhotosShowndBy = (bookDesignFooterVO, showType) => {
    switch (showType) {
        case showTypes.SHOW_PHOTOS_USED:
            return bookDesignFooterVO.photosUsed_SortingManual;

        case showTypes.SHOW_PHOTOS_NOT_USED:
            return bookDesignFooterVO.photosNotUsed_SortingManual;

        default: //showTypes.SHOW_ALL_PHOTOS
            return bookDesignFooterVO.allPhotos_SortingManual;
    }
};

const getPhotosShownAndSortedBy = (bookDesignFooterVO, showType, sortingType) => {
    let photosShowing = getPhotosShowndBy(bookDesignFooterVO, showType);
    return sortPhotosBy(photosShowing, sortingType);
};

export default function bookDesignFooterStatusVO(bookDesignFooterStatusVO = bookDesignFooterVODefault, action) {
    switch (action.type){
        case PASS_PHOTOS_TO_FOOTER:
            let allPhotos = action.photosList;
            let photosUsed = allPhotos.filter(photo => photo.isUsed);
            let photosNotUsed = allPhotos.filter(photo => !photo.isUsed);
            return {
                ...bookDesignFooterStatusVO,
                photosListShown: allPhotos,
                allPhotos_SortingManual: allPhotos,
                photosUsed_SortingManual: photosUsed,
                photosNotUsed_SortingManual: photosNotUsed
            };

        case CHANGE_SHOW_TYPE_OF_PHOTOS:
            let currentSortingType = bookDesignFooterStatusVO.sortingType;
            let showTypeAction = action.showType;
            let getPhotosAfterChangeShowType = getPhotosShownAndSortedBy(bookDesignFooterStatusVO, showTypeAction, currentSortingType);
            return {
                ...bookDesignFooterStatusVO,
                showType: showTypeAction,
                photosListShown: getPhotosAfterChangeShowType
            };

        case CHANGE_SORTING_TYPE_OF_PHOTOS:
            if (action.isChangeSortType) {
                let currentShowType = bookDesignFooterStatusVO.showType;
                let sortingTypeAction = action.sortingType;
                let getPhotosAfterChangeSortingType = getPhotosShownAndSortedBy(bookDesignFooterStatusVO, currentShowType, sortingTypeAction);
                return {
                    ...bookDesignFooterStatusVO,
                    isChangeSortingTypePhotos: true,
                    sortingType: sortingTypeAction,
                    photosListShown: getPhotosAfterChangeSortingType
                };
            } else {
                return {
                    ...bookDesignFooterStatusVO,
                    isChangeSortingTypePhotos: false,
                };
            }

        case SORTING_MANUAL_ALL_PHOTOS:
            let allPhotosAction = action.allPhotos;    
            return {
                ...bookDesignFooterStatusVO,
                allPhotos_SortingManual: allPhotosAction,
                photosListShown: allPhotosAction
            };

        case SORTING_MANUAL_PHOTOS_USED:
            let photosUsedAction = action.photosUsed;
            return {
                ...bookDesignFooterStatusVO,
                photosUsed_SortingManual: photosUsedAction,
                photosListShown: photosUsedAction
            };

        case SORTING_MANUAL_PHOTOS_NOT_USED:
            let photosNotUsedAction = action.photosNotUsed;
            return{
                ...bookDesignFooterStatusVO,
                photosNotUsed_SortingManual: photosNotUsedAction,
                photosListShown: photosNotUsedAction
            };

        default:
            return bookDesignFooterStatusVO;
    }
};
