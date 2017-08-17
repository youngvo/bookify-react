import AbsLoadingService from './AbsLoadingService';
import AppServices from './../../services/AppServices';
import Config from './../../config/Config';

function enCodeAmp(url) {
    return url.replace(/&/g, '&amp;');
}

class ImportingService extends AbsLoadingService {
    _makeXHRRequest(currentRequestObject, onComplete, onProgress, onAbort, onError) {
        let photos = currentRequestObject.photos;
        let imagesStr = ``;

        photos.forEach(function (photo) {
            imagesStr += `<image><url>${enCodeAmp(photo.imageUrl)}</url><metadata><date_taken>1496222868</date_taken><comments></metadata></image>`;
            if (currentRequestObject.service_name === 'facebook') {
                imagesStr = imagesStr.replace('<comments>', '<comments format="json">[]</comments>');
            } else {
                imagesStr = imagesStr.replace('<comments>', '');
            }
        }, this);

        let sessionVO = AppServices.getSession();
        let dataXml = `<images>${imagesStr}</images>`;

        let params = `projectid=${currentRequestObject.projectId}&client_id=${sessionVO.clientId}&api_key=${sessionVO.apiKey}&data=${encodeURIComponent(dataXml)}&service_name=${currentRequestObject.service_name}&session_id=${sessionVO.sessionId}`;
        let xmlHttpReq = new XMLHttpRequest();

        xmlHttpReq.addEventListener('load', onComplete);
        if (this.onProgress) xmlHttpReq.addEventListener('progress', onProgress);
        if (this.onAbort) xmlHttpReq.addEventListener('abort', onAbort);
        if (this.onError) xmlHttpReq.addEventListener('error', onError);

        xmlHttpReq.open('POST', Config.instance.apiUrls.imageSetUrl + '.flex');
        xmlHttpReq.withCredentials = true;
        xmlHttpReq.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        xmlHttpReq.send(params);
    }
}

export default ImportingService;
