import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tooltip  from 'rc-tooltip';
import LocaleUtils from './../../../../utils/LocaleUtils';

export default class AddPageIcon extends Component {
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

    render() {
    	return (
			<Tooltip placement='bottomRight' prefixCls='rc-tooltip-custom-page'
					 align={{
                         offset: [this.state.position.x, this.state.position.y],
                     }}
					 overlay={LocaleUtils.instance.translate('tooltip.add_page_spread')}>
				<div className="swap-add" onMouseEnter={this.setPositionState}>
					<span className="icon-AddPageIconActive" onClick={this.props.onClick}>
						<span className="path1" />
						<span className="path2" />
						<span className="path3" />
					</span>
				</div>
			</Tooltip>
		);
	}
}

AddPageIcon.propTypes = {
    onClick: PropTypes.func
}
