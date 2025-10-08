import React from "react";
import PomodoroSettings from "./PomodoroSettings";
import CountdownSettings from "./CountdownSettings";

const SettingsPanel = ({
  activeTab,
  pomodoroSettings,
  updatePomodoroSetting,
  getTotalPomodoroTime,
  countdownSettings,
  updateCountdownSetting,
  isActive,
}) => {
  if (activeTab === "stopwatch" || isActive) {
    return null; // Hide settings when timer is active or for stopwatch
  }

  return (
    <div className="settings-panel">
      {activeTab === "pomodoro" && (
        <PomodoroSettings
          settings={pomodoroSettings}
          onUpdate={updatePomodoroSetting}
          totalTime={getTotalPomodoroTime()}
        />
      )}
      {activeTab === "countdown" && (
        <CountdownSettings
          settings={countdownSettings}
          onUpdate={updateCountdownSetting}
        />
      )}
    </div>
  );
};

export default SettingsPanel;
