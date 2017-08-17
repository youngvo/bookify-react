import React from 'react';

import './PhotoList.css';
import PhotoCell from '../photoCell/PhotoCell';

const renderPhotoList = (photos, onPhotoCellClick, isSelected, iconClick) => (
    photos.map((photo, index) => (
      <PhotoCell
          isSelected={isSelected}
          key={photo.id}
          photo={photo}
          onClick={onPhotoCellClick}
          iconClick={iconClick}
      />
  ))
);

const PhotoList = ({ photos, posX, posY, scaleX, scaleY, onPhotoCellClick, isSelected, iconClick}) => (
    <div className="photo-list-content">
        {renderPhotoList(photos, onPhotoCellClick, isSelected, iconClick)}
    </div>
);

export default PhotoList;
