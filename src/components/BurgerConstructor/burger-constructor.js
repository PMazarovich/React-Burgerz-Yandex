import React from 'react';
import {Button, ConstructorElement, CurrencyIcon, DragIcon} from "@ya.praktikum/react-developer-burger-ui-components";
import dataStub from "../../utils/data";
import constructorStyles from './burger-constructor.module.css'
import PropTypes from "prop-types";


function ScrollComponent(props) {
    const {distanceFromBottom = 200} = props
    function calculateHeight(distanceFromBottom) {
        // get the height of the screen
        // set the desired distance from the bottom
        // calculate the max scrollable height
        return window.innerHeight - distanceFromBottom
    }
    return (
        <div style={{maxHeight: calculateHeight(distanceFromBottom), overflow: "auto", width: "fit-content"}}
             className={`custom-scroll`}>
            {props.children}
        </div>
    )

}
ScrollComponent.propTypes = {
    distanceFromBottom: PropTypes.number
}

function ConstructorElementWrapper(props) { /*this adds DragIcon in the left of ConstructorElement*/
    return (
        <div className={constructorStyles.wrapper}>
            <div style={{display: "flex", alignItems: "center", marginRight:"15px"}}>
                <DragIcon type="primary"/>
            </div>
            {props.children}
        </div>
    )
}

function BurgerConstructor(props) {

    return (
        <div className={constructorStyles.main}>
            <ConstructorElement
                type="top"
                isLocked={true}
                text="Краторная булка N-200i (верх)"
                price={200}
                thumbnail={'https://code.s3.yandex.net/react/code/bun-02.png'}
            />
            <ScrollComponent distanceFromBottom={400}>
                {dataStub.map((x, index) =>
                    <ConstructorElementWrapper key={index}>
                        <ConstructorElement text={x.name} thumbnail={x.image} price={x.price}/>
                    </ConstructorElementWrapper>)}
            </ScrollComponent>
            <ConstructorElement
                type="bottom"
                isLocked={true}
                text="Краторная булка N-200i (низ)"
                price={200}
                thumbnail={'https://code.s3.yandex.net/react/code/bun-02.png'}
            />
            <div style={{display:"flex", flexDirection:"row", marginTop:"15px"}}>
                <div style={{display:"flex", alignItems:"center", marginRight: "20px"}}>
                    <span style={{marginRight: "10px"}} className={"text_type_main-large"}>{12345}</span>
                    <CurrencyIcon type="primary"/>
                </div>
                <Button htmlType="button" type="primary" size="large">
                    Оформить заказ
                </Button>
            </div>
        </div>
    )
}

export default BurgerConstructor
