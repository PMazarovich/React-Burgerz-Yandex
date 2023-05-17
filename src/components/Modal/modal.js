import React from 'react';
import {CloseIcon} from "@ya.praktikum/react-developer-burger-ui-components";


/* this is a basic component that has a header and a X in header. This is basically a ModalOverlay that will appear over all other components */

function Modal({children, headerText, onCloseFunction}) {
    function handleKeyDown(event) {
        // Check if the pressed key is the ESC key (key code 27)
        if (event.keyCode === 27) {
            onCloseFunction();
        }
    }

    /* Подпишемся на escape */
    React.useEffect(() => {
        // Код эффекта
        document.addEventListener('keydown', handleKeyDown);
        // Код сброса
        return () => {
            // отписка от событий, закрытие соединений
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, [])

    return (
        /* {/!* 2 components in column: header and children component *!/}*/
        <div style={{display: "flex", flexDirection: "column", height: "100%", width: "100%"}}>
            {/* header */}
            <div style={{display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginTop: "15px"}}>
                <span className={"text_type_main-medium"}
                      style={{gridColumnStart: 2, gridColumnEnd: 5}}> {headerText} </span>
                {/*todo pointer does not work on X! */}
                <div className={"clickable-div"} style={{
                    gridColumnStart: 7,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                }}><CloseIcon onClick={onCloseFunction} type="primary"/></div>
            </div>
            <div>
                {children}
                {/*<IngredientDetails imgAlt={"булка"} imgSrc={"https://code.s3.yandex.net/react/code/bun-02.png"} name={"Биокотлета"} proteins={80} fat={24} carbohydrates={53} calories={146}/>*/}
            </div>

        </div>

    )
}

export default Modal;
