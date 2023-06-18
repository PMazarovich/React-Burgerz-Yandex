import React, {useState} from 'react';
import './App.css';
import Header from "./components/AppHeader/header";
import {getIngredients} from './utils/burger-api';
import BurgerIngredientsConstructorWrapper
    from "./components/BurgerIngredientsConstructorWrapper/burger-ingredients-constructor-wrapper";
import {useDispatch} from "react-redux";
import {ingredientsActions} from "./store/reducers/IngredientsListSlice";

function App() {
    const dispatch = useDispatch()
    /* Тащим данные с сервера 1 единственный раз*/
    React.useEffect(() => {
        dispatch(ingredientsActions.ingredientsFetching())
        getIngredients().then((ingredients) => {
            dispatch(ingredientsActions.ingredientsFetchingSuccess({ingredients: ingredients}))
        }).catch((err) => {
            dispatch(ingredientsActions.ingredientsFetchingFailure(err))
            console.error(err)
        })
    }, [])


    return (
        <>
            <Header/>
            <BurgerIngredientsConstructorWrapper/>
        </>
    );
}

export default App;
