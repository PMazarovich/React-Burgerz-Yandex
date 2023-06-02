import React, {useContext} from 'react';
import {Button, ConstructorElement, CurrencyIcon, DragIcon} from "@ya.praktikum/react-developer-burger-ui-components";
import constructorStyles from './burger-constructor.module.css'
import PropTypes from "prop-types";
import Modal from "../Modal/modal";
import OrderDetails from "../OrderDetails/order-details";
import {BurgerConstructorContext} from "../../utils/burger-constructor-context";
import {postOrder} from '../../utils/burger-api'


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

function BurgerConstructor() {
    const [sumbittedShowed, setSumbittedShowed] = React.useState(false)
    // eslint-disable-next-line no-unused-vars
    const [burgerConstructorState, dispatchBurgerConstructorState] = useContext(BurgerConstructorContext); // тащим данные из контекста
    // dispatchBurgerConstructorState - это функция отправки сообщения в Reducer
    const [orderNumber, setOrderNumber] = React.useState(null)

    function submitAnOrder() {
        // готовим request
        let ids = burgerConstructorState.currentIngredients.flatMap(x => x._id)
        // Если успех, покажем modal с order. Если успеха нет, выдаем alert с ошибкой
        postOrder(ids).then(x => {
            if (x.success) {
                setOrderNumber(x.order.number)
            } else {
                console.error("can't create an order with error: ", x)
                setOrderNumber(null)
                alert("can't create an order. See console")
            }
            switchSumbittedShowed()
        }).catch(e => {
            console.error("can't create an order with error: ", e)
            setOrderNumber(null)
            alert("can't create an order. See console")
        })
    }

    function switchSumbittedShowed() {
        setSumbittedShowed(!sumbittedShowed)
    }

    function removeIngredient(ingredient){
        dispatchBurgerConstructorState({
            type: "removeIngredient",
            ingredient: ingredient
        })
    }

    // filter Bun here as this is an exceptional element.
    // todo restict picking more than 1 bun and force to pick at least 1 bun
    //  This will happen in BurgerIngredients most probably.
    // todo for now just pick the first bun or use default one
    const chosenBun =
        burgerConstructorState.currentIngredients.find(item => item.type === "bun") ||
        {
            name: "Краторная булка N-200i (верх)",
            price: 200,
            image: 'https://code.s3.yandex.net/react/code/bun-02.png'
        };

    let ingredientsWithoutBun = burgerConstructorState.currentIngredients.filter(ingredient => ingredient.type !== "bun")

    return (
        <div className={constructorStyles.main}>
            <ConstructorElement
                type="top"
                isLocked={true}
                text={chosenBun.name}
                price={chosenBun.price}
                thumbnail={chosenBun.image}
            />
            <ScrollComponent distanceFromBottom={400}>
                {/* filter out "bun" and fill the ingredients with regular ones */}
                {ingredientsWithoutBun.map((ingredient, index) =>
                    <ConstructorElementWrapper
                        key={index}> {/* we can't use x._id here as there might be multiple identical ingredients */}
                        <ConstructorElement text={ingredient.name} thumbnail={ingredient.image} price={ingredient.price}
                                            handleClose={() => removeIngredient(ingredient)}/>
                    </ConstructorElementWrapper>)}
            </ScrollComponent>
            <ConstructorElement
                type="bottom"
                isLocked={true}
                text={chosenBun.name}
                price={chosenBun.price}
                thumbnail={chosenBun.image}
            />
            <div className={constructorStyles.bottomButtonContainer}>
                <div className={constructorStyles.currencyContainer}>
                    <span
                        className={`${constructorStyles.marginRight10} text_type_main-large`}>{burgerConstructorState.summ}</span>
                    <CurrencyIcon type="primary"/>
                </div>
                <Button onClick={submitAnOrder} htmlType="button" type="primary" size="large">
                    Оформить заказ
                </Button>
            </div>
            {sumbittedShowed &&
                <Modal onCloseFunction={switchSumbittedShowed} headerText={"Order confirmed!"}>
                    <OrderDetails orderNumber={orderNumber}/>
                </Modal>}
        </div>
    )
}

export default BurgerConstructor
