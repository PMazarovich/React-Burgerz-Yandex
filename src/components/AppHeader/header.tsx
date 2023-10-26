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
                             style={{textDecoration: 'none'}}
                             className={nav => (nav.isActive ? `${headerStyles.marginLeft10} text text_type_main-default` : `${headerStyles.marginLeft10} text text_type_main-default text_color_inactive`)}>
                        Конструктор
                    </NavLink>
                </div>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <div style={{marginLeft: '70px'}}><ListIcon type="secondary"/></div>
                    <NavLink
                        to={`/feed`}
                        style={{textDecoration: 'none'}}
                        className={nav => (nav.isActive ? `${headerStyles.marginLeft10} text text_type_main-default` : `${headerStyles.marginLeft10} text text_type_main-default text_color_inactive`)}>
                        Лента заказов
                    </NavLink>
                </div>
            </div>
            <div className={headerStyles.logo}>
                <Link
                    to={`/`}
                    style={{textDecoration: 'none'}}>
                <Logo/>
                </Link>

            </div>
            <div className={headerStyles.flexRowCenter}>
                <div className={headerStyles.flexRowCenter}>
                    <ProfileIcon type="secondary"/>
                    <NavLink
                        to={`/profile`}
                        style={{textDecoration: 'none'}}
                        className={nav => (nav.isActive ? `${headerStyles.marginLeft10} text text_type_main-default` : `${headerStyles.marginLeft10} text text_type_main-default text_color_inactive`)}
                    >
                        Личный кабинет
                    </NavLink>
                </div>
            </div>
        </header>
    );
}


export default Header;
