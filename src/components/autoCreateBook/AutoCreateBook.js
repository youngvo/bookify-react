import React from 'react';

import './AutoCreateBook.css';
import LocaleUtils      from './../../utils/LocaleUtils';
import Assets           from './../../assets/Assets';

const autoCreatBookComponent = (autoCreateBookClick, changeOrderAndLayoutClick) => {
    return (
        <div className="auto-create-book-content-left">
            <div className="auto-create-book-content-box" onClick={autoCreateBookClick} >
                <div className="img_leap">
                    <img src={Assets.instance.retrieveImageObjectURL('img_1892130684')} alt="img_1892130684" /></div>
                <h2>{LocaleUtils.instance.translate('wizard.text.auto_create')}</h2>
                <p>{LocaleUtils.instance.translate('wizard.subtext.auto_create')}</p>
            </div>
            <div className="auto-create-book-content-box-button" onClick={changeOrderAndLayoutClick} >
                <span>{LocaleUtils.instance.translate('wizard.auto_create.change_settings')}</span>
            </div>
        </div>
    );
};

const manuallyCreateBookComponent = (manuallyCreateBookClick) => {
    return (
        <div className="auto-create-book-content-right">
            <div className="auto-create-book-content-box" onClick={manuallyCreateBookClick} >
                <div className="img_leap">
                    <img src={Assets.instance.retrieveImageObjectURL('img_1628303658')} alt="img_1628303658" /></div>
                <h2>{LocaleUtils.instance.translate('wizard.text.manual_create')}</h2>
                <p>{LocaleUtils.instance.translate('wizard.subtext.manual_create')}</p>
            </div>
        </div>
    );
};

const AutoCreateBookPage = (props) => {
    return (
        <div className="auto-create-book-content">
            {autoCreatBookComponent(props.autoCreateBookClick, props.changeOrderAndLayoutClick)}
            {manuallyCreateBookComponent(props.manuallyCreateBookClick)}
        </div>
    );
}

export default AutoCreateBookPage;
