/*
*
* This Slice is responsible for burger constructor operations (add/remove ingredient as example)
*
* */
import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    orderNumber: null,
    fetching: false,
    error: '',
}
export const submitAnOrderSlice = createSlice(
    {
        name: 'constructor',             //ключ, который станет префиксом всех экшенов. Например: type: 'constructor/increment');
        initialState: initialState,
        reducers: {
            sendAnOrder(state){
                state.fetching = true
            },
            orderConfirmed(state, action){
                state.fetching = false
                state.orderNumber = action.payload.orderNumber
                state.error = ''
            },
            orderFailed(state, payload){
                state.fetching = false
                state.orderNumber = null
                state.error = payload.error
            },
        }
    })
export const submitAnOrderReducers = submitAnOrderSlice.reducer
export const submitAnOrderActions = submitAnOrderSlice.actions

