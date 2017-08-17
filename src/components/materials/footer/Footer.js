import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Footer.css';
import Tooltip  from 'rc-tooltip';
import LocaleUtils from './../../../utils/LocaleUtils';

export default class Footer extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let { enableClickRightBtn, isHideArrowBtn, leftBtn, firstRightBtn, secondRightBtn } = this.props;
        let unableClickRightbtnClass = '';
        if (enableClickRightBtn !== undefined) {
            unableClickRightbtnClass = enableClickRightBtn ? '' : 'unable-click-right-btn';
        }
        return (
            <div className='footer'>
                <div className='footer-left-side'>
                    {leftBtn}
                </div>
                <div className='footer-right-side'>
                    <div className={'footer-right-side-buttons ' + unableClickRightbtnClass}>
                        {!isHideArrowBtn && <span className="tria"></span>}
                        <Tooltip placement='bottomLeft' prefixCls='rc-tooltip-custom-page-footer'
                                 align={{
                                     offset: [0, -6],
                                 }}
                                 overlay={LocaleUtils.instance.translate('tooltip.edit_book')}>
                            <div className='tooltip-custom-div-wrapper'>
                                {firstRightBtn}
                            </div>
                        </Tooltip>
                        {secondRightBtn}
                    </div>
                </div>
            </div>
        );
    }
}

Footer.propTypes = {
    isHideArrowBtn: PropTypes.bool,
    leftBtn:        PropTypes.element,
    firstRightBtn:  PropTypes.element,
    secondRightBtn: PropTypes.element,
};
