import React from 'react';
import {BurgerIcon, ListIcon, Logo, ProfileIcon} from '@ya.praktikum/react-developer-burger-ui-components'
import headerStyles from './header.module.css'

function Header(props) {
    return (
        <header className={headerStyles.header}>
            <div className={headerStyles.threeElementsInRow}>
                <div  className={headerStyles.constructor}> {/* Конструктор */}
                    <BurgerIcon type="primary"/>
                    <p className={`${headerStyles.marginLeft10} text text_type_main-default`}>
                        Конструктор
                    </p>
                </div>
                <div className={headerStyles.orderArray}> {/* Лента заказов */}
                    <ListIcon type="secondary"/>
                    <p  className={`${headerStyles.marginLeft10} text text_type_main-default text_color_inactive`}>
                        Лента заказов
                    </p>
                </div>
            </div>
            <div className={headerStyles.logo}>
                <Logo/>
            </div>
            <div className={headerStyles.office}>
                <ProfileIcon type="secondary"/>
                <p className={`${headerStyles.marginLeft10} text text_type_main-default text_color_inactive`}>
                    Личный кабинет
                </p>
            </div>

        </header>
    );
}


export default Header;
