import React, { Component }     from 'react';
import { connect } from 'react-redux';

import './RegisterPopup.css';
import TextInput                from './textInput/TextInput';
import LocaleUtils              from './../../../utils/LocaleUtils';
import IconButton               from './../../materials/iconButton/IconButton';
import Button, {colorType}      from './../../materials/button/Button';
import AppServices from './../../../services/AppServices';
import Utils from './../../../utils/Utils';
import LocationUtils from './../../../utils/LocationUtils';
import { userRegisterSuccess } from './../../../actions/userActions/UserActions';
import { toggleSignInPopup, toggleRegisterPopup, toggleWelcomeNewRegister } from '../../../actions/appStatusActions/RootStatusActions';
import CTEventFactory from './../../../utils/CTEventFactory';

const validClass   = "message-success";
const invalidClass  = "message-failed";

class RegisterPopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            emailIsFirstRender: true,
            usernameIsFirstRender:  true,
            emailFocused:       false,
            usernameFocused:    false,
            passwordFocused:    false,
            email: '',
            username:   '',
            password: '',
            emailStatusMessage: '',
            emailStatusClass: '',
            usernameStatusMessage: '',
            usernameStatusClass: '',
            emailIsError : false,
            errorPasswordMessage: "",
            usernameIsError : false,
            passwordIsError: false,
            receiveEmailOffer: true,
            isHoverUsername: false,
            isHoverEmail: false,
        };

        this.emailInputFocused          = this.emailInputFocused.bind(this);
        this.usernameInputFocused       = this.usernameInputFocused.bind(this);
        this.passwordInputFocused       = this.passwordInputFocused.bind(this);
        this.handleChangeEmail          = this.handleChangeEmail.bind(this);
        this.handleChangeUsername       = this.handleChangeUsername.bind(this);
        this.handleChangePassword       = this.handleChangePassword.bind(this);
        this.handleChangeReceiveEmail   = this.handleChangeReceiveEmail.bind(this);
        this.checkInputtingEmail        = this.checkInputtingEmail.bind(this);
        this.onKeyUpHandle              = this.onKeyUpHandle.bind(this);
        this.onRegisterClick            = this.onRegisterClick.bind(this);
        this.verifyUsernameFailed       = this.verifyUsernameFailed.bind(this);
        this.verifyUsernameSuccess       = this.verifyUsernameSuccess.bind(this);
        this.registerFailed             = this.registerFailed.bind(this);
        this.registerSuccess = this.registerSuccess.bind(this);
        this.toggleHoverUsername = this.toggleHoverUsername.bind(this);
        this.toggleHoverEmail = this.toggleHoverEmail.bind(this);
    }

    toggleHoverUsername() {
        this.setState({ isHoverUsername: !this.state.isHoverUsername });
    }

    toggleHoverEmail() {
        this.setState({ isHoverEmail: !this.state.isHoverEmail });
    }
    
    emailInputFocused() {
        if (this.state.emailIsError) {
            this.checkInputtingEmail();
        }
        if (this.state.usernameFocused) {
            this.setState({
                usernameIsFirstRender: false,
            });
        }
        this.setState({
            emailFocused:       true,
            usernameFocused:    false,
            passwordFocused:    false,
        });
        setTimeout(() => {
            this.checkUserNameAPIService();
        }, 200);
    }

    usernameInputFocused() {
        if (!this.state.emailIsError) {
            this.checkInputtingEmail();
        }
        if (this.state.emailFocused) {
            this.setState({
                emailIsFirstRender: false,
            });
        }
        this.setState({
            emailFocused:       false,
            usernameFocused:    true,
            passwordFocused:    false,
        });
    }

    passwordInputFocused() {
        if (!this.state.emailIsError) {
            this.checkInputtingEmail();
        }
        if (this.state.usernameFocused) {
            this.setState({
                usernameIsFirstRender: false,
            });
        }
        if (this.state.emailFocused) {
            this.setState({
                emailIsFirstRender: false,
            });
        }
        this.setState({
            emailFocused:    false,
            usernameFocused: false,
            passwordFocused: true,
        });
        setTimeout(() => {
            this.checkUserNameAPIService();
        }, 200);
    }

    handleChangeReceiveEmail = () => {
        this.setState({
            receiveEmailOffer: !this.state.receiveEmailOffer
        });
    }

    handleChangeEmail(evt) {
        let email = evt.target.value;
        this.setState({ email });
    }

    checkInputtingEmail() {
        setTimeout(() => {
            if (!this.state.emailIsFirstRender) {
                let email = this.state.email;
                var apiResponseMessage = '';
                if (email.length === 0) {
                    apiResponseMessage = Utils.getAPIErrorMessage('email.field_requested');
                }
                else if (email.indexOf('@') === -1) {
                    apiResponseMessage = Utils.getAPIErrorMessage('email.missing_@');
                }
                else if (!Utils.verifyEmail(email)) {
                    apiResponseMessage = Utils.getAPIErrorMessage('email.address_is_not_valid');
                }
                if (apiResponseMessage !== '') {
                    this.setState(
                    {
                        emailStatusMessage: apiResponseMessage,
                        emailStatusClass: invalidClass,
                        emailIsError : true
                    });
                } else {
                    this.setState(
                    {
                        emailStatusMessage: apiResponseMessage,
                        emailStatusClass: validClass,
                        emailIsError : false
                    });
                }
            }
        }, 200);
    }

    checkUserNameAPIService() {
        if(!this.state.usernameIsFirstRender) {
            AppServices.verifyUsername(this.state.username, this.verifyUsernameSuccess, this.verifyUsernameFailed);
        }
    }

    verifyUsernameSuccess(response) {
        let username = response.user.username;
        let apiResponseMessage = LocaleUtils.instance.translate('label.username_is_valid');

        if (this.state.username === '') {
            this.setState({
                usernameStatusMessage: Utils.getAPIErrorMessage("user.username_must_be_between"),
                usernameStatusClass: invalidClass,
                usernameIsError : true
            });
        }
        else {
            this.setState({
                username: username,
                usernameStatusMessage: apiResponseMessage,
                usernameStatusClass: validClass,
                usernameIsError : false
            });

        }
    }

    verifyUsernameFailed(response) {
        let codeResponse = response.errors[0].error[0]['$'].code;
        let apiResponseMessage = Utils.getAPIErrorMessage(codeResponse);
        this.setState({
            usernameStatusMessage: apiResponseMessage,
            usernameStatusClass: invalidClass,
            usernameIsError : true
        });
    }

    handleChangeUsername(e) {
        let username = e.target.value;
        this.setState({
            username: username
        });
    }

    handleChangePassword(e) {
        let password = e.target.value;
        this.setState({
            password: password
        });
    }

    onKeyUpHandle(e) {
        let email       = this.state.email;
        let username    = this.state.username;
        let password    = this.state.password;
        let enableRegister = !this.state.usernameIsError && Utils.verifyEmail(email) && username.length > 0 && password.length > 0;
        if (enableRegister && e.keyCode === 13 && !this.state.isChecking) {
            this.onRegisterClick();
        }
    }

    registerSuccess(response) {
        let userVO = {
            id: response.id,
            email: response.email,
            username: response.user.username
        }
        this.props.onRegister(userVO);
        this.props.saveProject();
        AppServices.trackCTEvent(CTEventFactory.instance.createUserRegisteredEvent(), null, null);
    }

    registerFailed(response) {
        let errors = response.errors[0].error;
        let passwordIsError = false;
        errors.forEach(function(error) {
            let codeError = error['$'].code;
            if (codeError.indexOf('email') >= 0) {
                this.setState({
                    emailStatusMessage: Utils.getAPIErrorMessage(codeError),
                    emailIsError: true,
                    emailStatusClass: invalidClass,
                });
            }
            if (codeError.indexOf('user') >= 0) {
                passwordIsError = true;
                this.setState({
                    errorPasswordMessage: Utils.getAPIErrorMessage(codeError),
                    passwordIsError: true
                });
            }
        }.bind(this));
        if (!passwordIsError) {
            this.setState({
                errorPasswordMessage: '',
                passwordIsError: false
            });
        }
        this.setState({ isChecking: false });
    }

    onRegisterClick() {
        let email       = this.state.email;
        let username    = this.state.username;
        let password    = this.state.password;
        let receiveEmailOffer = this.state.receiveEmailOffer;
        let language = LocationUtils.instance.defaultLanguage();
        language = language.split('_')[0];
        AppServices.register(username, password, email, receiveEmailOffer, language, this.registerSuccess, this.registerFailed);
        this.setState({ isChecking: true });
    }

    renderTitle() {
        return (
            <div className="register-top-popup-zone">
                <div className="title-popup-item">{ LocaleUtils.instance.translate('alert.register_title') }</div>
                <IconButton className="close-popup" type="close" onClick={this.props.onClose}/>
            </div>
        );
    }

    renderEmailInput() {
        const your_email = LocaleUtils.instance.translate('label.your_email');
        const suggestInputEmail = LocaleUtils.instance.translate('tooltip.register.email_address');
        return (
            <div className="register-popup-input">
                <div className="register-popup-zone-input" onMouseEnter={this.toggleHoverEmail} onMouseLeave={this.toggleHoverEmail}>
                    <TextInput
                        isError={this.state.emailIsError}
                        text={your_email}
                        onChangeText={this.handleChangeEmail}
                        onFocusInput={this.emailInputFocused}
                        onKeyUpHandle={this.onKeyUpHandle} />
                    <div className={this.state.emailStatusClass}>{this.state.emailStatusMessage}</div>
                </div>
                {
                    this.state.isHoverEmail &&
                    <div className="red-popup-wrapper">
                        <div className="red-popup">This field is required</div>
                        <span className="triangle2"></span>
                    </div>
                }
                {this.state.emailFocused && this.registerSuggestion(suggestInputEmail)}
            </div>
        );
    }

    registerSuggestion(suggestText) {
        return (
            <div className="register-popup-suggestion">
                {suggestText}
            </div>
        );
    }

    renderUsernameInput() {
        const choose_username = LocaleUtils.instance.translate('label.choose_username');
        const suggestInputUsername = LocaleUtils.instance.translate('tooltip.register.username');
        let usernameFocused = this.state.usernameFocused;
        return (
            <div className="register-popup-input">
                <div className="register-popup-zone-input" onMouseEnter={this.toggleHoverUsername} onMouseLeave={this.toggleHoverUsername}>
                     <TextInput
                        isError={this.state.usernameIsError}
                         text={choose_username}
                         onChangeText={this.handleChangeUsername}
                         onFocusInput={this.usernameInputFocused}
                         onKeyUpHandle={this.onKeyUpHandle} />
                     <div className={this.state.usernameStatusClass}>{this.state.usernameStatusMessage}</div>
                </div>
                {
                    this.state.isHoverUsername &&
                    <div className="red-popup-wrapper choose-username">
                        <div className="red-popup">Username must be between 3 and 12 characters long</div>
                        <span className="triangle2"></span>
                    </div>
                }
                {usernameFocused && this.registerSuggestion(suggestInputUsername)}
            </div>
        );
    }

    renderPasswordInput() {
        const choose_password = LocaleUtils.instance.translate('label.choose_password');
        const suggestInputPassword = LocaleUtils.instance.translate('tooltip.register.password');

        let passwordFocused = this.state.passwordFocused;
        return (
            <div className="register-popup-input height-zone-password">
                <div className="register-popup-zone-input">
                    <TextInput
                        isError={this.state.passwordIsError}
                        text={choose_password}
                        type="password"
                        onFocusInput={this.passwordInputFocused}
                        onChangeText={this.handleChangePassword}
                        onKeyUpHandle={this.onKeyUpHandle} />
                    <p style={{'color': '#ff0000'}}>{this.state.errorPasswordMessage}</p>
                </div>
                {passwordFocused && this.registerSuggestion(suggestInputPassword)}
            </div>
        );
    }

    renderOfferNew() {
        let receiveEmailOffer = this.state.receiveEmailOffer;
        return (
            <div className="zone-offer-news">
                <hr />
                <p>{LocaleUtils.instance.translate('label.subscribe_to_newsletter')}</p>
                <input
                    className="login-popup-checkbox"
                    type="checkbox"
                    checked={receiveEmailOffer}
                    onChange={this.handleChangeReceiveEmail} />
                <span onClick={this.handleChangeReceiveEmail}>{LocaleUtils.instance.translate('label.heck_yeah')}</span>
            </div>
        );
    }

    renderRegister() {
        let email        = this.state.email;
        let username     = this.state.username;
        let password     = this.state.password;
        let enableRegister = !this.state.usernameIsError && Utils.verifyEmail(email) && username.length > 0 && password.length > 0;
        let textBtn = this.state.isChecking ? 'label.registering' : 'label.register';
        
        return (
            <div className="zone-agree-register">
                <hr className="zone-agree-register-devide"/>
                <p className="continuing-agree-term">{LocaleUtils.instance.translate('label.registration_disclaimer')}
                    <a
                        href="http://www.blurb.com/about/tandcs_plain"
                        className="link-conditions"
                        target="_blank"
                    >
                        {LocaleUtils.instance.translate('label.terms_and_conditions')}
                    </a>
                </p>
                <Button
                    className="button-register"
                    type={colorType.blue}
                    text={LocaleUtils.instance.translate(textBtn)}
                    enableClick={this.state.isChecking ? false : enableRegister}
                    onClick={this.onRegisterClick} />
            </div>
        );
    }

    renderContentLeft() {
        return (
            <div className="popup-zone-left">
                {this.renderEmailInput()}
                {this.renderUsernameInput()}
                {this.renderPasswordInput()}
                {this.renderOfferNew()}
                {this.renderRegister()}
            </div>
        );
    }

    renderContentRight() {
        return (
            <div className="register-popup-zone-right">
                <p>{ LocaleUtils.instance.translate('label.already_a_member') }</p>
                <Button className="button-login" text={ LocaleUtils.instance.translate('label.switch_to_login') } type={colorType.blue} onClick={this.props.onSignInClick} />
            </div>
        );
    }

    render() {
        const popupStyle = {
            backgroundColor: 'rgba(255, 255, 255, 0.5)'
        };
        return (
            <div className="register-popup-wrapper " style={popupStyle}>
                <div className="register-popup-zone">
                    { this.renderTitle() }
                    <div className="register-bottom-popup-zone">
                        { this.renderContentLeft() }
                        { this.renderContentRight() }
                    </div>
                </div>
            </div>
        );
    }
}

const onClose = (dispatch) => {
    dispatch(toggleRegisterPopup());
}

const onSignInClick = (dispatch) => {
    dispatch(toggleSignInPopup());
}

const onRegister = (dispatch, user) => {
    dispatch(userRegisterSuccess(user));
    onClose(dispatch);
    dispatch(toggleWelcomeNewRegister());
}

const mapDispatchToProps = (dispatch) => {
    return ({
        onSignInClick: () => onSignInClick(dispatch),
        onClose: () => onClose(dispatch),
        onRegister: (user) => onRegister(dispatch, user),
    });
}

export default connect(
    null,
    mapDispatchToProps
)(RegisterPopup);
