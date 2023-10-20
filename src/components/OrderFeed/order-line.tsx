import React, {useCallback, useEffect, useRef, useState} from "react";
import orderLineStyles from './order-line.module.css'
import {CurrencyIcon} from "@ya.praktikum/react-developer-burger-ui-components";
import exp from "constants";
import {Outlet, useLocation, useNavigate} from 'react-router-dom';
import classNames from "classnames";
import {Modal} from "../Modal/modal";
import OrderConfirmedDetails from "../OrderConfirmedDetails/order-confirmed-details";
import OrderDetailsComponent from "../OrderDetails/order-details";
import {IWSOptions, useSocket} from "../../utils/websockets";
import {useAuth} from "../../utils/auth";
import {IFeed, IIngredient, IOrderFeed} from "../../utils/Interfaces";
import {createWebsocketHandler, feedActions, socketFeedReducers, useAppDispatch} from "../../store/reducers/FeedSlice";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/store";
import constructorStyles from "../BurgerConstructor/burger-constructor.module.css";
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

function BodyContainer({description}: { description: string }) {
    return (
        <div className={orderLineStyles.cardOverviewWrapper}>
            <p className="text text_type_main-medium">{description}</p>
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
}

// todo fill with actual cardPayload
export function OrderCard({cardPayload}: { cardPayload: IOrderCard }) {
    const location = useLocation();
    const [modalShowed, setModalShowed] = useState<boolean>(false)

    // open a portal with order details
    function switchModalShowed(): void {
        const newURL: URL = new URL(window.location.href);
        newURL.pathname = `/ingredients/${cardPayload.orderNumber}`;
        if (!modalShowed) {
            window.history.replaceState('', '', `${location.pathname}/${cardPayload.orderNumber}`);
        } else {
            window.history.replaceState('', '', `${location.pathname}`);
        }
        setModalShowed(!modalShowed)
    }

    return (
        <div className={orderLineStyles.cardWrapper} onClick={switchModalShowed}>
            <HeaderContainer orderNumber={cardPayload.orderNumber} time={cardPayload.time}/>
            {cardPayload.showStatus && (
                <span className={classNames("text text_type_main-small", {
                    // apply the green color class if status is true, otherwise apply the red color class
                    [orderLineStyles.greenColor]: cardPayload.status,
                    [orderLineStyles.redColor]: !cardPayload.status
                })} style={{marginTop: "7px", marginLeft: "5px"}}>
                    Status is: {cardPayload.status ? "COMPLETED" : "CANCELLED"}
                </span>
            )}
            <BodyContainer description={"abc"}/>
            <FooterContainer ingredients={cardPayload.ingredients}/>
            {modalShowed &&
                <Modal onCloseFunction={switchModalShowed}>
                    <OrderDetailsComponent/>
                </Modal>}
        </div>
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
            ingredients: cardIngredients
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
        genericIngredients,
    } = useSelector((store: RootState) => ({
        total: store.socketFeed.feedState.total,
        totalToday: store.socketFeed.feedState.totalToday,
        feed: store.socketFeed.feedState,
        genericIngredients: store.ingredientsState.ingredients
    }))

    // let's open a socket connection right away
    // Use the custom typed useDispatch hook instead of the default one

    // Use useEffect to dispatch the thunk when the component mounts
    useEffect(() => {
        // Dispatch the thunk with the websocket url as an argument
        // This thunk will create a websocket connection and will store data in redux
        dispatch(createWebsocketHandler("wss://norma.nomoreparties.space/orders/all"))
    }, [dispatch]);

    let orders = createOrderCardsFromFeed(feed, genericIngredients)
    let [pending, completed] = formPendingAndCompleted(feed)
    return (
        <div className={orderLineStyles.wrapper}>
            <div className={orderLineStyles.innerContainerLeft}>
                <p className={`${orderLineStyles.leftInnerContainerTop} text text_type_main-large`}>Order line</p>
                <div className={`${orderLineStyles.leftInnerContainerBottom} custom-scroll`}>
                    {orders.map((order, index) => {
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
                            {/* todo generate this below component here */}
                            {completed.map((ordnumber, key) => {
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
                            {pending.map((ordnumber, key) => {
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
        ;
}


export default OrderFeed;
