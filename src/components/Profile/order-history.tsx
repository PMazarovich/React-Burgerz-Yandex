import React, {useEffect} from 'react';
import orderHistoryStyles from "./order-history.module.css"
import {createOrderCardsFromFeed, OrderCard} from "../OrderFeed/order-line";
import classNames from "classnames";
import {feedActions} from "../../store/reducers/FeedSlice";
import {useAppDispatch, useAppSelector} from "../../utils/hooks";
import {IWSOptions, useSocket} from "../../utils/websockets";
import {useAuth} from "../../utils/auth";

function OrderHistory() {
    // todo fetch orders for this exact user
    const dispatch = useAppDispatch();
    const {
        feed,
        genericIngredients,
        feedSocketConnected,
    } = useAppSelector((store) => ({
        feed: store.socketFeed.feedState,
        genericIngredients: store.ingredientsState.ingredients,
        feedSocketConnected: store.socketFeed.socketState.status
    }))
    const auth = useAuth()
    // опишем все случаи для url norma.nomoreparties.space/orders С ТОКЕНОМ
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
    const socket = useSocket('wss://norma.nomoreparties.space/orders', socketOptions)
    if(feedSocketConnected !== "connected"){
        socket.connect(auth.getAccessToken())
    }

    let orders = createOrderCardsFromFeed(feed, genericIngredients)

    return (
        <div className={classNames(orderHistoryStyles.historyWrapper, "custom-scroll")}>
            {orders.map((order, index) => {
                return <OrderCard key={index} cardPayload={order}/>
            })}
        </div>)
        ;
}


export default OrderHistory;
