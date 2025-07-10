import React, { useState, useEffect, useCallback } from "react";
import Window from "../../Window/Window";
import "./PomodoroWindow.scss";
import TabNavigation from "./components/TabNavigation";
import TimerDisplay from "./components/TimerDisplay";
import SettingsPanel from "./components/SettingsPanel";
import ControlButtons from "./components/ControlButtons";
import { GiTomato } from "react-icons/gi";
import { MdTimer, MdAccessTime } from "react-icons/md";

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
    rounds: 4,
  });
  const [currentRound, setCurrentRound] = useState(1);
  const [isBreak, setIsBreak] = useState(false);

  const [countdownSettings, setCountdownSettings] = useState({
    minutes: 10,
    seconds: 0,
  });

  const [stopwatchTime, setStopwatchTime] = useState(0);

  const [timeLeft, setTimeLeft] = useState(pomodoroSettings.work * 60);
  const [isActive, setIsActive] = useState(false);

  const handleTimerComplete = useCallback(() => {
    setIsActive(false);

    if (activeTab === "pomodoro") {
      if (!isBreak) {
        setIsBreak(true);
        setTimeLeft(pomodoroSettings.break * 60);
      } else {
        setIsBreak(false);
        if (currentRound < pomodoroSettings.rounds) {
          setCurrentRound((prev) => prev + 1);
          setTimeLeft(pomodoroSettings.work * 60);
        } else {
          setCurrentRound(1);
          setTimeLeft(pomodoroSettings.work * 60);
        }
      }
    }

    if (Notification.permission === "granted") {
      new Notification("Timer Complete!", {
        body:
          activeTab === "pomodoro"
            ? isBreak
              ? "Time for a break!"
              : "Back to work!"
            : "Timer finished!",
        icon: "🔔",
      });
    }
  }, [activeTab, isBreak, currentRound, pomodoroSettings]);

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
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
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

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    if (activeTab === "pomodoro") {
      setTimeLeft(pomodoroSettings.work * 60);
      setCurrentRound(1);
      setIsBreak(false);
    } else if (activeTab === "countdown") {
      setTimeLeft(countdownSettings.minutes * 60 + countdownSettings.seconds);
    } else if (activeTab === "stopwatch") {
      setStopwatchTime(0);
    }
  };

  const updatePomodoroSetting = (key, delta) => {
    setPomodoroSettings((prev) => {
      const newValue = Math.max(1, prev[key] + delta);
      const newSettings = { ...prev, [key]: newValue };
      if (key === "work" && !isActive && !isBreak) {
        setTimeLeft(newValue * 60);
      }
      return newSettings;
    });
  };

  const updateCountdownSetting = (key, delta) => {
    setCountdownSettings((prev) => {
      let newMinutes = prev.minutes;
      let newSeconds = prev.seconds;

      if (key === "minutes") newMinutes = Math.max(0, newMinutes + delta);
      if (key === "seconds") {
        newSeconds += delta;
        if (newSeconds >= 60) {
          newSeconds = 0;
          newMinutes++;
        } else if (newSeconds < 0) {
          newSeconds = 59;
          newMinutes = Math.max(0, newMinutes - 1);
        }
      }

      if (!isActive) {
        setTimeLeft(newMinutes * 60 + newSeconds);
      }
      return { minutes: newMinutes, seconds: newSeconds };
    });
  };

  const getTotalPomodoroTime = () =>
    pomodoroSettings.rounds * (pomodoroSettings.work + pomodoroSettings.break);

  const switchTab = (tabId) => {
    setActiveTab(tabId);
    resetTimer();
  };

  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  if (!visible) return null;

  return (
    <Window
      id={id}
      title="Timer"
      icon="⏰"
      onClose={onClose}
      onMove={onMove}
      onResize={onResize}
      position={position}
      size={size}
      minWidth={400}
      minHeight={550}
      maxWidth={600}
      maxHeight={800}
    >
      <div className="timer-content">
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabSwitch={switchTab}
        />

        <TimerDisplay
          activeTab={activeTab}
          stopwatchTime={stopwatchTime}
          timeLeft={timeLeft}
          formatStopwatchTime={formatStopwatchTime}
          formatTime={formatTime}
          currentRound={currentRound}
          pomodoroSettings={pomodoroSettings}
          isBreak={isBreak}
          isActive={isActive} // Добавляем пропс
        />

        <SettingsPanel
          activeTab={activeTab}
          pomodoroSettings={pomodoroSettings}
          updatePomodoroSetting={updatePomodoroSetting}
          getTotalPomodoroTime={getTotalPomodoroTime}
          countdownSettings={countdownSettings}
          updateCountdownSetting={updateCountdownSetting}
          isActive={isActive} // Добавляем пропс
        />

        <ControlButtons
          isActive={isActive}
          onToggle={toggleTimer}
          onReset={resetTimer}
          activeTab={activeTab}
        />
      </div>
    </Window>
  );
}

export default PomodoroWindow;
