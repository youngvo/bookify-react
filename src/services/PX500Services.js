import _500px from './../libs/500px';
import LocationUtils  from './../utils/LocationUtils';
import Config from './../config/Config';

//  Consumer Key: t6ezohyoTKZ7lh9EiB5gJyl8KDJvcXmgOMGaBlN9
// Consumer Secret: IeJ7BNBvJhnXsW8hY3MXByzE6Wb6HqnV2IYmRihk
// JavaScript SDK Key: 55b1c1a690d637dd38730a2be2f96e1da7bd36e3
var PX500Services = ( function () {

    var instance;

    var createInstance = () => {
        var isInitSdk = false;
        var SDK_KEY= '';
        var userName= '';

        var configKey = () => {
            let domain = LocationUtils.instance.domain();
            console.log( "Domain ", domain)
            // console.log( "Domain ", document.domain)
            switch (domain) {
                case 'localhost':
                    SDK_KEY = Config.instance.retrieve500pxAppIDTest();
                break;
                case 'master':
                    SDK_KEY = Config.instance.retrieve500pxAppId();
                break;
                default:
                    SDK_KEY = Config.instance.retrieve500pxAppId();
                break;
            }
        }
        var init500Px = function () {
          console.log("--------------------------------------");
          if (isInitSdk) return;

          configKey();
          window._500px.init({
              sdk_key: SDK_KEY
          });
          isInitSdk = true;
      };

      var checkAuthorize = function () {
          window._500px.authorize(function (response) {
              if (response !== 'authorized') {
                  console.log("not authorized");
              } else {
                  console.log(" authorized");
              }
          });
      };

        var login = function (userLoginSuccess, userLoginFailed = null) {
             window._500px.login(function (response) {
               console.log('response px500: ',response);
               if (response === 'denied') {
                  if (userLoginFailed) userLoginFailed(response);
               } else if (response === 'authorized') {

                  userLoginSuccess();
               } else {
                  if (userLoginFailed) userLoginFailed(response);
               }
             });
        };

        var getUser = (getUserCallback) => {
              window._500px.api('/users', function (response) {
                  getUserCallback(response);
              });
        };

        var getUserPhotos = function (getUserPhotosCallback) {
                window._500px.api('/users', function (response) {
                    var me = response.data.user;
                    console.log("User: ", me);
                    userName = me.username;
                    window._500px.api('/photos', { feature: 'user', user_id: me.id ,image_size : [2, 2048], rpp: 100}, function (response) {
                        getUserPhotosCallback(response);
                    });
                });

        };
        var getUserName = () => {
            return userName;
        }

        var logout = function () {
             window._500px.logout(function (response) {
                console.log("Log out", response);
             });
        };

      return {
          init500Px,
          checkAuthorize,
          login,
          logout,
          getUser,
          getUserName,
          getUserPhotos,
      }
  };
      return{
          getInstance: function () {
              if (!instance) {
                  instance = createInstance();
              }
              return instance;
          }
    }
})();
export default PX500Services;
