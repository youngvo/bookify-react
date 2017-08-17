import LocaleUtils from './LocaleUtils';
import { photoTypes } from './../constants/Constants';

const API_ERRORS_CODE = {
    'image.upload'                                  : 'api_error_code.image.upload',
    'photo.badcolorspace'                           : 'api_error_code.photo.badcolorspace',
    'user.username_must_be_between'                 : 'api_error_code.user.username_must_be_between',
    'user.username_contains_forbidden_characters'   : 'api_error_code.user.username_contains_forbidden_characters',
    'user.username_already_exists'                  : 'api_error_code.user.username_already_exists',
    'user.username_contains_bad_word'               : 'api_error_code.user.username_contains_bad_word',
    'user.password_too_short'                       : 'api_error_code.user.password_too_short',
    'email.field_requested'                         : 'api_error_code.email.field_requested',
    'email.address_is_not_valid'                    : 'api_error_code.email.address_is_not_valid',
    'email.address_already_taken'                   : 'api_error_code.email.address_already_taken',
    'email.missing_@'                               : 'api_error_code.email.missing_@',
    'registration.error'                            : 'api_error_code.registration.error',
    'login.invalid'                                 : 'error.invalid_login',
};

const AM = "AM";
const PM = "PM";

class Utils {
     static getCurrentTime() {
        let date = new Date();
        let hour = date.getHours();
        let meridiem = AM;
        if (hour > 12) {
            meridiem = PM;
            hour -= 12;
        }
        let minutes = date.getMinutes();
        let currentTime = hour + ':' + (minutes >= 10 ? minutes : '0' + minutes)
            + ' ' + meridiem;

        return currentTime;
    };

    static verifyEmail = (email) => {
        var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
        return pattern.test(email);
    }

    static getUrlParam(paramName) {
      var nvps = window.location.search.slice(1).split('&');
      for (var i = 0, len = nvps.length; i < len; i++) {
          var nvp = nvps[i].split('=');
          if (nvp[0] === paramName) {
              return nvp[1];
          }
      }
      return null;
    }

    static readCookie(name) {
        var cookieValue = "";
        var search = name + "=";
        if (document.cookie.length > 0) {
            var offset = document.cookie.indexOf(search);
            if (offset !== -1) {
                offset += search.length;
                var end = document.cookie.indexOf(";", offset);
                if (end === -1) {
                    end = document.cookie.length;
                }
                cookieValue = unescape(document.cookie.substring(offset, end))
            }
        }
        return cookieValue;
    }

    static setCookie(name, value, expirationSecs) {
        var expDate = new Date(new Date().getTime() + (1000*expirationSecs));
        var expires = '; expires=' + expDate.toGMTString();
        var firstDot = window.location.host.indexOf('.');
        var domainWithoutSubdomain = window.location.host.slice(firstDot + 1);
        var domain = '; domain=' + domainWithoutSubdomain;
        document.cookie = name + "=" + value + expires + domain + '; path=/';
        return true;
    }

    static getAPIErrorMessage(errorKey) {
        if (API_ERRORS_CODE[errorKey]) {
            return LocaleUtils.instance.translate(API_ERRORS_CODE[errorKey]);
        }
        return errorKey;
    }

    static mergeRecursive(dst, src) {
        if (typeof src !== 'object' || src === null) {
            return dst;
        }

        for (var p in src) {
            if (!src.hasOwnProperty(p)){
                continue;
            }
            if (src[p] === undefined) {
                continue;
            }
            if ( typeof src[p] !== 'object' || src[p] === null) {
                dst[p] = src[p];
            } else if (typeof dst[p]!=='object' || dst[p] === null) {
                dst[p] = Utils.mergeRecursive(src[p].constructor===Array ? [] : {}, src[p]);
            } else {
                Utils.mergeRecursive(dst[p], src[p]);
            }
        }
        return dst;
    }

    static compareValues(key, order = 'asc') {
        return function (a, b) {
            if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                console.log(key + ' is not exist');
                return 0;
            }

            const varA = (typeof a[key] === 'string') ?
                a[key].toUpperCase() : a[key];
            const varB = (typeof b[key] === 'string') ?
                b[key].toUpperCase() : b[key];

            let comparison = 0;
            if (varA > varB) {
                comparison = 1;
            } else if (varA < varB) {
                comparison = -1;
            }
            return (
                (order === 'desc') ? (comparison * -1) : comparison
            );
        };
    }
    static getMonthName(month) {
			var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
			return (months[month]).toString();
    }

    static formatDateStr(dateStr) {
        let dateString = dateStr.replace(' ', ':');
        let dateStringArr = dateString.split(':');
        let date = new Date();
        date.setFullYear(dateStringArr[0]);
        date.setMonth(dateStringArr[1] - 1);
        date.setDate(dateStringArr[2]);
        return date.toLocaleDateString();
    }

    static isBrowerVersionSupported(arrMinimalVersions) {
      let bowser = require('bowser');
      let isUnsupported = arrMinimalVersions ? bowser.isUnsupportedBrowser(arrMinimalVersions) : true;
      return !isUnsupported;
    }

    static randomString(length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for(var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };

    static generateTimeStamp() {
        var dateTime = Date.now();
        return Math.floor(dateTime / 1000);
    };

    static getUrlVars(str) {
        var vars = {}, hash;
        var hashes = str.split('&');

        for(var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars[hash[0]] = hash[1];
        }
        return vars;
    };

    static JSVer() {
      // STEP ONE: Convert all characters to lowercase to simplify testing
      var agt=navigator.userAgent.toLowerCase();

      // SETP TWO: Determine Browser Version
      // Note: On IE5, these return 4, so use is_ie5up to detect IE5.
      var is_major = parseInt(navigator.appVersion);
      var is_minor = parseFloat(navigator.appVersion);

      // Note: Opera and WebTV spoof Navigator.  We do strict client detection.
      // If you want to allow spoofing, take out the tests for opera and webtv.
      var is_nav  = ((agt.indexOf('mozilla')!=-1) && (agt.indexOf('spoofer')==-1)
        && (agt.indexOf('compatible') == -1) && (agt.indexOf('opera')==-1)
        && (agt.indexOf('webtv')==-1) && (agt.indexOf('hotjava')==-1));
      var is_nav2 = (is_nav && (is_major == 2));
      var is_nav3 = (is_nav && (is_major == 3));
      var is_nav4 = (is_nav && (is_major == 4));
      var is_nav4up = (is_nav && (is_major >= 4));
      var is_navonly = (is_nav && ((agt.indexOf(";nav") != -1) ||
        (agt.indexOf("; nav") != -1)) );
      var is_nav6 = (is_nav && (is_major == 5));
      var is_nav6up = (is_nav && (is_major >= 5));
      var is_gecko = (agt.indexOf('gecko') != -1);

      var is_ie     = ((agt.indexOf("msie") != -1) && (agt.indexOf("opera") == -1));
      var is_ie3    = (is_ie && (is_major < 4));
      var is_ie4    = (is_ie && (is_major == 4) && (agt.indexOf("msie 4")!=-1) );
      var is_ie4up  = (is_ie && (is_major >= 4));
      var is_ie5    = (is_ie && (is_major == 4) && (agt.indexOf("msie 5.0")!=-1) );
      var is_ie5_5  = (is_ie && (is_major == 4) && (agt.indexOf("msie 5.5") !=-1));
      var is_ie5up  = (is_ie && !is_ie3 && !is_ie4);
      var is_ie5_5up =(is_ie && !is_ie3 && !is_ie4 && !is_ie5);
      var is_ie6    = (is_ie && (is_major == 4) && (agt.indexOf("msie 6.")!=-1) );
      var is_ie6up  = (is_ie && !is_ie3 && !is_ie4 && !is_ie5 && !is_ie5_5);

      // KNOWN BUG: On AOL4, returns false if IE3 is embedded browser
      // or if this is the first browser window opened.  Thus the
      // variables is_aol, is_aol3, and is_aol4 aren't 100% reliable.
      var is_aol   = (agt.indexOf("aol") != -1);
      var is_aol3  = (is_aol && is_ie3);
      var is_aol4  = (is_aol && is_ie4);
      var is_aol5  = (agt.indexOf("aol 5") != -1);
      var is_aol6  = (agt.indexOf("aol 6") != -1);

      var is_opera = (agt.indexOf("opera") != -1);
      var is_opera2 = (agt.indexOf("opera 2") != -1 || agt.indexOf("opera/2") != -1);
      var is_opera3 = (agt.indexOf("opera 3") != -1 || agt.indexOf("opera/3") != -1);
      var is_opera4 = (agt.indexOf("opera 4") != -1 || agt.indexOf("opera/4") != -1);
      var is_opera5 = (agt.indexOf("opera 5") != -1 || agt.indexOf("opera/5") != -1);
      var is_opera5up = (is_opera && !is_opera2 && !is_opera3 && !is_opera4);

      var is_webtv = (agt.indexOf("webtv") != -1);
      var is_TVNavigator = ((agt.indexOf("navio") != -1) || (agt.indexOf("navio_aoltv") != -1));
      var is_AOLTV = is_TVNavigator;

      var is_hotjava = (agt.indexOf("hotjava") != -1);
      var is_hotjava3 = (is_hotjava && (is_major == 3));
      var is_hotjava3up = (is_hotjava && (is_major >= 3));

      // STEP THREE: Associate Javascript Version with Browser
      var is_js;
      if (is_nav2 || is_ie3) is_js = 1.0;
      else if (is_nav3) is_js = 1.1;
      else if (is_opera5up) is_js = 1.3;
      else if (is_opera) is_js = 1.1;
      else if ((is_nav4 && (is_minor <= 4.05)) || is_ie4) is_js = 1.2;
      else if ((is_nav4 && (is_minor > 4.05)) || is_ie5) is_js = 1.3;
      else if (is_hotjava3up) is_js = 1.4;
      else if (is_nav6 || is_gecko) is_js = 1.5;
      // NOTE: In the future, update this code when newer versions of JS
      // are released. For now, we try to provide some upward compatibility
      // so that future versions of Nav and IE will show they are at
      // *least* JS 1.x capable. Always check for JS version compatibility
      // with > or >=.
      else if (is_nav6up) is_js = 1.5;
      // NOTE: ie5up on mac is 1.4
      else if (is_ie5up) is_js = 1.3
      // HACK: no idea for other browsers; always check for JS version with > or >=
      else is_js = 0.0;
      return 'Javascript ' + is_js;
    }

    static getImageNameFromImageUrl(imageUrl) {
        let pathName = '';

        const slashIndex = imageUrl.lastIndexOf('/');
        if (slashIndex >= 0) {
            pathName = imageUrl.substr(slashIndex + 1);
        }

        const questionIndex = pathName.indexOf('?');
        if (questionIndex >= 0) {
            pathName = pathName.substr(0, questionIndex);
        }

        return pathName;
    }

    static filterSelectedImages(imagesSelected, photoList, uploadType) {
        let imagesDuplicated = [];
        let imagesFilted = [];

        for (let image of imagesSelected) {
            let imageName = uploadType === photoTypes.COMPUTER ? image.name : this.getImageNameFromImageUrl(image.imageUrl);     //name: images from local - imageUrl: images from services
            if (photoList.hasOwnProperty(imageName)) {
                imagesDuplicated.push(photoList[imageName]);
            } else {
                imagesFilted.push(image);
            }
        }

        return {
            imagesDuplicated,
            imagesFilted
        };
    }

    static replaceLowImageByOrigin(imageUrl) {
      // var slashIndex = imageUrl.lastIndexOf('/');
      // var relatePath = '/';
      // var pathName = '';
      // if (slashIndex >= 0) {
      //   relatePath = imageUrl.substr(0, slashIndex + 1);
      //   pathName = imageUrl.substr(slashIndex + 1);
      // }
      // return relatePath + pathName.replace('L', 'O');

        return imageUrl;
    }

    /**
		 * Number of minutes between two dates
		 */
		static minutesBetweenDates(startDate, endDate) {
			var millis = endDate.getTime() - startDate.getTime();
			var secs = millis / 1000;
			var mins = secs / 60;
			return Math.round(mins);
		}

    static extractOSName() {
      let bowser = require('bowser');
      if (bowser.mac) {
        return 'Mac OS X ' + bowser.osversion;
      }
      if (bowser.windows) {
        return 'Windows ' + bowser.osversion;
      }
      if (bowser.windowsphone) {
        return 'windows phone ' + bowser.osversion;
      }
      if (bowser.iosdevice) {
        return 'ios like mac os x ' + bowser.osversion;
      }
      if (bowser.android) {
        return 'android ' + bowser.osversion;
      }
      if (bowser.webos) {
        return 'webos ' + bowser.osversion;
      }
      if (bowser.blackberry) {
        return  'rim tablet ' + bowser.osversion;
      }
      if (bowser.bada) {
        return 'bada ' + bowser.osversion;
      }
      if (bowser.tizen) {
        return 'tizen ' + bowser.osversion;
      }
    }
}

export default Utils;
