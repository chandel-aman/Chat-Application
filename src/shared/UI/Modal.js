import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";

import Backdrop from "./Backdrop";

import classes from "./Modal.module.css";

const ModalOverlay = (props) => {
  const content = <div className={classes.modal}>{props.children}</div>;
  return ReactDOM.createPortal(content, document.getElementById("modal-hook"));
};

const Modal = (props) => (
  <Fragment>
    {props.show && <Backdrop onClick={props.onCancel} />}
    <CSSTransition
      in={props.show}
      timeout={0}
      mountOnEnter
      unmountOnExit
      classNames="modal"
    >
      <ModalOverlay {...props} />
    </CSSTransition>
  </Fragment>
);

export default Modal;
