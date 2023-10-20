/*
*
* This Slice is responsible for burger constructor operations (add/remove ingredient as example)
*
* */
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ISubmitAnOrderResponse} from "../../utils/Interfaces";

interface ISubmitAnOrderState {
    orderNumber: number | null;
    fetching: boolean;
    error: string
}


const initialState: ISubmitAnOrderState = {
    orderNumber: null,
    fetching: false,
    error: '',
}
export const submitAnOrderSlice = createSlice(
    {
        name: 'constructor',             //ключ, который станет префиксом всех экшенов. Например: type: 'constructor/increment');
        initialState: initialState,
        reducers: {
            sendAnOrder(state: ISubmitAnOrderState) {
                state.fetching = true
            },
            orderConfirmed(state: ISubmitAnOrderState, action: PayloadAction<ISubmitAnOrderResponse>) {
                console.log("IN ORDER CONFIRMED")
                console.log(action.payload)
                state.fetching = false
                state.orderNumber = action.payload.order.number
                state.error = ''
            },
            orderFailed(state: ISubmitAnOrderState, action: PayloadAction<string>) {
                console.log("IN REDUCER")
                console.log(action)
                state.fetching = false
                state.orderNumber = null
                state.error = action.payload
            },
        }
    })
export const submitAnOrderReducers = submitAnOrderSlice.reducer
export const submitAnOrderActions = submitAnOrderSlice.actions

