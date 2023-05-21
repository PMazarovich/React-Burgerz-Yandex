import React from 'react';
import {Button, ConstructorElement, CurrencyIcon, DragIcon} from "@ya.praktikum/react-developer-burger-ui-components";
import constructorStyles from './burger-constructor.module.css'
import PropTypes from "prop-types";
import Modal from "../Modal/modal";
import OrderDetails from "../OrderDetails/order-details";
import {dataFromServerPropTypes} from "../../utils/prop-types";


function ScrollComponent(props) {
    const {distanceFromBottom = 200} = props

    function calculateHeight(distanceFromBottom) {
        // get the height of the screen
        // set the desired distance from the bottom
        // calculate the max scrollable height
        return window.innerHeight - distanceFromBottom
    }

    return (
        <div style={{maxHeight: calculateHeight(distanceFromBottom), overflow: "auto", width: "fit-content"}}
             className={`custom-scroll`}>
            {props.children}
        </div>
    )

}

ScrollComponent.propTypes = {
    distanceFromBottom: PropTypes.number /* optional */
}

function ConstructorElementWrapper(props) { /*this adds DragIcon in the left of ConstructorElement*/
    return (
        <div className={constructorStyles.wrapper}>
            <div className={constructorStyles.dragIconStyle}>
                <DragIcon type="primary"/>
            </div>
            {props.children}
        </div>
    )
}

function BurgerConstructor({ dataFromServer }) {
    const [sumbittedShowed, setSumbittedShowed] = React.useState(false)

    function switchSumbittedShowed() {
        setSumbittedShowed(!sumbittedShowed)
    }

    return (
        <div className={constructorStyles.main}>
            <ConstructorElement
                type="top"
                isLocked={true}
                text="Краторная булка N-200i (верх)"
                price={200}
                thumbnail={'https://code.s3.yandex.net/react/code/bun-02.png'}
            />
            <ScrollComponent distanceFromBottom={400}>
                {dataFromServer.map((x, index) =>
                    <ConstructorElementWrapper key={index}>
                        <ConstructorElement text={x.name} thumbnail={x.image} price={x.price}/>
                    </ConstructorElementWrapper>)}
            </ScrollComponent>
            <ConstructorElement
                type="bottom"
                isLocked={true}
                text="Краторная булка N-200i (низ)"
                price={200}
                thumbnail={'https://code.s3.yandex.net/react/code/bun-02.png'}
            />
            <div className={constructorStyles.bottomButtonContainer}>
                <div className={constructorStyles.currencyContainer}>
                    <span className={`${constructorStyles.marginRight10} text_type_main-large`}>{12345}</span>
                    <CurrencyIcon type="primary"/>
                </div>
                <Button onClick={switchSumbittedShowed} htmlType="button" type="primary" size="large">
                    Оформить заказ
                </Button>
            </div>
            {sumbittedShowed &&
                <Modal onCloseFunction={switchSumbittedShowed} headerText={"Order confirmed!"}>
                    <OrderDetails orderNumber={123456789}/>
                </Modal>}
        </div>
    )
}

BurgerConstructor.propTypes = dataFromServerPropTypes

export default BurgerConstructor
