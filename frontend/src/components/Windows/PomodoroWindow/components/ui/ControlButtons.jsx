import React from "react";

const ControlButtons = ({ isActive, onToggle, onReset, activeTab }) => {
  return (
    <div className="control-buttons">
      <button className="control-btn primary" onClick={onToggle}>
        {isActive ? "⏸️" : "▶️"}
      </button>
      <button className="control-btn secondary" onClick={onReset}>
        {activeTab === "stopwatch" ? "🔄" : "⏹️"}
      </button>
    </div>
  );
};

export default ControlButtons;
