/*
*
* This Slice is responsible for burger constructor operations (add/remove ingredient as example)
*
* */
import {v4 as uuidv4} from 'uuid';
import {createSlice, current} from "@reduxjs/toolkit";
import {PayloadAction} from "@reduxjs/toolkit";


interface ConstructorState {
    bun: string;
    ingredients: Array<IINgredientUidsIds>
}

interface IINgredientUidsIds{
    ingredientId: string,
    uuid: string
}

const initialState: ConstructorState = {
    bun: '643d69a5c3f7b9001cfa093c',        // здесь ingredientId булки. Есть default значение
    ingredients: Array<IINgredientUidsIds>(),  // здесь ingredient uuid и ingredientId всех, кроме булки
}
export const burgerConstructorSlice = createSlice(
    // Если что-то нужно залоггировать, использовать current() из immer
    {
        name: 'constructor',             //ключ, который станет префиксом всех экшенов. Например: type: 'constructor/increment');
        initialState: initialState,
        reducers: {
            // Задача - изменить каким-то образом сообщение, которое пришло в reducer
            // REDUCER - "ЧИСТАЯ" ФУНКЦИЯ, РЕДЮСЕР НИЧЕГО МЕНЯТЬ НЕ ДОЛЖЕН.
            // Поэтому меняем action используя prepare
            addIngredient: {
                reducer(state:ConstructorState, action: PayloadAction<IINgredientUidsIds>) {
                    state.ingredients.push(action.payload)
                },
                prepare(ingredientId: string) { // <- это первоначальный приемник
                    return {payload: {uuid: uuidv4(), ingredientId: ingredientId}} //<- это пойдет в reducer
                }
            },
            addBun(state: ConstructorState, action: PayloadAction<string>) {
                state.bun = action.payload
            },
            removeIngredient(state: ConstructorState, action: PayloadAction<string>) { // remove ingredient by uuid
                state.ingredients = state.ingredients.filter(ingredient => ingredient.uuid !== action.payload);
            }
        }
    })
export const constructorReducers = burgerConstructorSlice.reducer
export const constructorActions = burgerConstructorSlice.actions

