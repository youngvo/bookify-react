export const SHOW_CHANGE_ORDER_LAYOUT_BOOK = "SHOW_CHANGE_ORDER_LAYOUT_BOOK";
export const SHOW_CHANGE_ORDER_PHOTO = "SHOW_CHANGE_ORDER_PHOTO";
export const SHOW_CHANGE_LAYOUT_PHOTO = "SHOW_CHANGE_LAYOUT_PHOTO";
export const CLOSE_AUTO_CREATE_BOOK = "CLOSE_AUTO_CREATE_BOOK";
export const CHANGE_ORDER_PHOTO = "CHANGE_ORDER_PHOTO";
export const CHANGE_LAYOUT_PHOTO = "CHANGE_LAYOUT_PHOTO";
export const KEEP_PAGES_MADE = "KEEP_PAGES_MADE";

export function showChangeOrderLayoutBook() {
    return {
        type: SHOW_CHANGE_ORDER_LAYOUT_BOOK
    };
};

export function toggleChangeOrderPhoto() {
    return {
        type: SHOW_CHANGE_ORDER_PHOTO
    }
}

export function toggleChangeLayoutPhoto() {
    return {
        type: SHOW_CHANGE_LAYOUT_PHOTO
    };
};

export function closeAutoCreateBook() {
    return {
        type: CLOSE_AUTO_CREATE_BOOK
    }
}

export function changeKeepPagesMade() {
    return {
        type: KEEP_PAGES_MADE
    }
}

export function changeOrderPhoto(orderType) {
    return {
        type: CHANGE_ORDER_PHOTO,
        orderType
    }
}

export function changeLayoutPhoto(layoutType) {
    return {
        type: CHANGE_LAYOUT_PHOTO,
        layoutType
    }
}

