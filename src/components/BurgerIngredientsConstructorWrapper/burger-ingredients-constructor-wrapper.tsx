import React, {useState} from 'react';
import BurgerIngredients from "../BurgerIngredients/burger-ingredients";
import BurgerConstructor from "../BurgerConstructor/burger-constructor";
import bcwStyles from './burger-ingredients-constructor-wrapper.module.css'
import {useDispatch, useSelector} from "react-redux";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {ingredientsActions} from "../../store/reducers/IngredientsListSlice";
import {getIngredients} from "../../utils/burger-api";
import {IIngredient} from "../../utils/Interfaces";

// todo why it fetch ingredients every time we go to this page?
function BurgerIngredientsConstructorWrapper() { /* this component just adds a pretty message if there is no data from server */
    const { ingredients } = useSelector((state: any) => ({
        ingredients: state.ingredientsState.ingredients,
    }));
    const [fetching, setFetching] = useState<boolean>(true)
    const [error, setError] = useState<boolean>(false)
    const dispatch = useDispatch()
    /* Тащим данные с сервера 1 единственный раз*/
    React.useEffect(() => {
        getIngredients().then((ingredients: Array<IIngredient>) => {
            dispatch(ingredientsActions.ingredientsFetchingSuccess({ingredients: ingredients}))
            setFetching(false)
            setError(false)
        }).catch((err) => {
            dispatch(ingredientsActions.ingredientsFetchingFailure(err))
            setFetching(false)
            setError(true)
            console.error(err)
        })
    }, [dispatch])
    const [ingredientDragging, setIngredientDragging] = useState<boolean>(false) // состояние dragging вынесено сюда, т.к. для redux это избыточная информация
    if (fetching && !error) {
        return <div>Fetching data...</div>
    } else if (!fetching && !error) {
        return (
            <DndProvider backend={HTML5Backend}>
                <div className={bcwStyles.twoRowedElements}>
                    <BurgerIngredients setIngredientDragging={setIngredientDragging}/>
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
