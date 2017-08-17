import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './BackgroundItem.css';
import { connect } from 'react-redux';
import Assets       from '../../../assets/Assets';
import {
    changeBackgroundForPage, changeBackgroundForAllPages
} from '../../../actions/projectActions/bookActions/pagesActions/PagesActions';
import {
    changeBackgroundColorForCover
} from '../../../actions/projectActions/bookActions/CoversActions';

class BackgroundItem extends Component {

    constructor(props) {
        super(props);
        this.backgroundItemClicked = this.backgroundItemClicked.bind(this);
    }

    backgroundItemClicked(){
        let {backgroundData, numPage, onChangeBackgroundForPage, onChangeBackgroundForAllPages,
            onChangeBackgroundColorForCover, isCover, changeAllPage, onClose} = this.props;
        if (isCover) {
            onChangeBackgroundColorForCover(backgroundData.$.id);
        } else {
            if (changeAllPage) {
                onChangeBackgroundForAllPages(backgroundData.$.id);
            } else {
                onChangeBackgroundForPage(numPage - 1, backgroundData.$.id);
            }
        }
        onClose();
    }

    renderBackgroundColorChild(style) {
        return (
            <div className="background-item-zone">
                <div className="background-item-child" style={style} onClick={this.backgroundItemClicked}/>
            </div>
        )
    }

    renderBackgroundImageChild(style, pattern_id) {
        return (
            <div className="background-item-zone">
                <img className="background-item-child" style={style}  src={Assets.instance.retrieveImageObjectURL(pattern_id)}
                     onClick={this.backgroundItemClicked}/>
            </div>
        )
    }

    render() {
        let { backgroundData } = this.props;
        let style = {
            backgroundColor: backgroundData.$.color
        }

        if (backgroundData.$.pattern_id) {
            return (
                this.renderBackgroundImageChild(style, backgroundData.$.pattern_id)
            );
        }

        return (
            this.renderBackgroundColorChild(style)
        );
    }
}

BackgroundItem.propTypes = {
    backgroundData: PropTypes.object,
    onClose: PropTypes.func,
    numPage: PropTypes.number,
    changeAllPage: PropTypes.bool,
    isCover: PropTypes.bool
};

const handleChangeBackgroundForPage = (dispatch, pagePosition, backgroundId) => {
    dispatch(changeBackgroundForPage(pagePosition, backgroundId));
};

const handleChangeBackgroundForAllPages = (dispatch, backgroundId) => {
    dispatch(changeBackgroundForAllPages(backgroundId));
};

const handleChangeBackgroundColorForCover = (dispatch, backgroundId) => {
    dispatch(changeBackgroundColorForCover(backgroundId));
};

const mapStateToProps = (state) => {
    const { project } = state;
    const { book } = project;
    const { pages } = book;
    const { present } = pages;
    return { present };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onChangeBackgroundForPage: (pagePosition, backgroundId) => handleChangeBackgroundForPage(dispatch, pagePosition, backgroundId),
        onChangeBackgroundForAllPages: (backgroundId) => handleChangeBackgroundForAllPages(dispatch, backgroundId),
        onChangeBackgroundColorForCover: (backgroundId) => handleChangeBackgroundColorForCover(dispatch, backgroundId)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BackgroundItem);