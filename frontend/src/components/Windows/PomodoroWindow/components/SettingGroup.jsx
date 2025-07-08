import React from "react";

const SettingGroup = ({ label, value, onDecrement, onIncrement }) => {
  return (
    <div className="setting-group">
      <label>{label}</label>
      <div className="setting-controls">
        <button className="setting-btn" onClick={onDecrement}>
          ➖
        </button>
        <span className="setting-value">{value}</span>
        <button className="setting-btn" onClick={onIncrement}>
          ➕
        </button>
      </div>
    </div>
  );
};

export default SettingGroup;
