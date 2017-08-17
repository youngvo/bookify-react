const PREFIX = "Pagination/";
export const CHANGE_SELECT_PAGE = PREFIX + "CHANGE_SELECT_PAGE";
export const SET_AMOUNT_PAGE = PREFIX + "SET_AMOUNT_PAGE";

export function selectPageOnPageTab(numPage) {
    return {
        type: CHANGE_SELECT_PAGE,
        numPage
    };
};

export function setAmountPage(amountPage) {
    return {
        type: SET_AMOUNT_PAGE,
        amountPage
    };
};