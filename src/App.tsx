import React, {useEffect, useState} from 'react';
import './App.css';
import Header from "./components/AppHeader/header";
import BurgerIngredients from "./components/BurgerIngredients/burger-ingredients";
import BurgerConstructor from "./components/BurgerConstructor/burger-constructor";
import ModalOverlay from "./components/ModalOverlay/modal-overlay";
import Modal from "./components/Modal/modal";


// @ts-ignore
function BurgerIngredientsConstructorWrapper({dataFromServer}) { /* this component just adds pretty message if there is no data from server */
    if (dataFromServer != null) {
        return (
            <>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignItems: "flex-start"
                }}>
                    <BurgerIngredients dataFromServer={dataFromServer}/>
                    <BurgerConstructor dataFromServer={dataFromServer}/>
                </div>
            </>
        )
    } else {
        return (
            <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <div>Sorry, can't fetch data from server. See console for details</div>
            </div>
        )
    }
}


function App() {
    let dataUrl = "https://norma.nomoreparties.space/api/ingredients"
    const [dataFromServer, setdataFromServer] = useState(null);

    /* Тащим данные с сервера 1 единственный раз*/
    React.useEffect(() => {
        fetch(dataUrl)
            .then(resp => resp.json())
            .then(js => {
                setdataFromServer(js.data)
            })
            .catch(err => console.log(err))
    }, [])


    return (
        <>
            <Header/>
            <BurgerIngredientsConstructorWrapper dataFromServer={dataFromServer}/>
        </>
    );
}

export default App;
