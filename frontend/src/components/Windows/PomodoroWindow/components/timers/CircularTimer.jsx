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
    activeTab === "stopwatch" || !totalTime
      ? 0
      : ((totalTime - timeLeft) / totalTime) * 100;

  const SEGMENTS = 48;
  const RING_SIZE = 280;
  const RADIUS = 110;
  const activeSegments = Math.round((progress / 100) * SEGMENTS);

  const isCardinal = (index) => {
    const segmentsPerQuarter = SEGMENTS / 4;
    return (
      index === 0 ||
      index === segmentsPerQuarter ||
      index === segmentsPerQuarter * 2 ||
      index === segmentsPerQuarter * 3
    );
  };

  const actionText =
    activeTab === "pomodoro"
      ? isBreak
        ? "BREAK"
        : "FOCUS"
      : activeTab === "countdown"
      ? "COUNTDOWN"
      : "STOPWATCH";

  const timeText =
    activeTab === "stopwatch"
      ? formatStopwatchTime(stopwatchTime)
      : formatTime(timeLeft);

  return (
    <div className="circular-timer">
      {/* Controls on top */}
      <div className="top-controls">
        <button className="control-btn stop-btn" onClick={onStop} title="Stop">
          ⏹
        </button>
        <button
          className="control-btn pause-btn"
          onClick={onPause}
          title={isActive ? "Pause" : "Start/Pause"}
        >
          {isActive ? "⏸" : "▶"}
        </button>
      </div>

      <div className="timer-circle">
        {/* Radial ring made of short lines */}
        <div
          className="radial-ring"
          style={{ width: RING_SIZE, height: RING_SIZE }}
        >
          {Array.from({ length: SEGMENTS }).map((_, i) => {
            const angle = (360 / SEGMENTS) * i;
            const isActiveSeg = activeTab !== "stopwatch" && i < activeSegments;
            const isCardinalSeg = isCardinal(i);
            return (
              <div
                key={i}
                className={`radial-segment ${isActiveSeg ? "active" : ""} ${
                  isCardinalSeg ? "cardinal" : ""
                }`}
                style={{
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${RADIUS}px)`,
                }}
              />
            );
          })}
        </div>

        {/* Inner content */}
        <div className="timer-content">
          <div className="action-text">{actionText}</div>
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
          <div className="time-display">{timeText}</div>
          {/* rounds count removed from visual UI - logic preserved elsewhere */}
        </div>
      </div>
    </div>
  );
};

export default CircularTimer;
