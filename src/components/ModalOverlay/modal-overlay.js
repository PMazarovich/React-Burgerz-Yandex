import React from 'react';
import ReactDOM from 'react-dom';
import {CloseIcon} from "@ya.praktikum/react-developer-burger-ui-components";
/* this is a basic component that has a header and a X in header. This is basically a ModalOverlay that will appear over all other components */

function ModalOverlay({ children }) {
    const modalRoot = document.getElementById("react-modals");
    return ReactDOM.createPortal(
        <div style={{ backgroundColor : 'rgba(0,0,0,0.8)', display: "flex", justifyContent:"center", maxWidth: "900px", maxHeight:"550px" }}>
            {children}
        </div>,
        modalRoot // The node where the previous render will be rendered
    );
}

export default ModalOverlay;
