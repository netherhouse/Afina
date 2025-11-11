import React from "react";
import SettingGroup from "./SettingGroup";

const PomodoroSettings = ({ settings, onUpdate, totalTime }) => {
  return (
    <div className="pomodoro-settings">
      <SettingGroup
        label="Work (min)"
        value={settings.work}
        onDecrement={() => onUpdate("work", -1)}
        onIncrement={() => onUpdate("work", 1)}
      />
      <SettingGroup
        label="Break (min)"
        value={settings.break}
        onDecrement={() => onUpdate("break", -1)}
        onIncrement={() => onUpdate("break", 1)}
      />
      <SettingGroup
        label="Rounds"
        value={settings.rounds}
        onDecrement={() => onUpdate("rounds", -1)}
        onIncrement={() => onUpdate("rounds", 1)}
      />
      <div className="total-time">Total: {totalTime} minutes</div>
    </div>
  );
};

export default PomodoroSettings;
