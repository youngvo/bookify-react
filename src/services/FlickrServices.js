import oauthSignature from 'oauth-signature';
// import fetchJsonp from 'fetch-jsonp';
import {parseString} from 'xml2js';
import fetchJsonp from 'fetch-jsonp';
import LocationUtils  from './../utils/LocationUtils';
import Utils  from './../utils/Utils';
import Config from './../config/Config';

const BASE_URL =            "https://www.flickr.com/services/";
const OAUTH =               "oauth/";
const REQUEST_TOKEN_URL = BASE_URL + OAUTH + 'request_token';
const ACCESS_TOKEN_URL = BASE_URL + OAUTH + 'access_token';
const AUTHORIZE_URL = BASE_URL + OAUTH + 'authorize';

const FLICKR_BLOG_GETLIST = "flickr.people.getPhotos";
const REQUEST_URL = "https://flickr.com/services/rest";
const FLICKR_TOKEN = 'oauthVerifierFlickr';
const OAUTH_CALLBACK_URL = '/flickrCallback.html'
const CORS_API_URL  = 'https://cors-anywhere.herokuapp.com/';
var FlickrServices = (function () {

    var instance;

    var createInstance = () => {
        var apiKey = '';
        var secretKey = '';
        var accessToken = "";
        let oauthToken = '';
        let oauthTokenSecret = '';
        let oauthVerifier = '';
        let oauthCallbackUrl = '';
        var userName = "";
        var nsid = "";
        
        var getUserName = () => {
            return userName;
        };

        var deleteCookie = (name) => {
            if(typeof InstallTrigger !== 'undefined') {
                document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;' + 'path='+ document.location.pathname+"/";
            }   
            if(!!window.chrome && !!window.chrome.webstore) {
                document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;' + 'path='+ document.location.pathname;
            }  
            
        };

        var configKey = () => {
            let domain = LocationUtils.instance.domain();
            let subDomain = LocationUtils.instance.subdomain();
            if (domain === 'localhost') {
                apiKey = Config.instance.retrieve500pxAppIDTest();
                secretKey = Config.instance.retrieveFlickrSecretAppIDTest();
            }

            if (subDomain === 'master' || LocationUtils.instance.isProductionDomain()) {
                apiKey = Config.instance.retrieveFlickrAppId();
                secretKey = Config.instance.retrieveFlickrSecretAppID();
            }
            oauthCallbackUrl = LocationUtils.instance.homepage + OAUTH_CALLBACK_URL;
        };

        var getOauthVerifierCookie = (getOauthVerifySuccess, getOauthVerifyFailed = null) => {
            let oauthVerifierKey = FLICKR_TOKEN;
            let allCookies = document.cookie;
            var cookieArray = allCookies.split(';');
            for (let i = 0; i < cookieArray.length; i++) {
                let name  = cookieArray[i].split('=')[0];
                let value = cookieArray[i].split('=')[1];
                if (name.trim() === oauthVerifierKey) {
                    oauthVerifier = value;
                }
            }
            oauthVerifier.length > 0 ? getOauthVerifySuccess() : getOauthVerifyFailed()
        };

        var requestOauthToken = (requestTokenSuccess, requestTokenFailed = null) => {
            configKey();

            var httpMethod = 'GET',
            url = REQUEST_TOKEN_URL,
            parameters = {
                oauth_callback: oauthCallbackUrl,
                oauth_consumer_key : apiKey,
                oauth_nonce : Utils.randomString(32),
                oauth_timestamp : Utils.generateTimeStamp(),
                oauth_signature_method : 'HMAC-SHA1',
                oauth_version : '1.0',
            },
            consumerSecret = secretKey,
            signature = oauthSignature.generate(httpMethod,url,parameters,consumerSecret);

            let baseUrl = REQUEST_TOKEN_URL + `?oauth_callback=${parameters.oauth_callback}&oauth_consumer_key=${apiKey}&oauth_nonce=${parameters.oauth_nonce}&oauth_signature_method=${parameters.oauth_signature_method}&oauth_signature=${signature}&oauth_version=${parameters.oauth_version}&oauth_timestamp=${parameters.oauth_timestamp}`;

            var myHeaders = new Headers();

            var myInit = { method: 'GET',
                    headers: myHeaders,
                    mode: 'cors',
                    cache: 'default',
            };

            let requestUrl = CORS_API_URL + baseUrl;
            fetch(requestUrl, myInit) 
                .then(function(response) {
                    return response.text();
                })
                .then(function(result) {
                    let vars = Utils.getUrlVars(result);
                    oauthToken = vars['oauth_token'];
                    oauthTokenSecret = vars['oauth_token_secret'];
                    requestTokenSuccess(vars);
                })
                .catch(function(ex) {
                    if (requestTokenFailed) requestTokenFailed(ex);
            });
        };

        var authorizeUser = () => {
            var httpMethod = 'GET',
                url = AUTHORIZE_URL,
                parameters = {
                    //oauth_callback: ACCESS_TOKEN_URL, // no need callback
                    oauth_token: oauthToken,
                    oauth_consumer_key : apiKey,
                    oauth_nonce : Utils.randomString(32),
                    oauth_timestamp : Utils.generateTimeStamp(),
                    oauth_signature_method : 'HMAC-SHA1',
                    oauth_version : '1.0',
                    perms: 'read',
                },
                consumerSecret = secretKey,
                tokenSecret = oauthTokenSecret,
                signature = oauthSignature.generate(httpMethod,url,parameters,consumerSecret,tokenSecret);

            let baseUrl = AUTHORIZE_URL + `?perms=${parameters.perms}&oauth_token=${parameters.oauth_token}`;

            return  window.open(baseUrl,"_blank");
        };

        var exchangeAcessToken = (ExchangeAcessTokenSuccess , ExchangeAcessTokenFailed = null) => {
            var httpMethod = 'GET',
                url = ACCESS_TOKEN_URL,
                parameters = {
                    oauth_token: oauthToken,
                    oauth_consumer_key : apiKey,
                    oauth_nonce : Utils.randomString(32),
                    oauth_timestamp : Utils.generateTimeStamp(),
                    oauth_signature_method : 'HMAC-SHA1',
                    oauth_version : '1.0',
                    oauth_verifier: oauthVerifier,
                },
                consumerSecret = secretKey,
                tokenSecret = oauthTokenSecret,
                signature = oauthSignature.generate(httpMethod,url,parameters,consumerSecret, tokenSecret);

            let baseUrl = url + `?oauth_consumer_key=${apiKey}&oauth_nonce=${parameters.oauth_nonce}&oauth_signature_method=${parameters.oauth_signature_method}&oauth_signature=${signature}&oauth_timestamp=${parameters.oauth_timestamp}&oauth_token=${parameters.oauth_token}&oauth_verifier=${parameters.oauth_verifier}&oauth_version=${parameters.oauth_version}`;
            
            var myHeaders = new Headers();
            var myInit = { method: 'GET',
                headers: myHeaders,
                mode: 'cors',
                cache: 'default',
            };

            let requestUrl = CORS_API_URL + baseUrl;
            fetch(requestUrl, myInit) 
                .then(function(response) {
                    return response.text();
                })
                .then(function(result) {
                    let vars = Utils.getUrlVars(result);
                    
                    oauthToken = vars['oauth_token'];
                    oauthTokenSecret = vars['oauth_token_secret'];
                    nsid = vars['user_nsid'];
                    userName =  vars['username'];
                    ExchangeAcessTokenSuccess();
                })
                .catch(function(ex) {
                    if (ExchangeAcessTokenFailed) ExchangeAcessTokenFailed(ex);
            });
        };

        var checkAcessToken = (checkAcessTokenTokenCallback) => {
            var httpMethod = 'GET',
                url = 'https://api.flickr.com/services/rest',
                parameters = {
                    nojsoncallback: 1,
                    method: 'flickr.auth.oauth.checkToken',
                    oauth_token: oauthToken,
                    oauth_consumer_key : apiKey,
                    oauth_nonce : Utils.randomString(32),
                    oauth_timestamp : Utils.generateTimeStamp(),
                    oauth_signature_method : 'HMAC-SHA1',
                    oauth_version : '1.0',
                    api_key: apiKey,
                    //oauth_verifier: oauthVerifier,
                },
                consumerSecret = secretKey,
                tokenSecret = oauthTokenSecret,
                signature = oauthSignature.generate(httpMethod,url,parameters,consumerSecret, tokenSecret);
            //let baseUrl = url + `?oauth_consumer_key=${apiKey}&method=${parameters.method}&oauth_nonce=${parameters.oauth_nonce}&oauth_signature_method=${parameters.oauth_signature_method}&oauth_signature=${signature}&oauth_timestamp=${parameters.oauth_timestamp}&oauth_token=${parameters.oauth_token}&oauth_version=${parameters.oauth_version}`;

            let baseUrl = url + `?method=${parameters.method}&oauth_consumer_key=${apiKey}&oauth_nonce=${parameters.oauth_nonce}&oauth_signature_method=${parameters.oauth_signature_method}&oauth_signature=${signature}&oauth_timestamp=${parameters.oauth_timestamp}&oauth_token=${parameters.oauth_token}&oauth_version=${parameters.oauth_version}&api_key=${parameters.api_key}`;

            var myHeaders = new Headers();
            var myInit = { method: 'GET',
                headers: myHeaders,
                mode: 'cors',
                cache: 'default',
            };

            let requestUrl = baseUrl;
            fetch(requestUrl, myInit) 
                .then(function(response) {
                    return response.text();
                })
                .then(function(xml) {
                        parseString(xml, function (err, result) {
                        checkAcessTokenTokenCallback(result);
                    });
                        
                })
                .catch(function(ex) {
                    console.log("Check Access Token Failed:" , ex);
            });
        };

        var getUserPhotos = (getUserPhotosSuccess, getUserPhotoFailed = null) => {
            var httpMethod = 'GET',
            url = 'https://api.flickr.com/services/rest',
            parameters = {
                nojsoncallback: 1,
                format:'json',
                method: FLICKR_BLOG_GETLIST,
                oauth_token: oauthToken,
                oauth_consumer_key : apiKey,
                oauth_nonce : Utils.randomString(32),
                oauth_timestamp : Utils.generateTimeStamp(),
                oauth_signature_method : 'HMAC-SHA1',
                oauth_version : '1.0',
                user_id: nsid,
            },
            consumerSecret = secretKey,
            tokenSecret = oauthTokenSecret,
            signature = oauthSignature.generate(httpMethod,url,parameters,consumerSecret, tokenSecret);
            let baseUrl = url + `?nojsoncallback=1&format=json&method=${parameters.method}&oauth_consumer_key=${apiKey}&oauth_nonce=${parameters.oauth_nonce}&oauth_signature_method=${parameters.oauth_signature_method}&oauth_signature=${signature}&oauth_timestamp=${parameters.oauth_timestamp}&oauth_token=${parameters.oauth_token}&user_id=${parameters.user_id}&oauth_version=${parameters.oauth_version}&extras=owner_name,date_upload,date_taken,o_dims,url_o,url_s&per_page=500`;
            var myHeaders = new Headers();
            var myInit = { method: 'GET',
                headers: myHeaders,
                mode: 'cors',
                cache: 'default',
            };
            
            fetch(baseUrl, myInit)
                .then (function(response) {
                    return response.json();
                })
                .then (function (result) {
                        getUserPhotosSuccess(result);
                })
                .catch (function(ex) {
                    if (getUserPhotoFailed) getUserPhotoFailed(ex);
            });
        };
        var logoutUser = () => {
            nsid = '';
            deleteCookie(FLICKR_TOKEN);
            Utils.setCookie(FLICKR_TOKEN," ", -1);
        };

        return {
            requestOauthToken,
            authorizeUser,
            getUserName,
            getOauthVerifierCookie,
            checkAcessToken,
            exchangeAcessToken,
            getUserPhotos,
            logoutUser
        };
    };
    return {
      getInstance: function () {
          if (!instance) {
              instance = createInstance();
          }
          return instance;
      }
    };
})();
export default FlickrServices;