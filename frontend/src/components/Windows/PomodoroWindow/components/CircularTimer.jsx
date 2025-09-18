import React from "react";

const CircularTimer = ({
  activeTab,
  timeLeft,
  totalTime,
  currentRound,
  totalRounds,
  isBreak,
  formatTime,
  formatStopwatchTime,
  stopwatchTime,
  onPause,
  onStop,
  isActive,
}) => {
  const progress =
    activeTab === "stopwatch" ? 0 : ((totalTime - timeLeft) / totalTime) * 100;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (progress / 100) * circumference;

  const getDisplayText = () => {
    if (activeTab === "pomodoro") {
      return isBreak ? "BREAK" : "FOCUS";
    } else if (activeTab === "countdown") {
      return "COUNTDOWN";
    } else if (activeTab === "stopwatch") {
      return "STOPWATCH";
    }
  };

  const getTimeDisplay = () => {
    if (activeTab === "stopwatch") {
      return formatStopwatchTime(stopwatchTime);
    } else {
      return formatTime(timeLeft);
    }
  };

  return (
    <div className="circular-timer">
      <div className="timer-circle">
        <svg width="180" height="180" className="progress-ring">
          {/* Background circle */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="4"
            fill="none"
          />
          {/* Progress circle - только для таймеров */}
          {activeTab !== "stopwatch" && (
            <circle
              cx="90"
              cy="90"
              r={radius}
              stroke="#10b981"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              className="progress-circle"
              style={{
                transform: "rotate(-90deg)",
                transformOrigin: "90px 90px",
                transition: "stroke-dashoffset 1s ease",
              }}
            />
          )}
        </svg>

        <div className="timer-content">
          <div className="action-text">{getDisplayText()}</div>

          {/* Индикатор раундов только для Pomodoro */}
          {activeTab === "pomodoro" && (
            <div className="dots-indicator">
              {Array.from({ length: totalRounds }).map((_, index) => (
                <div
                  key={index}
                  className={`round-dot ${
                    index < currentRound
                      ? "completed"
                      : index === currentRound - 1
                      ? "current"
                      : ""
                  }`}
                />
              ))}
            </div>
          )}

          <div className="time-display">{getTimeDisplay()}</div>
        </div>
      </div>

      <div className="pause-stop-buttons">
        <button className="control-btn pause-btn" onClick={onPause}>
          {isActive ? "⏸" : "▶"}
        </button>
        <button className="control-btn stop-btn" onClick={onStop}>
          ⏹
        </button>
      </div>
    </div>
  );
};

export default CircularTimer;
