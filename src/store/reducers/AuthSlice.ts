/*
*
* This Slice is responsible for burger constructor operations (add/remove ingredient as example)
*
* */
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

// Это находится в хранилище оперативной памяти
// Токен же будет находиться в постоянной памяти браузера

interface IInitialState {
    name: string;
    email: string;
    permissions: any; // there is no permissions currently, so now it is any
    userLoggedIn: boolean
}

interface IUserLoggedInActionType {
    name: string;
    email: string;
    userLoggedIn: boolean;
    permissions?: any;
}

const initialState: IInitialState = {
    name: '',
    email: '',
    permissions: null,
    userLoggedIn: false,
}

export const authSlice = createSlice(
    {
        name: 'auth',             //ключ, который станет префиксом всех экшенов. Например: type: 'constructor/increment');
        initialState: initialState,
        reducers: {
            userLoggedOut(state) {
                state.name = ''
                state.email = ''
                state.permissions = null
                state.userLoggedIn = false
            },
            userLoggedIn(state, action: PayloadAction<IUserLoggedInActionType>) {
                state.name = action.payload.name
                state.email = action.payload.email
                state.permissions = action.payload.permissions
                state.userLoggedIn = true
            },

        }
    })

export const authReducers = authSlice.reducer
export const authActions = authSlice.actions
