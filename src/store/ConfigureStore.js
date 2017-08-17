import {createStore, applyMiddleware, /*compose*/} from 'redux';
import { createLogger } from 'redux-logger';
// import DevTools         from '../utils/DevTools';
import stateReducer   from '../reducers/StateReducer';

const logger = createLogger();
const createStoreWithMiddleware = applyMiddleware(logger)(createStore);
export let store = null; // placeholder for store singleton once created
export default function configureStore() {
    if (store) {
      return store;
    }
    store = createStoreWithMiddleware(
        stateReducer,
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );
    return store;
    //Use redux_devtools_extension on the browser or compose as below with DEVTOOL was declared above
    // return createStore (
    //     stateReducer,
    //     compose (applyMiddleware(logger), DevTools.instrument())
    // );
};
