import React, { Component } from 'react';

export default class CheckBox extends Component {
    constructor(props){
        super(props);
        this.state = {
            checkboxValue: false,
        };
    };

    toggleCheckboxValue() {
        this.setState({
            checkboxValue: !this.state.checkboxValue
        });
    };

    render() {
        return (
            <div>
                <input type="checkbox" value={this.state.checkboxValue} onChange={this.toggleCheckboxValue.bind(this)} ref="checkboxShowhelp" />
                { this.props.text }
            </div>
        )
    }
}