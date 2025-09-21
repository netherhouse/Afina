import React from "react";

const StopwatchTimer = ({
  stopwatchTime,
  formatStopwatchTime,
  onPause,
  onStop,
  isActive,
}) => {
  const hours = Math.floor(stopwatchTime / 3600);
  const minutes = Math.floor((stopwatchTime % 3600) / 60);
  const seconds = Math.floor(stopwatchTime % 60);

  return (
    <div className="stopwatch-timer">
      {/* Top controls */}
      <div className="top-controls">
        <button
          className="control-btn reset-btn"
          onClick={onStop}
          title="Reset"
        >
          🔄
        </button>
        <button
          className="control-btn pause-btn"
          onClick={onPause}
          title={isActive ? "Pause" : "Start/Resume"}
        >
          {isActive ? "⏸" : "▶"}
        </button>
      </div>

      <div className="stopwatch-display">
        {/* Main time display */}
        <div className="time-display">{formatStopwatchTime(stopwatchTime)}</div>

        {/* Breakdown display */}
        <div className="time-breakdown">
          <div className="time-unit">
            <span className="unit-value">
              {hours.toString().padStart(2, "0")}
            </span>
            <span className="unit-label">Hours</span>
          </div>
          <div className="time-unit">
            <span className="unit-value">
              {minutes.toString().padStart(2, "0")}
            </span>
            <span className="unit-label">Minutes</span>
          </div>
          <div className="time-unit">
            <span className="unit-value">
              {seconds.toString().padStart(2, "0")}
            </span>
            <span className="unit-label">Seconds</span>
          </div>
        </div>

        {/* Status indicator */}
        <div className="status-indicator">
          <div className={`status-dot ${isActive ? "active" : "paused"}`}></div>
          <span className="status-text">
            {isActive ? "Running" : stopwatchTime > 0 ? "Paused" : "Ready"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StopwatchTimer;
