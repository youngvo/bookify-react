import React from 'react';

import './NormalAlbum.css';

const renderCountPhotosSelected = (photoSelectedCount) => {
    if (photoSelectedCount && photoSelectedCount > 0) {
        // return (<div>{photoSelectedCount}</div>);
        return <BadgeNotification photoSelectedCount={photoSelectedCount} />
    }
}

const BadgeNotification = function({photoSelectedCount}) {
    return (
        <div className="badge-notification">{photoSelectedCount}</div>
    );
}

const renderPicture = (picUrl) => (
    <div className="preview-album-zone" >
        {picUrl && <img className="image-preview-album" alt={picUrl} src={picUrl} />}
    </div>
);

const renderInfo = (albumName, photoCount) => (
    <div className="view-info-album-zone">
        <p className="name-album-long-text">{albumName}</p>
        <p className="amount-of-photo">{`${photoCount} photos`}</p>
    </div>
);

const onAlbumClick = (album, onClick) => {
    if (onClick) onClick(album);
}

const NormalAlbum = ({ album, photoSelectedCount, onClick }) => {
    let styleCss = '';
    if(onClick) {
        if (album.type == 'px500') {
            styleCss = 'album';
        } else {
            styleCss = 'album-smugmug';
        }
    } else {
        if (album.type == 'px500') {
            styleCss = 'album-can-not-click';
        } else {
            styleCss = 'album-smugmug-can-not-click';
        }
    }
    
    return (
        <div className={styleCss} 
            onClick={onAlbumClick.bind(this, album, onClick)} >
            <div className={photoSelectedCount > 0 ? "outer-shadow-box" : ""}>
                <div className={photoSelectedCount > 0 ? "inner-shadow-box" : ""}>
                    {renderCountPhotosSelected(photoSelectedCount)}
                    {renderPicture(album.picUrls[0])}
                    {renderInfo(album.name, album.photoCount!=0 ? album.photoCount : album.photoIds.length)}
                </div>
            </div>
        </div>
    )
};

export default NormalAlbum;
