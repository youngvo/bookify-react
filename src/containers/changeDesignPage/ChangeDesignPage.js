import React from 'react';
import { connect } from 'react-redux';

import './../../styles/GeneralStyle.css'
import ChangeDesign from './../../components/changeDesign/ChangeDesign';
import Header from './../../components/materials/header/Header';
import Footer from './../../components/materials/footer/Footer';
import LocaleUtils from './../../utils/LocaleUtils';
import Button, { colorType } from './../../components/materials/button/Button'
import Assets from './../../assets/Assets';

import { themesOriginal } from './../../constants/Constants';
import { showBookDesignScreen, toggleSignInPopup } from '../../actions/appStatusActions/RootStatusActions';
import { changeThemeOfBook } from './../../actions/projectActions/bookActions/BookInfoActions';
import {
    changeBackgroundForAllPages
} from '../../actions/projectActions/bookActions/pagesActions/PagesActions';
import {
    changeBackgroundColorForCover
} from '../../actions/projectActions/bookActions/CoversActions';
class ChangeDesignPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentTheme: props.currentTheme
        }

        this.onSaveNowClick = this.onSaveNowClick.bind(this);
        this.onThemeClick = this.onThemeClick.bind(this);
        this.onChangeThemeOfBook = this.onChangeThemeOfBook.bind(this);
    }

    onSaveNowClick() {
        const { isLoggedIn, saveProject, dispatchShowSignInPopup } = this.props;
        if (isLoggedIn) {
            saveProject();
        } else {
            dispatchShowSignInPopup();
        }
    }

    onThemeClick(theme) {
        this.setState({ currentTheme: theme });
    }

    onChangeThemeOfBook() {
        const { dispatchChangeThemeOfBook, themes } = this.props;
        let defaultBackgroundId = '';
        for (let index = 0; index < themes.length; index++) {
            if (themes[index].$.id === this.state.currentTheme) {
                defaultBackgroundId= themes[index]['Defaults'][0]['DefaultPageBackground'][0].$.id;
                break;
            }
        }
        dispatchChangeThemeOfBook(this.state.currentTheme, defaultBackgroundId);
    }

    render() {
        const { dispatchCancelChangeTheme, currentTheme, lastTimeSaved } = this.props;

        const cancelChangeDesignBtn = <Button
                                            text={LocaleUtils.instance.translate('wizard.nav.cancel')}
                                            onClick={dispatchCancelChangeTheme} />
        const changeDesigntBtn = <Button
                                            className="footer-btn"
                                            text={LocaleUtils.instance.translate('label.style_book')}
                                            type={colorType.orange}
                                            onClick={this.onChangeThemeOfBook} />
        
        const backgroundStyle = {
            background: "url(" + Assets.instance.retrieveImageObjectURL('img_background_white') + ")"
        }

        return (
            <div className="screen" style={backgroundStyle}>
                <Header
                    titleDetail={LocaleUtils.instance.translate('label.style_book.title')}
                    isShowSaveNow={true}
                    lastTimeSaved={lastTimeSaved}
                    onSaveNowClick={this.onSaveNowClick}
                />
                <div className="screen-body">
                    <ChangeDesign
                        currentTheme={this.state.currentTheme}
                        onThemeClick={this.onThemeClick}
                    />
                </div>
                <Footer
                    leftBtn={cancelChangeDesignBtn}
                    firstRightBtn={changeDesigntBtn}
                />
            </div>
        );
    }        
}

const dispatchShowSignInPopup = (dispatch) => {
    dispatch(toggleSignInPopup());
}

const dispatchCancelChangeTheme = (dispatch) => {
    dispatch(showBookDesignScreen());
};

const dispatchChangeThemeOfBook = (dispatch, theme, defaultBackgroundId) => {
    dispatch(changeThemeOfBook(theme));
    dispatch(showBookDesignScreen());
    dispatch(changeBackgroundForAllPages(defaultBackgroundId));
    dispatch(changeBackgroundColorForCover(defaultBackgroundId));
};

const mapStateToProps = (state) => {
    const { themes } = state;
    return {
        lastTimeSaved: state.appStatus.bookDesignHeaderStatus.lastTimeSaved,
        isLoggedIn: state.userStatus.isLoggedIn,
        currentTheme: state.project.book.bookInfo.theme,
        themes
	};
}

const mapDispatchToProps = (dispatch) => ({
    dispatchChangeThemeOfBook: (theme, defaultBackgroundId) => dispatchChangeThemeOfBook(dispatch, theme, defaultBackgroundId),
    dispatchCancelChangeTheme: () => dispatchCancelChangeTheme(dispatch),
    dispatchShowSignInPopup: () => dispatchShowSignInPopup(dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChangeDesignPage);
