import React, { useState, useEffect, useCallback } from "react";
import Window from "../../Window/Window";
import "./PomodoroWindow.scss";
import CompactSettings from "./components/settings/CompactSettings";
import CircularTimer from "./components/timers/CircularTimer";
import CountdownTimer from "./components/timers/CountdownTimer";
import StopwatchTimer from "./components/timers/StopwatchTimer";
import TabNavigation from "./components/navigation/TabNavigation";
import { GiTomato } from "react-icons/gi";
import { MdAccessTime, MdTimer } from "react-icons/md";

const tabs = [
  { id: "pomodoro", label: "Pomodoro", icon: <GiTomato /> },
  { id: "countdown", label: "Countdown", icon: <MdTimer /> },
  { id: "stopwatch", label: "Stopwatch", icon: <MdAccessTime /> },
];

function PomodoroWindow({
  id,
  visible,
  onClose,
  onMove,
  onResize,
  position,
  size,
}) {
  const [activeTab, setActiveTab] = useState("pomodoro");

  const [pomodoroSettings, setPomodoroSettings] = useState({
    work: 25,
    break: 5,
    rounds: 5,
  });

  const [countdownSettings, setCountdownSettings] = useState({
    hours: 0,
    minutes: 10,
    seconds: 0,
  });

  const [stopwatchTime, setStopwatchTime] = useState(0);

  const [currentRound, setCurrentRound] = useState(1);
  const [isBreak, setIsBreak] = useState(false);
  const [timeLeft, setTimeLeft] = useState(pomodoroSettings.work * 60);
  const [isActive, setIsActive] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const handleTimerComplete = useCallback(() => {
    if (activeTab === "pomodoro") {
      if (!isBreak) {
        if (currentRound >= pomodoroSettings.rounds) {
          setIsActive(false);
          setIsStarted(false);
          setCurrentRound(1);
          setIsBreak(false);
          setTimeLeft(pomodoroSettings.work * 60);

          if (Notification.permission === "granted") {
            new Notification("Pomodoro Complete!", {
              body: "All rounds completed! Great job!",
              icon: "🎉",
            });
          }
          return;
        } else {
          setIsBreak(true);
          setTimeLeft(pomodoroSettings.break * 60);
        }
      } else {
        setIsBreak(false);
        setCurrentRound((prev) => prev + 1);
        setTimeLeft(pomodoroSettings.work * 60);
      }

      if (Notification.permission === "granted") {
        new Notification("Timer Complete!", {
          body: isBreak
            ? "Break over! Time for work!"
            : "Work done! Time for a break!",
          icon: "🔔",
        });
      }
    } else if (activeTab === "countdown") {
      setIsActive(false);
      setIsStarted(false);
      setTimeLeft(
        countdownSettings.hours * 3600 +
          countdownSettings.minutes * 60 +
          countdownSettings.seconds
      );
      if (Notification.permission === "granted") {
        new Notification("Countdown Complete!", {
          body: "Timer finished.",
          icon: "🔔",
        });
      }
    }
  }, [activeTab, isBreak, currentRound, pomodoroSettings, countdownSettings]);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (activeTab === "pomodoro" || activeTab === "countdown") {
          setTimeLeft((time) => {
            if (time <= 1) {
              handleTimerComplete();
              return 0;
            }
            return time - 1;
          });
        } else if (activeTab === "stopwatch") {
          setStopwatchTime((time) => time + 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, activeTab, handleTimerComplete]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const formatStopwatchTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds) % 60;
    const centisecs = Math.floor((seconds * 100) % 100);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}.${centisecs.toString().padStart(2, "0")}`;
  };

  const updatePomodoroSetting = (key, delta) => {
    setPomodoroSettings((prev) => {
      let newValue = prev[key] + delta;

      if (key === "work") {
        newValue = Math.max(5, Math.min(150, newValue));
      } else if (key === "break") {
        newValue = Math.max(1, Math.min(30, newValue));
      } else if (key === "rounds") {
        newValue = Math.max(2, Math.min(10, newValue));
      }

      const newSettings = { ...prev, [key]: newValue };

      if (!isStarted && !isBreak && key === "work") {
        setTimeLeft(newValue * 60);
      }

      return newSettings;
    });
  };

  const updateCountdownSetting = (key, delta) => {
    setCountdownSettings((prev) => {
      let newHours = prev.hours;
      let newMinutes = prev.minutes;
      let newSeconds = prev.seconds;

      if (key === "hours") {
        newHours = Math.max(0, Math.min(23, newHours + delta));
      }
      if (key === "minutes") {
        newMinutes += delta;
        if (newMinutes >= 60) {
          newMinutes = 0;
          newHours = Math.min(23, newHours + 1);
        } else if (newMinutes < 0) {
          newMinutes = 59;
          newHours = Math.max(0, newHours - 1);
        }
      }
      if (key === "seconds") {
        newSeconds += delta;
        if (newSeconds >= 60) {
          newSeconds = 0;
          newMinutes++;
          if (newMinutes >= 60) {
            newMinutes = 0;
            newHours = Math.min(23, newHours + 1);
          }
        } else if (newSeconds < 0) {
          newSeconds = 59;
          newMinutes--;
          if (newMinutes < 0) {
            newMinutes = 59;
            newHours = Math.max(0, newHours - 1);
          }
        }
      }

      if (!isActive) {
        setTimeLeft(newHours * 3600 + newMinutes * 60 + newSeconds);
      }
      return { hours: newHours, minutes: newMinutes, seconds: newSeconds };
    });
  };

  const switchTab = (tabId) => {
    setActiveTab(tabId);
    resetTimer();
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsStarted(false);
    if (activeTab === "pomodoro") {
      setTimeLeft(pomodoroSettings.work * 60);
      setCurrentRound(1);
      setIsBreak(false);
    } else if (activeTab === "countdown") {
      setTimeLeft(
        countdownSettings.hours * 3600 +
          countdownSettings.minutes * 60 +
          countdownSettings.seconds
      );
    } else if (activeTab === "stopwatch") {
      setStopwatchTime(0);
    }
  };

  const handleStart = () => {
    setIsActive(true);
    setIsStarted(true);
  };

  const handlePause = () => {
    setIsActive(!isActive);
  };

  const handleStop = () => {
    if (
      activeTab === "stopwatch" &&
      stopwatchTime > 0 &&
      Notification.permission === "granted"
    ) {
      new Notification("Stopwatch Stopped", {
        body: "Stopwatch reset.",
        icon: "⏱️",
      });
    }

    setIsActive(false);
    setIsStarted(false);
    setCurrentRound(1);
    setIsBreak(false);
    setTimeLeft(pomodoroSettings.work * 60);

    if (activeTab === "stopwatch") {
      setStopwatchTime(0);
    }
  };

  useEffect(() => {
    if (activeTab === "countdown") {
      setTimeLeft(
        countdownSettings.hours * 3600 +
          countdownSettings.minutes * 60 +
          countdownSettings.seconds
      );
    } else if (activeTab === "pomodoro") {
      setTimeLeft(pomodoroSettings.work * 60);
    }
  }, [
    activeTab,
    countdownSettings.hours,
    countdownSettings.minutes,
    countdownSettings.seconds,
    pomodoroSettings.work,
  ]);

  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  

  const getTotalTime = () => {
    if (activeTab === "pomodoro") {
      if (isBreak) {
        return pomodoroSettings.break * 60;
      }
      return pomodoroSettings.work * 60;
    } else if (activeTab === "countdown") {
      return (
        countdownSettings.hours * 3600 +
        countdownSettings.minutes * 60 +
        countdownSettings.seconds
      );
    }
    return 0;
  };

  return (
    <Window
      id={id}
      title="Timer"
      className="pomodoro-window"
      visible={visible}
      onClose={onClose}
      onMove={onMove}
      onResize={onResize}
      position={position}
      size={size}
      minWidth={320}
      minHeight={480}
      maxWidth={320}
      maxHeight={480}
      isResizable={false}
    >
      <div className="pomodoro-content">
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabSwitch={switchTab}
          isTimerRunning={isStarted}
        />

        {!isStarted ? (
          <CompactSettings
            activeTab={activeTab}
            settings={pomodoroSettings}
            countdownSettings={countdownSettings}
            onUpdate={updatePomodoroSetting}
            onUpdateCountdown={updateCountdownSetting}
            onStart={handleStart}
          />
        ) : (
          <>
            {activeTab === "pomodoro" && (
              <CircularTimer
                activeTab={activeTab}
                timeLeft={timeLeft}
                totalTime={getTotalTime()}
                currentRound={currentRound}
                totalRounds={pomodoroSettings.rounds}
                isBreak={isBreak}
                formatTime={formatTime}
                formatStopwatchTime={formatStopwatchTime}
                stopwatchTime={stopwatchTime}
                onPause={handlePause}
                onStop={handleStop}
                isActive={isActive}
              />
            )}
            {activeTab === "countdown" && (
              <CountdownTimer
                timeLeft={timeLeft}
                totalTime={getTotalTime()}
                formatTime={formatTime}
                onPause={handlePause}
                onStop={handleStop}
                isActive={isActive}
              />
            )}
            {activeTab === "stopwatch" && (
              <StopwatchTimer
                stopwatchTime={stopwatchTime}
                onPause={handlePause}
                onStop={handleStop}
                isActive={isActive}
              />
            )}
          </>
        )}
      </div>
    </Window>
  );
}

export default PomodoroWindow;
