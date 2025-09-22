import React from "react";

const TimerDisplay = ({
  activeTab,
  stopwatchTime,
  timeLeft,
  formatStopwatchTime,
  formatTime,
  isBreak,
}) => {
  return (
    <div className="timer-display">
      <div className="time-value">
        {activeTab === "stopwatch"
          ? formatStopwatchTime(stopwatchTime)
          : formatTime(timeLeft)}
      </div>

      {activeTab === "pomodoro" && (
        <div className="timer-status">
          {/* round info removed from UI while keeping rounds logic */}
          <span className="mode-info">{isBreak ? "Break" : "Work"}</span>
        </div>
      )}
    </div>
  );
};

export default TimerDisplay;
