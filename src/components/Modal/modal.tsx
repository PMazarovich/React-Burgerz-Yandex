import React from 'react';
import {CloseIcon} from "@ya.praktikum/react-developer-burger-ui-components";
import ReactDOM from "react-dom";

import modalStyles from './modal.module.css'
import {ModalOverlay} from "../ModalOverlay/modal-overlay";
import {useLocation, useNavigate} from "react-router-dom";

/* this is a basic component that has a header and a X in header. This is basically a ModalOverlay that will appear over all other components */


export function Modal({
                          children, onCloseFunction
                      }: {
    children: React.ReactNode;
    onCloseFunction?: () => void;
}) {
    const modalRoot = document.getElementById("react-modals");
    const navigate = useNavigate()

    const location = useLocation();
    const prevLocation = location.state?.prevLocationObject;
    function closeFunction(){
        if(onCloseFunction){
            onCloseFunction()
        } else {
            navigate(prevLocation.pathname || "/", {replace: true})
        }
    }
    React.useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            /* Подпишемся на escape и будем действовать в зависимости от того, передали ли в аргументы функцию закрытия */
            if (event.key === "Escape") {
                if(onCloseFunction){
                    onCloseFunction()
                } else {
                    navigate(prevLocation.pathname || "/", {replace: true})
                }
            }
        }
        // Код эффекта
        document.addEventListener('keydown', handleKeyDown);
        // Код сброса
        return () => {
            // отписка от событий, закрытие соединений
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, [navigate])

    if (!modalRoot) {
        return null;
    }

    return ReactDOM.createPortal(
        <div className={modalStyles.relativeFullscreen}>
            {/*заполняем весь экран пользователя (это заполнение фактически в <div id="react-modals"/>)  используем relative, т.к. внутри будут absolute контейнеры*/}
            <ModalOverlay onCloseFunction={closeFunction}/>
            <div className={modalStyles.modalStyle}>
                {/* header */}
                <div className={modalStyles.gridMain}>
                    <div className={modalStyles.closeIcon}><CloseIcon onClick={closeFunction} type="primary"/>
                    </div>
                </div>
                <div>
                    {children}
                    {/*<IngredientDetails imgAlt={"булка"} imgSrc={"https://code.s3.yandex.net/react/code/bun-02.png"} name={"Биокотлета"} proteins={80} fat={24} carbohydrates={53} calories={146}/>*/}
                </div>
            </div>
        </div>
        ,
        modalRoot // The node where the previous render will be rendered
    );
}


