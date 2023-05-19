import PropTypes from "prop-types";

const foodIngredientsPropTypes = {
    price: PropTypes.number,        /* this is optional */
    imgSrc: PropTypes.string.isRequired,
    imgAlt: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    proteins: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    carbohydrates: PropTypes.number.isRequired,
    calories: PropTypes.number.isRequired
}

export default  foodIngredientsPropTypes
