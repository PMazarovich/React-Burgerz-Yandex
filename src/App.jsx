import React, {useEffect, useState} from 'react';
import './App.css';
import Header from "./components/AppHeader/header";
import BurgerIngredients from "./components/BurgerIngredients/burger-ingredients";
import BurgerConstructor from "./components/BurgerConstructor/burger-constructor";
import {getIngredients} from './utils/burger-api';
import appStyles from './app.module.css'
import {dataFromServerPropTypes} from "./utils/prop-types";
import {BurgerConstructorContext} from './utils/burger-constructor-context';

function BurgerIngredientsConstructorWrapper({dataFromServer}) { /* this component just adds pretty message if there is no data from server */
    function burgerConstructorReducer(burgerConstructorState, action) {
        switch (action.type) {
            case "addIngredient": {
                // add a price and an ingredient to the list of ingredients
                const summ = burgerConstructorState.summ + action.ingredient.price;
                const newIngredients = [...burgerConstructorState.currentIngredients, action.ingredient];
                return {
                    currentIngredients: newIngredients,
                    summ: summ
                };
            }
            case "removeIngredient": {
                // remove an ingredient and a price
                const summ = burgerConstructorState.summ - action.ingredient.price;
                const newIngredients = burgerConstructorState.currentIngredients.filter(item => item !== action.ingredient);
                return {
                    currentIngredients: newIngredients,
                    summ: summ
                };
            }
            case "emptyIngredients":
                return {currentIngredients: [], summ: 0};
            default:
                throw new Error(`Wrong type of action: ${action.type}`);
        }
    }


    const burgerConstructorReducedState = React.useReducer(burgerConstructorReducer, {currentIngredients: [], summ: 0})
    const dispatchBurgerConstructorState = burgerConstructorReducedState[1] // Сделано так, чтобы потом можно было передать 1 аргумент типа [] burgerConstructorReducedState
    // в BurgerConstructorContext.Provider

    useEffect(() => {
        if (dataFromServer != null) {
            // todo remove this in the future. this is a stub. Approximately this approach will be used in BurgerIngredients
            dispatchBurgerConstructorState({ type: "emptyIngredients" });
            /* add 5 regular ingredients */
            dataFromServer.slice(0, 5).forEach(x => dispatchBurgerConstructorState({
                type: "addIngredient",
                ingredient: x
            }));
            dispatchBurgerConstructorState({ /* add another bun  todo remove this in the future. this must be handled when choosing ingredients*/
                type: "addIngredient",
                ingredient: {
                    "_id": "643d69a5c3f7b9001cfa093c",
                    "name": "Краторная булка N-200i",
                    "type": "bun",
                    "proteins": 80,
                    "fat": 24,
                    "carbohydrates": 53,
                    "calories": 420,
                    "price": 1255,
                    "image": "https://code.s3.yandex.net/react/code/bun-02.png",
                    "image_mobile": "https://code.s3.yandex.net/react/code/bun-02-mobile.png",
                    "image_large": "https://code.s3.yandex.net/react/code/bun-02-large.png",
                    "__v": 0
                }
            });
        }
    }, [dataFromServer]); /* посылаем сообщение в reducer ТОЛЬКО при изменении dataFromServer */


    if (dataFromServer !== null) {
        return (
            <>
                <div className={appStyles.twoRowedElements}>

                    <BurgerConstructorContext.Provider value={burgerConstructorReducedState}>
                        <BurgerIngredients dataFromServer={dataFromServer}/>
                        <BurgerConstructor/>
                    </BurgerConstructorContext.Provider>

                </div>
            </>
        )
    } else {
        return (
            <div>Sorry, can't fetch data from server. See console for details</div>
        )
    }
}

BurgerIngredientsConstructorWrapper.propTypes = dataFromServerPropTypes


function App() {
    const [dataFromServer, setdataFromServer] = useState(null);
    /* Тащим данные с сервера 1 единственный раз*/
    React.useEffect(() => {
        getIngredients().then((ingredients) => setdataFromServer(ingredients)).catch((err) => {
            console.error(err)
        })
    }, [])


    return (
        <>
            <Header/>
            <BurgerIngredientsConstructorWrapper dataFromServer={dataFromServer}/>
        </>
    );
}

export default App;
