import React from 'react';

const LinkText = ( {text, enableClick, newTab, link, onClick} ) => {
    let styleUnableClick = {
        color: "#777777"
    };

    return (
        <div className="link-text">
            {
                enableClick ?
                    <a href={link} target={newTab ? "_blank" : "_self"} onClick={onClick} > {text} </a> : (<p style={styleUnableClick} href={link}>{text}</p>)
            }
        </div>
    );
};

export default LinkText;