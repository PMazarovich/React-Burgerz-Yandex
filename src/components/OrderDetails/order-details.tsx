import orderDetailsStyles from './order-details.module.css'
import React, {useEffect, useMemo, useState} from "react";
import {CurrencyIcon} from "@ya.praktikum/react-developer-burger-ui-components";
import {ICardIngredient, IOrderCard} from "../OrderFeed/order-line";
import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {IIngredient, IOrderFeed} from "../../utils/Interfaces";
import {createWebsocketHandler, useAppDispatch} from "../../store/reducers/FeedSlice";
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

function calculateRepetitionsForIngredients(cardIngredients: Array<ICardIngredientWithNameAndDescription>): { [key: string]: { count: number, object: ICardIngredientWithNameAndDescription } } {
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

type IngredientCount = { [p: string]: { count: number, object: ICardIngredientWithNameAndDescription } };

/// this is actually a portal. This portal will fetch the data from redux based on orderNumber in URL
function OrderDetailsComponent() {
    console.log("here we are")
    const dispatch = useAppDispatch()
    // const { ordNumber } = useParams(); // Access the ordNumber parameter from the URL. USE THIS VARIANT! IF THERE IS NO POPUP PORTALS WITH ADDED :id
    // console.log(window.location.href)
    // Convert the last segment to a number using the Number() function
    const ordNumber: number = Number(window.location.href.split("/").pop())
    const {order, genericIngredients, socketStatus} = useSelector((store: RootState) => {
        return {
            order: store.socketFeed.feedState.orders.filter(order => order.number === ordNumber)[0],
            genericIngredients: store.ingredientsState.ingredients,
            socketStatus: store.socketFeed.socketState.status
        }
    })
    // todo не работает вариант, когда сразу заходим в http://localhost:3000/feed/23910
    // todo было бы логично сделать get запроса какого-то конкретного ингредиента, если в reudx нет записей о feed.
    // todo иначе получается, что чтобы достать информацию о конкретном заказе нужно открывать webSocket и фильтровать там всё.
    let ingredientToCount = calculateRepetitionsForIngredients(extractIngredients(genericIngredients, order))
    let orderSum = genericIngredients.reduce((sum, ingredient) => sum + ingredient.price, 0)
    let status: boolean = order.status === "done"
    // create useState for each variable
   /* let [ingredients, setIngredients] = useState<ICardIngredientWithNameAndDescription[]>(extractIngredients(genericIngredients, order));
    let [ingredientToCount, setIngredientToCount] = useState<IngredientCount>({});
    let [status, setStatus] = useState(false);
    let [orderSum, setOrderSum] = useState(0);
*/
    // todo здесь пытался сделать логику по вытаскиванию из websocket, если нет в redux. В результате лиюбо бесконечный ререндер, либо вообще всё ломается.
    /*useEffect(() => {
        if(genericIngredients.length === 0) {
            console.log("WE ARE IN USEEFFECT");
            if (genericIngredients.length === 0) {
                getIngredients()
                    .then((ingredients: Array<IIngredient>) => {
                        setIngredients(extractIngredients(ingredients, order));
                        setStatus(order.status === "done");
                        setIngredientToCount(calculateRepetitionsForIngredients(extractIngredients(genericIngredients, order)));
                        setOrderSum(ingredients.reduce((sum, ingredient) => sum + ingredient.price, 0));
                    })
            }
            if (socketStatus !== "connected") {
                dispatch(createWebsocketHandler("wss://norma.nomoreparties.space/orders/all"));
            }
            if (genericIngredients.length !== 0) {
                console.log("HOHOHO");
                console.log(genericIngredients);
                // use setIngredients to update the ingredients state
                setIngredients(extractIngredients(genericIngredients, order));
                // use setIngredientToCount to update the ingredientToCount state
                // use setStatus to update the status state
                setStatus(order.status === "done");
                // use setOrderSum to update the orderSum state
                if (ingredients) {
                    setIngredientToCount(calculateRepetitionsForIngredients(ingredients));
                    setOrderSum(ingredients.reduce((sum, ingredient) => sum + ingredient.price, 0));
                }

            }
        }
    }, []);*/



    return (
        <div className={orderDetailsStyles.wrapper}>
            <div className={orderDetailsStyles.header}>
                <span
                    className={"text text_type_digits-default"}>{ordNumber}</span> {/* Use a variable or prop for the order number */}
                <div className={orderDetailsStyles.description}>
                    {order &&
                        <span
                            className={"text text_type_main-medium"}>{order.name}</span>
                    }{/* Use a variable or prop for the order description */}
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
                                style={{marginRight: "15px"}}>{orderSum}</span> {/* Use a variable or prop for the order sum */}
                            <CurrencyIcon type="primary"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderDetailsComponent
