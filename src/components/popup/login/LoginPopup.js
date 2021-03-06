import React, { Component } from 'react';
import { connect } from 'react-redux';
import LocaleUtils from './../../../utils/LocaleUtils';
import AppServices from './../../../services/AppServices';
import CTEventFactory from './../../../utils/CTEventFactory';
import './LoginPopup.css'

import Utils from './../../../utils/Utils';
import IconButton from './../../materials/iconButton/IconButton';
import Button, { colorType } from './../../materials/button/Button';

import { userLoginSuccess } from './../../../actions/userActions/UserActions';
import { toggleRegisterPopup, toggleSignInPopup, toggleWelcomeBackLogin } from './../../../actions/appStatusActions/RootStatusActions';

class LoginPopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            loginFailedMessage: "",
            isChecking: false
        }
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.checkEnableLogin = this.checkEnableLogin.bind(this);
        this.onLogin    = this.onLogin.bind(this);
        this.loginClick = this.loginClick.bind(this);
        this.loginSuccess = this.loginSuccess.bind(this);
        this.loginFailed = this.loginFailed.bind(this);
    }

    renderTitleLogin(onClose) {
        return (
            <div className="login-popup-top">
                <div className="login-title">{LocaleUtils.instance.translate('label.switch_to_login')}</div>
                <IconButton className="close-popup" type={IconButton.type.close} onClick={onClose} />
            </div>
        );
    }

    onChangeUsername(e) {
        let username = e.target.value;
        this.setState({
            username: username
        });
    }

    onChangePassword(e) {
        let password = e.target.value;
        this.setState({
            password: password
        });
    }

    checkEnableLogin(e) {
        let username = this.state.username;
        let password = this.state.password;
        let isChecking = this.state.isChecking;
        let enableLogin = username.length > 0 && password.length > 0;
        if (enableLogin && e.keyCode === 13 && !isChecking) {
            this.onLogin(username, password);
        }
    }

    loginSuccess(response) {
        this.props.userLogin(response.user);
        this.props.onClose();
        this.props.saveProject();
        AppServices.trackCTEvent(CTEventFactory.instance.createUserLoggedinEvent(), null, null);
    }

    loginFailed(response) {
        let code = response.errors[0].error[0]['$'].code;
        let message = Utils.getAPIErrorMessage(code);
        this.setState({
            loginFailedMessage: message,
            isChecking: false
        });
    }

    loginClick() {
        this.onLogin(this.state.username, this.state.password);
    }

    onLogin(username, password) {
        AppServices.login(username, password, 'false', this.loginSuccess, this.loginFailed);
        this.setState({ isChecking: true });
    }

    renderLeftLogin() {
        let username = this.state.username;
        let password = this.state.password;
        let loginFailedMessage = this.state.loginFailedMessage;
        let enableLogin = username.length > 0 && password.length > 0;
        let textBtn = this.state.isChecking ? 'label.logging_in' : 'label.login';

        const borderColor = {
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "#ff0000"
        };

        return (
            <div className="login-popup-left login-left">
                <div className="login-popup-input">
                    <span className="login-failed-message">{loginFailedMessage}</span>
                    <p>{LocaleUtils.instance.translate('label.username')}</p>
                    <input
                        style={loginFailedMessage ? borderColor : null}
                        onChange={this.onChangeUsername}
                        onKeyUp={this.checkEnableLogin} />
                </div>

                <div className="login-popup-input">
                    <div className="login-forget-password">
                        <p>{LocaleUtils.instance.translate('label.password')}</p>
                        <a className="forget-password" href="http://www.blurb.com/my/account/forgot_password" target="_blank">{LocaleUtils.instance.translate('label.forgot_password')}</a>
                    </div>
                    <input
                        type="password"
                        style={loginFailedMessage ? borderColor : null}
                        onChange={this.onChangePassword}
                        onKeyUp={this.checkEnableLogin} />
                </div>

                <div className="button-sign-in login-popup-input">
                    <Button
                        type={colorType.blue}
                        text={LocaleUtils.instance.translate(textBtn)}
                        enableClick={this.state.isChecking ? false : enableLogin}
                        onClick={this.loginClick} />
                </div>
            </div>
        );
    }

    renderRightLogin(onRegisterClick) {
        return (
            <div className="login-popup-right">
                <p className="not-a-member">{LocaleUtils.instance.translate('label.not_a_member')}</p>
                <Button className="button-login" text={LocaleUtils.instance.translate('label.switch_to_registration')} type={colorType.blue} onClick={onRegisterClick} />
            </div>
        );
    }

    render() {
        const popupStyle = {
            backgroundColor: 'rgba(255, 255, 255, 0.5)'
        };
        return (
            <div className="login-popup " style={popupStyle}>
                <div className="login-popup-zone">
                    {this.renderTitleLogin(this.props.onClose)}
                    <div className="login-popup-bottom">
                        {this.renderLeftLogin()}
                        {this.renderRightLogin(this.props.onRegisterClick)}
                    </div>
                </div>
            </div>
        );
    }
}

const userLogin = (dispatch, user) => {
    dispatch(userLoginSuccess(user));
    dispatch(toggleWelcomeBackLogin());
}

const onRegisterClick = (dispatch) => {
    console.log('onRegisterClick to switch to register');
    dispatch(toggleRegisterPopup());
}

const onClose = (dispatch) => {
    dispatch(toggleSignInPopup());
}

const mapDispatchToProps = (dispatch) => {
    return ({
        userLogin:          (user) => userLogin(dispatch, user),
        onRegisterClick:    () => onRegisterClick(dispatch),
        onClose:            () => onClose(dispatch),
    });
}

export default connect(
    null,
    mapDispatchToProps
)(LoginPopup);
