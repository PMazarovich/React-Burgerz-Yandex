import React, {useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from "../AppHeader/header";
import {getIngredients} from '../../utils/burger-api';
import BurgerIngredientsConstructorWrapper
    from "../BurgerIngredientsConstructorWrapper/burger-ingredients-constructor-wrapper";
import {useDispatch} from "react-redux";
import {ingredientsActions} from "../../store/reducers/IngredientsListSlice";
import Login from "../Login/login";
import Registration from "../Registration/registration";
import ForgotPassword from "../ForgotPassword/forgot-password";
import ResetPassword from "../ResetPassword/reset-password";
import Profile from "../Profile/profile";
import ProfileWrapper from "../Profile/profile-wrapper";
import OrderHistory from "../Profile/order-history";
import StubComponent from "../StubComponent/stub";
import {ProtectedRouteElement} from "../ProtectedRoute/protected-route";
import IngredientPage from "../IngredientPage/ingredient-page";

function App() {
    return (
        <>
            <Router>
                <Header/> {/* place header here as we use navLink inside and they require to be inside <Router> */}
                <Routes>
                    <Route path="/login" element={<Login />}/>   {/* по пути /login лежит страница LoginPage */}
                    {/*<Route path="/list" element={<ListPage />} />*/}
                    <Route path="/register" element={<Registration />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/profile" element={<ProtectedRouteElement><ProfileWrapper /></ProtectedRouteElement>}> {/* В этом компоненте присутствует <Outlet>. Outlet будет рисовать вместо себя вложенные пути */}
                        <Route index element={<Profile />} /> {/* index - default Route inside relative routes */}
                        <Route path="/profile/orders" element={<OrderHistory />} />
                       {/* <Route path="/profile/changeProfile" element={<Tablet />} />
                           <Route path="/profile/someOtherProfile" element={<Tablet />} />
                       */}
                    </Route>
                    <Route path="/ingredients/">
                        <Route path=":ingredientId" element={<IngredientPage />} />
                    </Route>
                    <Route path="/ordersLine" element={<ProtectedRouteElement><StubComponent/></ProtectedRouteElement>}/>
                    <Route path="/logout" element={<Login />}/>
                    <Route path="/constructor" element={<BurgerIngredientsConstructorWrapper />}/>
                    <Route path="/" element={<ProtectedRouteElement><BurgerIngredientsConstructorWrapper /></ProtectedRouteElement>}/>

                </Routes>
            </Router>
        </>
    );
}

export default App;
