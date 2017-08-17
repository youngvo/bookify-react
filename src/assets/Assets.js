import LoadingService from '../services/loadingServices/LoadingService';
import Config from './../config/Config';

class Assets {
    static instance = new Assets();

    constructor() {
        if (Assets.instance) {
          return Assets.instance;
        }
        this.images = { };
        this.onComplete = null;
        this.onProgress = null;
        return this;
    }

    _pushImages(loadingService, imageObjects) {
        for (let imageKey in imageObjects) {
            if (this.images[imageKey]) {
              continue;
            }
            if (imageObjects[imageKey] instanceof Object) {
               this._pushImages(loadingService, imageObjects[imageKey]);
            } else {
                let requestObject = {
                    id: imageKey,
                    responseType: LoadingService.RESPONSE_TYPE_BLOB,
                    urlRequest: Config.instance.retrieveImageUrl(imageKey)
                };

                loadingService.pushRequestObjects(requestObject);
            }
        }
    }

    _pushFonts(loadingService) {

    }

    _onLoadAssetsComplete(completedObjects) {
        completedObjects.forEach(function (completedObject) {
            switch (completedObject.requestObject.responseType) {
                case LoadingService.RESPONSE_TYPE_BLOB:
                    this.handleLoadingImageComplete(completedObject);
                    break;
                default:
                    break;
            }
        }.bind(this));

        this.onComplete();
    }

    _onLoadAssetsProgress(percentComplete) {
        this.onProgress(percentComplete);
    }

    loadAssets(onComplete, onProgress) {
        this.onComplete = onComplete;
        this.onProgress = onProgress;

        let loadingService = new LoadingService();
        this._pushImages(loadingService, Config.instance.images);
        this._pushFonts(loadingService);

        loadingService.start(this._onLoadAssetsComplete.bind(this), this._onLoadAssetsProgress.bind(this));
    }

    loadLogo(onComplete) {
      this.onComplete = onComplete;
      let loadingService = new LoadingService();
      let requestObject = {
          id: 'img_applogo',
          responseType: LoadingService.RESPONSE_TYPE_BLOB,
          urlRequest: Config.instance.retrieveImageUrl('img_applogo')
      };
      loadingService.pushRequestObjects(requestObject);
      loadingService.start(this._onLoadAssetsComplete.bind(this), null);
    }

    handleLoadingImageComplete(completedObject) {
        let requestId = completedObject.requestObject.id;
        return this.images[requestId] = URL.createObjectURL(completedObject.response);
    }

    retrieveImageObjectURL(id) {
        return this.images[id];
    }
}

export default Assets;
