import React, { Component } from 'react';

import './PhotoCell.css';
import LocaleUtils from './../../../utils/LocaleUtils';
import PhotoDetail from './../../bookDesign/photoDetail/PhotoDetail';

class PhotoCell extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isOpenPhotoDetail: false,
            isHovering: false,
        };
    }

    onHover() {
        this.setState({
            isHovering: !this.state.isHovering
        });
    }

    onPhotoClick(photo, onClick) {
        let isSelected = !photo.isSelected;
        if (onClick) onClick(photo, isSelected);
    }

    closePhotoDetail() {
        this.setState({ isOpenPhotoDetail: false });
    };

    showPhotoDetail() {
        this.setState({ isOpenPhotoDetail: true });

    };

    canClick(onClick) {
        let result = true;
        if (!onClick) result = false;

        return result;
    }

    renderPicture(photo, isSelected, onClick, belongSelected) {
        let imageStyle = { background: '#ffffff' };

        if (this.state.isHovering && this.canClick()) {
            if (belongSelected) {
                imageStyle.borderColor = '#fff';
            } else {
                imageStyle.borderColor = '#a9e1fa';
            }
        }

        if (isSelected && !belongSelected) {
            imageStyle.borderColor = '#EC6E1A'
        }

        return (
            <div className="preview-photo-zone"
                style={imageStyle}
                onClick={this.canClick(onClick) && this.onPhotoClick.bind(this, photo, onClick)}>

                <img className="preview-photo" onDoubleClick={this.showPhotoDetail.bind(this)} src={photo.picUrl} alt="Detail" />
            </div>
        );
    }

    renderRemoveIcon(isHovering, isSelected, photo, iconClick) {
        if (isHovering && isSelected) {
            return (
                <div className="photo-cell-remove-icon" >
                    <span className="icon-DeletePageIconNormal" onClick={() => {iconClick(photo, false)}}>
                        <span className="path1"></span>
                        <span className="path2"></span>
                        <span className="path3"></span>
                        <span className="path4"></span>
                        <span className="path5"></span>
                    </span>
                </div>
            );
        }
    }

    render() {
        const { isOpenPhotoDetail, isHovering } = this.state;
        const { photo, onClick, isSelected, iconClick } = this.props;
        
        let displayStyle = {
            opacity: isHovering ? 1 : 0
        }
        let cellStyle = isSelected ? "selected-photo-cell" : "selecting-photo-cell";

        return (
            <div
                className={cellStyle}
                onMouseEnter={this.onHover.bind(this)}
                onMouseLeave={this.onHover.bind(this)}
            >
                {this.renderPicture(photo, photo.isSelected, onClick, isSelected)}
                <div
                    className="view-button-zone"
                >
                    {isOpenPhotoDetail && <PhotoDetail onClose={this.closePhotoDetail.bind(this)} photo={photo} />}
                    {this.renderRemoveIcon(isHovering, isSelected, photo, iconClick)}
                    <button className="view-button" style={displayStyle} onClick={this.showPhotoDetail.bind(this)} >
                        {LocaleUtils.instance.translate('import.photos.button.view')}
                    </button>
                </div>
            </div>
        );
    }
}

export default PhotoCell;