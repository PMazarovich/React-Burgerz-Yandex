import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Button, ConstructorElement, CurrencyIcon, DragIcon} from "@ya.praktikum/react-developer-burger-ui-components";
import constructorStyles from './burger-constructor.module.css'
import PropTypes from "prop-types";
import Modal from "../Modal/modal";
import OrderDetails from "../OrderDetails/order-details";
import {postOrder} from '../../utils/burger-api'
import {useDispatch, useSelector} from "react-redux";
import {constructorActions} from "../../store/reducers/BurgerConstructorSlice";
import {submitAnOrderActions} from "../../store/reducers/SubmitAnOrderSlice";
import {useDrag, useDrop} from "react-dnd";
import classNames from 'classnames';
//---this is for inner sorting--------//
import update from "immutability-helper";

function restoreIngredientById(ingredientList, ingredientId) {
    return ingredientList.filter(originalIngredient => originalIngredient._id === ingredientId)[0] // we know that ids are unique, so we can get [0]
}

// В этот компонент будем тащить <FoodContainer>
// В этом компоненте будем дополнять список через constructorActions.addIngredient({ingredient: ingredientDropped})
function ScrollComponent(props) {
    const {ingredientDragging, setIngredientDragging} = props
    const { /*dragStarted = false,*/ originalIngredients} = useSelector(store => ({
        //dragStarted: store.constructorState.dragging,
        originalIngredients: store.ingredientsState.ingredients,
    }))
    const dispatch = useDispatch()
    const {distanceFromBottom = 200} = props
    // ВНИМАНИЕ! ВСЕГДА ПЕРЕДАВАТЬ В ПРИЕМНИК DND ПО ВОЗМОЖНОСТИ ТОЛЬКО ID! ИНАЧЕ ПОВЫШАЕТСЯ СВЯЗАННОСТЬ КОМПОНЕНТОВ
    const [, dropFoodContainerTarget] = useDrop({ // принимаем ID ингредиента из FoodContainer
        accept: ["abstractIngredient"],
        drop(ingredientId) { //  Это объект пришедший из FoodContainer. D частности у него есть поле ingredientId
            setIngredientDragging(false)
            //dispatch(constructorActions.dragStopped())
            restoreIngredientById(originalIngredients, ingredientId.ingredientId)
            // отфильтровываем булки от остальных ингредиентов
            if (restoreIngredientById(originalIngredients, ingredientId.ingredientId).type !== "bun") {
                dispatch(constructorActions.addIngredient({payload: ingredientId})) // ВСЕГДА ДЕЛАТЬ ТАК - {payload: ....}
            } else {
                dispatch(constructorActions.addBun(ingredientId))
            }

        }
    })

    function calculateHeight(distanceFromBottom) {
        // get the height of the screen
        // set the desired distance from the bottom
        // calculate the max scrollable height
        return window.innerHeight - distanceFromBottom
    }
    // ВНИМАНИЕ. КЛАССЫ КОМПОНОВАТЬ ВСЕГДА ТАК.
    const scrollClassNames = classNames('custom-scroll', constructorStyles.scroll,  // <- эти классы в любом случае применятся
        {
            [constructorStyles.border]: ingredientDragging, // Если ingredientDragging - true применить еще и style border
        });
    return (
        /* this is a div just to handle reordering components */
        <div className={constructorStyles.fullWidthHeight}>
            <div ref={dropFoodContainerTarget}
                 style={{
                     maxHeight: calculateHeight(distanceFromBottom),
                 }}
                 className={scrollClassNames}
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
    const { index, moveIng, customKey } = props
    /*-----------------InnerSort----на это внимания не обращаем-----------*/
    const ref = useRef(null)
    const [{ handlerId }, drop] = useDrop({
        accept: 'ing',
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        hover(item, monitor) {
            if (!ref.current) {
                return
            }
            const dragIndex = item.index
            const hoverIndex = index
            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return
            }
            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect()
            // Get vertical middle
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
            // Determine mouse position
            const clientOffset = monitor.getClientOffset()
            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top
            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%
            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return
            }
            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return
            }
            // Time to actually perform the action
            moveIng(dragIndex, hoverIndex)
            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex
        },
    })
    const [{ isDragging }, drag] = useDrag({
        type: 'ing',
        item: () => {
            return { customKey, index }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    })
    drag(drop(ref))
    return (
        <div ref={ref} data-handler-id={handlerId} className={constructorStyles.wrapper}>
            <div className={constructorStyles.dragIconStyle}>
                <DragIcon type="primary"/>
            </div>
            {props.children}
        </div>
    )
}

function BurgerConstructor({ingredientDragging, setIngredientDragging}) {
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
    if (currentIngredientsUUIdsIds.length !== 0) {
        // iterate over all currentIngredientsUUIdsIds and resurrect ingredients in constructor based on current ingredients id and original ingredients
        for (let ingredientUuidId of currentIngredientsUUIdsIds) {
            // add a uuid for each resurrected ingredient, just to be able to remove it properly later
            currentIngredients.push({
                ...restoreIngredientById(originalIngredients, ingredientUuidId.ingredientId),
                uuid: ingredientUuidId.uuid
            })
        }
    }

    function submitAnOrder() {
        // готовим request
        let ids = [bunIngredientId] // first and last ingredient Id should be buns. Order is important for sending to the server
        ids = ids.concat(currentIngredientsUUIdsIds.flatMap(x => x.ingredientId))
        ids.push(bunIngredientId)
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
    summ = summ + chosenBun.price * 2

    //----------------------InnerSort---------на это внимательно можно не смотреть, т.к. скопировано отсюда почти полностью https://react-dnd.github.io/react-dnd/examples/sortable/simple-----------//;
    const [currentIngredientsOrderableState, setCurrentIngredientsOrderableState] = useState(currentIngredients)
    useEffect(() => {    // ОБРАТИТЬ ВНИМАНИЕ - ЭТО ОЧЕНЬ ПОЛЕЗНЫЙ ИНСТРУМЕНТ ПРОТИВ БЕСКОНЕЧНЫХ РЕРЕНДЕРОВ. ДЕЛАЕМ SETSTATE ТОЛЬКО ПО УСЛОВИЮ
        if (currentIngredientsOrderableState.length !== currentIngredients.length){
            setCurrentIngredientsOrderableState(currentIngredients);
        }
    }, [currentIngredients, currentIngredientsOrderableState]);

    const moveIng = useCallback((dragIndex, hoverIndex) => {
        setCurrentIngredientsOrderableState((prevIngs) =>
            update(prevIngs, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, prevIngs[dragIndex]]
                ]
            })
        );
    }, []);

    /*--------------------------------------------------------------------------------------------------------------------------------------------------------*/

    return (
        <div className={constructorStyles.main}>
            <ConstructorElement
                type="top"
                isLocked={true}
                text={chosenBun.name + " (верх)"}
                price={chosenBun.price}
                thumbnail={chosenBun.image}
            />
            <ScrollComponent distanceFromBottom={400} ingredientDragging={ingredientDragging}
                             setIngredientDragging={setIngredientDragging}>
                {/* filter out "bun" and fill the ingredients with regular ones */}
                {currentIngredientsOrderableState.map((ingredient, index) =>
                    /* we need a customKey as we can't access a key property of component from the component */
                    <ConstructorElementWrapper customKey={ingredient.uuid}
                                               key={ingredient.uuid}
                                               index={index}
                                               moveIng={moveIng}                 > {/* we can't use x._id here as there might be multiple identical ingredients */}
                        <ConstructorElement text={ingredient.name} thumbnail={ingredient.image}
                                            price={ingredient.price}
                                            handleClose={() => dispatch(constructorActions.removeIngredient(ingredient.uuid))}/>{/*Удаляем по uuid*/}

                    </ConstructorElementWrapper>)}
            </ScrollComponent>
            <ConstructorElement
                type="bottom"
                isLocked={true}
                text={chosenBun.name + " (низ)"}
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
