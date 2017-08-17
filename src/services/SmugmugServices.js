
import oauthSignature from 'oauth-signature';
// import fetchJsonp from 'fetch-jsonp';
import $ from 'jquery';
import LocationUtils  from './../utils/LocationUtils';
import Config from './../config/Config';
// Key generated for the v2 API 04/03/2017
// const apiKey = "GV5QnCv63gV4nsQNW32m2jLB98j6WT8h";
// const secretKey = "HWk3QCgCt922tNKsHkMMzmX3cjPccKT4MzGGhW6srxTzwxrjgBdRznNrTj3x2Xp6";


const API_ORIGIN = 'https://api.smugmug.com';
const REDIRECT_URI_LOCAL = "http://localhost:3000/callback.html";
const OAUTH_ORIGIN = 'https://secure.smugmug.com';
const REQUEST_TOKEN_URL = API_ORIGIN + '/services/oauth/getRequestToken';
const ACCESS_TOKEN_URL = API_ORIGIN + '/services/oauth/getAccessToken';
const AUTHORIZE_URL = API_ORIGIN + '/services/oauth/authorize';
const CORS_API_URL  = 'https://cors-anywhere.herokuapp.com/';
var baseUrl ='';

var SmugmugServices = (function () {
    var instance;
    var createInstance = function () {
        let oauth_token = '';
        let oauth_token_secret = '';
        let oauth_verifier = '';
        let API_KEY, KEY_SECRET, REDIRECT_URI;
        let userName = '';

        var getUserName = () => {
            return userName;
        };

        const configKey = () => {
            let domain = LocationUtils.instance.domain();
            console.log( "Domain ", domain)
            // console.log( "Domain ", document.domain)
            switch (domain) {
                case 'localhost':
                    API_KEY = Config.instance.retrieveSmugAppIdTest();
                    KEY_SECRET = Config.instance.retrieveSmugSecretAppIDTest();
                    REDIRECT_URI = REDIRECT_URI_LOCAL;
                    break;
                case 'master':
                    API_KEY = Config.instance.retrieveSmugAppId();
                    KEY_SECRET = Config.instance.retrieveSmugSecretAppID();
                    REDIRECT_URI = LocationUtils.instance.homepage + '/callback.html';
                    break;
                default:
                    API_KEY = Config.instance.retrieveSmugAppId();
                    KEY_SECRET = Config.instance.retrieveSmugSecretAppID();
                    REDIRECT_URI = LocationUtils.instance.homepage + '/callback.html';
                    break;
            }
        }

        var randomString = (length) => {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for(var i = 0; i < length; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        };

        var getUrlVars = (str) => {
           var vars = {}, hash;
           var hashes = str.split('&');

           for(var i = 0; i < hashes.length; i++) {
               hash = hashes[i].split('=');
               vars[hash[0]] = hash[1];
           }
           return vars;
        }

        var generateTimeStamp = () => {
            var dateTime = Date.now();
            return Math.floor(dateTime / 1000);
        };
        var getOauthVerifierCookie = (getOauthVerifySuccess, getOauthVerifyFailed = null) => {
            let oauthVerifier = 'oauthVerifier';
            let allCookies = document.cookie;
            var cookieArray = allCookies.split(';');
            for (let i = 0; i < cookieArray.length; i++) {
                let name  = cookieArray[i].split('=')[0];
                let value = cookieArray[i].split('=')[1];
                if (name.trim() === oauthVerifier) {
                    oauth_verifier = value;
                }
            }
            oauth_verifier.length > 0 ? getOauthVerifySuccess() : getOauthVerifyFailed()
        };
        var requestOauthToken = (requestTokenSuccess, requestTokenFailed = null) => {
            configKey();

            var httpMethod = 'GET',
            url = REQUEST_TOKEN_URL,
            parameters = {
                oauth_callback: 'oob'/*REDIRECT_URI*/,
               // oauth_token: '556dBRbBJVchT7QvvRtV7btJbNZKLzBP',
                oauth_consumer_key : API_KEY,
                oauth_nonce : randomString(32),
                oauth_timestamp : generateTimeStamp(),
                oauth_signature_method : 'HMAC-SHA1',
                oauth_version : '1.0',
            },
            consumerSecret = KEY_SECRET,
           // tokenSecret = 'KLLTgpHTNhWPbLtqbdHVZRRX7sBBG6hDqBvbDTZ2fMLnk3JFNFvg2qcTcZG8SvGB',
            signature = oauthSignature.generate(httpMethod,url,parameters,consumerSecret);

            baseUrl = REQUEST_TOKEN_URL + `?oauth_callback=${parameters.oauth_callback}&oauth_consumer_key=${API_KEY}&oauth_nonce=${parameters.oauth_nonce}&oauth_signature_method=${parameters.oauth_signature_method}&oauth_signature=${signature}&oauth_version=${parameters.oauth_version}&oauth_timestamp=${parameters.oauth_timestamp}`;
            //popup = window.open(baseUrl,'_blank'/*, "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=800,height=800"*/);

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
                    let vars = getUrlVars(result);
                    oauth_token = vars['oauth_token'];
                    oauth_token_secret = vars['oauth_token_secret'];
                    requestTokenSuccess(vars);
                })
                .catch(function(ex) {
                    if (requestTokenFailed) requestTokenFailed(ex);
            });
        }

        var authorizeUser = () => {
            var httpMethod = 'GET',
                url = AUTHORIZE_URL,
                parameters = {
                    //oauth_callback: ACCESS_TOKEN_URL, // no need callback
                    oauth_token: oauth_token,
                    oauth_consumer_key : API_KEY,
                    oauth_nonce : randomString(32),
                    oauth_timestamp : generateTimeStamp(),
                    oauth_signature_method : 'HMAC-SHA1',
                    oauth_version : '1.0',
                    Access: 'full',
                },
                consumerSecret = KEY_SECRET,
                tokenSecret = oauth_token_secret,
                signature = oauthSignature.generate(httpMethod,url,parameters,consumerSecret,tokenSecret);

            var baseUrl = AUTHORIZE_URL + `?Access=${parameters.Access}&oauth_consumer_key=${API_KEY}&oauth_nonce=${parameters.oauth_nonce}&oauth_signature_method=${parameters.oauth_signature_method}&oauth_signature=${signature}&oauth_timestamp=${parameters.oauth_timestamp}&oauth_token=${parameters.oauth_token}&oauth_version=${parameters.oauth_version}`

            return  window.open(baseUrl,"_blank");
        };

        var exchangeAcessToken = (ExchangeAcessTokenSuccess , ExchangeAcessTokenFailed = null) => {
            var httpMethod = 'GET',
                    url = ACCESS_TOKEN_URL,
                    parameters = {
                        //oauth_callback: "http://localhost:3000/callback.html",
                        oauth_token: oauth_token,
                        oauth_consumer_key : API_KEY,
                        oauth_nonce : randomString(32),
                        oauth_timestamp : generateTimeStamp(),
                        oauth_signature_method : 'HMAC-SHA1',
                        oauth_version : '1.0',
                        oauth_verifier: oauth_verifier,
                    },
                    consumerSecret = KEY_SECRET,
                    tokenSecret = oauth_token_secret,
                    signature = oauthSignature.generate(httpMethod,url,parameters,consumerSecret, tokenSecret);

                baseUrl = url + `?oauth_consumer_key=${API_KEY}&oauth_nonce=${parameters.oauth_nonce}&oauth_signature_method=${parameters.oauth_signature_method}&oauth_signature=${signature}&oauth_timestamp=${parameters.oauth_timestamp}&oauth_token=${parameters.oauth_token}&oauth_verifier=${parameters.oauth_verifier}&oauth_version=${parameters.oauth_version}`;

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
                        let vars = getUrlVars(result);
                        oauth_token = vars['oauth_token'];
                        oauth_token_secret = vars['oauth_token_secret'];
                        ExchangeAcessTokenSuccess();
                    })
                    .catch(function(ex) {
                        console.log("Error", ex);
                });
            };

            var checkAcessToken = (checkAcessTokenTokenCallback) => {
                var httpMethod = 'GET',
                    url = 'https://secure.smugmug.com/services/api/json/1.3.0',
                    parameters = {
                        method: 'smugmug.auth.checkAccessToken',
                        oauth_token: oauth_token,
                        oauth_consumer_key : API_KEY,
                        oauth_nonce : randomString(32),
                        oauth_timestamp : generateTimeStamp(),
                        oauth_signature_method : 'HMAC-SHA1',
                        oauth_version : '1.0',
                        oauth_verifier: oauth_verifier,
                    },
                    consumerSecret = KEY_SECRET,
                    tokenSecret = oauth_token_secret,
                    signature = oauthSignature.generate(httpMethod,url,parameters,consumerSecret, tokenSecret);

                baseUrl = url + `?method=${parameters.method}&oauth_consumer_key=${API_KEY}&oauth_nonce=${parameters.oauth_nonce}&oauth_signature_method=${parameters.oauth_signature_method}&oauth_signature=${signature}&oauth_timestamp=${parameters.oauth_timestamp}&oauth_token=${parameters.oauth_token}&oauth_verifier=${parameters.oauth_verifier}&oauth_version=${parameters.oauth_version}`;

                var myHeaders = new Headers();
                var myInit = { method: 'GET',
                    headers: myHeaders,
                    mode: 'cors',
                    cache: 'default',
                };

                let requestUrl = CORS_API_URL + baseUrl;
                fetch(requestUrl, myInit)
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(result) {
                        if (result.stat!== 'fail') {
                            userName = result.Auth.User.NickName;
                        }
                        checkAcessTokenTokenCallback(result)
                    })
                    .catch(function(ex) {
                        console.log("Check Access Token Failed:" , ex);
                });
            };

            //https://secure.smugmug.com/services/api/json/1.3.0,
            //method get image in album - smugmug.images.get
            var getUserAlbums = (getUserAlbumsSuccess, getUserAlbumsFailed = null) => {
                var httpMethod = 'GET',
                    url = 'https://secure.smugmug.com/services/api/json/1.3.0',
                    parameters = {
                        method: 'smugmug.albums.get',
                        Heavy: 'true',
                        oauth_token: oauth_token,
                        oauth_consumer_key : API_KEY,
                        oauth_nonce : randomString(32),
                        oauth_timestamp : generateTimeStamp(),
                        oauth_signature_method : 'HMAC-SHA1',
                        oauth_version : '1.0',
                    },
                    consumerSecret = KEY_SECRET,
                    tokenSecret = oauth_token_secret,
                    signature = oauthSignature.generate(httpMethod,url,parameters,consumerSecret, tokenSecret);

                /*get albums*/
                baseUrl = url + `?Heavy=true&method=${parameters.method}&oauth_consumer_key=${API_KEY}&oauth_nonce=${parameters.oauth_nonce}&oauth_signature_method=${parameters.oauth_signature_method}&oauth_signature=${signature}&oauth_timestamp=${parameters.oauth_timestamp}&oauth_token=${parameters.oauth_token}&oauth_version=${parameters.oauth_version}`;
                /*get image in album*/
                // baseUrl = url + `?AlbumID=${parameters.AlbumID}&AlbumKey=${parameters.AlbumKey}&Heavy=${parameters.Heavy}&method=${parameters.method}&oauth_consumer_key=${API_KEY}&oauth_nonce=${parameters.oauth_nonce}&oauth_signature_method=${parameters.oauth_signature_method}&oauth_signature=${signature}&oauth_timestamp=${parameters.oauth_timestamp}&oauth_token=${parameters.oauth_token}&oauth_version=${parameters.oauth_version}`;
                var myHeaders = new Headers();
                var myInit = { method: 'GET',
                    headers: myHeaders,
                    mode: 'cors',
                    cache: 'default',

                };
                let requestUrl = CORS_API_URL + baseUrl;
                fetch(requestUrl, myInit)
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(result) {
                        getUserAlbumsSuccess(result);
                    })
                    .catch(function(ex) {
                        if (getUserAlbumsFailed) getUserAlbumsFailed(ex);
                });
            };

             var getUserPhotosByAlbumId = (AlbumID, AlbumKey, getUserPhotosByAlbumIdSuccess, getUserPhotosByAlbumIdFailed = null) => {
                var httpMethod = 'GET',
                    url = 'https://secure.smugmug.com/services/api/json/1.3.0',
                    parameters = {
                        method: 'smugmug.images.get',
                        Heavy: 'true',
                        AlbumID: AlbumID,
                        AlbumKey: AlbumKey,
                        oauth_token: oauth_token,
                        oauth_consumer_key : API_KEY,
                        oauth_nonce : randomString(32),
                        oauth_timestamp : generateTimeStamp(),
                        oauth_signature_method : 'HMAC-SHA1',
                        oauth_version : '1.0',
                    },
                    consumerSecret = KEY_SECRET,
                    tokenSecret = oauth_token_secret,
                    signature = oauthSignature.generate(httpMethod,url,parameters,consumerSecret, tokenSecret);

                /*get albums*/
                //baseUrl = url + `?Extras=${parameters.Extras}&Heavy=true&method=${parameters.method}&oauth_consumer_key=${API_KEY}&oauth_nonce=${parameters.oauth_nonce}&oauth_signature_method=${parameters.oauth_signature_method}&oauth_signature=${signature}&oauth_timestamp=${parameters.oauth_timestamp}&oauth_token=${parameters.oauth_token}&oauth_version=${parameters.oauth_version}`;
                /*get image in album*/
                baseUrl = url + `?AlbumID=${parameters.AlbumID}&AlbumKey=${parameters.AlbumKey}&Heavy=${parameters.Heavy}&method=${parameters.method}&oauth_consumer_key=${API_KEY}&oauth_nonce=${parameters.oauth_nonce}&oauth_signature_method=${parameters.oauth_signature_method}&oauth_signature=${signature}&oauth_timestamp=${parameters.oauth_timestamp}&oauth_token=${parameters.oauth_token}&oauth_version=${parameters.oauth_version}`;
                var myHeaders = new Headers();
                var myInit = { method: 'GET',
                    headers: myHeaders,
                    mode: 'cors',
                    cache: 'default',

                };
                let requestUrl = CORS_API_URL + baseUrl;
                fetch(requestUrl, myInit)
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(result) {
                        getUserPhotosByAlbumIdSuccess(result);
                    })
                    .catch(function(ex) {
                        if (getUserPhotosByAlbumIdFailed) getUserPhotosByAlbumIdFailed(ex);
                });
            };

            var logoutUser = () => {
                var httpMethod = 'GET',
                    //'https://secure.smugmug.com/services/api/json/1.3.0/logout'
                    //https://api.smugmug.com/services/api/json/1.2.2/
                    url = 'https://api.smugmug.com/services/api/json/1.2.2/',
                    parameters = {
                        method: 'smugmug.logout',
                        oauth_token: oauth_token,
                        oauth_consumer_key : API_KEY,
                        oauth_nonce : randomString(32),
                        oauth_timestamp : generateTimeStamp(),
                        oauth_signature_method : 'HMAC-SHA1',
                        oauth_version : '1.0',
                    },
                    consumerSecret = KEY_SECRET,
                    tokenSecret = oauth_token_secret,
                    signature = oauthSignature.generate(httpMethod,url,parameters,consumerSecret, tokenSecret);

                baseUrl = url + `?method=${parameters.method}&oauth_consumer_key=${API_KEY}&oauth_nonce=${parameters.oauth_nonce}&oauth_signature_method=${parameters.oauth_signature_method}&oauth_signature=${signature}&oauth_timestamp=${parameters.oauth_timestamp}&oauth_token=${parameters.oauth_token}&oauth_version=${parameters.oauth_version}`;

                var myHeaders = new Headers();
                var myInit = { method: 'GET',
                    headers: myHeaders,
                    mode: 'cors',
                    cache: 'default',
                };
                let requestUrl = CORS_API_URL + baseUrl;
                fetch(requestUrl, myInit)
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(result) {
                        console.log("Log out:", result);
                    })
                    .catch(function(ex) {
                        console.log("Check Access Token Failed:" , ex);
                });
            };

        return {
            requestOauthToken,
            authorizeUser,
            getOauthVerifierCookie,
            exchangeAcessToken,
            checkAcessToken,
            getUserName,
            getUserAlbums,
            getUserPhotosByAlbumId,
            logoutUser,
        }
    };

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    }
})();
export default SmugmugServices;
