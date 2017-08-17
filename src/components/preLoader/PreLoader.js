import React from 'react';
import { Line }                from 'rc-progress';

import './PreLoader.css';
import Assets from './../../assets/Assets';
import Config from './../../config/Config';
import LocaleUtils from './../../utils/LocaleUtils';

const PreLoader = ({ percentComplete }) => (
    <div className="loader">
        <div className="loader-zone" >
            <div className="loader-top">
                <img className="loader-top-logo" src={Assets.instance.retrieveImageObjectURL('img_applogo')} alt="" />
                <div className="loader-top-title-zone">
                    <span className="loader-top-title">{LocaleUtils.instance.translate(Config.instance.retrieveString('appname'))}<em>{LocaleUtils.instance.translate(Config.instance.retrieveString('tm'))}</em></span>
                </div>
            </div>

            <div className="loader-zone-progress">
                <div className="loader-zone-progress-bar">
                    <Line percent={percentComplete} strokeWidth="2"  trailWidth="2" strokeColor="#2dabe2" trailColor="#666666"  strokeLinecap="round"/>
                </div>
                <div className="loader-zone-progress-percent">
                    <span>{percentComplete}%</span>
                </div>
            </div>
        </div>
    </div>
);

export default PreLoader;
