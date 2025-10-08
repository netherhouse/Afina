import React from "react";

const TabNavigation = ({ tabs, activeTab, onTabSwitch, isTimerRunning }) => {
  const handleTabClick = (tabId) => {
    // Блокируем переключение если таймер запущен
    if (isTimerRunning) {
      return;
    }
    onTabSwitch(tabId);
  };

  return (
    <div className={`tab-navigation ${isTimerRunning ? "timer-running" : ""}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-button ${activeTab === tab.id ? "active" : ""} ${
            isTimerRunning && activeTab !== tab.id ? "disabled" : ""
          }`}
          onClick={() => handleTabClick(tab.id)}
          disabled={isTimerRunning && activeTab !== tab.id}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
