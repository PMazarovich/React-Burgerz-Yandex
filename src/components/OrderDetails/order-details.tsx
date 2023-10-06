import orderDetailsStyles from './order-details.module.css'
import React, {useEffect, useState} from "react";
import {CurrencyIcon} from "@ya.praktikum/react-developer-burger-ui-components";
import {createOrderCardsFromFeed, ICardIngredient} from "../OrderFeed/order-line";

import {IIngredient, IOrderFeed} from "../../utils/Interfaces";
import {useAppDispatch, useAppSelector} from "../../utils/hooks";
import {useLocation, useParams} from "react-router-dom";
import {IWSOptions, useSocket} from "../../utils/websockets";
import {feedActions} from "../../store/reducers/FeedSlice";
import {useAuth} from "../../utils/auth";


export function IngredientContainer({
                                        ingredient,
                                        numberOfRepetitions
                                    }: { ingredient: ICardIngredientWithNameAndDescription, numberOfRepetitions: number }) {

    let showRepetitions = numberOfRepetitions !== 1
    return (
        <div className={orderDetailsStyles.ingredientContainer}>
            <div className={orderDetailsStyles.flexCenter}>
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
                <div className={"text text_type_main-default margin-left"}>{ingredient.name}</div>
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
    console.log("HERE WE ARE, IN ORDER DETAILS COMPONENT")
    const dispatch = useAppDispatch()
    const auth = useAuth()
    const {ordNumber} = useParams();
    const location = useLocation()
    const ordNumberr: number = Number(ordNumber);
    const [ingredientToCount, setIngredientToCount] = useState<TIngredientCount | null>(null)
    const [sum, setSum] = useState<number>(0)
    const [status, setStatus] = useState<boolean>(false)

    function onMessageSocketHandler(message: MessageEvent) {
        dispatch(feedActions.messageReceived(JSON.parse(message.data)));
    }

    function onConnectSocketHandler(_: Event) {
        dispatch(feedActions.connectionOpened())
    }

    function onDisconnectSocketHandler(_: Event) {
        dispatch(feedActions.connectionClosed())
    }

    function onErrorSocketHandler(event: Event) {
        dispatch(feedActions.connectionError(event));
    }

    const socketOptions: IWSOptions = {
        onMessage: onMessageSocketHandler,
        onConnect: onConnectSocketHandler,
        onDisconnect: onDisconnectSocketHandler,
        onError: onErrorSocketHandler
    }


    // Пробуем достать из хранилища заказ и ингредиенты
    const {order, ingredients, socketStatus, userLoggedIn} = useAppSelector((store) => ({
        order: store.socketFeed.feedState.orders.filter(order => order.number === ordNumberr)[0],
        ingredients: store.ingredientsState.ingredients,
        socketStatus: store.socketFeed.socketState.status,
        userLoggedIn: store.authState.userLoggedIn,
    }));
    // if we are on the path of feed, then ws to wss://norma.nomoreparties.space/orders/all, if we are in orders, then ws to wss://norma.nomoreparties.space/orders?token=
    const url = location.pathname.includes('feed') ? 'wss://norma.nomoreparties.space/orders/all' : 'wss://norma.nomoreparties.space/orders';
    const socket = useSocket(url, socketOptions);
    if(socketStatus !== 'connected') {
        socket.connect(location.pathname.includes('feed') ? undefined : auth.getAccessToken());
    }
    // лучше проверять всё таким образом, а не через эффекты
    if (order && ingredients.length !== 0 && sum === 0 && !ingredientToCount) {
        setIngredientToCount(calculateRepetitionsForIngredients(extractIngredients(ingredients, order)))
        setSum(extractIngredients(ingredients, order).reduce((sum, ingredient) => sum + ingredient.price, 0))
    }
    useEffect(() => {
            if (socketStatus === 'idle' && userLoggedIn) {
                socket.connect(auth.getAccessToken())
            }
        }, [socket, socketStatus]
    )


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
                            <span className={"text text_type_main-small completed"}>
            Status is: COMPLETED
          </span>
                        ) : (
                            <span className={"text text_type_main-small cancelled"}>
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
                            <div className={orderDetailsStyles.flexMarginRight15}>
                            <span
                                className={orderDetailsStyles.marginRight15}>{sum}</span> {/* Use a variable or prop for the order sum */}
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
