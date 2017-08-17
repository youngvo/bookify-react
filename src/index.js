import React        from 'react';
import ReactDOM     from 'react-dom';
import { Provider } from 'react-redux';
import 'babel-polyfill';
import AppServices     from './services/AppServices';
import CTEventFactory     from './utils/CTEventFactory';
import RedBox from 'redbox-react';
import './styles/index.css';
import './styles/fonticon.css';

import Root             from './containers/root/Root';
import configureStore   from './store/ConfigureStore';
import { appCrashed } from './actions/appStatusActions/RootStatusActions';

const store = configureStore();

/**
 * Provider will save all app's states by store
 */
const root = document.getElementById('root');
try {
  ReactDOM.render(
      <Provider store={store}>
          {/*<div className='body-zone'>*/}
              <Root />
              {/*{process.env.NODE_ENV !== 'production' && <DevTools />}*/}
          {/*</div>*/}
      </Provider>,
      root
  );
} catch (error) {
  AppServices.trackCTEvent(CTEventFactory.instance.createCrashEvent(error.stack), null, null);
  store.dispatch(appCrashed({ type: 'error_crash_app', errorMessage: error.message, errorStack: error.stack }));
  let redBox = <RedBox error={error} />;
  ReactDOM.render(
      <Provider store={store}>
          {/*<div className='body-zone'>*/}
              <Root />
              {/*{process.env.NODE_ENV !== 'production' && <DevTools />}*/}
          {/*</div>*/}
      </Provider>,
      root
  );
}
