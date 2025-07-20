import React from "react";
import "./DialogBox.css";

const DialogBox = ({ title, message, type, onClose }) => {
  return (
    <div className={`dialog-box ${type}`}>
      <div className="dialog-content">
        {title && <div className="dialog-title">{title}</div>}
        <div className="dialog-message">{message}</div>
      </div>
      <button className="dialog-close" onClick={onClose}>
        &times;
      </button>
    </div>
  );
};

export default DialogBox;