import React from 'react';
import Button, {colorType} from '../../../materials/button/Button'

export default class StyleButton extends React.Component {
    onToggle(e) {
        e.preventDefault();
        const {style, onToggle} = this.props;
        onToggle(style);
    }

    render() {
        const {active, className, iconType} = this.props;

        return (
            <Button className={className} iconType={iconType} isFontIcon={true} icon={false} type={colorType.fontIcon} onMouseDown={this.onToggle.bind(this)} />
        );
    }
}

