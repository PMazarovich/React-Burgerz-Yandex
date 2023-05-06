import React from 'react';
import {BurgerIcon, ListIcon, Logo, ProfileIcon} from '@ya.praktikum/react-developer-burger-ui-components'
import headerStyles from './header.module.css'

class Header extends React.Component {
    render() {
        return (
            <header className={headerStyles.header}>
                <div style={{flexGrow: "3", display: "flex", justifyContent: "flex-end"}}>
                    <div style={{display: "flex", justifyContent: "space-between"}}> {/* Конструктор */}
                        <BurgerIcon type="primary"/>
                        <p style={{marginLeft: "10px"}} className="text text_type_main-default">
                            Конструктор
                        </p>
                    </div>
                    <div style={{display: "flex", justifyContent: "space-between", marginLeft: "30px"}}> {/* Лента заказов */}
                        <ListIcon type="secondary"/>
                        <p style={{marginLeft: "10px"}} className="text text_type_main-default text_color_inactive">
                            Лента заказов
                        </p>
                    </div>
                </div>
                <div className={headerStyles.logo}>
                    <Logo/>
                </div>
                <div className={headerStyles.office}>
                    <ProfileIcon type="secondary"/>
                    <p style={{marginLeft: "10px"}} className="text text_type_main-default text_color_inactive">
                        Личный кабинет
                    </p>
                </div>

            </header>
        );
    }
}

export default Header;
