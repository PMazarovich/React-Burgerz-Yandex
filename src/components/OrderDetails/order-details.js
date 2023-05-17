import React from 'react';
import checkboxImage from '../../images/checkbox.png'
import PropTypes from "prop-types";

function OrderDetails({orderNumber}) {
    return (
        <div style={{display: "flex", flexDirection: "column", alignItems:"center"}}>
            <div className="text text_type_digits-large">{orderNumber}</div>
            <span style={{marginTop:"30px"}} className="text text_type_main-medium">идентификатор заказа</span>
            <img src={checkboxImage} alt="checkbox" style={{width:"200px"}}/>
            <span className="text text_type_main-medium">Ваш заказ начали готовить</span>
            <span style={{marginTop:"30px", marginBottom:"50px"}} className="text text_type_main-medium text_color_inactive">Дождитесь готовности на орбитальной станции</span>
        </div>

    );
}
OrderDetails.propTypes = {
    orderNumber: PropTypes.number,
}

export default OrderDetails;
