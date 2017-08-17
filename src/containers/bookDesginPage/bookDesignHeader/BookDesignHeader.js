import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ActionCreators as UndoActionCreators } from 'redux-undo';
import Checkbox from 'rc-checkbox';
import Tooltip      from 'rc-tooltip';
import './BookDesignHeader.css';
import MenuGetPhotos                from './../../menuGetPhotos/MenuGetPhotos';
import MenuOptions              from './../../menuOptions/MenuOptions';
import ZoomBar                  from './../../../components/zoomBar/ZoomBar';
import Button, { colorType }    from './../../../components/materials/button/Button';
import Assets                   from './../../../assets/Assets';
import LocaleUtils              from './../../../utils/LocaleUtils';
import Utils                    from './../../../utils/Utils';
import Config                   from './../../../config/Config';
import AppServices from './../../../services/AppServices';
import CTEventFactory           from './../../../utils/CTEventFactory';
import { setProjectInfo } from './../../../actions/projectActions/ProjectInfoActions'
import { toggleRegisterPopup, showPreviewBook } from '../../../actions/appStatusActions/RootStatusActions';
import {
    toggleMenuOptions,
    toggleMenuGetPhotos,
    toggleShowHelpBubble
} from './../../../actions/appStatusActions/BookDesignHeaderStatusActions';
import IconButton from './../../../components/materials/iconButton/IconButton';

class BookDesignHeader extends Component {
    constructor(props){
        super(props);
    };

    renderSaveNow() {
        let lastTimeSaved = this.props.bookDesignHeaderStatus.lastTimeSaved !== 'null' ? this.props.bookDesignHeaderStatus.lastTimeSaved : Utils.getCurrentTime();
        return (
            <div className='header-save'>
                {LocaleUtils.instance.translate('statusView.lastSavedAt', { 0: lastTimeSaved })}
                <p onClick={this.props.checkingUserIsLoggedIn}>{LocaleUtils.instance.translate('statusView.saveNow')}</p>
            </div>
        )
    }

    renderInfoAction() {
        return (
            <div className="header-save">
                <span className="header-save status-action">{this.props.bookDesignHeaderStatus.statusAction}</span>
            </div>
        );
    }

    renderHeaderLeft() {

        let disableUndoClassName = !this.props.canUndo ? 'undo-disable' : null;
        let disableRedoClassName = !this.props.canRedo ? 'redo-disable' : null;
        return (
            <div className='header-left header-zone'>
                <div className='header-logo'>
                    <img src={Assets.instance.retrieveImageObjectURL('img_applogo')} alt="" />
                </div>
                <div className='header-menu-button header-button relative-pos' >
                    <Button
                        textFirst={true}
                        onMouseDown={this.props.toggleMenuOptionsPopup}
                        text={LocaleUtils.instance.translate('label.options')}
                        icon="triangle-down" />
                    {
                        this.props.bookDesignHeaderStatus.isShowMenuOptions && <MenuOptions leftMenuItems={Config.instance.leftMenuItems} rightMenuItems={Config.instance.rightMenuItems}/>
                    }
                </div>
                <div className={'header-undo-button header-button ' + disableUndoClassName}>
                    <Button
                        textFirst={true}
                        enableClick={this.props.canUndo}
                        onClick={this.props.handleUndo}
                        text={LocaleUtils.instance.translate('label.undo')}
                        icon="icon-UndoIcon" />
                </div>
                <div className={'header-redo-button header-button ' + disableRedoClassName}>
                    <Button
                        textFirst={true}
                        enableClick={this.props.canRedo}
                        onClick={this.props.handleRedo}
                        text={LocaleUtils.instance.translate('label.redo')}
                        icon="icon-RedoIcon" />
                </div>
                {
                    this.props.bookDesignHeaderStatus.isShowInfoAction ? this.renderInfoAction() : this.renderSaveNow()
                }
            </div>
        );
    };

    handleChangeZoomValue(value) {
        this.props.handleChangeZoomValue(value);
    }

    renderHeaderMiddle() {
        return (
          <div className='header-middle header-zone'>
              { this.props.isShowManagePages ? null : <ZoomBar handleChangeZoomValue={this.handleChangeZoomValue.bind(this)} /> }
          </div>
        );
    };

    showHelpChanged(e) {
        this.props.showHelpBubble(e.target.checked);
        AppServices.trackCTEvent(CTEventFactory.instance.createBubbleHelpToggledEvent(e.target.checked), null, null);
    }

    renderHeaderRight() {
        let { isShowHelpBubble, toggleMenuGetPhotosPopup, bookDesignHeaderStatus, handlePreviewAndFinish, isShowManagePage } = this.props;
        return (
            <div className='header-right header-zone'>
                <div className='header-show-help-checkbox'>
                    <label>
                        <Checkbox
                            checked={isShowHelpBubble}
                            onChange={this.showHelpChanged.bind(this)}
                        />
                        <span className="label">{LocaleUtils.instance.translate('helpbubbles.show_help_label')}</span>
                    </label>
                </div>
                <div className='header-get-photo-button header-button relative-pos'>
                    <Button className="get-photo-button btn-header-gd" onMouseDown={toggleMenuGetPhotosPopup} text={LocaleUtils.instance.translate('label.get_photos')} />
                    {
                        bookDesignHeaderStatus.isShowMenuGetPhotos && <MenuGetPhotos photoImportOptions={Config.instance.photoImportOptions}/>
                    }
                </div>
                <Tooltip placement='bottom' prefixCls='show-help-tooltip-custom-book-design-header'
                         visible={isShowHelpBubble && isShowManagePage}
                         overlay={<div><IconButton type={IconButton.type.closeShowHelp} onClick={this.props.closeShowHelpBubble}/>
                             <div className='show-help-tooltip-custom-book-design-header-text'>{LocaleUtils.instance.translate('helpbubbles.preview_button')}</div></div>}>
                    <div className='header-preview-button header-button'>
                        <Button type={colorType.orange} text={LocaleUtils.instance.translate('label.preview')} onClick={handlePreviewAndFinish} />
                    </div>
                </Tooltip>
            </div>
        );
    };

    render() {
        let customStyleHeader = {
            backgroundImage: 'url(' + Assets.instance.retrieveImageObjectURL('img_header_background') + ')',
            backgroundSize: '100% 100%'
        }

        return (
            <div className='header-main' style={customStyleHeader}>
                { this.renderHeaderLeft() }
                { this.renderHeaderMiddle() }
                { this.renderHeaderRight() }
            </div>
        );
    };
}

BookDesignHeader.propTypes = {
    bookDesignHeaderStatus: PropTypes.object.isRequired,
    handleChangeZoomValue: PropTypes.func,
    isShowManagePages: PropTypes.bool
};

const handleUndo = (dispatch) => {
    console.log("press Undo", dispatch);
    dispatch(UndoActionCreators.undo());
};

const handleRedo = (dispatch) => {
    console.log("press Redo");
    dispatch(UndoActionCreators.redo());
};

const onSaveProject = (dispatch, project) => {
    dispatch(setProjectInfo(project));
};

const onOpenRegister = (dispatch) => {
    dispatch(toggleRegisterPopup());
};

const handlePreviewAndFinish = (dispatch) => {
    dispatch(showPreviewBook());
};

const toggleMenuOptionsPopup = (dispatch) => {
    dispatch(toggleMenuOptions());
};

const toggleMenuGetPhotosPopup = (dispatch) => {
    dispatch(toggleMenuGetPhotos());
};

const handleShowHelpBubble = (dispatch, showHelpIsChecked) => {
    dispatch(toggleShowHelpBubble(showHelpIsChecked));
};

const handleCloseShowHelpBubble = (dispatch) => {
    dispatch(toggleShowHelpBubble(false));
};

const mapStateToProps = (state) => {
    let { appStatus, project, userStatus  } = state;
    let { bookDesignHeaderStatus, rootStatus } = appStatus;
    let { isShowHelpBubble } = bookDesignHeaderStatus;
    let { isShowManagePage } = rootStatus;
    let canUndo = (project.book.pages.past.length - 1) > 0;
    let canRedo = project.book.pages.future.length > 0;

    return {bookDesignHeaderStatus, project, userStatus, canUndo, canRedo, isShowHelpBubble, isShowManagePage};
};

const mapDispatchToProps = (dispatch) => ({
    handleUndo: () => handleUndo(dispatch),
    handleRedo: () => handleRedo(dispatch),
    handlePreviewAndFinish: () => handlePreviewAndFinish(dispatch),
    toggleMenuOptionsPopup: () => toggleMenuOptionsPopup(dispatch),
    toggleMenuGetPhotosPopup: () => toggleMenuGetPhotosPopup(dispatch),
    onOpenRegister: () => onOpenRegister(dispatch),
    onSaveProject: () => onSaveProject(dispatch),
    showHelpBubble: (showHelpIsChecked) => handleShowHelpBubble(dispatch, showHelpIsChecked),
    closeShowHelpBubble: () => handleCloseShowHelpBubble(dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BookDesignHeader);
