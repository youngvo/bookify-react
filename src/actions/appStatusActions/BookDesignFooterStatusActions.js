export const SORTING_MANUAL_ALL_PHOTOS = "SORTING_MANUAL_ALL_PHOTOS";
export const SORTING_MANUAL_PHOTOS_USED = "SORTING_MANUAL_PHOTOS_USED";
export const SORTING_MANUAL_PHOTOS_NOT_USED = "SORTING_MANUAL_PHOTOS_NOT_USED";
export const PASS_PHOTOS_TO_FOOTER = "PASS_PHOTOS_TO_FOOTER";
export const CHANGE_SHOW_TYPE_OF_PHOTOS = "CHANGE_SHOW_TYPE_OF_PHOTOS";
export const CHANGE_SORTING_TYPE_OF_PHOTOS = "CHANGE_SORTING_TYPE_OF_PHOTOS";


export function changeShowTypeOfPhotos(showType) {
    return {
        type: CHANGE_SHOW_TYPE_OF_PHOTOS,
        showType
    };
}

export function changeSortTypeOfPhotos(sortingType, isChangeSortType) {
    return {
        type: CHANGE_SORTING_TYPE_OF_PHOTOS,
        sortingType,
        isChangeSortType
    };
}

export function changeSortingManualAllPhotos(allPhotos){
    return {
        type: SORTING_MANUAL_ALL_PHOTOS,
        allPhotos
    };
}

export function changeSortingManualPhotosUsedInBook(photosUsed){
    return {
        type: SORTING_MANUAL_PHOTOS_USED,
        photosUsed
    };
}

export function changeSortingManualPhotosNotUsedInBook(photosNotUsed){
    return {
        type: SORTING_MANUAL_PHOTOS_NOT_USED,
        photosNotUsed
    };
}

export function passPhotoListForFooter(photosList) {
    return {
        type: PASS_PHOTOS_TO_FOOTER,
        photosList
    };
}
