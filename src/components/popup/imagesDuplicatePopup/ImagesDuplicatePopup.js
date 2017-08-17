import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick'

import './ImagesDuplicatePopup.css';
import IconButton from './../../materials/iconButton/IconButton';
import Button, { colorType } from './../../materials/button/Button';
import LocaleUtils from './../../../utils/LocaleUtils';

const ImagesDuplicatePopup = ({ images, onContinue }) => {

    function renderImages(images) {
        return (
            images.map((image, index) => (
                <div className="image-duplicated">
                    <img className="image-dup" key={index} src={image.imageUrl} />
                    <p className="image-name-dup">{image.name}</p>
                </div>
            ))
        );
    }

    function renderImagesDuplicate(images) {
        const settings = {
            slidesToShow: 3,
            slidesToScroll: 1,
            infinite: false,
            swipeToSlide: false,
            swipe: false
        };

        return (
            <div className="images-dup-zone">
                <Slider {...settings}>
                    {renderImages(images)}
                </Slider>
            </div>
        );
    }

    function renderContent(images) {
        return (
            <div className="content-popup">
                {renderImagesDuplicate(images)}
                <p className="images-dup-text">{LocaleUtils.instance.translate('popup.images_duplicated.text')}</p>
            </div>
        );
    }

    function renderButtons(onContinue) {
        return (
            <div className="bottom-popup-zone">
                <hr className="divider-popup" />
                <div className="group-button-item-popup">
                    <Button type={colorType.blue} text={LocaleUtils.instance.translate('warnings.duplocate_photos.dont_upload')} onClick={onContinue} />
                </div>
            </div>
        );
    }

    function renderTitle() {
        return (
            <div className="title-popup">
                {LocaleUtils.instance.translate('popup.images_duplicated.title')}
            </div>
        );
    }

    return (
        <div className="popup-wrapper">
            <div className="popup-zone images-dup-popup">
                <div className="top-popup-zone">
                    <div className="popup-item">
                        {renderTitle()}
                        {renderContent(images)}
                    </div>
                </div>
                {renderButtons(onContinue)}
            </div>
        </div>
    );
}

ImagesDuplicatePopup.propTypes = {
    images: PropTypes.array.isRequired,
    onContinue: PropTypes.func.isRequired
}

export default ImagesDuplicatePopup;
