import React from 'react';
import { connect } from 'react-redux';

import './SelectingAlbums.css';
import TaggedAlbum from '../../../../components/getPhotosForBook/albumTypes/taggedAlbum/TaggedAlbum';
import NormalAlbum from '../../../../components/getPhotosForBook/albumTypes/normalAlbum/NormalAlbum';

import { photoTypes } from './../../../../constants/Constants';
import {  FB_TAGGED_ALBUM_ID,
          INSTAGRAM_ALBUM_ID,
          PX500_ALBUM_ID,
          FLICKR_ALBUM_ID,
          albumTypes,
} from '../../../../reducers/getPhotosReducer/AlbumsReducer';

const renderTaggedAlbum = (taggedAlbum, albumSelectedCount, onAlbumClick) => (
    <div className="tagged-album-wrapper">
        <TaggedAlbum
            album={taggedAlbum}
            photoSelectedCount={albumSelectedCount}
            onClick={onAlbumClick}
        />
    </div>
);

const renderNormalAlbums = (normalAlbums, albumsSelectedCount, onAlbumClick) => (
    <div className="content-left-list-album" >
        {
            normalAlbums.map((normalAlbum) => (
                <NormalAlbum key={normalAlbum.id}
                             album={normalAlbum}
                             photoSelectedCount={albumsSelectedCount[normalAlbum.id]}
                             onClick={onAlbumClick}
                />
            ))
        }
    </div>
);

const SelectingAlbums = ({ normalAlbums, taggedAlbum, albumsSelectedCount, onAlbumClick }) => {
    return (
        <div className="selecting-album-wrapper">
            <div className="selecting-multiple-album-wrapper">
                <div className="selecting-multiple-album">
                    {taggedAlbum && renderTaggedAlbum(taggedAlbum, albumsSelectedCount[FB_TAGGED_ALBUM_ID], onAlbumClick)}
                    {renderNormalAlbums(normalAlbums, albumsSelectedCount, onAlbumClick)}
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state, {albumType}) => {

    const { getPhotosData } = state;
    const { albums, selectedPhotos } = getPhotosData;
    const { albumsSelectedCount } = selectedPhotos;
    let normalAlbums = {};
    let taggedAlbum;
    const filterAlbums = function (albums, type) {
        let result = {};
        Object.values(albums).forEach(function (album) {
                if (album.type === type) {
                    result[album.id] = album;
                }
            });
        return result;
    };

    switch (albumType) {
        case photoTypes.FACEBOOK:
             normalAlbums = filterAlbums(albums, albumTypes.facebook);
             taggedAlbum = normalAlbums[FB_TAGGED_ALBUM_ID];
             delete normalAlbums[FB_TAGGED_ALBUM_ID];
             break;
        case photoTypes.INSTAGRAM:
                normalAlbums = filterAlbums(albums, albumTypes.instagram);
            break;
        case photoTypes.PX500:
                normalAlbums = filterAlbums(albums, albumTypes.px500);
            break;
        case photoTypes.FLICKR:
                normalAlbums = filterAlbums(albums, albumTypes.flickr);
            break;
        case photoTypes.SMUGSMUG:
                normalAlbums = filterAlbums(albums, albumTypes.smugmug);
            break;
        default:
    }

    return {
        normalAlbums: Object.values(normalAlbums),
        taggedAlbum,
        albumsSelectedCount,
    };
}

export default connect(
    mapStateToProps
)(SelectingAlbums);
