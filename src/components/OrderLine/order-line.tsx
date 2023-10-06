import React from "react";
import orderLineStyles from './order-line.module.css'

// todo continue here
// сделать отдельные компоненты для header, body, footer
function HeaderContainer({
                             orderNumber,
                             time,
                         }: { orderNumber: number, time: Date }){
    return
}


function OrderCard() {
    return (
        <div className={orderLineStyles.cardWrapper}>
            <div className={orderLineStyles.cardHeaderWrapper}>HEEHEHE</div>
            <div className={orderLineStyles.cardOverviewWrapper}>HEEHEHE</div>
            <div className={orderLineStyles.cardFooterWrapper}>HEEHEHE</div>
        </div>
    )
}


function StubComponent() {
    return (
        <OrderCard/>
    )
        ;
}


export default StubComponent;
