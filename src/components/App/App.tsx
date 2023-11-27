import React, {useEffect} from 'react';
import {Route, Routes, useLocation} from 'react-router-dom';
import './App.css';
import Header from "../AppHeader/header";
import BurgerIngredientsConstructorWrapper
    from "../BurgerIngredientsConstructorWrapper/burger-ingredients-constructor-wrapper";
import {Modal} from "../Modal/modal";
import Login from "../Login/login";
import Registration from "../Registration/registration";
import ForgotPassword from "../ForgotPassword/forgot-password";
import ResetPassword from "../ResetPassword/reset-password";
import Profile from "../Profile/profile";
import ProfileWrapper from "../Profile/profile-wrapper";
import OrderHistory from "../Profile/order-history";
import IngredientPage from "../IngredientPage/ingredient-page";
import {ProtectedRouteElement} from "../ProtectedRoute/protected-route";
import OrderLine from "../OrderFeed/order-line";
import OrderDetailsComponent from "../OrderDetails/order-details";
import {useAppDispatch, useAppSelector} from "../../utils/hooks";
import {store} from "../../store/store";
import {getIngredients} from "../../store/reducers/IngredientsListSlice";

function App() {
    const dispatch = useAppDispatch()
    // location.state сохраняется между перезагрузками и при переходах между страницами
    // useLocation - де-факто window.location со всеми props и тд
    const location = useLocation(); // получаем доступ к текущему location
    // те. может случиться так, что другая страница что-то записала в location и это что-то нужно здесь использовать
    //(если есть prevlocation - отрисовать модалку, если нет, то перейти в обыкновенный компонент)
    const prevLocation = location.state?.prevLocationObject; // это объект предыдущего location

    console.log("location", location)
    console.log("prevLocation", prevLocation)
    const {
        ingredients,
    } = useAppSelector((store) => ({
        ingredients: store.ingredientsState.ingredients
    }))
    // Может быть, это и неправильно, т.к. теоретически только компонент, требующий данные с сервера обязан запрашивать эти данные.
    // А не в корне потенциально ненужные запросы.
    useEffect(() => {
        // если ингредиентов нет - вызвать thunk, который заполнит store соответствующим образом
        if (ingredients.length === 0) {
            dispatch(getIngredients())
        }
    }, [dispatch, ingredients.length])

    return (
        <>
            <Header/> {/* place header here as we use navLink inside, and they require to be inside <Router> */}
            {/*
             роутер выбирает путь исходя из объекта location=someLocationObject
             если у нас в prevLocation не undefined, будет использоваться prevLocation и роуты внутри него. Если prevLocation нет - будет использоваться текущий location
             */}
            <Routes location={prevLocation || location}>
                <Route path="/" element={<BurgerIngredientsConstructorWrapper/>}/>
                <Route path="/login" element={<Login/>}/> {/* по пути /login лежит страница LoginPage */}
                <Route path="/register" element={<Registration/>}/>
                <Route path="/forgot-password" element={<ForgotPassword/>}/>
                <Route path="/reset-password" element={<ResetPassword/>}/>
                {/* это случай прямого попадания на маршрут */}
                <Route path="/profile/orders/:ordNumber" element={<ProtectedRouteElement><OrderDetailsComponent/></ProtectedRouteElement>}/>
                <Route path="/profile" element={<ProtectedRouteElement><ProfileWrapper/></ProtectedRouteElement>}> {/* В этом компоненте присутствует <Outlet>. Outlet будет рисовать вместо себя вложенные пути */}
                    <Route index element={<ProtectedRouteElement><Profile/></ProtectedRouteElement>}/>
                    <Route path="orders">
                        <Route index element={<OrderHistory/>}/>
                    </Route>
                </Route>
                <Route path="/feed/">
                    {/*url feed/43*/}
                    {/*location feed*/}
                    <Route index element={<OrderLine/>}/>
                    <Route path=":ordNumber" element={<OrderDetailsComponent/>}/>
                </Route>
                <Route path="/logout" element={<Login/>}/>
                <Route path="/constructor" element={<BurgerIngredientsConstructorWrapper/>}/>
                <Route path="ingredients/:ingredientId" element={<IngredientPage/>}/>
            </Routes>
            {
                prevLocation && (
                    /* тут Routes смотрит ТОЛЬКО В URL браузера, т.к. тут нет никаких <Routes location=someLocationObject> */
                    <Routes>
                        <Route path="ingredients/:ingredientId" element={
                            <Modal>
                                <IngredientPage/>
                            </Modal>
                        }
                        />
                        <Route path="/feed/:ordNumber" element={
                            <Modal>
                                <OrderDetailsComponent/>
                            </Modal>}
                        />
                        <Route path="profile/orders/:ordNumber" element={
                            <Modal>
                                <OrderDetailsComponent/>
                            </Modal>}
                        />
                    </Routes>
                )
            }
        </>
    );
}

/* описание работы modal:
* в компоненте orderCard происходит запись объекта пути /feed, т.е. текущего location в стейт.
* далее происходит перенаправление на url /feed/12345
* в app проверяем, есть лм что-то в state текущего Location? Да, там есть объект предыдущего location, в котором path - /feed
* Поэтому routes сначала пройдется по первым route и найдет /feed, отрисует его. Далее программа продолжит выполнение и условие prevLocation && ( будет удовлетворено
* и будет отрисован route /feed/:ordNumber
*
*  */

export default App;
