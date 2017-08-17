import AbsLoadingService from './AbsLoadingService';

class LoadingService extends AbsLoadingService {
    static RESPONSE_TYPE_ARRAY_BUFFER = 'arraybuffer';
    static RESPONSE_TYPE_BLOB = 'blob';
    static RESPONSE_TYPE_DOCUMENT = 'document';
    static RESPONSE_TYPE_JSON = 'json';
    static RESPONSE_TYPE_TEXT = 'text';

    _makeXHRRequest(currentRequestObject, onComplete, onProgress, onAbort, onError) {
        let xmlHttpReq = new XMLHttpRequest();

        xmlHttpReq.addEventListener('load', onComplete);
        if (this.onProgress) xmlHttpReq.addEventListener('progress', onProgress);
        if (this.onAbort) xmlHttpReq.addEventListener('abort', onAbort);
        if (this.onError) xmlHttpReq.addEventListener('error', onError);

        xmlHttpReq.open('GET', currentRequestObject.urlRequest);
        xmlHttpReq.responseType = currentRequestObject.responseType;

        xmlHttpReq.send();
    }

    _onProgress(evt) {
        let percentCompleteOnThisRequest = evt.loaded / evt.total * 100;
        let percentCompleteMaxReachOnThisRequest = 100 / this.totalRequests;

        let percentCompleteCurrentReachOnThisRequest = percentCompleteOnThisRequest * percentCompleteMaxReachOnThisRequest / 100;
        let percentCompleteTotal = this.completedObjects.length * percentCompleteMaxReachOnThisRequest + percentCompleteCurrentReachOnThisRequest;

        this.onProgress(Math.round(percentCompleteTotal));
    }

}

export default LoadingService;
