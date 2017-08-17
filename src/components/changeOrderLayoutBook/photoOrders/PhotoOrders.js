import React, { Component } from 'react';
import onClickOutsize from 'react-onclickoutside';

import './PhotoOrders.css'
import IconButton   from './../../materials/iconButton/IconButton';
import { photoOrderTypes, sortingTypes } from './../../../constants/Constants';
import PhotoOrderItem from './PhotoOrderItem';

class PhotoOrders extends Component {
    handleClickOutside() {
        this.props.onCloseChangeOrderPhoto();
    }

    render() {
        const { firstPhoto, secondPhoto, checkedOrderType, onOrderTypeClick, onCloseChangeOrderPhoto } = this.props;
    
        return (
            <div className="swap">
                <div className="triangle" />
                <div className="photo-order-content">
                    <PhotoOrderItem
                        firstPhoto={firstPhoto}
                        secondPhoto={secondPhoto}
                        orderType={photoOrderTypes.NEWEST_FIRST}
                        isChecked={checkedOrderType === photoOrderTypes.NEWEST_FIRST || checkedOrderType === sortingTypes.RECENT_DATE}
                        onOrderTypeClick={onOrderTypeClick}
                    />
            
                    <PhotoOrderItem
                        firstPhoto={firstPhoto}
                        secondPhoto={secondPhoto}
                        orderType={photoOrderTypes.OLDEST_FIRST}
                        isChecked={checkedOrderType === photoOrderTypes.OLDEST_FIRST || checkedOrderType === sortingTypes.OLDEST_DATE}
                        onOrderTypeClick={onOrderTypeClick}
                    />
            
                    <PhotoOrderItem
                        firstPhoto={firstPhoto}
                        secondPhoto={secondPhoto}
                        orderType={photoOrderTypes.FILENAME}
                        isChecked={checkedOrderType === photoOrderTypes.FILENAME || checkedOrderType === sortingTypes.FILE_NAME_AZ}
                        onOrderTypeClick={onOrderTypeClick}
                    />
            
                    <PhotoOrderItem
                        firstPhoto={firstPhoto}
                        secondPhoto={secondPhoto}
                        orderType={photoOrderTypes.MANUAL}
                        isChecked={checkedOrderType === photoOrderTypes.MANUAL || checkedOrderType === sortingTypes.MY_SORTING}
                        onOrderTypeClick={onOrderTypeClick}
                    />
            
                    <IconButton type={IconButton.type.close} onClick={onCloseChangeOrderPhoto} />
                </div>
            </div>
        );
    }
};

export default onClickOutsize(PhotoOrders);