import PropTypes from "prop-types";

 export const foodIngredientsPropTypes = {
    price: PropTypes.number,        /* this is optional */
    imgSrc: PropTypes.string,
    imgAlt: PropTypes.string,
    name: PropTypes.string.isRequired,
    proteins: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    carbohydrates: PropTypes.number.isRequired,
    calories: PropTypes.number.isRequired
}

export const dataFromServerPropTypes = {
     dataFromServer: PropTypes.arrayOf(PropTypes.shape(foodIngredientsPropTypes))
}
