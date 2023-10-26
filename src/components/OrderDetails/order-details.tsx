import orderDetailsStyles from './order-details.module.css'
import React, {useEffect, useState} from "react";
import {CurrencyIcon} from "@ya.praktikum/react-developer-burger-ui-components";
import {ICardIngredient} from "../OrderFeed/order-line";

import {IIngredient, IOrderFeed} from "../../utils/Interfaces";
import {createWebsocketHandler, useAppDispatch} from "../../store/reducers/FeedSlice";
import {useAppSelector} from "../../utils/hooks";
import {useParams} from "react-router-dom";
import {getIngredients} from "../../utils/burger-api";
import {ingredientsActions} from "../../store/reducers/IngredientsListSlice";


export function IngredientContainer({
                                        ingredient,
                                        numberOfRepetitions
                                    }: { ingredient: ICardIngredientWithNameAndDescription, numberOfRepetitions: number }) {

    let showRepetitions = numberOfRepetitions !== 1
    return (
        <div className={orderDetailsStyles.ingredientContainer}>
            <div style={{display: "flex", alignItems: "center"}}>
                <div style={{
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    backgroundImage: `url(${ingredient.imageUrl})`, // todo place here a variable
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: '3px solid #333',
                    backgroundColor: "black",
                }}/>
                <div className={"text text_type_main-default"} style={{marginLeft: "10px"}}>{ingredient.name}</div>
            </div>
            <div className={`${orderDetailsStyles.numbersSubComponent} text text_type_main-medium`}>
                {showRepetitions && (
                    <>
                        <span>{numberOfRepetitions}</span>
                        <span>X</span>
                    </>
                )}
                <span>{ingredient.price}</span>
                <CurrencyIcon type="primary"/>
            </div>
        </div>


    )
}

interface ICardIngredientWithNameAndDescription extends ICardIngredient {
    name: string;
    description: string;
}

function calculateRepetitionsForIngredients(cardIngredients: Array<ICardIngredientWithNameAndDescription>): TIngredientCount {
    let result: { [key: string]: { count: number, object: ICardIngredientWithNameAndDescription } } = {};
    cardIngredients.forEach(ingredient => {
        if (!result[ingredient.name]) {
            result[ingredient.name] = {count: 0, object: ingredient};
        }
        result[ingredient.name] = {count: result[ingredient.name].count + 1, object: ingredient};
    })
    return result;
}


function extractIngredients(genericIngredients: Array<IIngredient>, order: IOrderFeed): Array<ICardIngredientWithNameAndDescription> {
    let cardIngredients: Array<ICardIngredientWithNameAndDescription> = []
    order.ingredients.forEach((x: string) => {
        const ingredientFiltered: IIngredient = genericIngredients.filter((ing: IIngredient) => ing._id === x)[0]
        const cardIngredient: ICardIngredientWithNameAndDescription = {
            imageUrl: ingredientFiltered.image_mobile,
            price: ingredientFiltered.price,
            name: ingredientFiltered.name,
            description: "some description", // todo where get description?
        }
        cardIngredients.push(cardIngredient)
    })

    return cardIngredients
}

type TIngredientCount = { [p: string]: { count: number, object: ICardIngredientWithNameAndDescription } };

// Этот компонент описывает детали заказа
function OrderDetailsComponent() {
    console.log("we are in OrderDetailsComponent")
    const dispatch = useAppDispatch()
    const {ordNumber} = useParams();
    const ordNumberr: number = Number(ordNumber);
    const [ingredientToCount, setIngredientToCount] = useState<TIngredientCount | null>(null)
    const [sum, setSum] = useState<number>(0)
    const [status, setStatus] = useState<boolean>(false)
    // Пробуем достать из хранилища заказ и ингредиенты
    const { order , ingredients}  = useAppSelector((store) => {
        return {
            order: store.socketFeed.feedState.orders.filter(order => order.number === ordNumberr)[0],
            ingredients: store.ingredientsState.ingredients
        }
    })
    // console.log('order', order)
    // todo почему я должен писать отдельный useeffect на order и ingredietns, если useSelector должен всё рисовать заново?
    if (order && ingredients.length !== 0 && sum === 0 && !ingredientToCount) {
        console.log('order', order)
        console.log('ingredients', ingredients)
        setIngredientToCount(calculateRepetitionsForIngredients(extractIngredients(ingredients, order)))
        setSum(extractIngredients(ingredients, order).reduce((sum, ingredient) => sum + ingredient.price, 0))
    }
    // Это не раотает. Почему?
    useEffect(() => {
        // Если ингредиентов нет, запрашиваем новые
        if(ingredients.length === 0)
            getIngredients().then((ingredients: Array<IIngredient>) => {
                dispatch(ingredientsActions.ingredientsFetchingSuccess(ingredients))
                // Если нет заказа, открываем сокет и вытаскиваем оттуда заказы
                if(!order){
                    // Dispatch the thunk with the websocket url as an argument
                    // This thunk will create a websocket instance in redux store and will handle different events accordingly
                    dispatch(createWebsocketHandler("wss://norma.nomoreparties.space/orders/all"))
                }
            }).catch((err) => {
                dispatch(ingredientsActions.ingredientsFetchingFailure(err))
                console.log("ERROR DURING INGREDIENTS FETCH")
                console.log(err)
            })
    }, []);

    return (
        <div className={orderDetailsStyles.wrapper}>
            {order &&
                <div className={orderDetailsStyles.header}>
                <span
                    className={"text text_type_digits-default"}>{ordNumber}</span> {/* Use a variable or prop for the order number */}
                    <div className={orderDetailsStyles.description}>
                        <span
                            className={"text text_type_main-medium"}>{order.name}</span>
                        {/* Use a variable or prop for the order description */}
                        {status ? (
                            <span
                                className={"text text_type_main-small"}
                                style={{color: "#89ffca", marginTop: "7px"}}
                            >
            Status is: COMPLETED
          </span>
                        ) : (
                            <span
                                className={"text text_type_main-small"}
                                style={{color: "#ff0000", marginTop: "7px"}}
                            >
            Status is: Cancelled
          </span>
                        )}
                    </div>
                    <div className={orderDetailsStyles.ingredientContainerWithHeaderWrapper}>
                        <span className={"text text_type_main-medium"}>Состав: </span>
                        <div className={`${orderDetailsStyles.ingredientContainerWrapper} custom-scroll`}>
                            {ingredientToCount && Object.entries(ingredientToCount).map(([_, value], index) => (
                                <IngredientContainer key={index} ingredient={value.object}
                                                     numberOfRepetitions={value.count}/>)
                            )}
                        </div>
                        <div className={orderDetailsStyles.footerContainer}>
                            {order &&
                                <span
                                    className={"text text_type_main-medium"}>{order.createdAt}</span>
                            }{/* Use a variable or prop for the order description */}
                            <div style={{display: "flex", marginRight: "15px"}}>
                            <span
                                style={{marginRight: "15px"}}>{sum}</span> {/* Use a variable or prop for the order sum */}
                                <CurrencyIcon type="primary"/>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default OrderDetailsComponent
