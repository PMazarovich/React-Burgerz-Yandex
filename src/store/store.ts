import {combineReducers, configureStore} from '@reduxjs/toolkit'
import logger from 'redux-logger'
import thunk from 'redux-logger'
import {ingredientsReducers} from "./reducers/IngredientsListSlice";
import {constructorReducers} from "./reducers/BurgerConstructorSlice";
import {submitAnOrderReducers} from "./reducers/SubmitAnOrderSlice";
import {authReducers} from "./reducers/AuthSlice";
import {socketFeedReducers} from "./reducers/FeedSlice";
import {useDispatch} from "react-redux";

const rootReducer = combineReducers({   // Соберем все reducers в один и передадим потом в rootReducer
    ingredientsState: ingredientsReducers,
    constructorState: constructorReducers,
    submitAnOrderState: submitAnOrderReducers,
    authState: authReducers,
    socketFeed: socketFeedReducers
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger).concat(thunk),
    devTools: process.env.NODE_ENV !== 'production',
})
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
