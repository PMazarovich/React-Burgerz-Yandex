import React, {useEffect, useState} from 'react';
import {useDispatch} from "react-redux";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {getIngredients, logout} from "../../utils/burger-api";
import ingredientPageStyles from './ingredient-page.module.css'

function TextDetailsContainer({name, value}) {
    return (
        <div className={ingredientPageStyles.textDetails}>
            <span className={"text_type_main-medium text_color_inactive"}>{name}</span>
            <span className={"text_type_main-medium text_color_inactive"}>{value}</span>
        </div>
    )
}


function IngredientPage() {
    // todo это всё тащить из api {imgSrc, imgAlt, name, proteins, fat, carbohydrates, calories}
    const { ingredientId } = useParams(); // Access the ingredientId parameter from the URL
    const navigate = useNavigate()
    const [ingredient, setIngredient] = useState(null)
    const [fetching, setFetching] = useState(true)
    const dispatch = useDispatch()
    // check if the model was opened. If it was, redirect to '/'
    useEffect(() => {
        const ingredientId = localStorage.getItem('portalOpen');
        if (ingredientId != null) {
            navigate('/')
        }
    }, [])
    React.useEffect(() => {
        setFetching(true)
        console.log()
        getIngredients().then((ingredients) => {
            // console.log(ingredients)
            // const temp = ingredients.filter(x => x._id === ingredientId)[0]
            console.log(ingredients.filter(x => x._id === ingredientId)[0])
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
            <div
                className={ingredientPageStyles.relative}>
                <img className={ingredientPageStyles.width500height250} src={ingredient.image_large} alt={ingredient.imgAlt}/>
            </div>
            <span className={`${ingredientPageStyles.marginBottom30} text_type_main-medium`}>{ingredient.name}</span>
            <div className={ingredientPageStyles.bottomTextConteiner}>
                <TextDetailsContainer name={"Калории,ккал"} value={ingredient.calories}/>
                <TextDetailsContainer name={"Белки, г"} value={ingredient.proteins}/>
                <TextDetailsContainer name={"Жиры, г"} value={ingredient.fat}/>
                <TextDetailsContainer name={"Углеводы, г"} value={ingredient.carbohydrates}/>
            </div>
        </div>)
    }
}


export default IngredientPage;
