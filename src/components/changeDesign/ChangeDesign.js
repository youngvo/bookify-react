import React from 'react';
import PropTypes from 'prop-types';

import './ChangeDesign.css'
import LocaleUtil from './../../utils/LocaleUtils';
import BookStyle from './changeDesignStyles/BookStyle';
import { themesOriginal } from './../../constants/Constants';
import Assets from './../../assets/Assets';

const ChangeDesign = ({ currentTheme, onThemeClick }) => {
    return (
        <div className="change-design-book-content">
            <BookStyle
                type={themesOriginal.VIEW_FINDER}
                themeTxt={LocaleUtil.instance.translate('theme.name.blurb.viewfinder')}
                imageUrl={Assets.instance.retrieveImageObjectURL('img_viewFinderTheme')}
                isChecked={currentTheme === themesOriginal.VIEW_FINDER}
                onClick={onThemeClick}
            />
            <BookStyle
                type={themesOriginal.DARK_ROOM}
                themeTxt={LocaleUtil.instance.translate('theme.name.blurb.darkroom')}
                imageUrl={Assets.instance.retrieveImageObjectURL('img_darkRoomTheme')}
                isChecked={currentTheme === themesOriginal.DARK_ROOM}
                onClick={onThemeClick}
            />
            <BookStyle
                type={themesOriginal.GIRLIE}
                themeTxt={LocaleUtil.instance.translate('theme.name.blurb.girlie')}
                imageUrl={Assets.instance.retrieveImageObjectURL('img_girlieTheme')}
                isChecked={currentTheme === themesOriginal.GIRLIE}
                onClick={onThemeClick}
            />
            <BookStyle
                type={themesOriginal.ELEGANT}
                themeTxt={LocaleUtil.instance.translate('theme.name.blurb.elegant')}
                imageUrl={Assets.instance.retrieveImageObjectURL('img_elegantTheme')}
                isChecked={currentTheme === themesOriginal.ELEGANT}
                onClick={onThemeClick}
            />
        </div>
    );
}

ChangeDesign.propTypes = {
    bookStyle: PropTypes.string,
    onChangeBookStyle: PropTypes.func
}

export default ChangeDesign;
