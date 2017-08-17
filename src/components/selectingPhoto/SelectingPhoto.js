import React from 'react';

import './SelectingPhoto.css';
import LocaleUtil from './../../utils/LocaleUtils';
import Button, { colorType } from './../materials/button/Button';
import { photoTypes } from './../../constants/Constants';
import GetPhotosForBook from '../../components/getPhotosForBook/GetPhotosForBook';

let title1, title2, startTxt;

const getPhotosFrom = (source, isConnecting) => {
    switch (source) {
        case photoTypes.FACEBOOK:
            title1 = LocaleUtil.instance.translate('import.facebook.auth.line1');
            title2 = LocaleUtil.instance.translate('import.facebook.auth.line2');
            startTxt = LocaleUtil.instance.translate('import.start_button.lets_start');
            break;
        case photoTypes.INSTAGRAM:
            title1 = LocaleUtil.instance.translate('import.instagram.auth.line1');
            title2 = LocaleUtil.instance.translate('import.instagram.auth.line2');
            isConnecting ? 
            startTxt = LocaleUtil.instance.translate('import.start_button.connecting', {0: LocaleUtil.instance.translate("start.import.instagram")})  
            :
            startTxt = LocaleUtil.instance.translate('import.start_button.lets_start');
            
            break;
        case photoTypes.FLICKR:
            title1 = LocaleUtil.instance.translate('import.flickr.auth.line1');
            title2 = LocaleUtil.instance.translate('import.flickr.auth.line2');
            isConnecting ? 
            startTxt = LocaleUtil.instance.translate('import.start_button.connecting', {0: LocaleUtil.instance.translate("start.import.flickr")})  
            :
            startTxt = LocaleUtil.instance.translate('import.start_button.lets_start');
            break;
        case photoTypes.PX500:
            title1 = LocaleUtil.instance.translate('import.500px.auth.line1')
            title2 = LocaleUtil.instance.translate('import.500px.auth.line2');
            isConnecting ? 
            startTxt = LocaleUtil.instance.translate('import.start_button.connecting', {0: LocaleUtil.instance.translate('start.import.500px')})  
            :
            startTxt = LocaleUtil.instance.translate('import.start_button.lets_start')
            break;
        case photoTypes.PICASA:
            title1 = LocaleUtil.instance.translate('import.picasa.auth.line1')
            title2 = LocaleUtil.instance.translate('import.picasa.auth.line2');
            startTxt = LocaleUtil.instance.translate('import.picasa.auth.buttonLabel')
            break;
        default:
            title1 = LocaleUtil.instance.translate('import.smugmug.auth.line1')
            title2 = LocaleUtil.instance.translate('import.smugmug.auth.line2');
            isConnecting ? 
            startTxt = LocaleUtil.instance.translate('import.start_button.connecting', {0: LocaleUtil.instance.translate('start.import.smugmug')})  
            :
            startTxt = LocaleUtil.instance.translate('import.start_button.lets_start')
            break;
    }
}

const startGetPhotos = (photoType, startSelectPhotoClick, isConnecting) => {
    getPhotosFrom(photoType, isConnecting);
    return (
        <div className="start-select-photo-content">
            <div className="start-select-photo-content-text">
                <h2>{title1}</h2>
                <br />
                <h2>{title2}</h2>
            </div>
            <div className="start-select-photo-content-button">
                <Button
                    enableClick={!isConnecting}
                    text={startTxt}
                    type={colorType.orange}
                    onClick={startSelectPhotoClick}
                />
            </div>
        </div>
    )
};

const SelectingPhoto = ({ isConnecting, photoType, startSelectPhotoClick, isShowGetPhotoForBook }) => {
    return (
        <div>
            {
                isShowGetPhotoForBook ? <GetPhotosForBook albumType={photoType} /> : startGetPhotos(photoType, startSelectPhotoClick, isConnecting)
            }
        </div>
    );
};

export default SelectingPhoto;
