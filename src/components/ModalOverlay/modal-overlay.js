import React from 'react';
import PropTypes from "prop-types";
import modalOverlayStyles from "./modal-overlay-component.module.css"

function ModalOverlay({onCloseFunction}) { /* это компонент полупрозрачного фона на весь родительский элемент */
    return (
        <div onClick={onCloseFunction} className={modalOverlayStyles.overlayStyle}/>
    );
}

ModalOverlay.propTypes = {
    onCloseFunction: PropTypes.func.isRequired,
}

export default ModalOverlay;
