import AppServices from './../services/AppServices';
import configureStore   from './../store/ConfigureStore';
import Utils from './Utils';
import LocationUtils from './LocationUtils';
import Config from './../config/Config';

class CTEventFactory {
    static instance = new CTEventFactory();

    constructor() {
        if (CTEventFactory.instance) {
            return CTEventFactory.instance;
        }
        this.baseParam = {
                          session_id: '',
                          username: '',
                          branch: 'staging',
                          project_id: '00000000-0000-0000-0000-000000000000',
                          build: '',
                          context: 'Bookify-React',
                          version: '1.1.1516',
                          commit: '567da1d1a192045321b0e7328c7954c0449ae8df',
                          events: [{
                            timestamp: '',
                            data: {}
                          }]
                         };

        this.baseEventData = JSON.stringify({
                                os: Utils.extractOSName(),
                                version: Utils.JSVer(),
                                userAgent: window.navigator.userAgent,
                                isDebugger: false,
                                cpuArchitecture: window.navigator.cpuClass,
                                localFileReadDisable: false
                              });
        return this;
    }

    init() {
      let cteventconfig = Config.instance.cteventconfig;
      this.baseParam.branch = cteventconfig.branch;
      this.baseParam.build = cteventconfig.build;
      this.baseParam.appInstance = cteventconfig.appInstance;
      this.baseParam.commit = cteventconfig.commit;
      this.baseParam.version = cteventconfig.version;
    }

    _buildProjectParam() {
      let { project } = this._mapStateToProps(configureStore().getState());
      let projectParam = { };
      let projectInfo = project.projectInfo;
      let book = project.book;
      let starterBook = LocationUtils.instance.getParameterByName('starterbook');
      projectParam.trim = book.covers.coverInfo ? book.covers.coverInfo.type : '';
      projectParam.theme = book.bookInfo.theme;
      projectParam.title = book.bookMetaData.title;
      projectParam.author = book.bookMetaData.author;
      projectParam.format = book.bookInfo.format;
      projectParam.yearbook = projectInfo.yearbook;
      projectParam.isPDFBook = false;
      projectParam.productID = projectInfo.productId;
      projectParam.projectID = projectInfo.id;
      projectParam.isYearBook = projectInfo.isYearBook();
      projectParam.chickenSoup = projectInfo.chickenSoup;
      projectInfo.source_info = projectInfo.sourceInfo;
      projectParam.source_name = projectInfo.sourceName;
      projectParam.starterbook = starterBook ? starterBook : '';
      projectParam.designerbook = projectInfo.designerBook;
      projectParam.isChickenSoup = projectInfo.isChickenSoup();
      projectParam.isDesignerBook = projectInfo.isDesignerBook();
      projectParam.isInstantBook = projectInfo.isInstantBook();
      projectParam.isStandardBook = false;
      projectParam.strange_instant_book = projectInfo.instantBook();
      return projectParam;
    }

    _buildNumLayoutsParam() {
      let { project } = this._mapStateToProps(configureStore().getState());
      let pages = project.book.pages.present;
      let byLayoutID = [];
      let item = null;
      let byImageCount = [ 0, 0, 0, 0, 0, 0 ];
      for (let i = 0; i < pages.length; i++ ) {
        item = pages[i];
        if (item['ImageContainer']) {
          if (item.ImageContainer.length > byImageCount.length) {
            byImageCount[byImageCount.length - 1]++;
          } else {
            byImageCount[item.ImageContainer.length]++;
          }
        } else {
          byImageCount[0]++;
        }
        if (byLayoutID[item.page_layout_id]) {
          byLayoutID[item.page_layout_id]++;
          continue;
        }
        byLayoutID[item.pay_layout_id] = 1;
      }
      return {
                byLayoutID: byLayoutID,
                byImageCount: { textOnly: byImageCount[0], oneUp: byImageCount[1], twoUp: byImageCount[2], threeUp: byImageCount[3], fourUp: byImageCount[4], fiveUpPlus: byImageCount[5] }
              };
    }

    _buildNumPagesParam() {
      let { project } = this._mapStateToProps(configureStore().getState());
      let pages = project.book.pages.present;
      let item = null;
      let itemCount = 0;
      let imageContainer;
      let textContainer;
      for (let i = 0; i < pages.length; i++ ) {
        item = pages[i];
        if (item['ImageContainer']) {
          imageContainer = item.ImageContainer;
          itemCount+= imageContainer.length;
        }
        if (item['TextContainer']) {
          textContainer = item.TextContainer;
          itemCount+= textContainer.length;
        }
      }
      let numPages = {
        all: itemCount,
        guts: pages.length
      };
      return numPages;
    }

    _buildNumImagesParam() {
      let { project } = this._mapStateToProps(configureStore().getState());
      let pages = project.book.pages.present;
      let photostream = this._getNumberImagesInLibrary();
      let item = null;
      let imagesCount = [];
      let imageContainer;
      for (let i = 0; i < pages.length; i++ ) {
        item = pages[i];
        if (item['ImageContainer']) {
          imageContainer = item.ImageContainer;
          for (let j = 0; j < imageContainer.length; j++) {
            let el = imageContainer[j];
            if (el.Image) {
              if (imagesCount[el.Image.src]) {
                imagesCount[el.Image.src]++;
                continue;
              }
              imagesCount[imageContainer[j].Image.src] = 1;
            }
          }
        }
      }
      let usedInBook = 0;
      for (let src in imagesCount) {
        usedInBook += imagesCount[src];
      }
      let numImages = {
        usedInBook: usedInBook,
        photostream: photostream
      };
      return numImages;
    }

    _getNumCharsInBook() {
      let numCharsInBook = 0;
      let { project } = this._mapStateToProps(configureStore().getState());
      let pages = project.book.pages.present;
      let item;
      let textContainer;
      let parsedText;
      for (let i = 0; i < pages.length; i++ ) {
        item = pages[i];
        if (item['TextContainer']) {
          textContainer = item.TextContainer;
          for (let j = 0; j < textContainer.length; j++) {
            parsedText = textContainer[j].parsedText;
            if (parsedText) {
              numCharsInBook += parsedText[0].text.length;
            }
          }
        }
      }
      return numCharsInBook;
    }

    getNumImagesAffected() {
      let numImagesAffected = 0;
      let { photoList, project } = this._mapStateToProps(configureStore().getState());
      let pages = project.book.pages.present;
      let item;
      let imageContainer;
      for (let i = 0; i < pages.length; i++ ) {
        item = pages[i];
        if (item['ImageContainer']) {
          imageContainer = item.ImageContainer;
          for (let j = 0; j < imageContainer.length; j++) {
            let el = imageContainer[j];
            if (el.Image) {
              let src = el.Image.src;
              let notFound = true;
              for (let name in photoList) {
                if (Utils.replaceLowImageByOrigin(photoList[name].imageUrl) === src) {
                  notFound = false;
                  break;
                }
              }
              if (notFound) {
                numImagesAffected++;
              }
            }
          }
        }
      }
      return numImagesAffected;
    }

    _getNumberImagesInLibrary() {
      let { photoList } = this._mapStateToProps(configureStore().getState());
      let photostream = 0;
      for (let name in photoList) {
        photostream++;
      }
      return photostream;
    }

    _buildProjectRelatedParams(eventName, eventData) {
      eventData.project = this._buildProjectParam();
      eventData.numPages = this._buildNumPagesParam();
      eventData.numImages = this._buildNumImagesParam();
      eventData.numLayouts = this._buildNumLayoutsParam();
      eventData.elapsedMinutes = Utils.minutesBetweenDates(AppServices.getSession().sessionStartDate, new Date());
      eventData.numCharsInBook = this._getNumCharsInBook();
      eventData.screenResolution = { x: window.screen.width, y: window.screen.height };
      return this._buildBaseParam(eventName, eventData);
    }

    _buildBaseParam(eventName, eventData) {
      let { project, userStatus } = this._mapStateToProps(configureStore().getState());
      if (userStatus.isLoggedIn && userStatus.userVO.username) {
        this.baseParam.username = userStatus.userVO.username;
      }
      if (project.projectInfo) {
        this.baseParam.project_id = project.projectInfo.id !== '' ? project.projectInfo.id : '00000000-0000-0000-0000-000000000000';
      }
      let session = AppServices.getSession();
      this.baseParam.session_id = session.sessionId ? session.sessionId : '';
      let event = this.baseParam.events[0];
      event.timestamp = new Date().toISOString();
      event.data = {};
      event.data[eventName] = eventData;
      return this.baseParam;
    }

    _mapStateToProps(state) {
      return {
        project: state.project,
        userStatus: state.userStatus,
        photoList: state.photoList
      };
    }

    _createImageImportEvent(eventName, importSource) {
      let eventData = JSON.parse(this.baseEventData);
      eventData.importSource = importSource;
      return this._buildBaseParam(eventName, eventData);
    }

    createAppStartedEvent() {
      let eventData = JSON.parse(this.baseEventData);
      return this._buildBaseParam('appStarted', eventData);
    }

    createAppLoadingEvent() {
      return this._buildBaseParam('appLoading', JSON.parse(this.baseEventData));
    }

    createAppExitedEvent() {
      return this._buildProjectRelatedParams('appExited', JSON.parse(this.baseEventData));
    }

    createAutoFlowUsedEvent(sortStrategy, keepExistingPages, fillWithBlankLayouts) {
      let eventData = JSON.parse(this.baseEventData);
      eventData.numImages = this._getNumberImagesInLibrary();
      eventData.sortStrategy = sortStrategy;
      eventData.keepExistingPages = keepExistingPages;
      eventData.fillWithBlankLayouts = fillWithBlankLayouts;
      return this._buildBaseParam('autoFlowUsed', eventData);
    }

    createBubbleHelpToggledEvent(enabled) {
      let eventData = JSON.parse(this.baseEventData);
      eventData.enabled = enabled;
      return this._buildBaseParam('bubbleHelpToggled', eventData);
    }

    createCrashEvent(message) {
      let eventData = JSON.parse(this.baseEventData);
      eventData.message = message;
      return this._buildBaseParam('crash', eventData);
    }

    createCustomLogoUpgradeActivatedEvent() {
      let eventData = JSON.parse(this.baseEventData);
      return this._buildBaseParam('customLogoUpgradeActivated', eventData);
    }

    createErrrorMissingImagesEvent(numImagesAffected) {
      let eventData = JSON.parse(this.baseEventData);
      eventData.numImagesAffected = numImagesAffected;
      return this._buildBaseParam('errrorMissingImages', eventData);
    }

    createFontSelectedEvent(fontFamily) {
      let eventData = JSON.parse(this.baseEventData);
      eventData.fontFamily = fontFamily;
      return this._buildBaseParam('fontSelected', eventData);
    }

    createImageImportAuthenticationStartedEvent(importSource) {
      return this._createImageImportEvent('imageImportAuthenticationStarted', importSource);
    }

    createImageImportCompletedEvent(importSource) {
      return this._createImageImportEvent('imageImportCompleted', importSource);
    }

    createImageImportSetsLoadedEvent(importSource) {
      return this._createImageImportEvent('imageImportSetsLoaded', importSource);
    }

    createImageImportStartedEvent(importSource) {
      return this._createImageImportEvent('imageImportStarted', importSource);
    }

    createImageUploadCompletedEvent(importSource) {
      return this._createImageImportEvent('imageUploadCompleted', importSource);
    }

    createNavigatedToBookWrightEvent() {
      let eventData = JSON.parse(this.baseEventData);
      return this._buildBaseParam('navigatedToBookWright', eventData);
    }

    createPreviewShownEvent() {
      let eventData = JSON.parse(this.baseEventData);
      return this._buildBaseParam('previewShown', eventData);
    }

    createProjectCreatedEvent(theme) {
      this._buildProjectRelatedParams('projectCreated', JSON.parse(this.baseEventData));
      this.baseParam.events[0].data['projectCreated'].project.theme = theme;
      this.baseParam.events[0].data['projectCreated'].project.trim='dustjacket';
      return this.baseParam;
    }

    createProjectLoadedEvent() {
      return this._buildProjectRelatedParams('projectLoaded', JSON.parse(this.baseEventData));
    }

    createProjectLoadFailedEvent() {
      return this._buildProjectRelatedParams('projectLoadFailed', JSON.parse(this.baseEventData));
    }

    createProjectPublishEvent() {
      let eventData = JSON.parse(this.baseEventData);
      eventData.republish = false;
      return this._buildProjectRelatedParams('projectPublish', eventData);
    }

    createProjectRepublishEvent() {
      let eventData = JSON.parse(this.baseEventData);
      eventData.republish = true;
      return this._buildProjectRelatedParams('projectRepublish', eventData);
    }

    createTooManyPhotosDialogShownEvent() {
      let eventData = JSON.parse(this.baseEventData);
      return this._buildBaseParam('tooManyPhotosDialogShown', eventData);
    }

    createUserLoggedinEvent() {
      return this._buildBaseParam('userLoggedin', JSON.parse(this.baseEventData));
    }

    createUserRegisteredEvent() {
      return this._buildBaseParam('userRegistered', JSON.parse(this.baseEventData));
    }
}

export default CTEventFactory;
