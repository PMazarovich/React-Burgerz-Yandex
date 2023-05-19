import React, {useState} from 'react';
import './App.css';
import Header from "./components/AppHeader/header";
import BurgerIngredients from "./components/BurgerIngredients/burger-ingredients";
import BurgerConstructor from "./components/BurgerConstructor/burger-constructor";
import getIngredients from './utils/burger-api';
import appStyles from './app.module.css'
import {dataFromServerPropTypes} from "./utils/prop-types";

function BurgerIngredientsConstructorWrapper({dataFromServer}) { /* this component just adds pretty message if there is no data from server */
    if (dataFromServer != null) {
        return (
            <>
                <div className={appStyles.twoRowedElements}>
                    <BurgerIngredients dataFromServer={dataFromServer}/>
                    <BurgerConstructor dataFromServer={dataFromServer}/>
                </div>
            </>
        )
    } else {
        return (
            <div>Sorry, can't fetch data from server. See console for details</div>
        )
    }
}

BurgerIngredientsConstructorWrapper.propTypes = dataFromServerPropTypes


function App() {
    const [dataFromServer, setdataFromServer] = useState(null);
    /* Тащим данные с сервера 1 единственный раз*/
    React.useEffect(() => {
        getIngredients().then((ingredients) => setdataFromServer(ingredients)).catch((err) => {
            console.error(err)
        })
    }, [])


    return (
        <>
            <Header/>
            <BurgerIngredientsConstructorWrapper dataFromServer={dataFromServer}/>
        </>
    );
}

export default App;
