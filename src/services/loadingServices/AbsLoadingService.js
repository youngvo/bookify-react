import Logger from '../../utils/Logger';

class AbsLoadingService {
    constructor() {
        this.requestObjectsQueue = []; //loading: [requestObject = {id, responseType, urlRequest}]
        this.completedObjects = [];
        this.currentRequestObject = '';
        this.totalRequests = 0;

        this.onProgress = null;
        this.onAllComplete = null;
        this.onUnitComplete = null;
        this.onAbort = null;
        this.onError = null;
    }

    pushRequestObjects(...requestObjects) {
        this.requestObjectsQueue.push(...requestObjects);
    }

    start(onAllComplete, onProgress = null, onUnitComplete = null, onAbort = null, onError = null) {
        if (this.requestObjectsQueue.length === 0) return;

        this.onAllComplete = onAllComplete;
        this.onUnitComplete = onUnitComplete;
        this.onProgress = onProgress;
        this.onAbort = onAbort;
        this.onError = onError;
        this.totalRequests = this.requestObjectsQueue.length;

        this._doLoad();
    }

    _makeXHRRequest(currentRequestObject, onComplete, onProgress, onAbort, onError) {
        throw new Error('AbsLoadingServer does not override onProgress!');
    }

    _doLoad() {
        this.currentRequestObject = this.requestObjectsQueue.shift();
        if (!this.currentRequestObject) {
            if (this.onAllComplete) this.onAllComplete(this.completedObjects);
            return;
        }

        this._makeXHRRequest(this.currentRequestObject, this._onUnitComplete.bind(this), this._onProgress.bind(this),
                                                this._onAbort.bind(this), this._onError.bind(this));
    }

    _onUnitComplete(evt) {
        const completedObject = {
            requestObject: this.currentRequestObject,
            response: evt.currentTarget.response
        };
        this.completedObjects.push(completedObject);

        if (this.onUnitComplete) this.onUnitComplete(completedObject);

        this._doLoad();
    }

    _onProgress(evt) {
    }

    _onAbort(evt) {
        Logger.instance.info('Loading service Aborted!');
        if (this.onAbort) this.onAbort(evt, this.completedObjects);
    }

    _onError(evt) {
        Logger.instance.info('Loading service Error!');
        if (this.onError) this.onError(evt, this.completedObjects);
    }

}

export default AbsLoadingService;