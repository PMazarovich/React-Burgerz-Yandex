import React, {useEffect, useState} from 'react';
import profileStyles from './profile.module.css'
import {Link, Outlet, useLocation} from "react-router-dom";
import {Buffer} from "buffer";
import {Button} from "@ya.praktikum/react-developer-burger-ui-components";
import {useAuth} from "../../utils/auth";

function ProfileWrapper() {
    const auth = useAuth()
    //////////// Это нужно для разной подсветки ссылокб когда нажат Профиль - подсвечиваем белым, когда не нажат - деактивируем и т.д///////////////
    const location = useLocation();
    const currentPath = location.pathname; //  - текущий путь, по которому находится компонент
    const [linkStyles, setLinkStyles] = useState({
        default: 'text text_type_main-medium text_color_primary',
        orders: 'text text_type_main-medium text_color_inactive',
    });
    useEffect(() => {
        if (currentPath === '/profile/') {
            setLinkStyles({
                default: 'text text_type_main-medium text_color_primary',
                orders: 'text text_type_main-medium text_color_inactive'
            })
        } else if (currentPath === '/profile/orders') {
            setLinkStyles({
                default: 'text text_type_main-medium text_color_inactive',
                orders: 'text text_type_main-medium text_color_primary'
            })
        }
    }, [currentPath],)
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    return (
        <div className={profileStyles.profileWrapper}>
            <div className={`${profileStyles.textBoxColumns} ${profileStyles.flexedTextContainer}`}>
                <Link to='/profile/'
                      className={`${linkStyles.default} ${profileStyles.noUnderline}`}> {/* Link меняет ссылку в адресной строке, а Router после анализа открывает соответствующие страницы */}
                    Профиль
                </Link>
                <Link to='/profile/orders' className={`${linkStyles.orders} ${profileStyles.noUnderline}`}>
                    История заказов
                </Link>
                <div onClick={() => auth.signOut()} style={{backgroundColor: "transparent", cursor:'pointer'}} className={`text text_type_main-medium text_color_inactive ${profileStyles.noUnderline}`}>
                    Выход
                </div>
            </div>
            <div className={profileStyles.flexedRightColumn}>
                <Outlet/> {/*Outlet нарисует вместо себя в этом компоненте все компоненты по пути (они в <Route>) /profile/* См в App.js*/}
            </div>


        </div>

    )
        ;
}


export default ProfileWrapper;
