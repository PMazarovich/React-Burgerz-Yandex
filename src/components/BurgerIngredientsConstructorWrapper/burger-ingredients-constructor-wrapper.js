import React, {useEffect} from 'react';
import BurgerIngredients from "../BurgerIngredients/burger-ingredients";
import BurgerConstructor from "../BurgerConstructor/burger-constructor";
import bcwStyles from './burger-ingredients-constructor-wrapper.module.css'
import {dataFromServerPropTypes} from "../../utils/prop-types";
import {BurgerConstructorContext} from '../../utils/burger-constructor-context';
import {CommonDataFromServerContext} from "../../utils/common-data-from-server-context";

function BurgerIngredientsConstructorWrapper({dataFromServer}) { /* this component just adds a pretty message if there is no data from server */
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

    const [dataFromServerState, setDataFromServerState] = React.useState(null)
    const burgerConstructorReducedState = React.useReducer(burgerConstructorReducer, {currentIngredients: [], summ: 0})
    const dispatchBurgerConstructorState = burgerConstructorReducedState[1] // Сделано так, чтобы потом можно было передать 1 аргумент типа [] burgerConstructorReducedState
    // в BurgerConstructorContext.Provider

    useEffect(() => {
        if (dataFromServer != null) {
            // todo remove this in the future. this is a stub. Approximately this approach will be used in BurgerIngredients
            dispatchBurgerConstructorState({type: "emptyIngredients"});
            setDataFromServerState(dataFromServer)
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


    if (dataFromServerState !== null) {
        return (
            <>
                <div className={bcwStyles.twoRowedElements}>
                    <BurgerConstructorContext.Provider value={burgerConstructorReducedState}> {/* this may be used in BurgerIngredients and in BurgerConstructor */}
                        <CommonDataFromServerContext.Provider value={dataFromServerState}> {/*This is a STATE. We will not be able to modify it in underlying components*/}
                            <BurgerIngredients/>
                        </CommonDataFromServerContext.Provider>
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

export default BurgerIngredientsConstructorWrapper
