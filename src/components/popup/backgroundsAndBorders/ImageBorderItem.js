import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ImageBorderItem.css';
import { connect } from 'react-redux';
import Assets       from '../../../assets/Assets';

class ImageBorderItem extends Component {

    constructor(props) {
        super(props);
        // this.layoutItemClicked = this.layoutItemClicked.bind(this);
    }

    render() {
        let {borderData} = this.props;
        console.log('<<<<<<<<<<<<<', borderData);
        if (typeof borderData === 'undefined') {
            return (
                <div className="image-border-item-zone">
                    <div className="image-border-item-first-child">
                        <span className="image-border-item-first-child-text">none</span>
                    </div>
                </div>
            )
        } else {
            let imageSource = borderData.$.image_id
            return (
                <div className="image-border-item-zone">
                    <img className="image-border-item-child"  src={Assets.instance.retrieveImageObjectURL(imageSource)} alt="img_border"/>
                </div>
            )
        }
    }
}

ImageBorderItem.propTypes = {
    borderData: PropTypes.object,
};

const mapStateToProps = (state) => {
    // const { project, appStatus } = state;
    // const { rootStatus } = appStatus;
    // const { pagesChoosingList } = rootStatus;
    // const { book } = project;
    // const { bookInfo, pages, recentLayouts } = book;
    // const { present } = pages;
    // const bookFormat = bookInfo.format;
    // return { bookFormat, present, pagesChoosingList, recentLayouts };
};

const mapDispatchToProps = (dispatch) => {
    return {
        // onClickChooseLayout: (pagesChoosingList, newLayout) => onChooseLayout(dispatch, pagesChoosingList, newLayout),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ImageBorderItem);