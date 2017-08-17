import React, { Component } from 'react';
import AppServices     from './../../services/AppServices';
import CTEventFactory  from './../../utils/CTEventFactory';
import { appCrashed } from './../../actions/appStatusActions/RootStatusActions';

export default class AbstractComponent extends Component {

  constructor(props) {
    super(props);
  }

   unstable_handleError(error) {
     console.log('unstable_handleError', error);
     AppServices.trackCTEvent(CTEventFactory.instance.createCrashEvent(error.stack), null, null);
     let configureStore = require('./../../store/ConfigureStore');
     let { dispatch } = { dispatch: configureStore.store.dispatch };
     dispatch(appCrashed({ type: 'error_crash_app', errorMessage: error.message, errorStack: error.stack }));
  }

}
