import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {getIngredients} from "../../utils/burger-api";
import ingredientPageStyles from './ingredient-page.module.css'
import {IIngredient} from "../../utils/Interfaces";
import {useAppDispatch} from "../../utils/hooks";

function TextDetailsContainer({name, value}: {name: string, value: string | number}) {
    return (
        <div className={ingredientPageStyles.textDetails}>
            <span className={"text_type_main-medium text_color_inactive"}>{name}</span>
            <span className={"text_type_main-medium text_color_inactive"}>{value}</span>
        </div>
    )
}


function IngredientPage() {
    // ingredient page will anyway fetch data from backend and render an exact ingredient by the id. This is not optimal.
    // better check if there is already ingredients in store and if they are, get data from there. If not - fetch from backend.
    const { ingredientId } = useParams(); // Access the ingredientId parameter from the URL
    const [ingredient, setIngredient] = useState<IIngredient | null>(null)
    const [fetching, setFetching] = useState<boolean>(true)
    // check if the model was opened. If it was, redirect to '/'
    /*useEffect(() => {
        const ingredientId: string | null = localStorage.getItem('portalOpen');
        if (ingredientId != null) {
            navigate('/')
        }
    }, [])*/
    React.useEffect(() => {
        setFetching(true)
        getIngredients().then((ingredients: Array<IIngredient>) => {
            // console.log(ingredients)
            // const temp = ingredients.filter(x => x._id === ingredientId)[0]
            //console.log(ingredients.filter(x => x._id === ingredientId)[0])
            setIngredient(ingredients.filter(x => x._id === ingredientId)[0])
            setFetching(false)
        }).catch((err) => {
            setFetching(false)
            console.error(err)
        })

    }, [])

    if (fetching) {
        return (
            <span style={{top: '50%', left: '50%', position: 'absolute', transform: 'translate(-50%,-50%)'}} className={ingredientPageStyles.loader}></span>)
    } else {
        return (<div className={ingredientPageStyles.centerColumn}>
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
