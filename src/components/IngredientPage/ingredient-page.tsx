import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import ingredientPageStyles from './ingredient-page.module.css'
import {IIngredient} from "../../utils/Interfaces";
import {useAppDispatch, useAppSelector} from "../../utils/hooks";
import {store} from "../../store/store";

function TextDetailsContainer({name, value}: { name: string, value: string | number }) {
    return (
        <div className={ingredientPageStyles.textDetails}>
            <span className={"text_type_main-medium text_color_inactive"}>{name}</span>
            <span className={"text_type_main-medium text_color_inactive"}>{value}</span>
        </div>
    )
}


function IngredientPage() {
    const {ingredientId} = useParams(); // Access the ingredientId parameter from the URL
    const [ingredient, setIngredient] = useState<IIngredient | null>(null)
    const { ingredients, fetching } = useAppSelector((store) => ({
        ingredients: store.ingredientsState.ingredients,
        fetching: store.ingredientsState.ingredientsFetching
    }))

    React.useEffect(() => {
        if(!fetching){
            setIngredient(ingredients.filter(x => x._id === ingredientId)[0])
        }
    }, [fetching, ingredientId, ingredients])

    if (fetching) {
        return (
            <span className={ingredientPageStyles.loader}></span>)
    } else {
        return (<div className={ingredientPageStyles.centerColumn}>
            <span className={'text_type_main-medium text_color_inactive flex-display'}> Детали ингредиента: </span>
            {ingredient && <>
                <div
                    className={ingredientPageStyles.relative}>
                    <img className={ingredientPageStyles.width500height250} src={ingredient.image_large}/>
                </div>
                <span
                    className={`${ingredientPageStyles.marginBottom30} text_type_main-medium`}>{ingredient.name}</span>
                <div className={ingredientPageStyles.bottomTextConteiner}>
                    <TextDetailsContainer name={"Калории,ккал"} value={ingredient.calories}/>
                    <TextDetailsContainer name={"Белки, г"} value={ingredient.proteins}/>
                    <TextDetailsContainer name={"Жиры, г"} value={ingredient.fat}/>
                    <TextDetailsContainer name={"Углеводы, г"} value={ingredient.carbohydrates}/>
                </div>
            </>}

        </div>)
    }
}


export default IngredientPage;
