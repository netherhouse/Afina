import React, { useState, useEffect, useCallback } from "react";
import Window from "../../Window/Window";
import "./PomodoroWindow.scss";
import CompactSettings from "./components/CompactSettings";
import CircularTimer from "./components/CircularTimer";
import CountdownTimer from "./components/CountdownTimer";
import StopwatchTimer from "./components/StopwatchTimer";
import TabNavigation from "./components/TabNavigation";

const tabs = [
  { id: "pomodoro", label: "Pomodoro", icon: "🍅" },
  { id: "countdown", label: "Countdown", icon: "⏰" },
  { id: "stopwatch", label: "Stopwatch", icon: "⏱️" },
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
        // Завершился рабочий период
        if (currentRound >= pomodoroSettings.rounds) {
          // Это был последний раунд - полностью завершаем
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
          // Переход к перерыву, таймер продолжает работать
          setIsBreak(true);
          setTimeLeft(pomodoroSettings.break * 60);
          // НЕ останавливаем таймер - setIsActive(true) остается
        }
      } else {
        // Завершился перерыв - переходим к следующему раунду
        setIsBreak(false);
        setCurrentRound((prev) => prev + 1);
        setTimeLeft(pomodoroSettings.work * 60);
        // НЕ останавливаем таймер - setIsActive(true) остается
      }

      // Уведомления о переходах
      if (Notification.permission === "granted") {
        new Notification("Timer Complete!", {
          body: isBreak
            ? "Break over! Time for work!"
            : "Work done! Time for a break!",
          icon: "🔔",
        });
      }
    } else if (activeTab === "countdown") {
      // Countdown finished: stop and return to settings view
      setIsActive(false);
      setIsStarted(false);
      // reset display to configured countdown settings
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

      // Применяем ограничения для каждого параметра
      if (key === "work") {
        newValue = Math.max(5, Math.min(150, newValue));
      } else if (key === "break") {
        newValue = Math.max(1, Math.min(30, newValue));
      } else if (key === "rounds") {
        newValue = Math.max(2, Math.min(10, newValue));
      }

      const newSettings = { ...prev, [key]: newValue };

      // Обновляем время только если таймер не запущен и мы в рабочем режиме
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
    // Уведомление только для секундомера при ручной остановке
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

    // Сбрасываем время секундомера
    if (activeTab === "stopwatch") {
      setStopwatchTime(0);
    }
  };

  useEffect(() => {
    // Инициализация времени для разных режимов
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

  if (!visible) return null;

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
