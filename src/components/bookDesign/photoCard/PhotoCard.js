import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './PhotoCard.css';
import PhotoDetail  from './../../bookDesign/photoDetail/PhotoDetail';
import Assets       from '../../../assets/Assets';
import Config       from '../../../config/Config';

class PhotoCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isShowPhotoDetail: false,
            photoIsUsing: this.checkingPhotoIsUsing(props),
            amountPhotoIsUsing: props.idsOfImageUsingList.length
        };

        this.photoCardClick = this.photoCardClick.bind(this);
        this.showPhotoDetail = this.showPhotoDetail.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.idsOfImageUsingList.length.toString() !== this.state.amountPhotoIsUsing.toString()) {
            this.setState({
                photoIsUsing: this.checkingPhotoIsUsing(nextProps)
            });
        }
    }

    componentWillUnmount() {
        this.setState({
            photoIsUsing: false
        });
    }

    checkingPhotoIsUsing(props) {
        const { photoVO, idsOfImageUsingList } = props;
        if (idsOfImageUsingList.indexOf(photoVO.baseId) >= 0) {
            return true;
        }
        return false;
    }

    showPhotoDetail() {
        this.setState({
            isShowPhotoDetail: true
        });
    }

    onClose() {
        this.setState({
            isShowPhotoDetail: false
        });
    }

    randomRotate() {
        // let numRandom = (Math.random() - 0.5) * 20;
        let translate = '';
        // let rotate = 'rotate(' + numRandom + 'deg)';
        let styleRandom = {
            transform: translate// + rotate
        }
        return styleRandom;
    }

    photoCardClick() {
        const { onClick, photoVO } = this.props;
        onClick(photoVO.baseId);
    }

    render() {
        const { photoVO, isClicking } = this.props;
        const cardClickedStyle = { background: "lightsteelblue" };

        return (
            <div className="photo-card-zone"
                style={isClicking ? cardClickedStyle : null}
                onMouseDown={this.photoCardClick}
                onDoubleClick={this.showPhotoDetail}
            >
                <div className="img-card-wrapper" style={this.randomRotate()} >
                    {
                        this.state.photoIsUsing && <img className="img-checked" src={Assets.instance.retrieveImageObjectURL('img_checked')} alt="checked" />
                    }
                    <img className="img-card-zone"
                        src={photoVO.picUrl}
                        alt={photoVO.name} />
                    <img src={photoVO.imageUrl} alt='Cache Origin' style={{ display: "none", position: "absolute" }} />
                </div>
                <div>
                    {
                        this.state.isShowPhotoDetail &&
                        <PhotoDetail
                            bg=""
                            photo={photoVO}
                            onClose={this.onClose.bind(this)}
                        >
                            <img src={photoVO.imageUrl} alt={photoVO.name} />
                        </PhotoDetail>
                    }
                </div>
            </div>
        );
    }
}

PhotoCard.propTypes = {
    photoVO: PropTypes.object,
    onClick: PropTypes.func,
    isClicking: PropTypes.bool
}

const mapStateToProps = (state) => {
    return {
        idsOfImageUsingList: state.appStatus.rootStatus.idsOfImageUsingList
    };
}

export default connect(mapStateToProps)(PhotoCard);
