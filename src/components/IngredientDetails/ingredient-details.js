import React from 'react';
import PropTypes from "prop-types";
import ingredientDetailsStyles from './ingredient-details.module.css'

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

function IngredientDetails({imgSrc, imgAlt, name, proteins, fat, carbohydrates, calories}) {
    return (
        <div className={ingredientDetailsStyles.centerColumn}>
            <div
                style={{position: "relative"}}>{/* parent should be relative so child can be absolute relatively to parent */}
                {/*In this div we will place the main image AND a counter image with counter inside*/}
                <img style={{width:"500px", height:"250px"}} src={imgSrc} alt={imgAlt}/> {/*main image*/}
            </div>
            <span style={{marginBottom: "30px"}} className={"text_type_main-medium"}>{name}</span>
            <div className={ingredientDetailsStyles.bottomTextConteiner}>
                <TextDetailsContainer name={"Калории,ккал"} value={calories}/>
                <TextDetailsContainer name={"Белки, г"} value={proteins}/>
                <TextDetailsContainer name={"Жиры, г"} value={fat}/>
                <TextDetailsContainer name={"Углеводы, г"} value={carbohydrates}/>
            </div>
        </div>

    );
}
IngredientDetails.propTypes = {
    imgSrc: PropTypes.string.isRequired,
    imgAlt: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    proteins: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    carbohydrates: PropTypes.number.isRequired,
    calories: PropTypes.number.isRequired
}

export default IngredientDetails;
