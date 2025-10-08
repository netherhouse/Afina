import React from "react";
import SliderWithDots from "./SliderWithDots";

const CompactSettings = ({
  activeTab,
  settings,
  countdownSettings,
  onUpdate,
  onUpdateCountdown,
  onStart,
}) => {
  const handlePomodoroChange = (key) => (value) => {
    onUpdate(key, value - settings[key]);
  };

  const handleCountdownChange = (key) => (value) => {
    onUpdateCountdown(key, value - countdownSettings[key]);
  };

  const totalTime = settings.rounds * (settings.work + settings.break);

  // Предопределенные значения для Work (шаг 5, от 5 до 150)
  const workValues = [];
  for (let i = 5; i <= 150; i += 5) {
    workValues.push(i);
  }

  // Предопределенные значения для Break (шаг 1, от 1 до 30)
  const breakValues = [];
  for (let i = 1; i <= 30; i += 1) {
    breakValues.push(i);
  }

  // Предопределенные значения для Rounds (шаг 1, от 2 до 10)
  const roundsValues = [];
  for (let i = 2; i <= 10; i += 1) {
    roundsValues.push(i);
  }

  return (
    <div className="compact-settings">
      {activeTab === "pomodoro" && (
        <>
          <SliderWithDots
            label="Work"
            value={settings.work}
            onChange={handlePomodoroChange("work")}
            min={5}
            max={150}
            step={5}
            values={workValues}
          />

          <SliderWithDots
            label="Break"
            value={settings.break}
            onChange={handlePomodoroChange("break")}
            min={1}
            max={30}
            step={1}
            values={breakValues}
          />

          <SliderWithDots
            label="Rounds"
            value={settings.rounds}
            onChange={handlePomodoroChange("rounds")}
            min={2}
            max={10}
            step={1}
            values={roundsValues}
          />

          <div className="start-section">
            <button className="start-btn" onClick={onStart}>
              ▶
            </button>
            <span className="total-time">
              {totalTime < 60
                ? `${totalTime}m`
                : `${Math.floor(totalTime / 60)}h ${totalTime % 60}m`}
            </span>
          </div>
        </>
      )}

      {activeTab === "countdown" && (
        <>
          <SliderWithDots
            label="Hours"
            value={countdownSettings.hours}
            onChange={handleCountdownChange("hours")}
            min={0}
            max={23}
            step={1}
          />

          <SliderWithDots
            label="Minutes"
            value={countdownSettings.minutes}
            onChange={handleCountdownChange("minutes")}
            min={0}
            max={59}
            step={1}
          />

          <SliderWithDots
            label="Seconds"
            value={countdownSettings.seconds}
            onChange={handleCountdownChange("seconds")}
            min={0}
            max={59}
            step={1}
          />

          <div className="start-section">
            <button className="start-btn" onClick={onStart}>
              ▶
            </button>
            <span className="total-time">
              {countdownSettings.hours > 0 && `${countdownSettings.hours}:`}
              {countdownSettings.minutes.toString().padStart(2, "0")}:
              {countdownSettings.seconds.toString().padStart(2, "0")}
            </span>
          </div>
        </>
      )}

      {activeTab === "stopwatch" && (
        <div className="start-section centered">
          <button className="start-btn large" onClick={onStart}>
            ▶ Start Stopwatch
          </button>
        </div>
      )}
    </div>
  );
};

export default CompactSettings;
