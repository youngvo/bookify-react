import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import './ChangeStylePage.css';
import IconButton from './../../../../components/materials/iconButton/IconButton';
import LocaleUtils from './../../../../utils/LocaleUtils';
import Tooltip  from 'rc-tooltip';
import LayoutPopup from './../../../../components/popup/layout/LayoutPopup';
import { showSelectLayoutPageLeft, showSelectLayoutPageRight, showBackgroundAndBorderPageLeft, showBackgroundAndBorderPageRight } from './../../../../actions/appStatusActions/RootStatusActions';
import CoverLayoutPopup from './../../../../components/popup/cover/CoverLayoutPopup';
import { FRONT_COVER_TYPES, COVER_SECTION } from './../../../../constants/Constants';
import {
    setCoverLayout
} from '../../../../actions/projectActions/bookActions/CoversActions';
import BackgroundsAndBordersPopup from '../../../popup/backgroundsAndBorders/BackgroundsAndBordersPopup';

class ChangeStylePage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            position: {
                x: 0,
                y: 0
            }
        }
        this.setPositionState = this.setPositionState.bind(this);
        this.onChangeAutoCoverLayout = this.onChangeAutoCoverLayout.bind(this);
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


    onChangeAutoCoverLayout() {
        let {type, layout_group_id, typesOfFrontCoverLayouts, onClickChooseCoverLayout} = this.props;
        let frontCoverList;
        if (type === FRONT_COVER_TYPES.DUST_JACKET) {
            frontCoverList = typesOfFrontCoverLayouts[0];
        } else if (type === FRONT_COVER_TYPES.IMAGE_WRAP) {
            frontCoverList = typesOfFrontCoverLayouts[1];
        } else {
            frontCoverList = typesOfFrontCoverLayouts[2];
        }
        for (let i = 0; i < frontCoverList.length; i++) {
            if (layout_group_id === frontCoverList[i].$.group_id) {
                if (i === frontCoverList.length - 1) {
                    onClickChooseCoverLayout(frontCoverList[0]);
                } else {
                    onClickChooseCoverLayout(frontCoverList[i + 1]);
                }
                return;
            }
        }
    }

    renderChangeStyleLeftPage() {
        const {onChangeLayoutAuto, numPage, display, onSelectLayoutPageLeft,
            onSelectBackgroundsAndBordersPageLeft, isShowSelectLayoutPageLeft, isShowSelectBackgroundsAndBordersPageLeft } = this.props;
        return (
            <div className="change-style-layout left-corner-page">
                <div className='select-page-layout-left'>
                    <Tooltip placement='bottomRight' prefixCls='rc-tooltip-custom-page'
                             align={{
                                 offset: [this.state.position.x, this.state.position.y],
                             }}
                             overlay={LocaleUtils.instance.translate('tooltip.shuffle_layout')}>
                        <div className='tooltip-custom-div-wrapper' onMouseEnter={this.setPositionState}>
                            <IconButton className="margin-button" type={IconButton.type.changeLayout}
                                        onClick={onChangeLayoutAuto}/>
                        </div>
                    </Tooltip>
                </div>
                <div className='select-page-layout-left'>
                    <Tooltip placement='bottomRight' prefixCls='rc-tooltip-custom-page'
                             align={{
                                 offset: [this.state.position.x, this.state.position.y],
                             }}
                             overlay={LocaleUtils.instance.translate('tooltip.change_page_layout')}>
                        <div className='tooltip-custom-div-wrapper' onMouseEnter={this.setPositionState}>
                            <IconButton className="margin-button" type={IconButton.type.selectLayout}
                                        onMouseDown={onSelectLayoutPageLeft}/>
                        </div>
                    </Tooltip>
                    {isShowSelectLayoutPageLeft ? <LayoutPopup display={display} numPage={numPage}
                                                                          onClose={onSelectLayoutPageLeft}/> : null}
                </div>
                <div className='select-page-layout-left'>
                    <Tooltip placement='bottomRight' prefixCls='rc-tooltip-custom-page'
                             align={{
                                 offset: [this.state.position.x, this.state.position.y],
                             }}
                             overlay={LocaleUtils.instance.translate('tooltip.change_page_style')}>
                        <div className='tooltip-custom-div-wrapper' onMouseEnter={this.setPositionState}>
                            <IconButton className="margin-button" type={IconButton.type.selectBackgroundAndBorder}
                                        onMouseDown={onSelectBackgroundsAndBordersPageLeft}/>
                        </div>
                    </Tooltip>
                    {isShowSelectBackgroundsAndBordersPageLeft ? <BackgroundsAndBordersPopup display={display} numPage={numPage}
                                                                                             onClose={onSelectBackgroundsAndBordersPageLeft}/> : null}
                </div>
                <span className="text-page">{LocaleUtils.instance.translate('label.page_design')}</span>
            </div>
        );
    }

    renderChangeStyleRightPage() {
        const { onChangeLayoutAuto, numPage, display, onSelectLayoutPageRight, onSelectBackgroundsAndBordersPageRight, isShowSelectLayoutPageRight, isShowSelectBackgroundsAndBordersPageRight } = this.props;
        return (
            <div className="change-style-layout right-corner-page">
                <span className="text-page">{LocaleUtils.instance.translate('label.page_design')}</span>
                <div className='select-page-layout-right'>
                    <Tooltip placement='bottomRight' prefixCls='rc-tooltip-custom-page'
                             align={{
                                 offset: [this.state.position.x, this.state.position.y],
                             }}
                             overlay={LocaleUtils.instance.translate('tooltip.shuffle_layout')}>
                        <div className='tooltip-custom-div-wrapper' onMouseEnter={this.setPositionState}>
                            <IconButton className="margin-button" type={IconButton.type.changeLayout}
                                        onClick={onChangeLayoutAuto}/>
                        </div>
                    </Tooltip>
                </div>
                <div className='select-page-layout-right'>
                    <Tooltip placement='bottomRight' prefixCls='rc-tooltip-custom-page'
                             align={{
                                 offset: [this.state.position.x, this.state.position.y],
                             }}
                             overlay={LocaleUtils.instance.translate('tooltip.change_page_layout')}>
                        <div className='tooltip-custom-div-wrapper' onMouseEnter={this.setPositionState}>
                            <IconButton className="margin-button" type={IconButton.type.selectLayout}
                                        onMouseDown={onSelectLayoutPageRight}/>
                        </div>
                    </Tooltip>
                    {isShowSelectLayoutPageRight ?
                        <LayoutPopup display={display} numPage={numPage}
                                     onClose={onSelectLayoutPageRight}/> : null}
                </div>
                <div className='select-page-layout-right'>
                    <Tooltip placement='bottomRight' prefixCls='rc-tooltip-custom-page'
                             align={{
                                 offset: [this.state.position.x, this.state.position.y],
                             }}
                             overlay={LocaleUtils.instance.translate('tooltip.change_page_style')}>
                        <div className='tooltip-custom-div-wrapper' onMouseEnter={this.setPositionState}>
                            <IconButton className="margin-button" type={IconButton.type.selectBackgroundAndBorder}
                                        onMouseDown={onSelectBackgroundsAndBordersPageRight}/>
                        </div>
                    </Tooltip>
                    {isShowSelectBackgroundsAndBordersPageRight ? <BackgroundsAndBordersPopup display={display} numPage={numPage}
                                                                                              onClose={onSelectBackgroundsAndBordersPageRight}/> : null}
                </div>
            </div>
        );
    }

    renderChangeStyleFrontCoverPage() {
        const { display, onSelectLayoutPageRight, onSelectBackgroundsAndBordersPageRight, isShowSelectLayoutPageRight, isShowSelectBackgroundsAndBordersPageRight } = this.props;
        return (
            <div className="change-style-layout right-corner-page">
                <span className="text-page">{LocaleUtils.instance.translate('label.cover_design')}</span>
                <div className='select-page-layout-right'>
                    <Tooltip placement='bottomRight' prefixCls='rc-tooltip-custom-page'
                             align={{
                                 offset: [this.state.position.x, this.state.position.y],
                             }}
                             overlay={LocaleUtils.instance.translate('tooltip.shuffle_layout')}>
                        <div className='tooltip-custom-div-wrapper' onMouseEnter={this.setPositionState}>
                            <IconButton className="margin-button" type={IconButton.type.changeLayout}
                                        onClick={this.onChangeAutoCoverLayout}/>
                        </div>
                    </Tooltip>
                </div>
                <div className='select-page-layout-right'>
                    <Tooltip placement='bottomRight' prefixCls='rc-tooltip-custom-page'
                             align={{
                                 offset: [this.state.position.x, this.state.position.y],
                             }}
                             overlay={LocaleUtils.instance.translate('tooltip.change_page_layout')}>
                        <div className='tooltip-custom-div-wrapper' onMouseEnter={this.setPositionState}>
                            <IconButton className="margin-button" type={IconButton.type.selectLayout}
                                        onMouseDown={onSelectLayoutPageRight}/>
                        </div>
                    </Tooltip>
                    {isShowSelectLayoutPageRight ?
                        <CoverLayoutPopup display={display}
                                     onClose={onSelectLayoutPageRight}/> : null}
                </div>
                <div className='select-page-layout-right'>
                    <Tooltip placement='bottomRight' prefixCls='rc-tooltip-custom-page'
                             align={{
                                 offset: [this.state.position.x, this.state.position.y],
                             }}
                             overlay={LocaleUtils.instance.translate('tooltip.change_page_style')}>
                        <div className='tooltip-custom-div-wrapper' onMouseEnter={this.setPositionState}>
                            <IconButton className="margin-button" type={IconButton.type.selectBackgroundAndBorder}
                                        onMouseDown={onSelectBackgroundsAndBordersPageRight}/>
                        </div>
                    </Tooltip>
                    {isShowSelectBackgroundsAndBordersPageRight ? <BackgroundsAndBordersPopup display={display} isCover={true}
                                                                                              onClose={onSelectBackgroundsAndBordersPageRight}/> : null}
                </div>
            </div>
        )
    }

    renderChangeStyleBackCoverPage() {
        const { display, onSelectBackgroundsAndBordersPageRight, isShowSelectBackgroundsAndBordersPageRight } = this.props;
        let styleCoverRight = {
            left: -45,
            top: 5
        }

        return (
            <div className="change-style-layout right-corner-page">
                <div className='select-page-layout-right' style={styleCoverRight}>
                    <span className="text-page">{LocaleUtils.instance.translate('label.cover_design')}</span>
                    <Tooltip placement='bottomRight' prefixCls='rc-tooltip-custom-page'
                             align={{
                                 offset: [this.state.position.x, this.state.position.y],
                             }}
                             overlay={LocaleUtils.instance.translate('tooltip.change_page_style')}>
                        <div className='tooltip-custom-div-wrapper' onMouseEnter={this.setPositionState}>
                            <IconButton className="margin-button" type={IconButton.type.selectBackgroundAndBorder}
                                        onMouseDown={onSelectBackgroundsAndBordersPageRight}/>
                        </div>
                    </Tooltip>
                    {isShowSelectBackgroundsAndBordersPageRight ? <BackgroundsAndBordersPopup display={display} isCover={true}
                                                                                              onClose={onSelectBackgroundsAndBordersPageRight}/> : null}
                </div>
            </div>
        )
    }

    renderOnlyChangeBackgroundsAndBorders() {
        const {numPage, display, onSelectBackgroundsAndBordersPageLeft, isShowSelectBackgroundsAndBordersPageLeft } = this.props;
        return(
            <div className="change-style-layout left-corner-page">
                <div className='select-page-layout-left'>
                    <Tooltip placement='bottomRight' prefixCls='rc-tooltip-custom-page'
                             align={{
                                 offset: [this.state.position.x, this.state.position.y],
                             }}
                             overlay={LocaleUtils.instance.translate('tooltip.change_page_style')}>
                        <div className='tooltip-custom-div-wrapper' onMouseEnter={this.setPositionState}>
                            <IconButton className="margin-button" type={IconButton.type.selectBackgroundAndBorder}
                                        onMouseDown={onSelectBackgroundsAndBordersPageLeft}/>
                        </div>
                    </Tooltip>
                    {isShowSelectBackgroundsAndBordersPageLeft ? <BackgroundsAndBordersPopup display={display} numPage={numPage}
                                                                                             onClose={onSelectBackgroundsAndBordersPageLeft}/> : null}
                </div>
                <span className="text-page">{LocaleUtils.instance.translate('label.page_design')}</span>
            </div>
        )
    }

    renderChangeStyleSpine() {
        const { display, onSelectBackgroundsAndBordersPageRight, isShowSelectBackgroundsAndBordersPageRight } = this.props;
        let styleCoverRight = {
            left: -5,
            top: 10
        }

        return (
            <div className="change-style-layout right-corner-page">
                <div className='select-page-layout-right' style={styleCoverRight}>
                    <span className="text-page">{LocaleUtils.instance.translate('label.cover_design')}</span>
                    <Tooltip placement='bottomRight' prefixCls='rc-tooltip-custom-page'
                             align={{
                                 offset: [this.state.position.x, this.state.position.y],
                             }}
                             overlay={LocaleUtils.instance.translate('tooltip.change_page_style')}>
                        <div className='tooltip-custom-div-wrapper' onMouseEnter={this.setPositionState}>
                            <IconButton className="margin-button" type={IconButton.type.selectBackgroundAndBorder}
                                        onMouseDown={onSelectBackgroundsAndBordersPageRight}/>
                        </div>
                    </Tooltip>
                    {isShowSelectBackgroundsAndBordersPageRight ? <BackgroundsAndBordersPopup display={display} isCover={true}
                                                                                              onClose={onSelectBackgroundsAndBordersPageRight}/> : null}
                </div>
            </div>
        )
    }

    render() {
        const {positionOfPage, justChangeBackgroundAndBorder, coverSection} = this.props;
        if (justChangeBackgroundAndBorder) {
            return (
               this.renderOnlyChangeBackgroundsAndBorders()
            );
        }

        if (positionOfPage === 'left') {
            return (
                this.renderChangeStyleLeftPage()
            )
        }

        if (positionOfPage === 'right') {
            return (
                this.renderChangeStyleRightPage()
            )
        }

        if (positionOfPage === 'cover') {
            if(coverSection === COVER_SECTION.FRONT_COVER) {
                return (
                    this.renderChangeStyleFrontCoverPage()
                )
            }
            return (
                this.renderChangeStyleBackCoverPage()
            )
        }

        if (positionOfPage === 'flap' || positionOfPage === 'spine') {
            return(
                this.renderChangeStyleSpine()
            )
        }
    }
}

ChangeStylePage.propTypes = {
    positionOfPage: PropTypes.string,
    onChangeLayoutAuto: PropTypes.func,
    onSelectBackgroundAndOrder: PropTypes.func,
    justChangeBackgroundAndBorder: PropTypes.bool,
    numPage: PropTypes.number,
	display: PropTypes.string,
    coverSection: PropTypes.string,
    unScaleNumber: PropTypes.number
};

const handleSelectLayoutPageLeft = (dispatch) => {
    dispatch(showSelectLayoutPageLeft());
}

const handleSelectLayoutPageRight = (dispatch) => {
    dispatch(showSelectLayoutPageRight());
}

const handleSelectBackgroundsAndBordersPageLeft = (dispatch) => {
    dispatch(showBackgroundAndBorderPageLeft());
}

const handleSelectBackgroundsAndBordersPageRight = (dispatch) => {
    dispatch(showBackgroundAndBorderPageRight());
}

const onChooseCoverLayout = (dispatch, newLayout) => {
    dispatch(setCoverLayout(-1, newLayout));
};

const mapStateToProps = (state) => {
    const { project, coverLayouts, appStatus } = state;
    const { book } = project;
    const {frontCover, coverInfo} = book.covers;
    const {type} = coverInfo;
    const {layout_group_id} = frontCover;
    const {typesOfFrontCoverLayouts} = coverLayouts;
    const { rootStatus } = appStatus;
    const { isShowSelectLayoutPageLeft, isShowSelectLayoutPageRight, isShowSelectBackgroundsAndBordersPageLeft, isShowSelectBackgroundsAndBordersPageRight } = rootStatus;

    return {type, layout_group_id, typesOfFrontCoverLayouts, isShowSelectLayoutPageLeft, isShowSelectLayoutPageRight, isShowSelectBackgroundsAndBordersPageLeft, isShowSelectBackgroundsAndBordersPageRight};
};

const mapDispatchToProps = (dispatch) => ({
    onClickChooseCoverLayout: (newLayout) => onChooseCoverLayout(dispatch, newLayout),
    onSelectLayoutPageLeft: () => handleSelectLayoutPageLeft(dispatch),
    onSelectLayoutPageRight: () => handleSelectLayoutPageRight(dispatch),
    onSelectBackgroundsAndBordersPageLeft: () => handleSelectBackgroundsAndBordersPageLeft(dispatch),
    onSelectBackgroundsAndBordersPageRight: () => handleSelectBackgroundsAndBordersPageRight(dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChangeStylePage);
