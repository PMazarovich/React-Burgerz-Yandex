import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    ingredients: [],
    ingredientsFetching: true,
    error: ''
}
// создаёт экшены, генераторы экшенов и редьюсеры.
export const ingredientsSlice = createSlice(
    {
        name: 'ingredients',             //ключ, который станет префиксом всех экшенов. Например: type: 'counter/increment');
        initialState: initialState,
        reducers: {             // Это типа switch case. Тут все reducerы
            ingredientsFetching(state){
                state.ingredientsFetching = true
            },
            ingredientsFetchingSuccess(state, action){ // action ЭТО ОБЪЕКТ {type: blalbalba, payload: {ingredients: asdfasdf, something: XCVxcvxcv}}
                state.ingredientsFetching = false
                state.error = ''
                state.ingredients = action.payload.ingredients
            },
            ingredientsFetchingFailure(state, action){
                state.ingredientsFetching = false
                state.error = action.payload
            }
        }
    }) // отсюда можно вытащить actions и reducers и еще много чего

export const ingredientsReducers = ingredientsSlice.reducer
export const ingredientsActions = ingredientsSlice.actions

