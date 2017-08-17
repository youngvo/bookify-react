import React from 'react';

import './PhotoOrders.css'
import { getOrderStr } from './../ChangeOrderLayoutBook';


const PhotoOrderItem = ({ firstPhoto, secondPhoto, orderType, isChecked, onOrderTypeClick }) => {
    let checkedStyle = {
        border: "3px solid #fdb913"
    };

    const onOrderClick = () => {
        onOrderTypeClick(orderType);
    }

    let orderStr = getOrderStr(orderType);

    return (
        <div className={isChecked ? "order-component is-checked" : "order-component"} onClick={onOrderClick}>
            <div className="order-component-photo">
		<div className="thumb">
                <img src={firstPhoto.picUrl} alt="" />
		</div>
                <div className="order-component-photo-arrow icon-ArrowNext">
                     
                </div>
		
		
		<div className="thumb">
                <img src={secondPhoto.picUrl} alt="" />
		</div>
		
            </div>
            <div className="order-component-text">
                {orderStr}
            </div>
        </div>
    );
};

export default PhotoOrderItem;