import React from "react";
import SettingGroup from "./SettingGroup";

const CountdownSettings = ({ settings, onUpdate }) => {
  return (
    <div className="countdown-settings">
      <SettingGroup
        label="Minutes"
        value={settings.minutes}
        onDecrement={() => onUpdate("minutes", -1)}
        onIncrement={() => onUpdate("minutes", 1)}
      />
      <SettingGroup
        label="Seconds"
        value={settings.seconds}
        onDecrement={() => onUpdate("seconds", -1)}
        onIncrement={() => onUpdate("seconds", 1)}
      />
    </div>
  );
};

export default CountdownSettings;
