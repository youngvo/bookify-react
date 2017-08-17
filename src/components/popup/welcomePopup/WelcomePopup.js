import React from 'react';
import PropTypes from 'prop-types';

import IconButton from './../../materials/iconButton/IconButton';
import LocaleUtils from './../../../utils/LocaleUtils';

const WelcomePopup = ({ isLogin, username }) => {

    let title = isLogin ? 'alert.sign_in_title' : 'alert.register_title';
    let content = isLogin ? 'label.login_successful' : 'label.registration_successful';

    return (
        <div className="popup-wrapper">
            <div className="popup-zone welcome-back-login-popup">
                <div className="top-popup-zone">
                    <IconButton className="close-popup" type="close" />
                    <div className="popup-item">
                        <div className="title-popup">
                            {LocaleUtils.instance.translate(title)}
                        </div>
                        <div className="content-popup" style={{ marginBottom: '10px', textAlign: 'center' }}>
                            <p className="content-welcome-back-login-popup">{LocaleUtils.instance.translate(content, { 0: username })}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

WelcomePopup.propTypes = {
    isLogin: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired
}

export default WelcomePopup;
