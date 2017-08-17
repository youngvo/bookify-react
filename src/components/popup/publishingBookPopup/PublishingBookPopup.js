import React from 'react';

import './PublishingBookPopup.css';
import LocaleUtils from './../../../utils/LocaleUtils';

const PublishingBookPopup = () => {

    function renderContent() {
        return (
            <div className="content-popup publishing-book">
                <span>{LocaleUtils.instance.translate('alert.publish.pending_title')}</span>
                <div className="out-border">
                    <div className="content-popup progress-bar"/>
                </div>
            </div>
        );
    }

    return (
        <div className="popup-wrapper">
            <div className="popup-zone publishing-popup-zone">
                <div className="top-popup-zone">
                    <div className="popup-item">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PublishingBookPopup;