import React from 'react';

import './TextInput.css';

const TextInput = ({ isError, text, type, onChangeText, onFocusInput, onKeyUpHandle }) => {
    let errorStyle = isError ? 'input-zone-style-error' : 'input-zone';
    return (

        <div className="text-input">
            <p>{text}</p>
            <input className={errorStyle}
                type={type || "text"}
                onChange={onChangeText}
                onFocus={onFocusInput}
                onKeyUp={onKeyUpHandle} />
        </div>
    );
}

export default TextInput;