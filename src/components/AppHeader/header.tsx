import React from 'react';
import {BurgerIcon, ListIcon, Logo, ProfileIcon} from '@ya.praktikum/react-developer-burger-ui-components'
import headerStyles from './header.module.css'
import {Link, NavLink} from "react-router-dom";

function Header() {
    return (
        <header className={headerStyles.header}>
            <div className={headerStyles.flexRowCenter}>
                <div className={headerStyles.flexRowCenter}>
                    <BurgerIcon type="primary"/>
                    <NavLink to="/constructor"
                             className={nav => (nav.isActive ? `${headerStyles.marginLeft10TextDecorationNone} text text_type_main-default` : `${headerStyles.marginLeft10TextDecorationNone} text text_type_main-default text_color_inactive`)}>
                        Конструктор
                    </NavLink>
                </div>
                <div className={headerStyles.flexRowCenter}>
                    <div className={headerStyles.marginLeft70}><ListIcon type="secondary"/></div>
                    <NavLink
                        to={`/feed`}
                        className={nav => (nav.isActive ? `${headerStyles.marginLeft10TextDecorationNone} text text_type_main-default` : `${headerStyles.marginLeft10TextDecorationNone} text text_type_main-default text_color_inactive`)}>
                        Лента заказов
                    </NavLink>
                </div>
            </div>
            <div className={headerStyles.logo}>
                <Link
                    to={`/`}
                    className={headerStyles.textDecorationNone}>
                <Logo/>
                </Link>

            </div>
            <div className={headerStyles.flexRowCenter}>
                <div className={headerStyles.flexRowCenter}>
                    <ProfileIcon type="secondary"/>
                    <NavLink
                        to={`/profile`}
                        className={nav => (nav.isActive ? `${headerStyles.marginLeft10TextDecorationNone} text text_type_main-default` : `${headerStyles.marginLeft10TextDecorationNone} text text_type_main-default text_color_inactive`)}
                    >
                        Личный кабинет
                    </NavLink>
                </div>
            </div>
        </header>
    );
}


export default Header;
