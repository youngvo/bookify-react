import React from 'react';

import './PhotoLayouts.css';
import Assets from './../../../assets/Assets';

const PhotoLayoutItem = ({ isChecked, layout, onLayoutTypeClick }) => {
    let checkedStyle = {
        border: "2px solid orange"
    };

    const onLayoutClick = () => {
        onLayoutTypeClick(layout);
    };

    let photoLayout = Assets.instance.retrieveImageObjectURL(layout.imageName);
    console.log('layout item: ', layout);

    return (
        <div className={isChecked ? "layout-photo-component is-checked" : "layout-photo-component"}  onClick={onLayoutClick}>
            <img src={photoLayout} alt={layout.layoutType} />
        </div>
    );
};

export default PhotoLayoutItem;