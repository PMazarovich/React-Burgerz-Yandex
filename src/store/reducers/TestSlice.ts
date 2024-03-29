import {createSlice, PayloadAction} from "@reduxjs/toolkit";
interface User {
    name: string;
}
interface UserState {
    users: User[];
    isLoading: boolean;
    error: string;
}

const initialState = {
    users: [],
    isLoading: false,
    error: ''
}
// создаёт экшены, генераторы экшенов и редьюсеры.
export const userSlice = createSlice(
    {
        name: 'user',             //ключ, который станет префиксом всех экшенов. Например: type: 'counter/increment');
        initialState: initialState,
        reducers: {             // Это типа switch case. Тут все reducerы
            someReducerIncrement(state: UserState, payload: PayloadAction<number>){    // Это будет не только редюсером, но и названием action.
                // Потом можно будет сделать так const {someReducerIncrement} = userSlice.actions
            }
        }
}) // отсюда можно вытащить actions и reducers и еще много чего

export const userReducer = userSlice.reducer
