import React, {useEffect, useRef} from 'react';
import {CurrencyIcon, Tab} from "@ya.praktikum/react-developer-burger-ui-components";
import burgerIngredientsStyles from './burger-ingredients.module.css'
import counterImage from '../../images/counterIcon.png'
import PropTypes from "prop-types";
import Modal from "../Modal/modal";
import IngredientDetails from "../IngredientDetails/ingredient-details";
import {foodIngredientsPropTypes} from "../../utils/prop-types";
import {useDispatch, useSelector} from "react-redux";
import {useDrag} from "react-dnd";
import {constructorActions} from "../../store/reducers/BurgerConstructorSlice";


function BurgerIngredients() {
    const [currentTab, setCurrentTab] = React.useState('one')
    // if there will be more tabs, then we'll think how to create a generic code
    const tabsRef = useRef(null);
    const bunsRef = useRef(null);
    const saucesRef = useRef(null);
    const fillingsRef = useRef(null);

    function handleScroll() {
        // here we will get the coordinates of the tab and will calculate the distance from each <FoodSection> component.
        // After we will activate less distance tab. So if the minimum distance is for buns, activate "buns" tab etc
        let tabsCoords = Math.abs(tabsRef.current.getBoundingClientRect().y)
        let coordinates = { // calculate a difference
            "buns": Math.abs(bunsRef.current.getBoundingClientRect().y) - tabsCoords,
            "fillings": Math.abs(fillingsRef.current.getBoundingClientRect().y) - tabsCoords,
            "sauces": Math.abs(saucesRef.current.getBoundingClientRect().y) - tabsCoords
        }
        // Convert object to array of key-value pairs
        let coordinatesArray = Object.entries(coordinates);
        // Sort the array based on values in descending order
        coordinatesArray.sort((a, b) => a[1] - b[1]);
        // Activate needed tab
        setCurrentTab(coordinatesArray[0][0])
    }

    //const burgerConstructorState = useContext(CommonDataFromServerContext); // тащим burgerConstructorState из контекста
    const {ingredients, currentIngredientsIds} = useSelector(store => ({
        ingredients: store.ingredientsState.ingredients,
        currentIngredientsIds: store.constructorState.ingredients
    }))
    /* Стараться всё, что можно делать в JS, а результаты уже рендерить в JSX */
    const buns = ingredients.filter((item) => item.type === 'bun')
    const mains = ingredients.filter((item) => item.type === 'main')
    const sauces = ingredients.filter((item) => item.type === 'sauce')


    function calculateHeight(distanceFromBottom = 200) {
        // get the height of the screen
        // set the desired distance from the bottom
        // calculate the max scrollable height
        return window.innerHeight - distanceFromBottom
    }

    calculateHeight.propTypes = {
        distanceFromBottom: PropTypes.number   /* this is optional */
    };

    //By using React.forwardRef(), you can receive the ref as a parameter in the functional component and then forward it to the desired DOM element
    const FoodSection = React.forwardRef(({sectionName, children}, ref) => {
        return (
            <>
                <span ref={ref} className={`${burgerIngredientsStyles.marginTop50marginLeft30} text_type_main-medium`}>
                  {sectionName}
                </span>
                <div className={burgerIngredientsStyles.foodSectionParent}>
                    {children}
                </div>
            </>
        );
    });

    FoodSection.propTypes = {
        sectionName: PropTypes.string.isRequired
    };


    function FoodCounter({ ingredientId }) { /* this component should be placed inside relative component!*/
        // соберем все совпадения из constructor для данного элемента
        let count = currentIngredientsIds.filter(currentIngredientsId => currentIngredientsId.ingredientId === ingredientId).length
        return (
            /* будем скрывать счетчик если количество 0*/
            <div hidden={count <= 0} className={burgerIngredientsStyles.absoluteTop0Right0}> {/* tiny image and text*/}
                <img
                    src={counterImage}
                    alt="Second"
                    className={burgerIngredientsStyles.absoluteTop0Right30mw40mh40}
                />
                <span
                    className={burgerIngredientsStyles.counterNumber}>{count}</span>
            </div>
        )
    }

    FoodCounter.propTypes = {
        ingredientId: PropTypes.string.isRequired
    }

    /*картинка + описание + счетчик + вызов портала с описанием на левый клик*/
    // Этот компонент перетаскиваемый
    function FoodContainer(props) {
        const {ingredientId, imgSrc, imgAlt, name, price, proteins, fat, carbohydrates, calories} = props
        const dispatch = useDispatch();
        // ВНИМАНИЕ! ВСЕГДА ПЕРЕДАВАТЬ В ПРИЕМНИК ПО DND ПО ВОЗМОЖНОСТИ ТОЛЬКО ID! ИНАЧЕ ПОВЫШАЕТСЯ СВЯЗАННОСТЬ КОМПОНЕНТОВ
        const [{isDrag}, dragRef] = useDrag({   //<- он возвращает {тут всякие возвращаемые объекты типа monitor.isDragging() и т.д.} и ref компонента, на который повешен этот хук
            type: "abstractIngredient",
            item: {
                ingredientId // Мы хотим передать в редюсер конструктора ТОЛЬКО id того элемента, который перетащили
            },
            end: () => dispatch(constructorActions.dragStopped()), // end fires when drag is over
            collect: monitor => ({
                isDrag: monitor.isDragging(),
            })
        });

        // Send a message to the reducer, that we began to drag an item
        useEffect(() => {
            if (isDrag) {
                dispatch(constructorActions.dragStarted())
            }
        }, [isDrag]);

        const [detailsShowed, setDetailsShowed] = React.useState(false)

        function switchDetailsShowed() {
            setDetailsShowed(!detailsShowed)
        }

        return (
            <>
                <div ref={dragRef}          // Реф из useDrag
                     onClick={() => {
                         switchDetailsShowed()
                     }} className={burgerIngredientsStyles.foodContainerParent}>
                    <div
                        className={burgerIngredientsStyles.relative}>{/*parent should be relative so child can be absolute relatively to parent */}
                        {/*In this div we will place the main image AND a counter image with counter inside*/}
                        <img className={'p-3'} src={imgSrc} alt={imgAlt}/> {/*main image*/}
                        <FoodCounter ingredientId={ingredientId}/>
                    </div>
                    <div className={burgerIngredientsStyles.flexCenter}>
                        <span
                            className={`${burgerIngredientsStyles.marginRight10} text_type_main-default`}>{price}</span>
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
                <div className={burgerIngredientsStyles.tabClass} ref={tabsRef}>
                    <Tab value="buns" active={currentTab === 'buns'} onClick={setCurrentTab}>
                        Булки
                    </Tab>
                    <Tab value="fillings" active={currentTab === 'fillings'} onClick={setCurrentTab}>
                        Начинки
                    </Tab>
                    <Tab value="sauces" active={currentTab === 'sauces'} onClick={setCurrentTab}>
                        Соусы
                    </Tab>
                </div>
                {/*Это очередной компонент столбца. Он должен быть шириной 640, т.к. это ширина компонента Tab
              Длина компонента зависит от длины экрана пользователя и будет - 200px от bottom
              Используем стиль, который ограничит ширину и высоту, добавит скроллбар помимо custom-scroll,
              т.к. нужно расположить child элементы соответствующим образом
            */}
                <div style={{maxHeight: calculateHeight(250), maxWidth: "600px", overflow: "auto"}}
                     className={`custom-scroll`} onScroll={handleScroll}>
                    {/* syling of all "in-scroll" component */}
                    <div className={burgerIngredientsStyles.inTabStyle}>
                        <FoodSection sectionName="Булки" ref={bunsRef}>
                            {buns.map((x) => <FoodContainer key={x._id}
                                                            ingredientId={x._id}
                                                            name={x.name}
                                                            imgAlt={x.name}
                                                            imgSrc={x.image}
                                                            price={x.price}
                                                            calories={x.calories}
                                                            fat={x.fat}
                                                            carbohydrates={x.carbohydrates}
                                                            proteins={x.proteins}/>)}
                        </FoodSection>
                        <FoodSection ref={fillingsRef} sectionName="Начинки">
                            {mains.map(x => <FoodContainer key={x._id}
                                                           ingredientId={x._id}
                                                           name={x.name}
                                                           imgAlt={x.name}
                                                           imgSrc={x.image}
                                                           price={x.price}
                                                           calories={x.calories}
                                                           fat={x.fat}
                                                           carbohydrates={x.carbohydrates}
                                                           proteins={x.proteins}/>)}
                        </FoodSection>
                        <FoodSection ref={saucesRef} sectionName="Соусы">
                            {sauces.map(x => {
                                return (<FoodContainer key={x._id}
                                                       ingredientId={x._id}
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

export default BurgerIngredients;
