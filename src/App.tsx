import React from 'react';
import './App.css';
import Header from "./components/AppHeader/header";
import BurgerIngredients from "./components/BurgerIngredients/burger-ingredients";
import BurgerConstructor from "./components/BurgerConstructor/burger-constructor";

function App() {

    return (
        <>
            <Header></Header>
            <div style={{display: "flex", flexDirection:"row", justifyContent:"space-evenly", alignItems: "flex-start"}}>
                <BurgerIngredients/>
                <BurgerConstructor/>
            </div>
        </>
    );
}

export default App;
