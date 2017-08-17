import React, { Component } from 'react';
import PropTypes from 'prop-types';
import  { connect } from 'react-redux'
import Tooltip from 'rc-tooltip';
import onClickOutsize from 'react-onclickoutside';

import './MenuOptions.css';
import LocaleUtils from '../../utils/LocaleUtils'
import LinkText from './../../components/materials/linkText/LinkText';
import IconButton from './../../components/materials/iconButton/IconButton';
import { toggleMenuOptions } from '../../actions/appStatusActions/BookDesignHeaderStatusActions';
import {
    showChangeBookDesign,
    showChangeOrderLayoutScreen,
    showPreviewBook,
    toggleReadyToOrderPopup
 } from '../../actions/appStatusActions/RootStatusActions';

class MenuOptions extends Component {
    constructor(props) {
        super(props)
        this.state = {
            position: {
                x: 0,
                y: 0
            }
        }
        this.setPositionState = this.setPositionState.bind(this);
    }

    setPositionState(e) {
        let rect = e.target.getBoundingClientRect();
        let xPos = e.pageX - rect.left - rect.width; //x position within the element
        let yPos = e.pageY - rect.top - rect.height;  //y position within the element
        this.setState({
            position: {
                x: xPos,
                y: yPos
            }
        })
    }

    handleClickOutside() {
        this.props.onClose();
    }

    renderMenuOptionsLeft() {
        let enableAutoCreateBook = Object.keys(this.props.photoList).map((k) => this.props.photoList[k]).length > 0;
        return (
            <div className="menu-item-zone menu-item-left">
                <p className="title-text" >
                    {this.props.project_title.length > 0 ? this.props.project_title : LocaleUtils.instance.translate('default_book_title')}
                </p>
                <div className="sd"></div>
                {
                    this.props.leftMenuItems.map((menuItem) =>
                        menuItem.type === 'divider'
                            ?
                            <div>
                                <div className="hr-white" > </div>
                                <div className="sd"></div>
                            </div>
                            :
                            <LinkText
                                text={LocaleUtils.instance.translate(menuItem.text)}
                                link={LocaleUtils.instance.translate(menuItem.url)}
                                enableClick={menuItem.clickable == 1 && (menuItem.id === 'mi_autocreate' ? enableAutoCreateBook : true)}
                                newTab={menuItem.newTab == 1}
                                onClick={this.props[menuItem.onClickAction]} />
                    )}
            </div>
        );
    }

    renderMenuOptionsRight() {
        let enableAutoCreateBook = Object.keys(this.props.photoList).map((k) => this.props.photoList[k]).length > 0;
        return (
            <div className="menu-item-zone menu-item-right">
                <p className="title-text" >{LocaleUtils.instance.translate('blurb.com')}</p>
                <div className="sd"></div>
                {
                    this.props.rightMenuItems.map((menuItem) =>
                        menuItem.type === 'divider'
                            ?
                            <div>
                                <div className="hr-white" > </div>
                                <div className="sd"></div>
                            </div>
                            :
                            <LinkText
                                text={LocaleUtils.instance.translate(menuItem.text)}
                                link={LocaleUtils.instance.translate(menuItem.url)}
                                enableClick={menuItem.clickable == 1 && (menuItem.id === 'mi_autocreate' ? enableAutoCreateBook : true)}
                                newTab={menuItem.newTab == 1}
                                onClick={this.props[menuItem.onClickAction]} />
                    )}
            </div>
        );
    };

    renderIconButton() {
        return (
            <Tooltip placement='bottomRight' prefixCls='rc-tooltip-custom-page'
                     align={{
                         offset: [this.state.position.x, this.state.position.y],
                     }}
                     overlay={LocaleUtils.instance.translate('tooltip.close')}>
                <div className='menu-option-tooltip-custom' onMouseEnter={this.setPositionState}>
                    <IconButton className='close-main-menu' onClick={this.props.onClose} type={IconButton.type.close}/>
                </div>
            </Tooltip>
        );
    };

    render() {
        return (
            <div className="main-menu-component" >
                <div className="triangle-on-menu"></div>
                <div className="main-menu-zone">
                    { this.renderMenuOptionsLeft() }
                    { this.renderMenuOptionsRight() }
                    { this.renderIconButton() }
                </div>
            </div>
        );
    }
}

const onClose = (dispatch) => {
    dispatch(toggleMenuOptions());
};

const onChangeDesignClick = (dispatch) => {
    onClose(dispatch);
    dispatch(showChangeBookDesign());
};

const onAutoCreateClick = (dispatch) => {
    onClose(dispatch);
    dispatch(showChangeOrderLayoutScreen());
};

const onPreviewBookClick = (dispatch) => {
    onClose(dispatch);
    dispatch(showPreviewBook())
};

const onFinishClick = (dispatch) => {
    onClose(dispatch);
    dispatch(toggleReadyToOrderPopup())
};

const mapDispatchToProps = (dispatch) => {
    return {
        onClose:                onClose.bind(null, dispatch),
        onChangeDesignClick:    onChangeDesignClick.bind(null, dispatch),
        onAutoCreateClick:      onAutoCreateClick.bind(null, dispatch),
        onPreviewBookClick:     onPreviewBookClick.bind(null, dispatch),
        onFinishClick:          onFinishClick.bind(null, dispatch),
    };
}

const mapStateToProps = (state) => {
    return {
        photoList: state.photoList,
        project_title: state.project.projectInfo.metadata.title
    };
}

MenuOptions.propTypes = {
    leftMenuItems: PropTypes.object.isRequired,
    rightMenuItems: PropTypes.object.isRequired,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(onClickOutsize(MenuOptions))
