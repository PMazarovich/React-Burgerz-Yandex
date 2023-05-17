import React from 'react';
import PropTypes from "prop-types";

function TextDetailsContainer({name, value}){
    return(
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", marginLeft:"30px"}}>
            <span className={"text_type_main-medium text_color_inactive"}>{name}</span>
            <span className={"text_type_main-medium text_color_inactive"}>{value}</span>
        </div>
    )
}
TextDetailsContainer.propTypes = {
    name: PropTypes.string,
    value: PropTypes.any,
}

function IngredientDetails({imgSrc, imgAlt, name, proteins, fat, carbohydrates, calories}) {
    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <div
                style={{position: "relative"}}>{/* parent should be relative so child can be absolute relatively to parent */}
                {/*In this div we will place the main image AND a counter image with counter inside*/}
                <img style={{width:"500px", height:"250px"}} src={imgSrc} alt={imgAlt}/> {/*main image*/}
            </div>
            <span style={{marginBottom: "30px"}} className={"text_type_main-medium"}>{name}</span>
            <div style={{display: "flex", flexDirection: "row", alignItems: "center", width:"700px", marginBottom:"50px"}}>
                <TextDetailsContainer name={"Калории,ккал"} value={calories}/>
                <TextDetailsContainer name={"Белки, г"} value={proteins}/>
                <TextDetailsContainer name={"Жиры, г"} value={fat}/>
                <TextDetailsContainer name={"Углеводы, г"} value={carbohydrates}/>
            </div>



        </div>

    );
}
IngredientDetails.propTypes = {
    imgSrc: PropTypes.string,
    imgAlt: PropTypes.string,
    name: PropTypes.string,
    proteins: PropTypes.number,
    fat: PropTypes.number,
    carbohydrates: PropTypes.number,
    calories: PropTypes.number
}

export default IngredientDetails;
