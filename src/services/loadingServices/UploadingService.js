import AbsLoadingService from './AbsLoadingService';
import AppService from './../../services/AppServices';
import Config from './../../config/Config';

class UploadingService extends AbsLoadingService {
    constructor() {
        super();
        this.progress = 0;
    }

    _makeXHRRequest(currentRequestObject, onComplete, onProgress, onAbort, onError) {
        let xmlHttpReq = new XMLHttpRequest();

        xmlHttpReq.addEventListener('load', onComplete);
        if (this.onProgress) xmlHttpReq.upload.addEventListener('progress', onProgress);
        if (this.onAbort) xmlHttpReq.upload.addEventListener('abort', onAbort);
        if (this.onError) xmlHttpReq.upload.addEventListener('error', onError);

        xmlHttpReq.open('POST', Config.instance.apiUrls.imageUploadUrl);

        let sessionVO = AppService.getSession();
        let fd = new FormData();
        fd.append('Filename', currentRequestObject.file.name);
        fd.append('projectid', currentRequestObject.projectId);
        fd.append('api_key', sessionVO.apiKey);
        fd.append('action', 'upload');
        fd.append('session_id', sessionVO.sessionId);
        fd.append('file', currentRequestObject.file);

        xmlHttpReq.send(fd);
    }

    _onProgress(evt) {
        this.progress += evt.loaded;
        this.onProgress(Math.round(this.progress));
    }

}

export default UploadingService;
