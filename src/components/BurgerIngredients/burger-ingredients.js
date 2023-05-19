import React from 'react';
import {CurrencyIcon, Tab} from "@ya.praktikum/react-developer-burger-ui-components";
import burgerIngredientsStyles from './burger-ingredients.module.css'
import counterImage from '../../images/counterIcon.png'
import PropTypes from "prop-types";
import Modal from "../Modal/modal";
import IngredientDetails from "../IngredientDetails/ingredient-details";
import foodIngredientsPropTypes from "../../utils/prop-types";


function BurgerIngredients({dataFromServer}) {
    const [currentTab, setCurrentTab] = React.useState('one')


    /* Стараться всё, что можно делать в JS, а результаты уже рендерить в JSX */
    const buns = dataFromServer.filter((item) => item.type === 'bun')
    const mains = dataFromServer.filter((item) => item.type === 'main')
    const sauces = dataFromServer.filter((item) => item.type === 'sauce')


    function calculateHeight(distanceFromBottom = 200) {
        // get the height of the screen
        // set the desired distance from the bottom
        // calculate the max scrollable height
        return window.innerHeight - distanceFromBottom
    }
    calculateHeight.propTypes = {
        distanceFromBottom: PropTypes.number   /* this is optional */
    };


    function FoodSection(props) {
        const {sectionName} = props;
        return (
            <>
                <span className={`${burgerIngredientsStyles.marginTop50marginLeft30} text_type_main-medium`}>
                    {sectionName}
                </span>
                <div className={burgerIngredientsStyles.foodSectionParent}>
                    {props.children}
                </div>
            </>

        );
    }

    FoodSection.propTypes = {
        sectionName: PropTypes.string.isRequired
    };


    function FoodCounter(props) { /* this component should be placed inside relative component!*/
        const {count} = props;
        return (
            /* будем скрывать счетчик если количество 0*/
            <div hidden={count <= 0} className={burgerIngredientsStyles.absoluteTop0Right0}> {/* tiny image and text*/}
                <img
                    src={counterImage}
                    alt="Second image"
                    className={burgerIngredientsStyles.absoluteTop0Right30mw40mh40}
                />
                <span
                    className={burgerIngredientsStyles.counterNumber}>{count}</span>
            </div>
        )
    }

    FoodCounter.propTypes = {
        count: PropTypes.number.isRequired
    }

    /*картинка + описание + счетчик + вызов портала с описанием на правый клик*/
    function FoodContainer({imgSrc, imgAlt, name, price, proteins, fat, carbohydrates, calories}) {
        const [count, setCount] = React.useState(0)
        const [detailsShowed, setDetailsShowed] = React.useState(false)

        function switchDetailsShowed() {
            setDetailsShowed(!detailsShowed)
        }

        function handleRightClick(e) { /* remove an item todo changed right click. Now it will open an overlay with details */
            setCount(count + 1)/* open model overlay with details */
            e.preventDefault() /* так отменяем открытие обычного окна при правом клике */
        }

        return (

            <>
                <div onClick={() => {
                    switchDetailsShowed()
                }} onContextMenu={handleRightClick} className={burgerIngredientsStyles.foodContainerParent}>
                    <div
                        className={burgerIngredientsStyles.relative}>{/*parent should be relative so child can be absolute relatively to parent */}
                        {/*In this div we will place the main image AND a counter image with counter inside*/}
                        <img className={'p-3'} src={imgSrc} alt={imgAlt}/> {/*main image*/}
                        <FoodCounter count={count}/>
                    </div>
                    <div className={burgerIngredientsStyles.flexCenter}>
                        <span className={`${burgerIngredientsStyles.marginRight10} text_type_main-default`}>{price}</span>
                        <CurrencyIcon type="primary"/>
                    </div>
                    <span className={"text_type_main-default"}>{name}</span>
                </div>
                {detailsShowed &&
                    <Modal onCloseFunction={switchDetailsShowed} headerText={"Ingredient details:"}>
                        <IngredientDetails calories={calories} name={name} imgAlt={imgAlt} imgSrc={imgSrc}
                                           proteins={proteins} carbohydrates={carbohydrates} fat={fat}/>
                    </Modal>}
            </>


        );
    }

    FoodContainer.propTypes = foodIngredientsPropTypes

    return (
        /* Создадим контейнер, где все дети будут расположены по центру в колонку и выравнены по левую сторону*/
        <div className={burgerIngredientsStyles.centerColumnLeft}>
            <span className={"text_type_main-medium"}>Соберите бургер</span>
            {/* Создадим контейнер, где все дети будут расположены по центру в колонку и выравнены по центру*/}
            <div className={burgerIngredientsStyles.centerColumnCenter}>
                {/*Этот компонент будет использовать класс, который выравнивает компонент по центру в строке*/}
                <div className={burgerIngredientsStyles.tabClass}>
                    <Tab value="one" active={currentTab === 'one'} onClick={setCurrentTab}>
                        Булки
                    </Tab>
                    <Tab value="three" active={currentTab === 'three'} onClick={setCurrentTab}>
                        Начинки
                    </Tab>
                    <Tab value="two" active={currentTab === 'two'} onClick={setCurrentTab}>
                        Соусы
                    </Tab>
                </div>
                {/*Это очередной компонент столбца. Он должен быть шириной 640, т.к. это ширина компонента Tab
              Длина компонента зависит от длины экрана пользователя и будет - 200px от bottom
              Используем стиль, который ограничит ширину и высоту, добавит скроллбар помимо custom-scroll,
              т.к. нужно расположить child элементы соответствующим образом
            */}
                <div style={{maxHeight: calculateHeight(250), maxWidth: "600px", overflow: "auto"}}
                     className={`custom-scroll`}>
                    {/* syling of all "in-scroll" component */}
                    <div className={burgerIngredientsStyles.inTabStyle}>
                        <FoodSection sectionName="Булки">
                            {buns.map(x => <FoodContainer key={x._id} name={x.name}
                                                          imgAlt={x.name}
                                                          imgSrc={x.image}
                                                          price={x.price}
                                                          calories={x.calories}
                                                          fat={x.fat}
                                                          carbohydrates={x.carbohydrates}
                                                          proteins={x.proteins}/>)}
                        </FoodSection>
                        <FoodSection sectionName="Начинки">
                            {mains.map(x => <FoodContainer key={x._id} name={x.name}
                                                           imgAlt={x.name}
                                                           imgSrc={x.image}
                                                           price={x.price}
                                                           calories={x.calories}
                                                           fat={x.fat}
                                                           carbohydrates={x.carbohydrates}
                                                           proteins={x.proteins}/>)}
                        </FoodSection>
                        <FoodSection sectionName="Соусы">
                            {sauces.map(x => {
                                return (<FoodContainer key={x._id}
                                                       name={x.name}
                                                       imgAlt={x.name}
                                                       imgSrc={x.image}
                                                       price={x.price}
                                                       calories={x.calories}
                                                       fat={x.fat}
                                                       carbohydrates={x.carbohydrates}
                                                       proteins={x.proteins}/>)
                            })}
                        </FoodSection>
                    </div>
                </div>
            </div>
        </div>
    );
}

BurgerIngredients.propTypes = {
    dataFromServer: PropTypes.any
}

export default BurgerIngredients;
