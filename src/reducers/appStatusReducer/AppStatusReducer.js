import { combineReducers } from 'redux';

import bookDesignHeaderReducer          from './BookDesignHeaderStatusReducer';
import paginationReducer                from './PaginationStatusReducer';
import rootReducer                      from './RootStatusReducer';
import changeOrderLayoutReducer from './ChangeOrderLayoutBookStatusReducer';
import bookDesignFooterReducer from './BookDesignFooterStatusReducer';

const appStatusReducer = combineReducers({
    bookDesignHeaderStatus: bookDesignHeaderReducer,
    paginationStatus:       paginationReducer,
    rootStatus:             rootReducer,
    changeOrderLayoutStatus: changeOrderLayoutReducer,
    bookDesignFooterStatus: bookDesignFooterReducer
});

export default appStatusReducer;