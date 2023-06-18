import React from 'react';
import {BurgerIcon, ListIcon, Logo, ProfileIcon} from '@ya.praktikum/react-developer-burger-ui-components'
import headerStyles from './header.module.css'

function Header() {
    return (
        <header className={headerStyles.header}>
            <div className={headerStyles.threeElementsInRow}>
                <a href={''} className={headerStyles.constructor}> {/* Конструктор */}
                    <BurgerIcon type="primary"/>
                    <p className={`${headerStyles.marginLeft10} text text_type_main-default`}>
                        Конструктор
                    </p>
                </a>
                <a href={''} className={headerStyles.orderArray}> {/* Лента заказов */}
                    <ListIcon type="secondary"/>
                    <p  className={`${headerStyles.marginLeft10} text text_type_main-default text_color_inactive`}>
                        Лента заказов
                    </p>
                </a>
            </div>
            <div className={headerStyles.logo}>
                <Logo/>
            </div>
            <a href={''} className={headerStyles.office}>
                <ProfileIcon type="secondary"/>
                <p className={`${headerStyles.marginLeft10} text text_type_main-default text_color_inactive`}>
                    Личный кабинет
                </p>
            </a>

        </header>
    );
}


export default Header;
