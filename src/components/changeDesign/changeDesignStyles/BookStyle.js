import React from 'react';
import PropTypes from 'prop-types';

import './BookStyle.css';

const BookStyle = ({ type, themeTxt, imageUrl, isChecked, onClick }) => {
    const styleChecked = {
        background: "#1db0eb"
    }

    const changeTheme = () => {
        onClick(type);
    }

    return (
        <div className="style-book" style={isChecked ? styleChecked : null} onClick={changeTheme} >
            <div className="style-book-top">
                <img src={imageUrl} alt="" />
            </div>
            <div className="style-book-bottom">
                <span>{themeTxt}</span>
            </div>
        </div>
    );
}

BookStyle.propTypes = {
    type: PropTypes.string,
    themeTxt: PropTypes.string,
    imageUrl: PropTypes.string,
    isChecked: PropTypes.bool,
    onClick: PropTypes.func
}

export default BookStyle;
