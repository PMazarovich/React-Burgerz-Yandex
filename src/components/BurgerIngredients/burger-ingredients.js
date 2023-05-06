import React from 'react';
import {CurrencyIcon, Tab} from "@ya.praktikum/react-developer-burger-ui-components";
import burgerConstructorStyles from './burger-ingredients.module.css'
import counterImage from '../../images/counterIcon.png'
import dataStub from "../../utils/data";


// Define a functional component called MyComponent
function BurgerIngredients(props) {
    const [currentTab, setCurrentTab] = React.useState('one')

    function calculateHeight(distanceFromBottom = 200) {
        // get the height of the screen
        // set the desired distance from the bottom
        // calculate the max scrollable height
        return window.innerHeight - distanceFromBottom
    }

    function FoodSection(props) {
        const {sectionName} = props;
        return (
            <>
                <span className={"text_type_main-medium"} style={{marginTop: "50px", marginLeft: "30px"}}>
                    {sectionName}
                </span>
                <div className={burgerConstructorStyles.foodSectionParent}>
                    {props.children}
                </div>
            </>

        );
    }

    function FoodCounter(props) { /* this component should be placed inside relative component!*/
        const {count} = props;
        return (
            /* будем скрывать счетчик если количество 0*/
            <div hidden={count <= 0} style={{position: 'absolute', top: '0', right: '0'}}> {/* tiny image and text*/}
                <img
                    src={counterImage}
                    alt="Second image"
                    style={{position: "absolute", top: 0, right: 30, maxWidth: "40px", maxHeight: "40px"}}
                />
                <span
                    style={{position: 'absolute', top: 9, right: 46, color: "black", fontWeight: "bold"}}>{count}</span>
            </div>
        )
    }

    /*картинка + описание + счетчик*/
    function FoodContainer(props) {
        const {imgSrc, imgAlt, name, price} = props;
        const [count, setCount] = React.useState(0)

        function handleRightClick(e) { /* remove an item */
            if (count > 0) {
                setCount(count - 1)
            }
            e.preventDefault() /* так отменяем открытие обычного окна при правом клике */
        }

        return (
            <div onClick={() => {
                setCount(count + 1)
            }} onContextMenu={handleRightClick} className={burgerConstructorStyles.foodContainerParent}>
                <div
                    style={{position: "relative"}}>{/*parent should be relative so child can be absolute relatively to parent */}
                    {/*In this div we will place the main image AND a counter image with counter inside*/}
                    <img className={'p-3'} src={imgSrc} alt={imgAlt}/> {/*main image*/}
                    <FoodCounter count={count}/>
                </div>
                <div style={{display: "flex", justifyContent: "center"}}>
                    <text style={{marginRight: "10px"}} className={"text_type_main-default"}>{price}</text>
                    <CurrencyIcon type="primary"/>
                </div>
                <span className={"text_type_main-default"}>{name}</span>
            </div>

        );
    }


    return (
        /* Создадим контейнер, где все дети будут расположены по центру в колонку*/
        <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
            <span className={"text_type_main-medium"}>Соберите бургер</span>
            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>

                {/*Этот компонент будет использовать класс, который выравнивает компонент по центру в строке*/}
                <div className={burgerConstructorStyles.tabClass}>
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
                <div style={{maxHeight: calculateHeight(200), maxWidth: "600px", overflow: "auto"}}
                     className={`custom-scroll`}>
                    {/* syling of all "in-scroll" component */}
                    <div className={burgerConstructorStyles.inTabStyle}>
                        <FoodSection sectionName="Булки">
                            {dataStub.filter(x => x.type === "bun").map(x => <FoodContainer key={x._id} name={x.name}
                                                                                            imgAlt={x.name}
                                                                                            imgSrc={x.image}
                                                                                            price={x.price}/>)}
                        </FoodSection>
                        <FoodSection sectionName="Начинки">
                            {dataStub.filter(x => x.type === "main").map(x => <FoodContainer key={x._id} name={x.name}
                                                                                             imgAlt={x.name}
                                                                                             imgSrc={x.image}
                                                                                             price={x.price}/>)}
                        </FoodSection>
                        <FoodSection sectionName="Соусы">
                            {dataStub.filter(x => x.type === "sauce").map(x => {
                                return (<FoodContainer key={x._id} name={x.name} imgAlt={x.name} imgSrc={x.image}
                                                       price={x.price}/>)
                            })}
                        </FoodSection>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BurgerIngredients;
