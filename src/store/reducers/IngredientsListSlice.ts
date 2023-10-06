import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IIngredient} from "../../utils/Interfaces";


interface IIngredientsState {
    ingredients: Array<IIngredient>;
    ingredientsFetching: boolean;
    error: string
}

const initialState: IIngredientsState = {
    ingredients: Array<IIngredient>(),
    ingredientsFetching: true,
    error: ''
}

// создаёт экшены, генераторы экшенов и редьюсеры.
export const ingredientsSlice = createSlice(
    {
        name: 'ingredients',             //ключ, который станет префиксом всех экшенов. Например: type: 'counter/increment');
        initialState: initialState,
        reducers: {             // Это типа switch case. Тут все reducerы
            ingredientsFetching(state: IIngredientsState) {
                state.ingredientsFetching = true
            },
            ingredientsFetchingSuccess(state: IIngredientsState, action: PayloadAction<Array<IIngredient>>) { // action ЭТО ОБЪЕКТ {type: blalbalba, payload: {ingredients: asdfasdf, something: XCVxcvxcv}}
                state.ingredientsFetching = false
                state.error = ''
                state.ingredients = action.payload
            },
            ingredientsFetchingFailure(state: IIngredientsState, action: PayloadAction<string>) {
                state.ingredientsFetching = false
                state.error = action.payload
            }
        }
    }) // отсюда можно вытащить actions и reducers и еще много чего

export const ingredientsReducers = ingredientsSlice.reducer
export const ingredientsActions = ingredientsSlice.actions

