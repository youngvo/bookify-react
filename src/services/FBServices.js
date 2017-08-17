// const APP_ID_TEST1 = '149782938885657'; // new app_id for  TEST with account < username:thuc.tran@terralogic.com, pass:123456ab >
import LocationUtils from './../utils/LocationUtils';
import Config from './../config/Config';

var FBServices = (() => {

    var instance;
    var FB_APP_ID = '';
    var isInitSdk = false;

    var createInstance = () => {

        var userName = '';
        
        var getUserName = () => {
            return userName;
        }

        var configKey = () => {
            let domain = LocationUtils.instance.domain();
            let subDomain = LocationUtils.instance.subdomain();
            if (domain === 'localhost') {
                FB_APP_ID = Config.instance.retrieveFbAppIDTest();
            }

            if (subDomain === 'master' || LocationUtils.instance.isProductionDomain()) {
                FB_APP_ID = Config.instance.retrieveFbAppId();
            }
        } 
        var loadFbLoginApi = () => {
            if (isInitSdk) return;
            document.defaultView.fbAsyncInit = function () {
                window.FB.init({
                    appId:  FB_APP_ID,
                    cookie: true,  // enable cookies to allow the server to access the session
                    xfbml:  true,  // parse social plugins on this page
                    version:'v2.5' // use version 2.1
                });

            };
            console.log('fb init');
            // Load the SDK asynchronously
            (function (d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {
                    return;
                }
                js          = d.createElement(s);
                js.id       = id;
                js.src      = "//connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
            isInitSdk = true;
        };

        var initFbSDK = () => {
            configKey();
            loadFbLoginApi();
        };

        var getLoginStatus = (loginStatusTrue, loginStatusFalse) => {
            window.FB.getLoginStatus((response) => {
                if (response.status === 'connected') {
                    window.FB.api('/me', function (response) {
                        userName = response.name ;
                    });

                    loginStatusTrue();
                }
                else {
                    loginStatusFalse(response);
                }
            });
        }

        var login = (userLoginSuccess, userLoginFailed = null) => {
            window.FB.login(function (response) {
                if (response && response.authResponse) {
                    window.FB.api('/me', function (response) {
                        userName = response.name ;
                    });
                    // window.FB.api('/me/permissions', function (response) {
                    //     console.log('permission granted ' , response);
                    // });
                    userLoginSuccess();
                } else {
                    if (userLoginFailed) userLoginFailed(response.error);
                }
            }, {scope: 'user_photos, manage_pages'});
        };
        
        var getAccounts = (getAccountsSuccess, getAccountsFailed = null) => {
            window.FB.api('/me/accounts', (response) => {
                if (response && !response.error) {
                    getAccountsSuccess(response);
                } else {
                    if (getAccountsFailed) getAccountsFailed(response.error);
                }
            });
        };

        var getAlbums = (getAlbumsSuccess, getAlbumsFailed = null, account = null) => {
            let param = '/albums?fields=id,name,picture{url},photos.limit(100){id},photo_count&limit=9999';
            let url = '';
            if (account) {
                url = `/${account}${param}`;
            } else {
                url = `/me${param}`;
            }
            window.FB.api(url, (response) => {
                if (response && !response.error) {
                    getAlbumsSuccess(response);
                } else {
                    if (getAlbumsFailed) getAlbumsFailed(response.error);
                }
            });
        };

        var getTaggedAlbum = (getTaggedAlbumSuccess, getTaggedAlbumFailed = null) => {
            window.FB.api('/me/photos?fields=id,picture&limit=4', (response) => {
                if (response && !response.error) {
                    getTaggedAlbumSuccess(response);
                } else {
                    if (getTaggedAlbumFailed) getTaggedAlbumFailed(response.error);
                }
            });
        };

        var getPhotosOfAlbum = (albumId = null, getPhotosOfAlbumSuccess, response = null, getPhotosOfAlbumFailed = null) => {
            let url = " ";
            if (!albumId) {
                if(response.photos)
                    url = response.photos.paging.next;
                else
                    url = response.paging.next;
            }else {
                url =albumId + '?fields=count,photos.limit(100){id,name,picture,images,created_time,updated_time}'
            }
            window.FB.api(url, (response) => {    
                if (response && !response.error) {
                    getPhotosOfAlbumSuccess(response);
                } else {
                    if (getPhotosOfAlbumFailed) getPhotosOfAlbumFailed(response.error);
                }
            });
        };

        var getPhotosOfTaggedAlbum = (getPhotosOfTaggedAlbumSuccess, getPhotosOfTaggedAlbumFailed = null) => {
            let url = 'me/photos?fields=id,name,picture,images,created_time,updated_time&limit=400';
            window.FB.api(url, (response) => {
                if (response && !response.error) {
                    getPhotosOfTaggedAlbumSuccess(response);
                } else {
                    if (getPhotosOfTaggedAlbumFailed) getPhotosOfTaggedAlbumFailed(response.error);
                }
            })
        };

        var logout = (userLogoutSucess = null) => {
            window.FB.logout((response) => {
                //userLogoutSucess(response);
            })
        };

        return {
            initFbSDK,
            getLoginStatus,
            login,
            getUserName,
            logout,
            getAccounts,
            getAlbums,
            getTaggedAlbum,
            getPhotosOfAlbum,
            getPhotosOfTaggedAlbum
        };
    };
    return {
        getInstance: () => {
            if (!instance){
                instance = createInstance();
            }
            return instance;
        },
    }
})();
export default FBServices;
