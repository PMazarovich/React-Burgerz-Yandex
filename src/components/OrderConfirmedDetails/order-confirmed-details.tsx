import React from 'react';
import checkboxImage from '../../images/checkbox.png'
import PropTypes from "prop-types";
import orderDetailsStyle from "./order-details.module.css"

function OrderConfirmedDetails({orderNumber, orderName}: {orderNumber: number, orderName: string}) {
    return (
        <div className={orderDetailsStyle.detailsConteiner}>
            <div className="text text_type_digits-large">{orderNumber}</div>
            <span className={`${orderDetailsStyle.marginTop30} text text_type_main-medium`}>{orderName}</span>
            <img src={checkboxImage} alt="checkbox" className={orderDetailsStyle.width200}/>
            <span className="text text_type_main-medium">Ваш заказ начали готовить</span>
            <span className={`${orderDetailsStyle.marginTop30} ${orderDetailsStyle.marginBottom50} text text_type_main-medium text_color_inactive`}>Дождитесь готовности на орбитальной станции</span>

        </div>

    );
}
export default OrderConfirmedDetails;
