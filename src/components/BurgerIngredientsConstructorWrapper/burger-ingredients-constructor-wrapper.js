import React, {useState} from 'react';
import BurgerIngredients from "../BurgerIngredients/burger-ingredients";
import BurgerConstructor from "../BurgerConstructor/burger-constructor";
import bcwStyles from './burger-ingredients-constructor-wrapper.module.css'
import {useSelector} from "react-redux";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";

function BurgerIngredientsConstructorWrapper() { /* this component just adds a pretty message if there is no data from server */
    const {fetching, error, ingredients} = useSelector(state => ({
        ingredients: state.ingredientsState.ingredients,
        fetching: state.ingredientsState.ingredientsFetching,
        error: state.ingredientsState.error,
    }));
    const [ingredientDragging, setIngredientDragging] = useState(false) // состояние dragging вынесено сюда, т.к. для redux это избыточная информация
    if (fetching) {
        console.log("fetching....")
        return <div>Fetching data...</div>
    } else if (!fetching && ingredients !== []) {
        return (
            // <div>MAIN</div>
            <DndProvider backend={HTML5Backend}>
                <div className={bcwStyles.twoRowedElements}>
                    <BurgerIngredients ingredientDragging={ingredientDragging} setIngredientDragging={setIngredientDragging}/>
                    <BurgerConstructor ingredientDragging={ingredientDragging} setIngredientDragging={setIngredientDragging}/>
                </div>
            </DndProvider>
        )
    } else {
        return (
            <div>Sorry, can't fetch data from server. See console for details</div>
        )
    }
}

export default BurgerIngredientsConstructorWrapper
