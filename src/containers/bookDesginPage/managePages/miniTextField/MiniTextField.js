import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './MiniTextField.css';

const MiniTextField = (props) => {
    let { isCover, idPage, idLayout, idPageLayout, textSource, sizeHeight, sizeWidth, positionX, positionY, ratio} = props;
    let classNameField = textSource ? 'mini-text-field' : isCover ? 'mini-text-field' : 'mini-text-field null-text';
    let styleField = {
        top: positionY,
        left: positionX,
        width: sizeWidth,
        height: sizeHeight
    };
    let styleTextZone = {
        width: sizeWidth/ratio,
        transform: 'scale('+ratio+')'
    }

    const renderTagP = (pObject, styleOfTagP) => {
        let spanComponentArr = [];
        if (pObject.characterList) {
            for (let i in pObject.characterList) {
                let char = pObject.text.charAt(i);
                let styleList = pObject.characterList[i].style;
                let styleOfChar = {};
                for (let j in styleList) {
                    if (styleList[j] === 'BOLD') styleOfChar.fontWeight = 'bold';
                    if (styleList[j] === 'ITALIC') styleOfChar.fontStyle = 'italic';
                    if (styleList[j] === 'UNDERLINE') styleOfChar.textDecoration = 'underline';
                    if (styleList[j].indexOf('font_style')===0) {
                        let font = styleList[j].split('-')[1];
                        styleOfChar.fontFamily = font;
                    }
                    if (styleList[j].indexOf('size_style')===0) {
                        let fontSize = styleList[j].split('-')[1];
                        styleOfChar.fontSize = fontSize;
                    }
                    if (styleList[j].indexOf('#')===0) {
                        let color = styleList[j];
                        styleOfChar.color = color;
                    }
                }

                let spanComponent = <span style={styleOfChar}>{char}</span>;
                spanComponentArr.push(spanComponent);
            }
        }

        return (
            <p style={styleOfTagP}>
                {
                    spanComponentArr
                }
            </p>
        )
    }

    const renderText = (textSource) => {
        if (!textSource || !textSource[0]) return null;
        let styleOfTagP = {
            textAlign: textSource.alignment
        }
        let arrayTagP = [];

        for (let key in textSource) {
            if (key === 'alignment' ) continue;
            arrayTagP.push(renderTagP(textSource[key], styleOfTagP));
        }

        return (
            <div className='mini-text-zone' style={styleTextZone}>
                {
                    arrayTagP
                }
            </div>
        );
    }

    return (
        <div className={classNameField} style={styleField} >
            {
                textSource && renderText(textSource)
            }
        </div>
    );
}

MiniTextField.propTypes = {
    idPage: PropTypes.number,
    idLayout: PropTypes.string,
    idPageLayout: PropTypes.string,
    textSource: PropTypes.object,
    sizeHeight: PropTypes.number,
    sizeWidth: PropTypes.number,
    positionX: PropTypes.number,
    positionY: PropTypes.number,
    ratio: PropTypes.number
}

export default MiniTextField;
