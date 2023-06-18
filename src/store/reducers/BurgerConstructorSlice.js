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
    dragging: false
}
export const burgerConstructorSlice = createSlice(
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
            // Если в action передать (ingredientId) он передастся не как объект, а как единственный property
            // Есди же передать так  {ingredients: asdfasdf, something: XCVxcvxcv}, то в payload уже нужно будет обращаться как action.payload.ingredients
            addIngredient(state, action) {  // action ЭТО ОБЪЕКТ {type: blalbalba, payload: {ingredients: asdfasdf, something: XCVxcvxcv}}
                state.ingredients.push({uuid: uuidv4(), ingredientId: action.payload.ingredientId})
            },
            addBun(state, action){
                state.bun = action.payload.ingredientId
            },
            removeIngredient(state, action) { // remove ingredient by uuid
                for (let i = 0; i < state.ingredients.length; i++) {
                    console.log(current(state.ingredients[i]))
                    if (state.ingredients[i].uuid === action.payload.ingredientUuid) { // current will extract an actual value from Proxy
                        // this will "mutate" state.ingredients with immer
                        state.ingredients.splice(i, 1); // delete only ONE element from constructor as there may be multiple identical elements there
                        break;
                    }
                }
            }
        }
    })
export const constructorReducers = burgerConstructorSlice.reducer
export const constructorActions = burgerConstructorSlice.actions

