/*
*
* This Slice is responsible for burger constructor operations (add/remove ingredient as example)
*
* */
import { v4 as uuidv4 } from 'uuid';
import {createSlice, current} from "@reduxjs/toolkit";

const initialState = {
    bun: '643d69a5c3f7b9001cfa093c',        // здесь ingredientId булки. Есть default значение
    ingredients: [],  // здесь ingredient uuid и ingredientId всех, кроме булки
    //dragging: false
}
export const burgerConstructorSlice = createSlice(
    // Если что-то нужно залоггировать, использовать current() из immer
    {
        name: 'constructor',             //ключ, который станет префиксом всех экшенов. Например: type: 'constructor/increment');
        initialState: initialState,
        reducers: {
            dragStarted(state){
              state.dragging = true
            },
            dragStopped(state){
                state.dragging = false
            },
            reorderIngredient(state, action){

            },
            // REDUCER - "ЧИСТАЯ" ФУНКЦИЯ, РЕДЮСЕР НИЧЕГО МЕНЯТЬ НЕ ДОЛЖЕН.
            // Поэтому меняем action используя prepare
            addIngredient:{
                reducer(state, action){
                    state.ingredients.push(action.payload)
                },
                prepare(action){ // <- это первоначальный приемник
                    // ВСЕГДА ПЕРЕДАВАТЬ ACTION В ВИДЕ {payload: ....}
                    return { payload: {uuid: uuidv4(), ingredientId: action.payload.ingredientId} } //<- это пойдет в reducer
                }
            },
            addBun(state, action){
                state.bun = action.payload.ingredientId
            },
            removeIngredient(state, action) { // remove ingredient by uuid
                state.ingredients = state.ingredients.filter(ingredient => ingredient.uuid !== action.payload);
            }
        }
    })
export const constructorReducers = burgerConstructorSlice.reducer
export const constructorActions = burgerConstructorSlice.actions

