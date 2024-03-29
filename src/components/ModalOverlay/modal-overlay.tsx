import React from 'react';
import modalOverlayStyles from "./modal-overlay-component.module.css"

export function ModalOverlay({onCloseFunction}: { onCloseFunction: () => void; }) { /* это компонент полупрозрачного фона на весь родительский элемент */
    return (
        <div onClick={onCloseFunction}
             id="overlay" // this is for tests selectors
             className={modalOverlayStyles.overlayStyle}/>
    );
}

