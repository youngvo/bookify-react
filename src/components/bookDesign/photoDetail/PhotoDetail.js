import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Modal     from 'react-modal';

import './PhotoDetail.css'
import LocaleUtils from './../../../utils/LocaleUtils';
import IconButton from './../../materials/iconButton/IconButton';

class PhotoDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            enableInfo: false,
        };
    }
    
    toggleInfoEvent() {
        if (this.state.enableInfo) {
            this.setState({
                enableInfo: false
            });
        } else {
            this.setState({
                enableInfo: true
            });
        }
    }

    renderImageDetail(photoName, photoSize, createdTime, updatedTime) {
        if (this.state.enableInfo) {
            return (
                 <div className="info-item" >
                    <table className="info-item-zone" >
                        <tr>
                            <td>{LocaleUtils.instance.translate('label.filename') + ':'}</td>
                            <td className="info-item-right">{photoName}</td>
                        </tr>

                        <tr>
                            <td>{LocaleUtils.instance.translate('label.size') + ':'}</td>
                            <td className="info-item-right">{photoSize}</td>
                        </tr>

                        <tr>
                            <td>{LocaleUtils.instance.translate('label.date_uploaded') + ':'}</td>
                            <td className="info-item-right">{createdTime}</td>
                        </tr>

                        <tr>
                            <td>{LocaleUtils.instance.translate('label.date_taken') + ':'}</td>
                            <td className="info-item-right">{updatedTime}</td>
                        </tr>
                        
                    </table>
                </div>
            );
        }
    }

    render() {
        const { onClose, photo } = this.props;
        const photoSize = photo.width + " x " + photo.height;

        const customStyleModal = {
            content : {
                backgroundColor: "transparent",
                border: "none",
                position: "absolute",
                top: "0",
                left: "0",
                right: "0",
                bottom: "0",
                padding: "0",
            }
        }

        let maxHeight = window.innerHeight*0.7;
        let maxWidth = window.innerWidth*0.7;
        let styleOfImage = {
            maxHeight: maxHeight,
            maxWidth: maxWidth
        }

        return (
            <Modal
                style={customStyleModal}
                isOpen={true}
                overlayClassName="modal-overlay"
                contentLabel="Minimal Modal Example" >
                <div className="photo-detail-wrapper" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }} >
                    <div className="content-photo-detail" >
                        <IconButton className="photo-detail-button-item close-button"
                            type={IconButton.type.close}
                            alt="x-icon"
                            onClick={onClose}
                        />
                        <IconButton className="photo-detail-button-item info-photo-button"
                            type={IconButton.type.info}
                            alt="i-icon"
                            onClick={this.toggleInfoEvent.bind(this)}
                        />
                        <div className="photo-detail-item">
                            <div className="image-item">
                                <img src={photo.imageUrl} alt={photo.name} style={styleOfImage}/>
                            </div>
                            <ReactCSSTransitionGroup
                                transitionName="info"
                                transitionEnterTimeout={500}
                                transitionLeaveTimeout={500}
                            >
                                {this.renderImageDetail(photo.name, photoSize, photo.updatedTime, photo.createTime)}
                            </ReactCSSTransitionGroup>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}

export default PhotoDetail;