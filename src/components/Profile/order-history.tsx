import React, {useEffect, useState} from 'react';
import orderHistoryStyles from "./order-history.module.css"
import {createOrderCardsFromFeed, IOrderCard, OrderCard} from "../OrderFeed/order-line";
import classNames from "classnames";
import {createWebsocketHandler, useAppDispatch} from "../../store/reducers/FeedSlice";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";

function OrderHistory() {
    // todo fetch orders for this exact user
    const dispatch = useAppDispatch();
    const {
        feed,
        genericIngredients,
    } = useSelector((store: RootState) => ({
        total: store.socketFeed.feedState.total,
        totalToday: store.socketFeed.feedState.totalToday,
        feed: store.socketFeed.feedState,
        genericIngredients: store.ingredientsState.ingredients
    }))

    useEffect(() => {
        // Dispatch the thunk with the websocket url as an argument
        // This thunk will create a websocket connection and will store data in redux
        dispatch(createWebsocketHandler("wss://norma.nomoreparties.space/orders/all"))
    }, [dispatch]);

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
