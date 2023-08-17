import React from 'react';
import PropTypes from "prop-types";
import ingredientDetailsStyles from './ingredient-details.module.css'
import {foodIngredientsPropTypes} from '../../utils/prop-types'

function TextDetailsContainer({name, value}){
    return(
        <div className={ingredientDetailsStyles.textDetails}>
            <span className={"text_type_main-medium text_color_inactive"}>{name}</span>
            <span className={"text_type_main-medium text_color_inactive"}>{value}</span>
        </div>
    )
}
TextDetailsContainer.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
}

function IngredientDetailsModal({imgSrc, imgAlt, name, proteins, fat, carbohydrates, calories}) {
    return (
        <div className={ingredientDetailsStyles.centerColumn}>
            <div
                className={ingredientDetailsStyles.relative}>{/* parent should be relative so child can be absolute relatively to parent */}
                {/*In this div we will place the main image AND a counter image with counter inside*/}
                <img className={ingredientDetailsStyles.width500height250} src={imgSrc} alt={imgAlt}/> {/*main image*/}
            </div>
            <span className={`${ingredientDetailsStyles.marginBottom30} text_type_main-medium`}>{name}</span>
            <div className={ingredientDetailsStyles.bottomTextConteiner}>
                <TextDetailsContainer name={"Калории,ккал"} value={calories}/>
                <TextDetailsContainer name={"Белки, г"} value={proteins}/>
                <TextDetailsContainer name={"Жиры, г"} value={fat}/>
                <TextDetailsContainer name={"Углеводы, г"} value={carbohydrates}/>
            </div>
        </div>

    );
}
IngredientDetailsModal.propTypes = foodIngredientsPropTypes

export default IngredientDetailsModal;
