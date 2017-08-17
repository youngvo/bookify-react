import React, { Component } from 'react';
import onClickOutsize from 'react-onclickoutside';

import './PhotoLayouts.css';
import IconButton from './../../materials/iconButton/IconButton';
import PhotoLayoutItem from './PhotoLayoutItem';
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

class PhotoLayouts extends Component {
    handleClickOutside() {
        this.props.onCloseChangeLayoutPhoto();
    }

    renderLayouts(currChooseLayouts, layouts, onLayoutTypeClick) {
        const settings = {
            slidesToShow: 3,
            slidesToScroll: 1,
            infinite: false,
            swipeToSlide: false,
            swipe: false
        };

        const renderLayoutsDetails = () => {
            return (
                layouts.map((layout) => (
                    <div>
                        <PhotoLayoutItem
                            key={layout.layoutType}
                            isChecked={layout.layoutType === currChooseLayouts.layoutType}
                            layout={layout}
                            onLayoutTypeClick={onLayoutTypeClick} />
                    </div>
                ))
            );
        }

        return (
            <Slider  {...settings}>
                {renderLayoutsDetails()}
            </Slider>
        );
    }

    render() {
        const { currChooseLayout, layouts, onLayoutTypeClick, onCloseChangeLayoutPhoto } = this.props;

        return (
            <div className="photo-layout">
                <div className="triangle" />
                <div className="photo-layout-close-button">
                    <IconButton type={IconButton.type.close} onClick={onCloseChangeLayoutPhoto} />
                </div>
                {this.renderLayouts(currChooseLayout, layouts, onLayoutTypeClick)}
            </div>
        );
    }
}

export default onClickOutsize(PhotoLayouts);
