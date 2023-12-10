/*
*
* This Slice is responsible for Feed
*
* */
import {createSlice} from "@reduxjs/toolkit";
import {IFeed} from "../../utils/Interfaces";


interface ISocketState {
    data: string | null, // The data received from the websocket server
    status: string // "idle", // The status of the websocket connection
    error: string | null // The error message if any
}

interface IsocketFeed {
    socketState: ISocketState
    feedState: IFeed
}


export const initialState: IsocketFeed = {
    feedState: {
        success: false,
        orders: [],
        total: 0,
        totalToday: 0,
    },
    socketState: {
        data: null,
        status: "idle",
        error: null
    }
}
export const feedSlice = createSlice(
    {
        name: 'feed',             //ключ, который станет префиксом всех экшенов. Например: type: 'constructor/increment');
        initialState: initialState,
        reducers: {
            messageReceived(state, action) {
                Object.assign(state.feedState, action.payload)
                //state.socketState.data = action.payload;
                state.socketState.status = "connected";
                state.socketState.error = null;
            },
            // Update the state when the connection is opened
            connectionOpened(state) {
                state.socketState.status = "connected";
                state.socketState.error = null;
            },
            // Update the state when the connection is closed
            connectionClosed(state) {
                state.socketState.status = "closed";
                state.socketState.error = null;
            },
            // Update the state when an error occurs
            connectionError(state, action) {
                state.socketState.status = "error";
                state.socketState.error = action.payload;
            }
        }
    })

export const socketFeedReducers = feedSlice.reducer
export const feedActions = feedSlice.actions

