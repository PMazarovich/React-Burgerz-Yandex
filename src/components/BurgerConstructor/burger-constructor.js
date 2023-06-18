import React from 'react';
import {Button, ConstructorElement, CurrencyIcon, DragIcon} from "@ya.praktikum/react-developer-burger-ui-components";
import constructorStyles from './burger-constructor.module.css'
import PropTypes from "prop-types";
import Modal from "../Modal/modal";
import OrderDetails from "../OrderDetails/order-details";
import {postOrder} from '../../utils/burger-api'
import {useDispatch, useSelector} from "react-redux";
import {constructorActions} from "../../store/reducers/BurgerConstructorSlice";
import {submitAnOrderActions} from "../../store/reducers/SubmitAnOrderSlice";
import {useDrop} from "react-dnd";

function restoreIngredientById(ingredientList, ingredientId){
    return ingredientList.filter(originalIngredient => originalIngredient._id === ingredientId)[0] // we know that ids are unique, so we can get [0]
}
// В этот компонент будем тащить <FoodContainer>
// В этом компоненте будем дополнять список через constructorActions.addIngredient({ingredient: ingredientDropped})
function ScrollComponent(props) {
    const { dragStarted = false, originalIngredients } = useSelector(store => ({
        dragStarted: store.constructorState.dragging,
        originalIngredients: store.ingredientsState.ingredients,
    }))
    const dispatch = useDispatch()
    const {distanceFromBottom = 200} = props
    // ВНИМАНИЕ! ВСЕГДА ПЕРЕДАВАТЬ В ПРИЕМНИК DND ПО ВОЗМОЖНОСТИ ТОЛЬКО ID! ИНАЧЕ ПОВЫШАЕТСЯ СВЯЗАННОСТЬ КОМПОНЕНТОВ
    const [, dropFoodContainerTarget] = useDrop({ // принимаем ID ингредиента из FoodContainer
        accept: ["abstractIngredient"],
        drop(ingredientId) { //  Это объект пришедший из FoodContainer. D частности у него есть поле ingredientId
            console.log(ingredientId)
            dispatch(constructorActions.dragStopped())
            restoreIngredientById(originalIngredients, ingredientId.ingredientId)
            // отфильтровываем булки от остальных ингредиентов
            if (restoreIngredientById(originalIngredients, ingredientId.ingredientId).type !== "bun"){
                dispatch(constructorActions.addIngredient(ingredientId))
            } else {
                dispatch(constructorActions.addBun(ingredientId))
            }

        }
    })
    // todo это не сделано.
    const [, dropConstructorElementWrapperTarget] = useDrop({ // принимаем элементы из ConstructorElementWrapper (reorder)
        accept: ["reorderedIngredient"], // принимаем элементы из ConstructorElementWrapper
        drop() {
            dispatch(constructorActions.dragStopped())
        },
    })
    // change a color of the border basing on the changes of dragStarted
    let borderStyle = ''
    if (dragStarted) {
        borderStyle = 'dashed lightblue'
    } else {
        borderStyle = 'transparent'
    }

    function calculateHeight(distanceFromBottom) {
        // get the height of the screen
        // set the desired distance from the bottom
        // calculate the max scrollable height
        return window.innerHeight - distanceFromBottom
    }

    return (
        /* this is a div just to handle reordering components */
        <div style={{height: "100%", width: "100%",}} ref={dropConstructorElementWrapperTarget}>
            <div ref={dropFoodContainerTarget}
                 style={{
                     maxHeight: calculateHeight(distanceFromBottom),
                     border: `1px ${borderStyle}`,
                     minHeight: "200px",
                     height: "100%",
                     width: "100%",
                     overflow: "auto",
                 }}
                 className={`custom-scroll`}
            >
                {props.children}
            </div>
        </div>
    )

}

ScrollComponent.propTypes = {
    distanceFromBottom: PropTypes.number /* optional */
}

// This element is draggable within ScrollComponent
// customKey is available here. customKey here is from 0 to N. This customKey is n actual order in constructorState.ingredients
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
    const dispatch = useDispatch()
    const [submittedShowed, setSubmittedShowed] = React.useState(false)
    const {currentIngredientsUUIdsIds, originalIngredients, orderNumber, bunIngredientId} = useSelector(store => ({
        originalIngredients: store.ingredientsState.ingredients,
        currentIngredientsUUIdsIds: store.constructorState.ingredients,
        orderNumber: store.submitAnOrderState.orderNumber,
        bunIngredientId: store.constructorState.bun,
    }))

    // Восстановим ингредиенты для отрисовки в Constructor исходя из тех ingredientId, которые в данный момент в constructorStore
    let currentIngredients = []
    if (currentIngredientsUUIdsIds.length !== 0){
        // iterate over all currentIngredientsUUIdsIds and resurrect ingredients in constructor based on current ingredients id and original ingredients
        for (let ingredientUuidId of currentIngredientsUUIdsIds) {
            // add a uuid for each resurrected ingredient, just to be able to remove it properly later
            currentIngredients.push({...restoreIngredientById(originalIngredients,ingredientUuidId.ingredientId), uuid: ingredientUuidId.uuid})
        }
    }

    function submitAnOrder() {
        // готовим request
        let ids = currentIngredients.flatMap(x => x._id)
        // Если успех, покажем modal с order. Если успеха нет, выдаем alert с ошибкой
        dispatch(submitAnOrderActions.sendAnOrder())
        postOrder(ids).then(x => {
            if (x.success) {
                dispatch(submitAnOrderActions.orderConfirmed({orderNumber: x.order.number}))
                setSubmittedShowed(true)
            } else {
                console.error("can't create an order with error: ", x)
                dispatch(submitAnOrderActions.orderFailed({error: x}))
                setSubmittedShowed(false)
                alert("can't create an order. See console")
            }
            switchSumbittedShowed()
        }).catch(e => {
            console.error("can't create an order with error: ", e)
            dispatch(submitAnOrderActions.orderFailed({error: e}))
            setSubmittedShowed(false)
            alert("can't create an order. See console")
        })
    }

    function switchSumbittedShowed() {
        setSubmittedShowed(!submittedShowed)
    }

    const chosenBun = restoreIngredientById(originalIngredients, bunIngredientId)

    // now, when we know a 2x bun and currentIngredients, we can calculate a summ
    let summ = 0
    currentIngredients.forEach(ingredient => {
        summ = summ + ingredient.price
    });
    summ = summ + chosenBun.price*2

    let ingredientsWithoutBun = currentIngredients.filter(ingredient => ingredient.type !== "bun")

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
                {ingredientsWithoutBun.map((ingredient) =>
                    /* we need a customKey as we can't access a key property of component from the component */
                    <ConstructorElementWrapper customKey={ingredient.uuid} key={ingredient.uuid}> {/* we can't use x._id here as there might be multiple identical ingredients */}
                        <ConstructorElement text={ingredient.name} thumbnail={ingredient.image}
                                            price={ingredient.price}
                                            handleClose={() => dispatch(constructorActions.removeIngredient({ingredientUuid: ingredient.uuid}))}/>{/*Удаляем по uuid*/}

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
                        className={`${constructorStyles.marginRight10} text_type_main-large`}>{summ}</span>
                    <CurrencyIcon type="primary"/>
                </div>
                <Button onClick={submitAnOrder} htmlType="button" type="primary" size="large">
                    Оформить заказ
                </Button>
            </div>
            {submittedShowed &&
                <Modal onCloseFunction={switchSumbittedShowed} headerText={"Order confirmed!"}>
                    <OrderDetails orderNumber={orderNumber}/>
                </Modal>}
        </div>
    )
}

export default BurgerConstructor
