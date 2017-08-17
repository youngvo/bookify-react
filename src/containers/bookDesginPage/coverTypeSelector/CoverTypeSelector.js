import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './CoverTypeSelector.css';
import { COVER_SECTION, COVER_TYPE } from './../../../constants/Constants';
import RadioButtonGroup from 'react-radio-button';
import Assets                   from './../../../assets/Assets';
import LocaleUtils              from './../../../utils/LocaleUtils';

const COVER_TYPES = [
                { value: COVER_TYPE.HARDCOVER_IMAGEWRAP, text: LocaleUtils.instance.translate('coverCreator.imageWrap')},
                { value: COVER_TYPE.HARDCOVER_DUST_JACKET, text: LocaleUtils.instance.translate('coverCreator.dustJacket')},
				{ value: COVER_TYPE.SOFTCOVER, text: LocaleUtils.instance.translate('coverCreator.softCover')}
            ]

class CoverTypeSelector extends Component {
    constructor(props) {
        super(props)
        let { coverSection, coverType } = props;
        this.state = {
            sectionValue: coverSection ? coverSection : COVER_SECTION.FRONT_COVER,
            typeValue: coverType ? coverType : COVER_TYPE.HARDCOVER_IMAGEWRAP
        }
    }

    componentWillReceiveProps(nextProps) {
        let { coverSection, coverType } = nextProps;
        if (coverSection !== this.state.sectionValue) {
            this.setState({
                sectionValue: coverSection
            });
        }
    }

    componentDidMount() {
        let items = this.refs.cover_type_zone.getElementsByClassName("radio-button-item-word");

        let textOfCoverType = '';
        COVER_TYPES.forEach(function(element) {
            if (element.value === this.state.typeValue) {
                textOfCoverType = element.text;
                return;
            }
        }, this);

        for( let i=0; i<items.length; i++) {
            if (items[i].textContent === textOfCoverType) {
                items[i].click();
                break;
            }
        }
    }

    onSelectCoverSection(value) {
        this.props.onChangeCoverSection(value);
        this.setState({
            sectionValue: value
        })
    }

    onSelectCoverType(value) {
        if (value!== COVER_TYPE.HARDCOVER_DUST_JACKET && this.state.sectionValue===COVER_SECTION.FRONT_FLAP) {
            this.setState({
                sectionValue: COVER_SECTION.FRONT_COVER,
                typeValue: value
            })
            this.props.onChangeCoverSection(COVER_SECTION.FRONT_COVER);
        } else {
            this.setState({
                typeValue: value
            })
        }
        this.props.onChangeCoverType(value);
    }

    render() {
        let { typeValue, sectionValue } = this.state;
        // let typeClass = 'cover-type-option';
        // let typeClassSelecting = 'cover-type-option selecting';
        let sectionClass = 'cover-section-option';
        let sectionClassSelecting = 'cover-section-option selecting';
        let coverFlapClass = sectionClass;
        if (typeValue !== COVER_TYPE.HARDCOVER_DUST_JACKET) {
            coverFlapClass = sectionClass + ' disable ';
        } else if (sectionValue===COVER_SECTION.FRONT_FLAP || sectionValue===COVER_SECTION.BACK_FLAP) {
            coverFlapClass = sectionClassSelecting;
        }

        return (
            <div className="cover-type-selector-wrapper">
                <div className="cover-type-selector-top-zone">
			 <img src={Assets.instance.retrieveImageObjectURL('img_bookCoverIcon')} alt="" />
                  <span className="text-cover-img">{LocaleUtils.instance.translate('coverCreator.label.coverDesignInfo')}</span>

                </div>
				  <div className="small-text-cover">{LocaleUtils.instance.translate('coverCreator.label.coverDesignExplanation')}</div>
                <div className="cover-type-zone" ref="cover_type_zone">
                <h5>{LocaleUtils.instance.translate('coverCreator.label.coverType')}</h5>
				<RadioButtonGroup listOfItems={COVER_TYPES} selectedItemCallback={(value) => this.onSelectCoverType(value)}/>

                </div>
				<h5 className="cover-section">{LocaleUtils.instance.translate('coverCreator.label.coverSection')}:</h5>
                <div className="cover-section-zone">

                    <div className={sectionValue===COVER_SECTION.FRONT_COVER ? sectionClassSelecting : sectionClass}
                        onClick={()=>this.onSelectCoverSection(COVER_SECTION.FRONT_COVER)}>
                        {LocaleUtils.instance.translate('label.front_cover')}
                    </div>
                    <div className={sectionValue===COVER_SECTION.BACK_COVER ? sectionClassSelecting : sectionClass}
                        onClick={()=>this.onSelectCoverSection(COVER_SECTION.BACK_COVER)}>
                        {LocaleUtils.instance.translate('label.back_cover')}
                    </div>
                    <div className={sectionValue===COVER_SECTION.SPINE ? sectionClassSelecting : sectionClass}
                        onClick={()=>this.onSelectCoverSection(COVER_SECTION.SPINE)}>
                        {LocaleUtils.instance.translate('label.spine')}
                    </div>
                    <div className={coverFlapClass += " no-botline"} onClick={()=>this.onSelectCoverSection(COVER_SECTION.FRONT_FLAP)} >
                        <div className="main-tex">{LocaleUtils.instance.translate('label.flaps')}</div><span className="sub-tex">{LocaleUtils.instance.translate('label.flaps.extended')}</span>
                    </div>
                </div>
            </div>
        );
    }
}

CoverTypeSelector.propTypes = {
    onChangeCoverSection:  PropTypes.func,
    onChangeCoverType: PropTypes.func,
    coverSection:  PropTypes.string,
    coverType: PropTypes.string
}

export default CoverTypeSelector;
