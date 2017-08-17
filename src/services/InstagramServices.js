/**
 * This is Instagram services class
 * Authenticate and get user photos... start from here
 */

import fetchJsonp from 'fetch-jsonp';
import LocationUtils  from './../utils/LocationUtils';
import Utils  from './../utils/Utils';
import Config from './../config/Config';

export const instagramTokenName = 'instagramToken';
const REDIRECT_URI_CALLBACK= "/instagram.html";//http://localhost:3000/instagram.html , http://www.master.eng.blurb.com/obt/instagram.html, http://www.blurb.com/obt/instagram.html
const SELF_URL =            `/users/self/media/recent?access_token=`;
const SELF_INFO_URL =       `/users/self/?access_token=`;
const BASE_URL =            "https://api.instagram.com/v1"; // NO PMD
const LOG_OUT_URL =         "https://instagram.com/accounts/logout/";
const CORS_API_URL  = 'https://cors-anywhere.herokuapp.com/';
var   acces_token =      "";


var InstagramServices = (function () {

    var instance;


    var createInstance = function () {
        var REDIRECT_URI = '';
        var CLIENT_ID = '';
        // var instagramTokenName = 'instagramToken';
        var userName= '';
        var path = '';

        var getUserInfo = () => {
            let real_url = BASE_URL + SELF_INFO_URL + acces_token;

            fetchJsonp(real_url)
                .then(function(response) {
                    return response.json();
                }).then(function(json) {
                     if (json.meta.code !== 400)
                     userName = json.data.username;
                }).catch(function(ex) {
                    console.log('parsing failed', ex)
                });
        };

        var getUserName = () => {
            return userName;
        };

        var setAccessToken = (new_access_token) => {
            acces_token = new_access_token;
        };

        var deleteCookie = (name) => {
            if(typeof InstallTrigger !== 'undefined') {
                document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;' + 'path='+ path+"/";
            }else/*(!!window.chrome && !!window.chrome.webstore)*/ {
                document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;' + 'path='+ path;
            }
        };

        var getInstagramCookie = () => {
            let allCookies = document.cookie;
            var cookieArray = allCookies.split(';');
            for (let i = 0; i < cookieArray.length; i++) {
                let name  = cookieArray[i].split('=')[0];
                let value = cookieArray[i].split('=')[1];
                if (name.trim() === instagramTokenName) {
                    setAccessToken(value);
                }
            };
        };

        var getAccessToken = () => {

            return acces_token;
        };

        var openLoginWindow = () => {
            let domain = LocationUtils.instance.domain();
            REDIRECT_URI = LocationUtils.instance.homepage + REDIRECT_URI_CALLBACK;
            switch (domain) {
                case 'localhost':
                    CLIENT_ID = Config.instance.retrieveInstagramAppIDTest();
                break;
                case 'master':
                    CLIENT_ID = Config.instance.retrieveInstagramAppId();
                break;
                default:
                    CLIENT_ID = Config.instance.retrieveInstagramAppId();
                    path = document.location.pathname;
                break;
            }
            let width = 850 , height = 750;
            let center_left = (window.screen.width / 2) - (width / 2);
	        let center_top = (window.screen.height / 2) - (height / 2);
            return  window.open(`https://api.instagram.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=public_content`,
                '_target', "toolbar=yes,scrollbars=yes,resizable=yes,width="+width+",height="+height+",left="+center_left+",top="+center_top);
        };

        var getUserPhotos = (getUserPhotosSuccess, getUserPhotosFailed =null) => {
            let insToken = Utils.readCookie(instagramTokenName);
            setAccessToken(insToken);
            let real_url = BASE_URL + SELF_URL + acces_token + `&count=1000`;
            getUserInfo();
            fetchJsonp(real_url)
                .then(function(response) {
                    return response.json();
                }).then(function(json) {
                    getUserPhotosSuccess(json);
                }).catch(function(ex) {
                    if (getUserPhotosFailed) {
                        getUserPhotosFailed(ex)
                    }
                    console.log('parsing failed', ex)
                });
        };

        var logoutUser = () => {
            let url = CORS_API_URL+ "http://instagram.com/accounts/logout/";
            deleteCookie(instagramTokenName);
            Utils.setCookie(instagramTokenName,"", -1);
            setAccessToken("");
            fetch(url)
                .then(function(response) {
                     console.log("----", response);
                    return response.json();
                }).then(function(json) {
                // if get Photo success then return callback;
                    console.log("----", json);
            }).catch(function(ex) {

            });
        };

        return{
            getInstagramCookie,
            getAccessToken,
            getUserPhotos,
            setAccessToken,
            openLoginWindow,
            getUserName,
            logoutUser,
        };
    };

    return{
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        },
    };
})();
export default InstagramServices;
