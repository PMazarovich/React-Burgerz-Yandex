import React from 'react';
import checkboxImage from '../../images/checkbox.png'
import PropTypes from "prop-types";
import orderDetailsStyle from "./order-details.module.css"

function OrderDetails({orderNumber}: {orderNumber: number}) {
    return (
        <div className={orderDetailsStyle.detailsConteiner}>
            <div className="text text_type_digits-large">{orderNumber}</div>
            <span className={`${orderDetailsStyle.marginTop30} text text_type_main-medium`}>идентификатор заказа</span>
            <img src={checkboxImage} alt="checkbox" style={{width:"200px"}}/>
            <span className="text text_type_main-medium">Ваш заказ начали готовить</span>
            <span className={`${orderDetailsStyle.marginTop30} ${orderDetailsStyle.marginBottom50} text text_type_main-medium text_color_inactive`}>Дождитесь готовности на орбитальной станции</span>
        </div>

    );
}
export default OrderDetails;
