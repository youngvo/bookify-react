import Logger from './../utils/Logger';
import LocationUtils from './../utils/LocationUtils';
import Utils from './../utils/Utils';

const configPath = 'app-config.xml';
const configPathOverridesLocal = 'app-config-overrides.local.xml';
const configPathOverridesMaster = 'app-config-overrides.xml.master-service';
const configPathOverridesIntegration = 'app-config-overrides.xml.integration-service';
const configPathOverridesProduct = 'app-config-overrides.xml';
const configPathOverridesWs = 'app-config-overrides.xml.ws-service';

const ASSET_PATH_NAME = 'assets';

class Config {
    static instance = new Config();

    constructor() {
        if (Config.instance) {
            return Config.instance;
        }

        this.domain = 'localhost';
        this.subdomain = '';
        this.port = 80;
        this.apiVersion = 'v1_1';

        this.logging = {enabled:true, level:'info'};
        this.enableDevTools       = false;
        this.minPagesInBook       = 20;
        this.maxPagesInBook       = 440;
        this.maxImageLimit        = 1000;
        this.maxImageWarning      = 100;
        this.maxUndo              = 12;
        this.instantBookTrimId    = "square_instantbook";
        this.maxBookTitle         = 128;
        this.maxAuthorTitle       = 256;
        this.apiUrls              = {};
        this.baseUrls             = {};
        this.images               = {};
        this.icons                = {};
        this.menuItems            = {};
        this.strings              = {};
        this.globalConfig         = {};
        this.leftMenuItems        = [];
        this.rightMenuItems       = [];
        this.fonts                = {};
        this.fontSizes            = [];

        this.facebookAppID        = {};
        this.facebookAppIDTest    = {};
        this.instagramAppID       = {};
        this.instagramAppIDTest   = {};
        this.px500AppID           = {};
        this.px500AppIDTest       = {};
        this.flickrAppID          = {};
        this.flickrSecretAppID    = {};
        this.flickrAppIDTest      = {};
        this.flickrSecretAppIDTest= {};
        this.smugAppID            = {};
        this.smugSecretAppID      = {};
        this.smugAppIDTest        = {};
        this.smugSecretAppIDTest  = {};
        this.jsonConfig           = {};
        this.photoImportOptions   = {};
        this.cteventconfig        = {};
        this.apiUrls              = { analyticsServiceUrl: 'http://clientevents.blurb.com/notice' };

        return this;
    }

    load(loadFinish) {
        this.domain = LocationUtils.instance.domain();
        this.subdomain = LocationUtils.instance.subdomain();
        this.port = window.location.port;

        let xml = require(`!xml!./${configPath}`);
        let xmlOverride = require(`!xml!./${this._getConfigPathOverrides()}`);

        let merge = Utils.mergeRecursive(xml, xmlOverride);

        this._parseJSON(merge, loadFinish);
    }

    _getConfigPathOverrides() {
        if (this.domain.indexOf('localhost') >= 0) return configPathOverridesLocal;
        if (this.subdomain.indexOf('master') >= 0) return configPathOverridesMaster;
        if (this.subdomain.indexOf('integration') >= 0) return configPathOverridesIntegration;
        if (this.subdomain.indexOf('ws') >= 0) return configPathOverridesWs;
        return configPathOverridesProduct;
    }

    _parseJSON(json, loadFinish = null) {
        this.jsonConfig = json.appconfig;
        if (this.jsonConfig.logging) this.logging.enabled = this.jsonConfig.logging[0].enabled[0];
        if (this.jsonConfig.logging) this.logging.level = this.jsonConfig.logging[0].level[0];
        if (this.jsonConfig.enableDevTools) this.enableDevTools = this.jsonConfig.enableDevTools[0];
        if (this.jsonConfig.minPagesInBook) this.minPagesInBook = this.jsonConfig.minPagesInBook[0];
        if (this.jsonConfig.maxPagesInBook) this.maxPagesInBook = this.jsonConfig.maxPagesInBook[0];
        if (this.jsonConfig.maxImageLimit) this.maxImageLimit  = this.jsonConfig.maxImageLimit[0];
        if (this.jsonConfig.maxImageWarning) this.maxImageWarning = this.jsonConfig.maxImageWarning[0];
        if (this.jsonConfig.maxUndo) this.maxUndo = this.jsonConfig.maxUndo[0];
        if (this.jsonConfig.instantBookTrimId) this.instantBookTrimId = this.jsonConfig.instantBookTrimId[0];
        if (this.jsonConfig.pdfBookMaxImageLimit) this.pdfBookMaxImageLimit = this.jsonConfig.pdfBookMaxImageLimit[0];

        if (this.jsonConfig.services) this._parseApiUrls(this.jsonConfig.services[0]);

        if (this.jsonConfig.icons) {
          this._parseIcons(this.jsonConfig.icons[0]);
        }
        if (this.jsonConfig.images) {
          this._parseImages(this.jsonConfig.images[0]);
        }
        if (this.jsonConfig.strings) {
          this._parseStrings(this.jsonConfig.strings[0]);
        }
        if (this.jsonConfig.fonts) {
            this._parseFonts(this.jsonConfig.fonts[0]);
        }
        if (this.jsonConfig.fontSizes) {
            this._parseFontSizes(this.jsonConfig.fontSizes[0]);
        }

        if (this.jsonConfig.facebookAppID) {
          this._parseFbAppId(this.jsonConfig.facebookAppID);
        }
        if (this.jsonConfig.facebookAppIDTest) {
          this._parseFbAppIdTest(this.jsonConfig.facebookAppIDTest);
        }

        if (this.jsonConfig.instagramAppID) {
          this._parseInstagramAppId(this.jsonConfig.instagramAppID);
        }
        if (this.jsonConfig.instagramAppIDTest) {
          this._parseInstagramAppIdTest(this.jsonConfig.instagramAppIDTest);
        }

        if (this.jsonConfig.px500AppID) {
          this._parse500pxAppId(this.jsonConfig.px500AppID);
        }
        if (this.jsonConfig.px500AppIDTest) {
          this._parse500pxAppIdTest(this.jsonConfig.px500AppIDTest);
        }

        if (this.jsonConfig.flickrAppID) {
          this._parseFlickrAppId(this.jsonConfig.flickrAppID);
        }
        if (this.jsonConfig.flickrSecretAppID) {
          this._parseFlickrSecretAppId(this.jsonConfig.flickrSecretAppID);
        }

        if (this.jsonConfig.flickrAppIDTest) {
          this._parseFlickrAppIdTest(this.jsonConfig.flickrAppIDTest);
        }
        if (this.jsonConfig.flickrSecretAppIDTest) {
          this._parseFlickrSecretAppIdTest(this.jsonConfig.flickrSecretAppIDTest);
        }

        if (this.jsonConfig.smugmugAppID) {
          this._parseSmugAppId(this.jsonConfig.smugmugAppID);
        }
        if (this.jsonConfig.smugmugSecretAppID) {
          this._parseSmugSecretAppId(this.jsonConfig.smugmugSecretAppID);
        }

        if (this.jsonConfig.smugmugAppIDTest) {
          this._parseSmugAppIdTest(this.jsonConfig.smugmugAppIDTest);
        }
        if (this.jsonConfig.smugmugSecretAppIDTest) {
          this._parseSmugSecretAppIdTest(this.jsonConfig.smugmugSecretAppIDTest);
        }

        this._parseCTEventConfig();
        this.photoImportOptions = this._parsePhotoImportOptions();
        this.leftMenuItems = this._parseMenuItems(this.jsonConfig.leftMenuItems);
        this.rightMenuItems = this._parseMenuItems(this.jsonConfig.rightMenuItems);
        if (loadFinish) {
            loadFinish();
        }
    }

    _parseApiUrls(servicesObj) {
        if (servicesObj.apiVersion) this.apiVersion = servicesObj.apiVersion[0];

        let baseUrls = this._parseBaseUrls(servicesObj);
        this.baseUrls = baseUrls;
        this._assignOriginalURLs(servicesObj);

        this._overridesApiUrls(baseUrls);
    }

    _overridesApiUrls(baseUrls) {
        for (let apiName in this.apiUrls) {
            let apiUrl = this.apiUrls[apiName];

            for (let baseApiName in baseUrls) {
                if (apiUrl.indexOf('[' + baseApiName + ']') >= 0) {
                    if (baseApiName === ASSET_PATH_NAME) {
                      this.apiUrls[apiName] = LocationUtils.instance.homepage + '/' + ASSET_PATH_NAME + apiUrl.split(']')[1];
                      continue;
                    }
                    this.apiUrls[apiName] = baseUrls[baseApiName] + apiUrl.split(']')[1];
                    break;
                }
            }
        }
    }

    _parseBaseUrls(servicesObj) {
        let baseUrlsObjXML = {};
        if (servicesObj.baseUrls) baseUrlsObjXML = servicesObj.baseUrls[0];

        let result = {};

        for (let baseUrlKey in baseUrlsObjXML) {
            let baseUrlValue = baseUrlsObjXML[baseUrlKey][0];
            baseUrlValue = baseUrlValue.replace('{domain}', this.domain);
            baseUrlValue = baseUrlValue.replace('{subdomain}', this.subdomain);
            baseUrlValue = baseUrlValue.replace('{port}', this.port);
            baseUrlValue = baseUrlValue.replace('{apiVersion}', this.apiVersion);

            result[baseUrlKey] = baseUrlValue;
        }

        return result;
    }

    _assignOriginalURLs(servicesObj) {
        if (servicesObj.sessionUrl) this.apiUrls.sessionUrl = servicesObj.sessionUrl[0];
        if (servicesObj.loginUrl) this.apiUrls.loginUrl = servicesObj.loginUrl[0];
        if (servicesObj.imageSetUrl) this.apiUrls.imageSetUrl = servicesObj.imageSetUrl[0];
        if (servicesObj.imageUploadUrl) this.apiUrls.imageUploadUrl = servicesObj.imageUploadUrl[0];
        if (servicesObj.httpProxyUrl) this.apiUrls.httpProxyUrl = servicesObj.httpProxyUrl[0];
        if (servicesObj.projectServiceUrl) this.apiUrls.projectServiceUrl = servicesObj.projectServiceUrl[0];
        if (servicesObj.testDriveUrl) this.apiUrls.testDriveUrl = servicesObj.testDriveUrl[0];
        if (servicesObj.starterProjectServiceUrl) this.apiUrls.starterProjectServiceUrl = servicesObj.starterProjectServiceUrl[0];
        if (servicesObj.bbfJobServiceUrl) this.apiUrls.bbfJobServiceUrl = servicesObj.bbfJobServiceUrl[0];
        if (servicesObj.bookRepublishServiceUrl) this.apiUrls.bookRepublishServiceUrl = servicesObj.bookRepublishServiceUrl[0];
        if (servicesObj.quickRenderServiceUrl) this.apiUrls.quickRenderServiceUrl = servicesObj.quickRenderServiceUrl[0];
        if (servicesObj.pageLayoutServiceUrl) this.apiUrls.pageLayoutServiceUrl = servicesObj.pageLayoutServiceUrl[0];
        if (servicesObj.coverLayoutServiceUrl) this.apiUrls.coverLayoutServiceUrl = servicesObj.coverLayoutServiceUrl[0];
        if (servicesObj.themeServiceUrl) this.apiUrls.themeServiceUrl = servicesObj.themeServiceUrl[0];
        if (servicesObj.autoflowLayoutsServiceUrl) this.apiUrls.autoflowLayoutsServiceUrl = servicesObj.autoflowLayoutsServiceUrl[0];
        if (servicesObj.pageBackgroundServiceUrl) this.apiUrls.pageBackgroundServiceUrl = servicesObj.pageBackgroundServiceUrl[0];
        if (servicesObj.imageBorderServiceUrl) this.apiUrls.imageBorderServiceUrl = servicesObj.imageBorderServiceUrl[0];
        if (servicesObj.usernameValidationUrl) this.apiUrls.usernameValidationUrl = servicesObj.usernameValidationUrl[0];
        if (servicesObj.userUrl) this.apiUrls.userUrl = servicesObj.userUrl[0];
        if (servicesObj.fontUrl) this.apiUrls.fontUrl = servicesObj.fontUrl[0];
        if (servicesObj.errorServiceUrl) this.apiUrls.errorServiceUrl = servicesObj.errorServiceUrl[0];
        if (servicesObj.pricingServiceUrl) this.apiUrls.pricingServiceUrl = servicesObj.pricingServiceUrl[0];
        if (servicesObj.bookDimensionsServiceUrl) this.apiUrls.bookDimensionsServiceUrl = servicesObj.bookDimensionsServiceUrl[0];
        if (servicesObj.pdfBookServiceUrl) this.apiUrls.pdfBookServiceUrl = servicesObj.pdfBookServiceUrl[0];
        if (servicesObj.analyticsServiceUrl) this.apiUrls.analyticsServiceUrl = servicesObj.analyticsServiceUrl[0];
        if (servicesObj.crossdomainXmlUrl) this.apiUrls.crossdomainXmlUrl = servicesObj.crossdomainXmlUrl[0];
        if (servicesObj.s3CrossdomainXmlUrl) this.apiUrls.s3CrossdomainXmlUrl = servicesObj.s3CrossdomainXmlUrl[0];
    }

    _parseIcons(json) {
      let icons = json.icon;
      for (let i = 0; i < icons.length; i++) {
          let icon = icons[i];
          this.icons[icon['$'].id] = icon['$'].name;
      }
    }

    _parseImages(json) {
      let images = json.image;
      for (let i = 0; i < images.length; i++) {
          let image = images[i];
          this.images[image['$'].id] = image['$'].name;
      }
    }

    _parseFonts(json) {
        let fonts = json.font;
        for (let i = 0; i < fonts.length; i++) {
            let font = fonts[i];
            this.fonts[font['$'].family] = font['$'];
        }
    }

    _parseFontSizes(json) {
        let fontSizes = json;
        this.fontSizes = json.split(',');
    }

    _parseStrings(json) {
      let strings = json.string;
      for (let i = 0; i < strings.length; i++) {
          let item = strings[i];
          this.strings[item['$'].id] = item['$'].text;
      }
    }

    retrieveString(id) {
      return this.strings[id];
    }

    _parseFbAppId(jsonConfig) {
        let facebookAppID = jsonConfig;
        this.facebookAppID = facebookAppID[0];
    }

    _parseFbAppIdTest(jsonConfig) {
        let facebookAppIDTest = jsonConfig;
        this.facebookAppIDTest = facebookAppIDTest[0];
    }

    _parseInstagramAppId(jsonConfig) {
        let instagramAppID = jsonConfig;
        this.instagramAppID = instagramAppID[0];
    }

    _parseInstagramAppIdTest(jsonConfig) {
        let instagramAppIDTest = jsonConfig;
        this.instagramAppIDTest = instagramAppIDTest[0];
    }

    _parse500pxAppId(jsonConfig) {
        let px500AppID = jsonConfig;
        this.px500AppID = px500AppID[0];
    }

    _parse500pxAppIdTest(jsonConfig) {
        let px500AppIDTest = jsonConfig;
        this.px500AppIDTest = px500AppIDTest[0];
    }

    _parseFlickrAppId(jsonConfig) {
        let flickrAppID = jsonConfig;
        this.flickrAppID = flickrAppID[0];
    }

    _parseFlickrSecretAppId(jsonConfig) {
        let flickrSecretAppID = jsonConfig;
        this.flickrSecretAppID = flickrSecretAppID[0];
    }

    _parseFlickrAppIdTest(jsonConfig) {
        let flickrAppIDTest = jsonConfig;
        this.flickrAppIDTest = flickrAppIDTest[0];
    }

    _parseFlickrSecretAppIdTest(jsonConfig) {
        let flickrSecretAppIDTest = jsonConfig;
        this.flickrSecretAppIDTest = flickrSecretAppIDTest[0];
    }

    _parseSmugAppId(jsonConfig) {
        let smugAppID = jsonConfig;
        this.smugAppID = smugAppID[0];
    }

    _parseSmugSecretAppId(jsonConfig) {
        let smugSecretAppID = jsonConfig;
        this.smugSecretAppID = smugSecretAppID[0];
    }

    _parseSmugAppIdTest(jsonConfig) {
        let smugAppIDTest = jsonConfig;
        this.smugAppIDTest = smugAppIDTest[0];
    }

    _parseSmugSecretAppIdTest(jsonConfig) {
        let smugSecretAppIDTest = jsonConfig;
        this.smugSecretAppIDTest = smugSecretAppIDTest[0];
    }

    _parsePhotoImportOptions() {
      let options = {};
      if (this.jsonConfig.photoImportOptions) {
        let json = this.jsonConfig.photoImportOptions[0];
        let photoImportOptions = json.option;
        for (let i = 0; i < photoImportOptions.length; i++) {
            let item = photoImportOptions[i];
            options[item['$'].id] = item['$'];
        }
      }
      return options;
    }

    retrieveFbAppId() {
        return this.facebookAppID;
    }

    retrieveFbAppIDTest() {
        return this.facebookAppIDTest;
    }

    retrieveInstagramAppId() {
        return this.instagramAppID;
    }

    retrieveInstagramAppIDTest() {
        return this.instagramAppIDTest;
    }

    retrieve500pxAppId() {
        return this.px500AppID;
    }

    retrieve500pxAppIDTest() {
        return this.px500AppIDTest;
    }

    retrieveFlickrAppId() {
        return this.flickrAppID;
    }

    retrieveFlickrSecretAppID() {
        return this.flickrSecretAppID;
    }

    retrieveFlickrAppIdTest() {
        return this.flickrAppIDTest;
    }

    retrieveFlickrSecretAppIDTest() {
        return this.flickrSecretAppIDTest;
    }

    retrieveSmugAppId() {
        return this.smugAppID;
    }

    retrieveSmugSecretAppID() {
        return this.smugSecretAppID;
    }

    retrieveSmugAppIdTest() {
        return this.smugAppIDTest;
    }

    retrieveSmugSecretAppIDTest() {
        return this.smugSecretAppIDTest;
    }

    retrieveIconUrl(id) {
      return LocationUtils.instance.homepage + '/' + ASSET_PATH_NAME + '/' + this.icons[id];
    }

    retrieveImageUrl(id) {
      return LocationUtils.instance.homepage + '/' + ASSET_PATH_NAME + '/' + this.images[id]
    }

    retrieveSupportedBrowsers() {
      let options = {};
      if (this.jsonConfig.supportedBrowsers) {
        let supportedBrowsers = this.jsonConfig.supportedBrowsers[0].browser;
        let item;
        for (let i = 0; i < supportedBrowsers.length; i++) {
            item = supportedBrowsers[i];
            options[item['$'].id] = item['$'].version;
        }
      }
      return options;
    }

    _parseMenuItems(menuItemsConfig) {
      let options = [];
      if (menuItemsConfig) {
        let json = menuItemsConfig[0];
        let menuItems = json.option;
        for (let i = 0; i < menuItems.length; i++) {
            let item = menuItems[i];
            options.push(item['$']);
        }
      }
      return options;
    }

    _parseCTEventConfig() {
      if (this.jsonConfig.cteventconfig) {
        let cteventconfig = this.jsonConfig.cteventconfig[0];
        this.cteventconfig = { commit: cteventconfig.commit_sha[0],
                               build: cteventconfig.build_number[0],
                               appInstance: cteventconfig.app_instance[0],
                               branch: cteventconfig.branch[0],
                               version: cteventconfig.version[0]
                              };
      }
    }

}

export default Config
