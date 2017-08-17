import React from 'react';
import { connect } from 'react-redux';

import './SelectedPhotos.css';
import LocaleUtils from './../../../utils/LocaleUtils';
import { selectPhoto, deselectPhoto } from './../../../actions/getPhotosActions/SelectedPhotosActions';
import PhotoList from '../../../components/getPhotosForBook/photoList/PhotoList';

const getTextPhotoCount = (photoCount) => {
    let result = LocaleUtils.instance.translate('wizard.title.no_photos_selected');
    if (photoCount === 1) {
        result = LocaleUtils.instance.translate('wizard.title.one_photo_selected');
    } else if (photoCount > 1) {
        result = LocaleUtils.instance.translate('wizard.title.photos_selected', { 0: photoCount });
    }
    return result;
}

const SelectedPhotos = ({ selectedPhotos, onPhotoCellClick }) => {
    let recommendTextStyle = selectedPhotos.length < 20 ? "recommend-select-photo" : "recommend-select-photo-hidden";
    return (
        <div className="content-right">
            <div className="list-photo-selected-container">
                <div>
                    <div className="list-photo-selected-title">
                        <div>{LocaleUtils.instance.translate('import.hopper.photos_for_your_book')}</div>
                    </div>
                    <div className="list-photo-selected-counter">
                        <div>{getTextPhotoCount(selectedPhotos.length)}</div>
                    </div>
                </div>
                <div>
                    <hr className="list-photo-selected-separate" />
                </div>
                <div className="list-photo-selected-wrapper">
                    <div className="list-photo-selected">
                    <PhotoList 
                        isSelected={true}
                        photos={selectedPhotos} 
                        iconClick={onPhotoCellClick} />
                    </div>
                </div>
                <div className={recommendTextStyle}>
                    {LocaleUtils.instance.translate('import.hopper.we_recommend_num_photos', { 0: 20 })}
                </div>
            </div>
        </div>
    );
}

const onPhotoCellClick = (dispatch, photo, isSelected) => {
    console.log('Deselect')
    isSelected ? dispatch(selectPhoto(photo)) : dispatch(deselectPhoto(photo));
}

const mapStateToProps = (state) => {
    const { getPhotosData } = state;
    const { selectedPhotos } = getPhotosData;

    return { selectedPhotos: Object.values(selectedPhotos.selectedPhotos) };
}

const mapDispatchToProps = (dispatch) => ({
    onPhotoCellClick: onPhotoCellClick.bind(this, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SelectedPhotos);
