/*
*
* This Slice is responsible for Feed
*
* */
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IFeed} from "../../utils/Interfaces";
import {AppDispatch} from "../store";
import {useDispatch} from "react-redux";


interface ISocketState {
    data: string | null, // The data received from the websocket server
    status: string // "idle", // The status of the websocket connection
    error: string | null // The error message if any
}

interface IsocketFeed {
    socketState: ISocketState
    feedState: IFeed
}


const initialState: IsocketFeed = {
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

export const createWebsocketHandler = createAsyncThunk(
    "websocket/feed",
    //payloadCreator takes two arguments: the first one is the argument that you pass to the thunk action creator when you dispatch it,
    // and the second one is an object with some useful properties and methods, such as getState, dispatch, rejectWithValue, etc.
    // аргумент            // thunkAPI имеет getState и dispatch
    async (url: string, thunkAPI) => {
        const websocket = new WebSocket(url);
        websocket.addEventListener("open", () => {
            thunkAPI.dispatch(feedActions.connectionOpened())
        })
        websocket.addEventListener("message", (event: MessageEvent<any>) => {
            // Dispatch an action when a message is received
            thunkAPI.dispatch(feedActions.messageReceived(JSON.parse(event.data)));
        });
        // Use the ErrorEvent interface for the error event
        websocket.addEventListener("error", (event: Event) => {
            // Dispatch an action when an error occurs
            thunkAPI.dispatch(feedActions.connectionError(event));
        });
        websocket.addEventListener("close", () => {
            // Dispatch an action when the connection is closed
            thunkAPI.dispatch(feedActions.connectionClosed());
        });

        // Можно вернуть инстанс созданного вебсокета. Но нам не нужно
        // return websocket

    }
)
// Create a custom typed version of useDispatch hook using AppDispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const socketFeedReducers = feedSlice.reducer
export const feedActions = feedSlice.actions

