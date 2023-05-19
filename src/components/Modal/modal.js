import React from 'react';
import {CloseIcon} from "@ya.praktikum/react-developer-burger-ui-components";
import ReactDOM from "react-dom";
import ModalOverlay from "../ModalOverlay/modal-overlay";
import modalStyles from './modal.module.css'
import PropTypes from "prop-types";
import ESC_KEYCODE from '../../utils/keycodes';

/* this is a basic component that has a header and a X in header. This is basically a ModalOverlay that will appear over all other components */

function Modal({children, headerText, onCloseFunction}) {
    const modalRoot = document.getElementById("react-modals");

    function handleKeyDown(event, key) {
        // Check if the pressed key is the ESC key (key code 27)
        if (event.keyCode === key) {
            onCloseFunction();
        }
    }

    /* Подпишемся на escape */
    React.useEffect(() => {
        // Код эффекта
        document.addEventListener('keydown', (event) => handleKeyDown(event, ESC_KEYCODE));
        // Код сброса
        return () => {
            // отписка от событий, закрытие соединений
            document.removeEventListener('keydown', (event) => handleKeyDown(event, ESC_KEYCODE));
        }
    }, [])

    return ReactDOM.createPortal(
        <div className={modalStyles.relativeFullscreen}>
            {/*заполняем весь экран пользователя (это заполнение фактически в <div id="react-modals"/>)  используем relative, т.к. внутри будут absolute контейнеры*/}
            <ModalOverlay
                onCloseFunction={onCloseFunction}/> {/* Добавляем overlay, который сделает родительский div полупрозрачным */}
            {/*2 components in column: header and children component*/}
            <div className={modalStyles.modalStyle}>
                {/* header */}
                <div className={modalStyles.gridMain}>
                <span className={`${modalStyles.headerGridComponent} text_type_main-medium`}> {headerText} </span>
                    {/*todo pointer does not work on X! */}
                    <div className={modalStyles.closeIcon}><CloseIcon onClick={onCloseFunction} type="primary"/></div>
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

Modal.propTypes = {
    children: PropTypes.node.isRequired,
    headerText: PropTypes.string.isRequired,
    onCloseFunction: PropTypes.func.isRequired,
}

export default Modal;
