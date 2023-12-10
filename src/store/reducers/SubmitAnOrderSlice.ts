/*
*
* This Slice is responsible for burger constructor operations (add/remove ingredient as example)
*
* */
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {postOrder} from "../../utils/burger-api";
import {getIngredients} from "./IngredientsListSlice";

interface ISubmitAnOrderState {
    orderNumber: number;
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
            // Эти редюсеры будут доступны в приложении
            cleanOrderState(state) {
                state.name = ''
                state.error = ''
                state.orderNumber = 0
                state.fetching = false
            },
        },
        // Эти редюсеры занимаются обработкой thunkов этого слайса. Thunkов может быть множество, не только submitAnOrderHandler
        extraReducers: (builder) => {
            /* смотрим на состояние промиса, который был создан здесь submitAnOrderHandler  и в соответствии с этим заполняем стейт */
            builder
                .addCase(submitAnOrderHandler.pending, (state) => {
                    state.fetching = true
                })
                .addCase(submitAnOrderHandler.fulfilled, (state, action) => {
                    state.fetching = false
                    state.orderNumber = action.payload.order.number
                    state.error = ''
                    state.name = action.payload.name
                })
                .addCase(getIngredients.rejected, (state, action) => {
                    state.fetching = false
                    state.orderNumber = 0
                    state.name = ''
                    state.error = action.payload as string
                });
        }
    })


export const submitAnOrderHandler = createAsyncThunk(
    "submit/order",
    async (ingredientIDs: Array<string>, { rejectWithValue, fulfillWithValue }) => {
        try {
           const resp = await postOrder(ingredientIDs);
           if(resp){
               return fulfillWithValue(resp)
           }
           return rejectWithValue("Error")
        } catch (e) {
            return rejectWithValue("Error")
        }
    }
)

export const submitAnOrderReducers = submitAnOrderSlice.reducer
export const submitAnOrderActions = submitAnOrderSlice.actions

