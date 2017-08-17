import React from 'react';
import PropTypes from 'prop-types';
import { Line } from 'rc-progress';
import Draggable from 'react-draggable';

import './Uploader.css';
import Button           from './../../materials/button/Button';
import IconButton       from './../../materials/iconButton/IconButton';
import Assets           from './../../../assets/Assets';
import LocaleUtils      from './../../../utils/LocaleUtils';
import {
    photoTypes
} from './../../../constants/Constants';

class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: props.isShow
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.isShow !== nextProps.isShow) {
            this.setState({
                isShow: nextProps.isShow
            });
        }
    }


    onClose() {
        this.setState({
            isShow: false
        });
    }

    getTitleUpload(type) {
        switch (type) {
            case photoTypes.INSTAGRAM:
                return LocaleUtils.instance.translate('dialog.image_acquisition_progress.instagram_title');
            case photoTypes.FLICKR:
                return LocaleUtils.instance.translate('dialog.image_acquisition_progress.flickr_title');
            case photoTypes.FACEBOOK:
                return LocaleUtils.instance.translate('dialog.image_acquisition_progress.facebook_title');
            case photoTypes.PX500:
                return LocaleUtils.instance.translate('dialog.image_acquisition_progress.500px_title');
            case photoTypes.SMUGSMUG:
                return LocaleUtils.instance.translate('dialog.image_acquisition_progress.smugmug_title');
            case photoTypes.PICASA:
                return LocaleUtils.instance.translate('dialog.image_acquisition_progress.picasa_title');
            case photoTypes.COMPUTER:
                return LocaleUtils.instance.translate('dialog.image_acquisition_progress.upload_title');
            default:
                return;
        }
    }

    convertBytesToMB(byteSize) {
        let mb = byteSize / (1024 * 1024);
        return Math.round(parseFloat(mb) * 100) / 100;
    }

    getProgressRemaining(type, amountUploaded, amountTotal) {
        if (type === photoTypes.COMPUTER) {
            return LocaleUtils.instance.translate('dialog.image_acquisition_progress.upload_remaining', { 0: this.convertBytesToMB(amountUploaded), 1: this.convertBytesToMB(amountTotal) })
        }
        return LocaleUtils.instance.translate('dialog.image_acquisition_progress.import_remaining', { 0: amountUploaded, 1: amountTotal });
    }

    calculateTimeRemaining(secondsRemaining) {
        if (secondsRemaining < 0) {
            return;
        }
        let hoursLeft = Math.floor(secondsRemaining / 3600);
        hoursLeft = Math.min(99, hoursLeft);
        let minutesLeft = Math.floor((secondsRemaining % 3600) / 60);
        let secondsLeft = (secondsRemaining % 3600) % 60;

        let timeRemainingMessage = "";
        if (hoursLeft > 0) {
            timeRemainingMessage += hoursLeft + " " + LocaleUtils.instance.translate('dialog.image_acquisition_progress.hours');
        }
        if (minutesLeft > 0) {
            if (timeRemainingMessage !== "") timeRemainingMessage += " ";
            timeRemainingMessage += minutesLeft + " " + LocaleUtils.instance.translate('dialog.image_acquisition_progress.minutes');
        }
        if (hoursLeft === 0 && minutesLeft < 15) {
            // we display seconds when there is less than 15 minutes left
            if (timeRemainingMessage !== "") timeRemainingMessage += " ";
            timeRemainingMessage += secondsLeft + " " + LocaleUtils.instance.translate('dialog.image_acquisition_progress.seconds');
        }
        timeRemainingMessage += ".";
        return timeRemainingMessage;
    }

    renderTitleImporting(titleUpload) {
        const title = this.getTitleUpload(titleUpload);
        return (
            <div className="image-upload-title">
                <div className="image-upload-title-info">
                    <span className="icon-InfoNote">
                <span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span>
                </span>
                </div>
                <div className="image-upload-title-content">
                    <span>{title}</span><br />
                    <span>{LocaleUtils.instance.translate('dialog.image_acquisition_progress.message')}</span>
                </div>
                <div className="image-upload-title-close">
                    <IconButton type={IconButton.type.close} onClick={this.onClose.bind(this)} />
                </div>
            </div>
        );
    }

    renderProgressing(amountUploaded, amountTotal) {
        let percentUploaded = amountUploaded / amountTotal * 100;
        return (
            <div className="image-upload-progress">
                <Line percent={percentUploaded} strokeWidth="4"  trailWidth="4"  strokeColor="#3FC7FA" strokeLinecap="square"/>
            </div>
        );
    }

    renderTimeRemaining(type, amountUploaded, amountTotal, timeRemaining, onCancelUpload) {
        let progressRemaining = this.getProgressRemaining(type, amountUploaded, amountTotal);
        return (
            <div className="image-upload-content">
                <div className="image-upload-content-percent">
                    <span>{progressRemaining}</span><br />
                    <span>{LocaleUtils.instance.translate('dialog.image_acquisition_progress.time_remaining') + " "}</span><br />
                    <span>{this.calculateTimeRemaining(timeRemaining)}</span>
                </div>
                <div className="image-upload-content-cancel">
                    {
                        type === photoTypes.COMPUTER && <Button
                            text={LocaleUtils.instance.translate('active_exit_dialog.cancel')}
                            onClick={onCancelUpload}
                        />
                    }
                </div>
            </div>
        );
    }

    render() {
        const { type, amountUploaded, amountTotal, timeRemaining, onCancelUpload } = this.props;
        return (
            this.state.isShow &&
            <Draggable>
                <div className="image-upload">
                    {this.renderTitleImporting(type)}
                    {this.renderProgressing(amountUploaded, amountTotal)}
                    {this.renderTimeRemaining(type, amountUploaded, amountTotal, timeRemaining, onCancelUpload)}
                </div>
            </Draggable>
        );
    }
}

Uploader.propTypes = {
    type: PropTypes.string,
    amountUploaded: PropTypes.number,
    amountTotal: PropTypes.number,
    timeRemaining: PropTypes.number,
    isShow: PropTypes.bool,
    onCancelUpload: PropTypes.func,
}

export default Uploader;
