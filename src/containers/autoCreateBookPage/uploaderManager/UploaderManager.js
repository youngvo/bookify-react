import React from 'react';

import UploaderContainer from './UploaderContainer';

const UploaderManager = ({ projectId, uploadingPhotos }) => {
    return (
        <div className="importing-photo">
            {
                uploadingPhotos.map((uploadingPhotoVO, index) => {
                    if (!uploadingPhotoVO.isUploading) {
                        return (
                            <UploaderContainer
                                key={index}
                                uploadingId={uploadingPhotoVO.id}
                                projectId={projectId}
                                uploadType={uploadingPhotoVO.uploadType}
                                photos={uploadingPhotoVO.photos}
                                size={uploadingPhotoVO.size}
                            />
                        );
                    }
                })
            }
        </div>
    );
};

export default UploaderManager;
