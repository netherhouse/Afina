import React from "react";

const CountdownTimer = ({
  timeLeft,
  totalTime,
  formatTime,
  onPause,
  onStop,
  isActive,
}) => {
  const progress =
    totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;

  return (
    <div className="countdown-timer">
      {/* Top controls */}
      <div className="top-controls">
        <button className="control-btn stop-btn" onClick={onStop} title="Stop">
          ⏹
        </button>
        <button
          className="control-btn pause-btn"
          onClick={onPause}
          title={isActive ? "Pause" : "Start/Resume"}
        >
          {isActive ? "⏸" : "▶"}
        </button>
      </div>

      <div className="countdown-display">
        {/* Progress bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="progress-text">{Math.round(progress)}%</div>
        </div>

        {/* Large time display */}
        <div className="time-display">{formatTime(timeLeft)}</div>
      </div>
    </div>
  );
};

export default CountdownTimer;
