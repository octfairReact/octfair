import React from "react";
import "./css/CustomAlert.css";

export const CustomAlert = ({ message, onClose }) => {
  return (
    <div className="custom-alert-overlay">
      <div className="custom-alert">
        <p>{message}</p>
        <button onClick={onClose}>확인</button>
      </div>
    </div>
  );
};
