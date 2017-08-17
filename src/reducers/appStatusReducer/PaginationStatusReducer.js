import Config from './../../config/Config';
import { CHANGE_SELECT_PAGE, SET_AMOUNT_PAGE } from './../../actions/appStatusActions/PaginationStatusActions';
import {
    ADD_PAGE_IN_BOOK,
    DELETE_PAGE_IN_BOOK,
    DELETE_PAGES_LIST_IN_BOOK
} from '../../actions/projectActions/bookActions/pagesActions/PagesActions';


var paginationStatusDefault = {
    amountPage:     Config.instance.minPagesInBook, //alway is even
    currentPage:    0
}

export default function (paginationStatus = paginationStatusDefault, action) {
    switch (action.type) {
        case CHANGE_SELECT_PAGE:
            return {
                ...paginationStatus,
                currentPage: action.numPage,
            };
        case SET_AMOUNT_PAGE:
            return {
                ...paginationStatus,
                amountPage: action.amountPage,
            };
        case ADD_PAGE_IN_BOOK:
            return {
                ...paginationStatus,
                amountPage: paginationStatus.amountPage + 2,
                currentPage: paginationStatus.currentPage + 2
            };
        case DELETE_PAGE_IN_BOOK:
            return {
                ...paginationStatus,
                amountPage: paginationStatus.amountPage - 2,
                currentPage: paginationStatus.currentPage - 2
            };
        case DELETE_PAGES_LIST_IN_BOOK:
            return {
                ...paginationStatus,
                amountPage: paginationStatus.amountPage - action.pagesChoosing.length,
            };
        default:
            return paginationStatus;
    }
};