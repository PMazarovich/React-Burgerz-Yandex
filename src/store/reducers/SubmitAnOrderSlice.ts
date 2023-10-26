/*
*
* This Slice is responsible for burger constructor operations (add/remove ingredient as example)
*
* */
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ISubmitAnOrderResponse} from "../../utils/Interfaces";
import {feedActions} from "./FeedSlice";
import {postOrder} from "../../utils/burger-api";

interface ISubmitAnOrderState {
    orderNumber: number ;
    fetching: boolean;
    error: string
    name: string
}


const initialState: ISubmitAnOrderState = {
    orderNumber: 0,
    fetching: false,
    error: '',
    name: '',
}
export const submitAnOrderSlice = createSlice(
    {
        name: 'submit/order',             //ключ, который станет префиксом всех экшенов. Например: type: 'constructor/increment');
        initialState: initialState,
        reducers: {
            sendAnOrder(state: ISubmitAnOrderState) {
                state.fetching = true
            },
            cleanOrderState(state: ISubmitAnOrderState){
                state.name = ''
                state.error = ''
                state.orderNumber = 0
                state.fetching= false
            },
            orderConfirmed(state: ISubmitAnOrderState, action: PayloadAction<ISubmitAnOrderResponse>) {
                state.fetching = false
                state.orderNumber = action.payload.order.number
                state.error = ''
                state.name = action.payload.name
            },
            orderFailed(state: ISubmitAnOrderState, action: PayloadAction<string>) {
                state.fetching = false
                state.orderNumber = 0
                state.name = ''
                state.error = action.payload
            },
        }
    })


export const submitAnOrderHandler = createAsyncThunk(
    "submit/order",
    //payloadCreator takes two arguments: the first one is the argument that you pass to the thunk action creator when you dispatch it,
    // and the second one is an object with some useful properties and methods, such as getState, dispatch, rejectWithValue, etc.
    // аргумент            // thunkAPI имеет getState и dispatch
    async (ingredientIDs: Array<string>, thunkAPI) => {
        submitAnOrderActions.sendAnOrder()
        postOrder(ingredientIDs).then(x => {
            thunkAPI.dispatch(submitAnOrderActions.orderConfirmed(x))
        }).catch(e => {
            thunkAPI.dispatch(submitAnOrderActions.orderFailed(e))
            alert("can't create an order. See console")
        })
        // Можно вернуть инстанс созданного вебсокета. Но нам не нужно
        // return websocket
    }
)

export const submitAnOrderReducers = submitAnOrderSlice.reducer
export const submitAnOrderActions = submitAnOrderSlice.actions

