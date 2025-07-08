import React from "react";

const TimerDisplay = ({
  activeTab,
  stopwatchTime,
  timeLeft,
  formatStopwatchTime,
  formatTime,
  currentRound,
  pomodoroSettings,
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
          <span className="round-info">
            Round {currentRound}/{pomodoroSettings.rounds}
          </span>
          <span className="mode-info">{isBreak ? "Break" : "Work"}</span>
        </div>
      )}
    </div>
  );
};

export default TimerDisplay;
