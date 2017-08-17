import React, { Component } from 'react';
import { connect } from 'react-redux';
import xml2js from 'xml2js';
import CTEventFactory from './../../../utils/CTEventFactory';
import { photoTypes } from './../../../constants/Constants';
import UploadingService from './../../../services/loadingServices/UploadingService';
import ImportingService from './../../../services/loadingServices/ImportingService';
import Uploader from './../../../components/popup/upload/Uploader';
import {
    photoListAct_addPhotos,
} from './../../../actions/photoListActions/PhotoListActions';
import {
    deleteUploadingPhotoWhenComplete,
    changeStatusUploading
} from './../../../actions/getPhotosActions/UploadingPhotosActions';

import {
    photoListAct_addPhotosByComputerBeforeUploading,
    photoListAct_addPhotosByServiceBeforeUploading,
    photoListAct_addPhotosByComputer,
    photoListAct_addPhotosByService
} from './../../../actions/photoListActions/PhotoListActions';

import AppServices from './../../../services/AppServices';
import Config from './../../../config/Config';

class UploaderContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            progress: 0,
            timeRemaining: 0,
            isShowUploader: true
        };

        this.startLoadTime = 0;
        this.uploadingService = null;

        this.downloadImages = this.downloadImages.bind(this);
        this.getImagesImportedSuccess = this.getImagesImportedSuccess.bind(this);
        this.cancelUploadingSuccess = this.cancelUploadingSuccess.bind(this);
    }

    componentWillMount() {
        const {
            projectId, uploadType, photos, onChangeStatusUploading, uploadingId,
            dispatchAddPhotosByComputerBeforeUploading,
            dispatchAddPhotosByServiceBeforeUploading
        } = this.props;

        if (uploadType === photoTypes.COMPUTER) {
            dispatchAddPhotosByComputerBeforeUploading(photos);
            this.uploadPhotos(projectId, photos);
        } else {
            dispatchAddPhotosByServiceBeforeUploading(photos, uploadType);
            this.importPhotos(projectId, uploadType, photos);
        }
        onChangeStatusUploading(uploadingId);
    }

    uploadPhotos(projectId, photos) {
        this.uploadingService = new UploadingService();

        console.log('upload photos: ', photos);

        photos.forEach(function(photo) {
            const requestObject = {
                projectId,
                file: photo
            };
            this.uploadingService.pushRequestObjects(requestObject);
        }.bind(this));

        this.startLoadTime = (new Date()).getTime();
        this.uploadingService.start(
            this.onUploadCompleted.bind(this),
            this.onUploadProgress.bind(this),
            this.onUnitUploadCompleted.bind(this)
        );
        AppServices.trackCTEvent(CTEventFactory.instance.createImageImportStartedEvent(photoTypes.COMPUTER), null, null);
    }

    importPhotos(projectId, uploadType, photos) {
        this.uploadingService = new ImportingService();

        console.log('import photos: ', photos);

        const requestObject = {
            projectId,
            service_name: uploadType,
            photos
        };
        this.uploadingService.pushRequestObjects(requestObject);

        this.startLoadTime = (new Date()).getTime();
        this.uploadingService.start(
            this.onImportingComplete.bind(this),
            this.onImportingProgress.bind(this),
        );
        AppServices.trackCTEvent(CTEventFactory.instance.createImageImportStartedEvent(uploadType), null, null);
    }

    onImportingProgress(progress) {
        console.log('<<< importing is progressing');
    }

    downloadImages(res) {
        const { deleteUploadingInQueue, uploadingId, dispatchAddPhotosByService } = this.props;

        let photosSourceFromService = res['photo_import'][0]['imports'][0]['import'];
        dispatchAddPhotosByService(photosSourceFromService);

        setTimeout(function () {
            deleteUploadingInQueue(uploadingId);
        }, 1000);
    };

    getImagesFailed(error) {
        const { deleteUploadingInQueue, uploadingId } = this.props;
        deleteUploadingInQueue(uploadingId);

        console.log('>>> importing failed', error);
    };

    getImagesImportedSuccess = (importId) => {
        const getImageSucces = (res) => {
            let photosRes = res['photo_import'][0]['imports'][0]['import'];
            let countDownloaded = 0;
            for (let i in photosRes) {
                if (photosRes[i]['status'][0] === 'DOWNLOADED') {
                    countDownloaded++;
                }
                if (photosRes[i]['status'][0] === 'NEW' || 
                    (photosRes[i]['status'][0] === 'DOWNLOADED' && !photosRes[i]['photo'])) {
                    //update progress
                    let timeRemaining = this.calculateTimeRemaining(countDownloaded, this.props.size);
                    this.setState({
                        progress: countDownloaded,
                        timeRemaining
                    });

                    this.getImagesImportedSuccess(importId);
                    break;
                }
            }

            if (countDownloaded === this.props.size) {
                this.setState({
                    progress: countDownloaded,
                    timeRemaining: 0
                });
                this.downloadImages(res);
            }
        };

        AppServices.getImageAfterImported(importId, getImageSucces.bind(this), this.getImagesFailed.bind(this));
    };

    onImportingComplete(completedObjects) {
        let importId;
        xml2js.parseString(completedObjects[0].response, function (err, json) {
            importId = json.response.photo_import[0]['id'][0];
        });
        this.getImagesImportedSuccess(importId);
        AppServices.trackCTEvent(CTEventFactory.instance.createImageImportCompletedEvent(this.props.uploadType), null, null);
    }

    onUnitUploadCompleted(completedObjects) {
        this.props.dispatchAddPhotosByComputer(completedObjects.response);

        AppServices.trackCTEvent(CTEventFactory.instance.createImageUploadCompletedEvent(this.props.uploadType), null, null);
    }

    onUploadCompleted() {
        const { deleteUploadingInQueue, uploadingId } = this.props;
        deleteUploadingInQueue(uploadingId);

    }

    calculateTimeRemaining(progress, size) {
        let timeElapsed = (new Date().getTime() - this.startLoadTime) / 1000;
        if (timeElapsed === 0) {
            timeElapsed = 1;
        }
        let uploadSpeed = Math.round(progress / timeElapsed);
        if (uploadSpeed === 0) {
            return -1;
        }
        let timeRemaining = (size - progress) / uploadSpeed;
        if (timeRemaining < 0) timeRemaining = 0;
        return Math.round(timeRemaining);
    }

    onUploadProgress(progress) {
        const timeRemaining = this.calculateTimeRemaining(progress, this.props.size);
        if (progress > this.props.size) progress = this.props.size;
        this.setState({
            progress,
            timeRemaining
        });
    }

    cancelUploadingSuccess() {
        const { deleteUploadingInQueue, uploadingId } = this.props;
        deleteUploadingInQueue(uploadingId);

        this.setState({
            isShowUploader: false
        });
    }

    onCancelUpload() {
        const { projectId } = this.props;

        let xmlHttpReq = new XMLHttpRequest();
        xmlHttpReq.addEventListener('load', this.cancelUploadingSuccess);

        xmlHttpReq.open('DELETE', Config.instance.apiUrls.projectServiceUrl + '/' + projectId + '/images/remove.flex');
        let sessionVO = AppServices.getSession();
        let fd = new FormData();
        fd.append('id', projectId);
        fd.append('session_id', sessionVO.sessionId);
        fd.append('format', 'flex');
        fd.append('_method', 'DELETE');
        fd.append('client_id', sessionVO.clientId);
        fd.append('api_key', sessionVO.apiKey);

        xmlHttpReq.send(fd);
    }

    render() {
        const { uploadType, size } = this.props;
        return (
            <Uploader
                type={uploadType}
                amountUploaded={this.state.progress}
                amountTotal={size}
                timeRemaining={this.state.timeRemaining}
                isShow={this.state.isShowUploader}
                onCancelUpload={this.onCancelUpload.bind(this)}
            />
        );
    }
}

// const addPhotosToList = (dispatch, photos, uploadType) => {
//     dispatch(photoListAct_addPhotos(photos, uploadType));
// };

const deleteUploadingInQueue = (dispatch, uploadingId) => {
    dispatch(deleteUploadingPhotoWhenComplete(uploadingId));
};

const onChangeStatusUploading = (dispatch, uploadingId) => {
    dispatch(changeStatusUploading(uploadingId));
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchAddPhotosByComputerBeforeUploading: (photos) => dispatch(photoListAct_addPhotosByComputerBeforeUploading(photos)),
        dispatchAddPhotosByServiceBeforeUploading: (photos, uploadType) => dispatch(photoListAct_addPhotosByServiceBeforeUploading(photos, uploadType)),
        dispatchAddPhotosByComputer: (photoSourceFromComputer) => dispatch(photoListAct_addPhotosByComputer(photoSourceFromComputer)),
        dispatchAddPhotosByService: (photosSourceFromService) => dispatch(photoListAct_addPhotosByService(photosSourceFromService)),
        deleteUploadingInQueue: (uploadingId) => deleteUploadingInQueue(dispatch, uploadingId),
        onChangeStatusUploading: (uploadingId) => onChangeStatusUploading(dispatch, uploadingId),
    };
};

export default connect(
    null,
    mapDispatchToProps
)(UploaderContainer);
