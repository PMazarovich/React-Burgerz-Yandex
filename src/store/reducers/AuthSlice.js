/*
*
* This Slice is responsible for burger constructor operations (add/remove ingredient as example)
*
* */
import {createSlice} from "@reduxjs/toolkit";

// Это находится в хранилище оперативной памяти
// Токен же будет находиться в постоянной памяти браузера

const initialState = {
    name: null,
    email: null,
    permissions: null,
    userLoggedIn: false,
}

export const authSlice = createSlice(
    {
        name: 'auth',             //ключ, который станет префиксом всех экшенов. Например: type: 'constructor/increment');
        initialState: initialState,
        reducers: {
            userLoggedOut(state){
                state.name = null
                state.email = null
                state.permissions = null
                state.userLoggedIn = false
            },
            userLoggedIn(state, action){
                state.name = action.payload.name
                state.email = action.payload.email
                state.permissions = null
                state.userLoggedIn = true
            },

        }
    })

export const authReducers = authSlice.reducer
export const authActions = authSlice.actions
