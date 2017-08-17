import React from 'react';

import './GetPhotosForBook.css';
import SelectingPhotos from '../../containers/getPhotosForBook/selectingPhotos/SelectingPhotos';
import SelectedPhotos from '../../containers/getPhotosForBook/selectedPhotos/SelectedPhotos';

const GetPhotosForBook = ({albumType}) => (
    <div className="list-photo-content">
        <SelectingPhotos albumType={albumType} />
        <SelectedPhotos />
    </div>
);

export default GetPhotosForBook;
