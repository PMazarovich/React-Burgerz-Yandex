import React from 'react';
import modalOverlayStyles from "./modal-overlay-component.module.css"

export function ModalOverlay({onCloseFunction}: {onCloseFunction: (ingredientId?: any) => void}) { /* это компонент полупрозрачного фона на весь родительский элемент */
    return (
        <div onClick={onCloseFunction} className={modalOverlayStyles.overlayStyle}/>
    );
}

