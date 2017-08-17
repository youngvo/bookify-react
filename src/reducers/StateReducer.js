import { combineReducers } from 'redux';

import appStatusReducer from './appStatusReducer/AppStatusReducer';
import getPhotosDataReducer from './getPhotosReducer/GetPhotosDataReducer';
import userReducer from './userReducer/UserReducer';
import projectReducer from './projectReducer/ProjectReducer';
import themesReducer from './themesReducer/ThemesReducer';
import autoFlowLayoutsReducer from './autoFlowLayoutsReducer/AutoFlowLayoutsReducer';
import coverLayoutsReducer from './coverLayoutsReducer/CoverLayoutsReducer';
import photoListReducer from './photoListReducer/PhotoListReducer';

const stateReducer = combineReducers({
    appStatus:      appStatusReducer,
    getPhotosData:  getPhotosDataReducer,
    userStatus:     userReducer,
    project:        projectReducer,
    themes:         themesReducer,
    autoFlowLayouts: autoFlowLayoutsReducer,
    coverLayouts:   coverLayoutsReducer,
    photoList: photoListReducer
});

export default stateReducer;
