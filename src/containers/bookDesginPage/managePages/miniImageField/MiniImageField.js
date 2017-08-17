import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FIT_POLICY } from './../../../../constants/Constants'

import './MiniImageField.css';

function getStyleForImage(imageSource, thumbnailUrl, ratio, sizeHeight, sizeWidth) {
    let { imageUrl, rotation, zoom_level, fit_policy, x_shift, y_shift, height, width } = imageSource;

    let thumbnailImg = new Image();
    thumbnailImg.src = thumbnailUrl;
    let thumbnailWidth = thumbnailImg.width;
    let thumbnailHeight = thumbnailImg.height;

    let originWidth = width;
    let originHeight = height;
    if ( width || height ) {
        let originImg = new Image();
        originImg.src = imageUrl;

        originWidth = originImg.width;
        originHeight = originImg.height;
    }

    let widthRender = 0;
    let heightRender = 0;
    let posX = 0;
    let posY = 0;

    if (fit_policy === FIT_POLICY.FILL || fit_policy === FIT_POLICY.PORTRAIT_FILL) {
        if (thumbnailWidth < thumbnailHeight) {
            widthRender = sizeWidth;
            heightRender = 'auto';
        } else {
            widthRender = 'auto';
            heightRender = sizeHeight;
        }
        return {
            transform: 'rotate(' + rotation + 'deg) ',
            width: widthRender,
            height: heightRender
        };
    } else if (fit_policy === FIT_POLICY.FIT) {
        if (thumbnailWidth > thumbnailHeight) {
            widthRender = sizeWidth;
            heightRender = 'auto'
        } else {
            widthRender = 'auto';
            heightRender = sizeHeight;
        }
        return {
            transform: 'rotate(' + rotation + 'deg) ',
            width: widthRender,
            height: heightRender
        };
    } else {
        widthRender = originWidth * (zoom_level / 100) * ratio;
        heightRender = originHeight * (zoom_level / 100) * ratio;
    }

    return {
        transform: 'rotate(' + rotation + 'deg) ',
        width: widthRender,
        height: heightRender,
        left: x_shift * ratio,
        top: y_shift * ratio
    };
}

const MiniImageField = (props) => {
    let { idPage, idLayout, idPageLayout, isLogo, isLogoChanged, imageSource, sizeHeight, sizeWidth, positionX, positionY , ratio, isPreview} = props;
    let className = imageSource ? imageSource.fit_policy === FIT_POLICY.MANUAL ? 'mini-image-field' : 'mini-image-field image-center' : 'mini-image-field null-image';
    let classNameImage = imageSource.fit_policy === FIT_POLICY.MANUAL ? 'mini-image' : 'mini-image';
    let styleField = {
        width: sizeWidth,
        height: (isLogo && !isLogoChanged) ? 'auto' : sizeHeight,
        transform: (isLogo && !isLogoChanged) ? 'scale(0.2)' : '',
        top: positionY,
        left: positionX,
    };

    let styleImage = {};
    let thumbnailUrl = '';
    let miniBox = ' miniBoxImage---' + idLayout + '---' + idPage + '---' + idPageLayout;

    if (imageSource) {
        thumbnailUrl = imageSource.imageUrl.replace('O','T');
        styleImage = getStyleForImage(imageSource, thumbnailUrl, ratio, sizeHeight, sizeWidth);
    }
    
    const renderImage = () => {
        return (
            <img className={classNameImage} style={styleImage} src={isPreview ? imageSource.imageUrl : thumbnailUrl} alt='' />
        );
    }

    return (
        <div className={className + miniBox} style={styleField} >
            {
                imageSource && renderImage()
            }
        </div>
    );
}

MiniImageField.propTypes = {
    idPage: PropTypes.number,
    idLayout: PropTypes.string,
    idPageLayout: PropTypes.string,
    imageSource: PropTypes.object,
    sizeHeight: PropTypes.number,
    sizeWidth: PropTypes.number,
    positionX: PropTypes.number,
    positionY: PropTypes.number,
    ratio: PropTypes.number,
    isPreview: PropTypes.bool
}

export default MiniImageField;
