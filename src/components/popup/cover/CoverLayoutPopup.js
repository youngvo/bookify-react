import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import './CoverLayoutPopup.css';
import IconButton from './../../materials/iconButton/IconButton';
import LocaleUtils from './../../../utils/LocaleUtils';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import { FRONT_COVER_TYPES } from './../../../constants/Constants';
import CoverLayoutItem from './CoverLayoutItem';
import onClickOutsize from 'react-onclickoutside';

class CoverLayoutPopup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sliderGoToIndex: 0
        }
    }

    componentWillMount() {
        let {type, layout_group_id, typesOfFrontCoverLayouts} = this.props;
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
                this.setState({
                    sliderGoToIndex: i
                });
                return;
            }
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.goToCurrentPageLayout();
        }, 500);

    }

    componentDidUpdate() {
        setTimeout(() => {
            this.goToCurrentPageLayout();
        }, 500);
    }

    handleClickOutside() {
        this.props.onClose();
    }

    goToCurrentPageLayout() {
        const {sliderGoToIndex} = this.state;
        if (sliderGoToIndex > 5) {
            this.refs.slider.slickGoTo(sliderGoToIndex - 5);
        }
    }

    getSlidesToScroll(layoutLength) {
        let mod = layoutLength % 6;
        let origin = layoutLength / 6;
        let result = (mod > origin) ? parseInt(mod) : parseInt(origin);
        return result;
    }

    renderCoverLayoutItem(frontCoverList) {
        let result = [];
        for ( let index = 0; index < frontCoverList.length; index++) {
            let coverLayoutItem = <div>
                <CoverLayoutItem coverLayoutData={frontCoverList[index]} onClose={this.props.onClose}/>
            </div>
            result.push(coverLayoutItem);
        }
        return result;
    }

    render() {
        let {type, typesOfFrontCoverLayouts, display} = this.props;
        let frontCoverList;
        if (type === FRONT_COVER_TYPES.DUST_JACKET) {
            frontCoverList = typesOfFrontCoverLayouts[0];
        } else if (type === FRONT_COVER_TYPES.IMAGE_WRAP) {
            frontCoverList = typesOfFrontCoverLayouts[1];
        } else {
            frontCoverList = typesOfFrontCoverLayouts[2];
        }
        let slideConfig = {
            slidesToShow: 6,
            infinite: false,
            swipeToSlide: false,
            swipe: false,
            slidesToScroll: this.getSlidesToScroll(frontCoverList.length)
        };
        let classCoverPopupZone = 'layout-popup-zone ' + display;
        return (
            <div className={classCoverPopupZone}>
                <div className="layout-popup-top">
                    <IconButton className="layout-popup-close-icon" onClick={this.props.onClose} type="close"/>
                    <div className="layout-popup-title">
                        {LocaleUtils.instance.translate('title.layout_menu')}
                    </div>
                    <div className="layout-popup-tip">{LocaleUtils.instance.translate('layout.tip')}</div>
                </div>
                <div className="layout-popup-slider-custom">
                    <div className="layout-slider-wrapper">
                        <Slider ref='slider' {...slideConfig}>
                            {this.renderCoverLayoutItem(frontCoverList)}
                        </Slider>
                    </div>
                </div>
                <div className="triangle"></div>
            </div>
        );
    }
}

CoverLayoutPopup.propTypes = {
    display: PropTypes.string,
    onClose: PropTypes.func
};

const mapStateToProps = (state) => {
    const {project, coverLayouts} = state;
    const {book} = project;
    const {frontCover, coverInfo} = book.covers;
    const {type} = coverInfo;
    const {layout_group_id} = frontCover;
    const {typesOfFrontCoverLayouts} = coverLayouts;
    return {type, layout_group_id, typesOfFrontCoverLayouts};
};

export default connect(
    mapStateToProps
)(onClickOutsize(CoverLayoutPopup));