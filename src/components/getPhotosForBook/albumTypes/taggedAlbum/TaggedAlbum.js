import React , {Component} from 'react';
import LocaleUtils from './../../../../utils/LocaleUtils';
import './TaggedAlbum.css';

class TaggedAlbum extends Component{
    renderPictures (picUrls) {
        let pics = picUrls.map((picUrl, index) => (
            <div className="image-preview-tagged-album">
                <img className="" key={index} src={picUrl} alt="Tagged Album" />
            </div>
        ));

        return (<div className="preview-album-zone" >{pics}</div>);
    }

    renderCountPhotosSelected = (photoSelectedCount) => {
        if (photoSelectedCount && photoSelectedCount > 0) {
            // return (<div>{photoSelectedCount}</div>);
            return (
                <div className="badge-notification">{photoSelectedCount}</div>
            );
        }
    }

    onTaggedAlbumClick(album, onClick) {
        if (onClick) onClick(album);
    }

    render() {
        const { album, photoSelectedCount, onClick } = this.props;

        return (
            <div className="tagged-album" onClick={this.onTaggedAlbumClick.bind(this, album, onClick)}>
                <div className={ photoSelectedCount > 0 ? "outer-shadow-tagged-album" : "tagged-album"}>
                    <div className={ photoSelectedCount > 0 ? "inner-shadow-tagged-album" : "tagged-album"}>
                        {this.renderCountPhotosSelected(photoSelectedCount)}
                        <div className="title-tagged-album">
                        <div>{LocaleUtils.instance.translate('import.facebook.album.tagged')}</div>
                        </div>
                        {this.renderPictures(album.picUrls)}
                    </div>
                </div>
            </div>
        );
    }
}

export default TaggedAlbum;
