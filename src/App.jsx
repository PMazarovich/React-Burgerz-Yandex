import React, {useState} from 'react';
import './App.css';
import Header from "./components/AppHeader/header";
import {getIngredients} from './utils/burger-api';
import BurgerIngredientsConstructorWrapper
    from "./components/BurgerIngredientsConstructorWrapper/burger-ingredients-constructor-wrapper";

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
