import React, {useEffect, useRef, useState} from "react";
import orderLineStyles from './order-line.module.css'
import {CurrencyIcon} from "@ya.praktikum/react-developer-burger-ui-components";
import {Link, NavLink, useLocation, useNavigate} from 'react-router-dom';
import classNames from "classnames";
import {Modal} from "../Modal/modal";
import OrderDetailsComponent from "../OrderDetails/order-details";
import {IFeed, IIngredient, IOrderFeed} from "../../utils/Interfaces";
import {createWebsocketHandler, useAppDispatch} from "../../store/reducers/FeedSlice";
import {useAppSelector} from "../../utils/hooks";
import {getIngredients} from "../../utils/burger-api";
import {ingredientsActions} from "../../store/reducers/IngredientsListSlice";

function HeaderContainer({
                             orderNumber,
                             time,
                         }: { orderNumber: number, time: Date }) {
    return (
        <div className={orderLineStyles.cardHeaderWrapper}>
            <p className="text text_type_main-small">#{orderNumber}</p>
            <p className="text text_type_main-default text_color_inactive">{time.toTimeString()}</p>
        </div>
    )
}

function BodyContainer({description}: { description: string | undefined}) {
    return (
        <div className={orderLineStyles.cardOverviewWrapper}>
            <p className="text text_type_main-small">{description}</p>
        </div>
    )
}

function FooterContainer({ingredients}: { ingredients: Array<{ imageUrl: string, price: number }> }) {
    const summ = ingredients.reduce((sum, ingredient) => sum + ingredient.price, 0)
    return (
        <div className={orderLineStyles.cardFooterWrapper}>
            <div style={{display: "flex"}}>
                {ingredients.map((x, index) => {
                    return (<div key={index} style={{
                        borderRadius: '50%',
                        width: '50px',
                        height: '50px',
                        backgroundImage: `url(${x.imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        border: '3px solid #00cbef',
                        backgroundColor: "black",
                        position: 'relative',                 // This enables shifting
                        left: `${-20 * index + 1}px`,         // This shifts the container to the left
                    }}/>)
                })}
            </div>
            <div className="text text_type_main-medium"
                 style={{display: "flex", alignItems: "center", marginRight: "5px"}}>
                <span style={{marginRight: "15px"}}>{summ}</span><CurrencyIcon type="primary"/>
            </div>
        </div>

    )
}

export interface ICardIngredient {
    imageUrl: string
    price: number,
}

export interface IOrderCard {
    orderNumber: number
    time: Date
    status?: boolean
    showStatus: boolean
    description?: string
    ingredients: Array<ICardIngredient>
    name: string | undefined
}

// todo fill with actual cardPayload
export function OrderCard({cardPayload}: { cardPayload: IOrderCard }) {
    // open a portal with order details
    const location = useLocation()
    return (
        /* link will place modalWasOpened in state and will triggre re-rendering an App component with all Routes */
        <NavLink
            style={{textDecoration: 'none', color: "#8585ad"}}
            to={{pathname: `/feed/${cardPayload.orderNumber}`}}
            state={{prevLocationObject: location}}
            key={cardPayload.orderNumber}
        >
            <div className={orderLineStyles.cardWrapper}>
                <HeaderContainer orderNumber={cardPayload.orderNumber} time={cardPayload.time}/>
                {cardPayload.showStatus && (
                    <span className={classNames("text text_type_main-small", {
                        // apply the green color class if status is true, otherwise apply the red color class
                        [orderLineStyles.greenColor]: cardPayload.status,
                        [orderLineStyles.redColor]: !cardPayload.status
                    })} style={{marginTop: "7px", marginLeft: "5px", textDecoration: 'none'}}>
                    Status is: {cardPayload.status ? "COMPLETED" : "CANCELLED"}
                </span>
                )}
                <BodyContainer description={cardPayload.name}/>
                <FooterContainer ingredients={cardPayload.ingredients}/>
            </div>
        </NavLink>
    )
}

function formPendingAndCompleted(feed: IFeed): [number[], number[]] {
    let completed: Array<number> = []
    let pending: Array<number> = []
    feed.orders.forEach((order: IOrderFeed) => {
        if (order.status === "done") {
            completed.push(order.number)
        } else {
            pending.push(order.number)
        }
    })
    return [pending, completed]
}


export function createOrderCardsFromFeed(feed: IFeed, genericIngredients: Array<IIngredient>): Array<IOrderCard> {
    function parseStatus(state: string): boolean {
        return state === "done"
    }

    let result: Array<IOrderCard> = []
    // extract an ingredient by Id from genericIngredients
    feed.orders.forEach((order: IOrderFeed) => {
        let cardIngredients: Array<ICardIngredient> = []
        order.ingredients.forEach((x: string) => {
            const ingredientFiltered: IIngredient = genericIngredients.filter((ing: IIngredient) => ing._id === x)[0]

            const cardIngredient: ICardIngredient = {
                imageUrl: ingredientFiltered.image_mobile,
                price: ingredientFiltered.price,
            }
            cardIngredients.push(cardIngredient)
        })
        let ordCard: IOrderCard = {
            showStatus: false,
            orderNumber: order.number,
            time: new Date(order.updatedAt),
            status: parseStatus(order.status),
            ingredients: cardIngredients,
            name: order.name
        }
        result.push(ordCard)

    })
    return result
}


function OrderFeed() {
    const dispatch = useAppDispatch();

    const {
        total,
        totalToday,
        feed,
        ingredients,
        socketConnected,
    } = useAppSelector((store) => ({
        total: store.socketFeed.feedState.total,
        totalToday: store.socketFeed.feedState.totalToday,
        feed: store.socketFeed.feedState,
        ingredients: store.ingredientsState.ingredients,
        socketConnected: store.socketFeed.socketState.status
    }))


    let orderCards: IOrderCard[] = []
    let [pendingCompleted, setPendingCompleted] = useState<[number[], number[]]>([[], []])

    if ((feed.orders.length > 0) && (ingredients.length > 0)){
       orderCards = createOrderCardsFromFeed(feed, ingredients)
    }

    useEffect(() => {
        // Dispatch the thunk with the websocket url as an argument
        // This thunk will create a websocket connection and will store data in redux
        // Если сокет не подключен, подключить его
        if (socketConnected !== 'connected') {
            dispatch(createWebsocketHandler("wss://norma.nomoreparties.space/orders/all"))
        }
        // Если ингредиентов нет - потащим их
        if(ingredients.length === 0) {
            getIngredients().then((ingredients: Array<IIngredient>) => {
                dispatch(ingredientsActions.ingredientsFetchingSuccess(ingredients))
            }).catch((err) => {
                dispatch(ingredientsActions.ingredientsFetchingFailure(err))
            })
        }
        if(feed.orders.length > 0) {
            setPendingCompleted(formPendingAndCompleted(feed))
        }
    }, [dispatch, feed, ingredients.length, socketConnected]);


    return (
        <div className={orderLineStyles.wrapper}>
            <div className={orderLineStyles.innerContainerLeft}>
                <p className={`${orderLineStyles.leftInnerContainerTop} text text_type_main-large`}>Order line</p>
                <div className={`${orderLineStyles.leftInnerContainerBottom} custom-scroll`}>
                    { orderCards.length !== 0 && orderCards.map((order, index) => {
                        return <OrderCard key={index} cardPayload={order}/>
                    })}
                </div>
            </div>
            <div className={orderLineStyles.innerContainerRight}>
                <div className={orderLineStyles.rightInnerContainer} style={{flexDirection: "row"}}>
                    <div className={classNames(orderLineStyles.innerContainer11, 'custom-scroll')}>
                        <span className={'text text_type_main-medium'}>Готовы:</span>
                        <div style={{
                            marginTop: "15px",
                            display: "flex",
                            flexDirection: "column",
                            marginLeft: "10px",

                        }}>
                            {pendingCompleted[1].map((ordnumber, key) => {
                                return <span key={key} className={'text text_type_digits-default'}
                                             style={{color: "#abff4fd6"}}>{ordnumber}</span>
                            })}

                        </div>
                    </div>
                    <div className={classNames(orderLineStyles.innerContainer11, 'custom-scroll')}><span
                        className={'text text_type_main-medium'}>В работе:</span>
                        <div style={{
                            marginTop: "15px",
                            display: "flex",
                            flexDirection: "column",
                            marginLeft: "10px",
                            marginBottom: "20px"
                        }}>
                            {pendingCompleted[0].map((ordnumber, key) => {
                                return <span key={key} className={'text text_type_digits-default'}>{ordnumber}</span>
                            })}
                        </div>
                    </div>
                </div>
                <div className={orderLineStyles.rightInnerContainer}
                     style={{flexDirection: "column", alignItems: "start"}}>
                    <div className={orderLineStyles.innerContainer22}>
                        <span className={'text text_type_main-medium'}>Выполнено за всё время:</span>
                        <span className={`text text_type_digits-large ${orderLineStyles.glow}`}>{total}</span>
                    </div>
                    <div className={orderLineStyles.innerContainer22}>
                        <span className={'text text_type_main-medium'}>Выполнено за сегодня:</span>
                        <span className={`text text_type_digits-large ${orderLineStyles.glowCold}`}>{totalToday}</span>
                    </div>

                </div>
            </div>
        </div>
    )
}


export default OrderFeed;
