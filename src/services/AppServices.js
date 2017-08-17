import Config  from './../config/Config';
import Utils  from './../utils/Utils';
import LocaleUtils  from './../utils/LocaleUtils';
import SessionResponse from './response/SessionResponse';
import RegisterResponse from './response/RegisterResponse';
import ProjectResponse from './response/ProjectResponse';
import VerifyUserResponse from './response/VerifyUserResponse';
import { version } from './../constants/Constants';
import { toggleShowingErrorPopup } from './../actions/appStatusActions/RootStatusActions';
const API_KEY = 'avatar';
const CLIENT_ID = 'OBT';
const SESSION_KEY = '_session_id';
const GALI = '_gali';
const LOGGED_IN_KEY = 'logged_in';
const SESSION_EXPIRATIONSECS = 60*60*8;
const LOGGED_IN_EXPIRATIONSECS = 60*60*24*365;
const SOURCE_NAME = 'bookify';
const SUCCESS_CODE = 200;

const REQUEST_TYPE_CALL_API = 'callApi';
const REQUEST_TYPE_GET_FILE = 'getFile';

let parseStringToJson = require('xml2js').parseString;
let _thisServices;

function _encodeQueryData(data) {
   let ret = [];
   for (let d in data) {
     ret.push(encodeURIComponent(d).replace(/_/g, '%5F') + '=' + encodeURIComponent(data[d]));
   }
   return ret.join('&');
}

function _trim(params) {
    if (!params) {
        params = {};
    } else {
        for (let i in params) {
            if (!params[i] && params[i] !== 0 && params[i] !== '') {
                 delete params[i];
            }
        }
    }
    return params;
}

/**
* AppServices is a singleton class that is responsible for connecting to backend Rest APIs for exchanging data.
*/
let AppServices = (function () {
    const headers = [
        { 'Content-Type': 'application/x-www-form-urlencoded' },
        {
            'Accept': 'text/html,application/xhtml+ xml, application/xml;q=0.9,*/*;q=0.8'
        }
    ];

    function AppServices(poolSize, sessionId) {
        this.headers = new Headers({
          'Content-Type': 'application/x-www-form-urlencoded'
        });
        this.loaders = [];
        this.loading = 0;
        this.webSessionId = Utils.readCookie(SESSION_KEY);
        this.setConfig(poolSize, sessionId);
        this.sessionStartDate = new Date();
        this.loadNextID = setInterval(() => this._loadNext(), 100);
        _thisServices = this;
    };

    AppServices.prototype._mapDispatchToProps = function(configureStore) {
      return { dispatch: configureStore.store.dispatch };
    }

    AppServices.prototype._dispatchError = function (request, error) {
        let configureStore = require('./../store/ConfigureStore');
        let { dispatch } = this._mapDispatchToProps(configureStore);
        let message = LocaleUtils.instance.translate('error.server_unreachable') + ':' + request.url;
        dispatch(toggleShowingErrorPopup({ type: 'error_connect', errorMessage: message, errorStack: error.stack }));
    };

    AppServices.prototype._makeRequestObject = function (request, requestType, successHandler, failedHandler) {
        let requestObject = {
            request: request,
            type: requestType,
            successHandler: successHandler,
            failedHandler: failedHandler
        };
        return requestObject;
    };

    AppServices.prototype._makeRequestObjectForCallApi = function (request, successHandler, failedHandler) {
        return this._makeRequestObject(request, REQUEST_TYPE_CALL_API, successHandler, failedHandler);
    };

    AppServices.prototype._makeRequestObjectForGetFile = function (request, successHandler, failedHandler) {
        return this._makeRequestObject(request, REQUEST_TYPE_GET_FILE, successHandler, failedHandler);
    };

    AppServices.prototype._post = function (path, params, successHandler, failedHandler) {
        params = _trim(params);
        params.client_id = CLIENT_ID;
        params.api_key = API_KEY;
        if (this.sessionId) {
            params.session_id = this.sessionId;
        }
        let request = new Request(path, {
            method: 'POST',
            mode: 'cors',
            headers: this.headers,
            credentials: 'include',
            body: _encodeQueryData(params)
        });
        this.loaders.push(this._makeRequestObjectForCallApi(request, successHandler, failedHandler));
    };

    AppServices.prototype._postFormData = function (requestType, path, params, successHandler, failedHandler) {
        params = _trim(params);
        let request = new Request(path, {
            method: 'POST',
            mode: 'cors',
            headers: this.headers,
            credentials: 'include',
            body: _encodeQueryData(params)
        });
        this.loaders.push({
            request: request,
            type: requestType,
            successHandler: successHandler,
            failedHandler: failedHandler
        });
    };

    AppServices.prototype._put = function (path, params, successHandler, failedHandler) {
        params = _trim(params);
        if (this.sessionId) {
            params.session_id = this.sessionId;
        }
        params.api_key = API_KEY;
        params.client_id = CLIENT_ID;
        let request = new Request(path, {
            method: 'PUT',
            mode: 'cors',
            headers: this.headers,
            credentials: 'include',
            body: _encodeQueryData(params)
        });
        this.loaders.push(this._makeRequestObjectForCallApi(request, successHandler, failedHandler));
    };

    AppServices.prototype._get = function (path, params, header, successHandler, failedHandler) {
        params = _trim(params);
        if (this.sessionId) {
            params.session_id = this.sessionId;
        }
        params.api_key = API_KEY;
        params.client_id = CLIENT_ID;

        let questionMark = (path.indexOf('?') === path.length - 1) ? '' : '?';
        let request = new Request(path + questionMark + _encodeQueryData(params), {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
            headers: header ? header : this.headers
        });
        this.loaders.push(this._makeRequestObjectForCallApi(request, successHandler, failedHandler));
    };

    AppServices.prototype._getFile = function (path, params, successHandler, failedHandler) {
        params = _trim(params);
        let questionMark = (path.indexOf('?') === path.length - 1) ? '' : '?';
        let request = new Request(path + questionMark + _encodeQueryData(params), {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
            headers: this.headers
        });
        this.loaders.push(this._makeRequestObjectForGetFile(request, successHandler, failedHandler));
    };

    AppServices.prototype._delete = function (path, params, successHandler, failedHandler) {
        params = _trim(params);
        if (this.sessionId) {
            params.session_id = this.sessionId;
        }
        params.api_key = API_KEY;
        params.client_id = CLIENT_ID;
        let request = new Request(path, {
            method: 'DELETE',
            mode: 'cors',
            headers: this.headers,
            credentials: 'include',
            body: _encodeQueryData(params)
        });
        this.loaders.push(this._makeRequestObjectForCallApi(request, successHandler, failedHandler));
    };

    AppServices.prototype.setConfig = function (poolSize, sessionId) {
        this.poolSize = poolSize;
        this.sessionId = sessionId;
    };

    AppServices.prototype.getSession = function () {
        return {
            sessionId: this.sessionId,
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            sessionStartDate: this.sessionStartDate
        };
    }

    AppServices.prototype._loadNext = function () {
        if (this.loaders.length === 0) {
            return false;
        }
        if (this.loading === this.poolSize) {
            return false;
        }
        let nextLoader = this.loaders.shift();
        fetch(nextLoader.request)
            .then(_thisServices.checkResponseStatus)
            .then(function (response) {
                return response.text();
            })
            .then(function (text) {
                let response = text;
                let code = SUCCESS_CODE;
                try {
                  parseStringToJson(text, function (err, json) {
                      if (json) {
                          response = json;
                          if (json.response && nextLoader.type === REQUEST_TYPE_CALL_API) {
                              response = json.response;
                              code = parseInt(response['$'].code, 0);
                          }
                      }
                  });
                } catch (e) {
                  _thisServices.generalFailedHandler(response, nextLoader.failedHandler);
                  return;
                }
                if (code !== SUCCESS_CODE) {
                    _thisServices.generalFailedHandler(response, nextLoader.failedHandler);
                    return;
                }
                _thisServices.generalSuccessHandler(response, nextLoader.successHandler);
            })
            .catch(function (err) {
                console.log('err', err);
                _thisServices.generalFailedHandler({ code: 500, message: err }, nextLoader.failedHandler);
                _thisServices._dispatchError(nextLoader.request, err);
            });
        this.loading++;
    };

    AppServices.prototype.checkResponseStatus = function (response) {
        if (response.status >= SUCCESS_CODE && response.status < 300) {
            return Promise.resolve(response);
        }
        return Promise.reject(new Error(response.statusText));
    };

    AppServices.prototype.generalSuccessHandler = function (json, successHandler) {
        this.loading--;
        if (successHandler) {
            successHandler(json);
        }
    };

    AppServices.prototype.generalFailedHandler = function (json, failedHandler) {
        this.loading--;
        if (failedHandler) {
            failedHandler(json);
        }
    };

    AppServices.prototype.login = function (username, password, rememberMe, successHandler, failedHandler) {
        let params = {
            username: username,
            password: password,
            remember_me: rememberMe,
            session_id: this.sessionId
        };
        this._post(
            Config.instance.apiUrls.loginUrl + '.flex',
            params,
            function (json) {
                let apiSession = json.api_session[0];
                _thisServices.sessionId = apiSession.id[0];
                _thisServices.webSessionId = apiSession.web_session_id[0];
                Utils.setCookie(SESSION_KEY, _thisServices.webSessionId, SESSION_EXPIRATIONSECS);
                let response = new SessionResponse(SUCCESS_CODE, apiSession);
                successHandler(response);
            },
            failedHandler
        );
    };

    AppServices.prototype.logout = function (successHandler, failedHandler) {
        this._delete(
            Config.instance.apiUrls.loginUrl + '.flex',
            { session_id: this.sessionId },
            function (json) {
                _thisServices.sessionId = null;
                _thisServices.webSessionId = null;
                Utils.setCookie(SESSION_KEY, _thisServices.sessionId, SESSION_EXPIRATIONSECS);
                Utils.setCookie(LOGGED_IN_KEY, 'set', LOGGED_IN_EXPIRATIONSECS);
                _thisServices.initSession(
                    function (result) {
                        successHandler(json);
                    },
                    failedHandler
                );
            },
            failedHandler
        );
    };

    AppServices.prototype.register = function (username, password, email, wantNewsletter, locale, successHandler, failedHandler) {
        let params = {
            username: username,
            password: password,
            email: email,
            want_newsletter: wantNewsletter,
            locale: locale,
            session_id: this.sessionId
        };
        this._post(
            Config.instance.apiUrls.userUrl + '.flex',
            params,
            function (json) {
                let user = json.user[0];
                let webSessionId = user.web_session_id[0];
                _thisServices.webSessionId = webSessionId;
                Utils.setCookie(SESSION_KEY, _thisServices.sessionId, SESSION_EXPIRATIONSECS);
                Utils.setCookie(LOGGED_IN_KEY, 'set', LOGGED_IN_EXPIRATIONSECS);
                _thisServices.initSession(
                    function (result) {
                        let response = new RegisterResponse(SUCCESS_CODE, user);
                        successHandler(response);
                    },
                    failedHandler
                );
            },
            failedHandler
        );
    };

    AppServices.prototype.initSession = function (successHandler, failedHandler) {
        let webSessionId = Utils.readCookie(SESSION_KEY);
        let params = {};
        if (webSessionId) {
            params.web_session_id = webSessionId;
        }
        this._post(
            Config.instance.apiUrls.sessionUrl + '.flex',
            params,
            function (json) {
                let apiSession = json.api_session[0];
                _thisServices.sessionId = apiSession.id[0];
                _thisServices.webSessionId = apiSession.web_session_id[0];
                _thisServices.sessionStartDate = new Date();
                Utils.setCookie(SESSION_KEY, _thisServices.webSessionId, SESSION_EXPIRATIONSECS);
                Utils.setCookie(GALI, 'Avatar', SESSION_EXPIRATIONSECS);
                let response = new SessionResponse(SUCCESS_CODE, apiSession);
                if (response.user) {
                    Utils.setCookie(LOGGED_IN_KEY, 'set', LOGGED_IN_EXPIRATIONSECS);
                }
                successHandler(response);
            },
            failedHandler);
    };

    AppServices.prototype.createProject = function (data, coverThumbnail, title, version, restartAppOnSave, instantBook, sourceInfo, editLiteMode, successHandler, failedHandler) {
        let params = {
            instant_book: instantBook,
            title: title,
            source_info: sourceInfo,
            cover_thumbnail: '',
            version: version,
            source_name: SOURCE_NAME,
            data: data,
            restartAppOnSave: restartAppOnSave,
            editLiteMode: editLiteMode
        };

        this._post(Config.instance.apiUrls.projectServiceUrl + '.flex', params, function (json) {
            let project = json.project[0];
            let response = new ProjectResponse(SUCCESS_CODE, project);
            successHandler(response);
        }, failedHandler);
    };

    AppServices.prototype.verifyUsername = function (username, successHandler, failedHandler) {
        let params = { username: username };
        this._post(Config.instance.apiUrls.usernameValidationUrl + '.flex', params, function (json) {
            let user = json.user[0];
            let response = new VerifyUserResponse(SUCCESS_CODE, user);
            successHandler(response);
        }, failedHandler);
    };

    AppServices.prototype.trackCTEvent = function (eventData, successHandler, failedHandler) {
      this._postFormData(REQUEST_TYPE_GET_FILE, Config.instance.apiUrls.analyticsServiceUrl, { data: JSON.stringify(eventData) }, successHandler, failedHandler);
    };

    AppServices.prototype.saveProject = function (id, data, coverThumbnail, title, version, restartAppOnSave, instantBook, sourceInfo, editLiteMode, successHandler, failedHandler) {
        let params = {
            id: id,
            _method: 'PUT',
            source_info: sourceInfo,
            title: title,
            source_name: SOURCE_NAME,
            instant_book: instantBook,
            data: data,
            restartAppOnSave: restartAppOnSave,
            cover_thumbnail: coverThumbnail,
            version: version,
            editLiteMode: editLiteMode
        };

        this._post(Config.instance.apiUrls.projectServiceUrl + '/' + id + '.flex', params, function (json) {
            let project = json.project[0];
            let metadata = project.metadata[0];
            let response = new ProjectResponse(SUCCESS_CODE, project);
            successHandler(response);
        }, failedHandler);
    };

    AppServices.prototype.recoveredMissingImages = function (projectId, imageId, successHandler, failedHandler) {
        let path = Config.instance.apiUrls.projectServiceUrl + '/' + projectId + '/images/add.flex';
        let params = {
            id: imageId,
            client_id: CLIENT_ID,
            api_key: API_KEY,
            format: 'flex',
            session_id: this.sessionId,
            _method: 'PUT'
        };

        this._postFormData(REQUEST_TYPE_CALL_API, path, params, successHandler, failedHandler);
    }

    AppServices.prototype.loadExistingProject = function(projectId, successHandler, failedHandler) {
        let path = Config.instance.apiUrls.projectServiceUrl + "/" + projectId + ".flex";
        let params = {
            session_id : this.sessionId,
            id : projectId,
            api_key : API_KEY,
            client_id : CLIENT_ID
        }

        this._get(path, params, null, successHandler, failedHandler);
    };

    AppServices.prototype.loadImages = function(projectId, successHandler, failedHandler) {
        let path = Config.instance.apiUrls.projectServiceUrl + "/" + projectId + "/images.flex";
        let params = {
            format : "flex",
            session_id : this.sessionId,
            api_key : API_KEY,
            client_id : CLIENT_ID
        }

        this._get(path , params, null, successHandler, failedHandler);
    };

    AppServices.prototype.loadStarterProject = function (starterProjectLayoutName, successHandler, failedHandler) {
        starterProjectLayoutName = starterProjectLayoutName + '.xml';
        let path = Config.instance.apiUrls.starterProjectServiceUrl + '/' + starterProjectLayoutName;
        let params = {
            id: starterProjectLayoutName,
            appVersion: version.appVersion
        };

        this._getFile(path, params, successHandler, failedHandler);
    };

    AppServices.prototype._loadLayouts = function (layoutUrl, layoutName, successHandler, failedHandler) {
        layoutName = layoutName + '.xml';
        let params = {
            file: layoutName,
            appVersion: version.appVersion
        };

        this._getFile(layoutUrl + '/' + layoutName, params, successHandler, failedHandler);
    };

    AppServices.prototype.loadPageLayouts = function (pageLayoutName, successHandler, failedHandler) {
        this._loadLayouts(
            Config.instance.apiUrls.pageLayoutServiceUrl,
            pageLayoutName,
            successHandler,
            failedHandler
        );
    };

    AppServices.prototype.loadCoverLayouts = function(coverLayoutName, successHandler, failedHandler) {
        this._loadLayouts(
            Config.instance.apiUrls.coverLayoutServiceUrl,
            coverLayoutName,
            successHandler,
            failedHandler
        );
    };

    AppServices.prototype.loadThemes = function(successHandler, failedHandler) {
        this._loadLayouts(
            Config.instance.apiUrls.themeServiceUrl,
            'themes',
            successHandler,
            failedHandler
        );
    };

    AppServices.prototype.loadAutoFlowLayouts = function (autoFlowLayoutName, successHandler, failedHandler) {
        this._loadLayouts(
            Config.instance.apiUrls.autoflowLayoutsServiceUrl,
            autoFlowLayoutName,
            successHandler,
            failedHandler
        );
    };

    AppServices.prototype.getImageAfterImported = function (importId, successHandler, failedHandler) {
        let path = Config.instance.apiUrls.imageSetUrl + '/' + importId + '.flex';
        let params = { id: importId };

        let headerObject = headers[1];
        let header = new Headers(headerObject);

        this._get(path, params, header, successHandler, failedHandler);
    };

    AppServices.prototype.bbf = function(projectId, bbfXMLString, coverIntent, successHandler, failedHandler) {
        let params = {
            project_id: projectId,
            book_xml: bbfXMLString,
            coverIntent: coverIntent
        };

        this._post(Config.instance.apiUrls.bbfJobServiceUrl + '.flex', params, successHandler, failedHandler);
    };

    AppServices.prototype.bbfGet = function (bbfJobId, successHandler, failedHandler) {
        let params = {id:bbfJobId};
        this._get(Config.instance.apiUrls.bbfJobServiceUrl + '/' + bbfJobId + '.flex', params, null, successHandler, failedHandler);
    };

    AppServices.prototype.bbfReplace = function (projectId, productId, bbfXMLString, coverIntent, successHandler, failedHandler) {
        let params = {
            project_id: projectId,
            product_id: productId,
            book_xml: bbfXMLString,
            coverIntent: coverIntent
        };

        this._post(Config.instance.apiUrls.bookRepublishServiceUrl + '.flex', params, successHandler, failedHandler);
    };

    AppServices.prototype.dispose = function() {
      clearInterval(this.loadNextID);
    }

    return AppServices;
}());
exports.AppServices = AppServices;
let singleton = new AppServices(1, null);
exports.__esModule = true;
exports["default"] = singleton;
