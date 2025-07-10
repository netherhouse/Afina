import React, { forwardRef, useImperativeHandle, useState } from "react";
import UserProfileWindow from "../Windows/UserProfileWindow/UserProfileWindow.jsx";
import MusicWindow from "../Windows/MusicWindow/MusicWindow.jsx";
import PomodoroWindow from "../Windows/PomodoroWindow/PomodoroWindow.jsx";

const getRandomPosition = () => {
  const padding = 50;
  const width = 400;
  const height = 300;
  const x = Math.random() * (window.innerWidth - width - padding);
  const y = Math.random() * (window.innerHeight - height - padding);
  return { x, y };
};

const WindowManager = forwardRef((props, ref) => {
  const [windowStates, setWindowStates] = useState({
    user: {
      visible: false,
      position: getRandomPosition(),
      size: { width: 400, height: 500 },
      zIndex: 1,
      lastActiveTime: 0,
    },
    music: {
      visible: false,
      position: getRandomPosition(),
      size: { width: 350, height: 450 },
      zIndex: 1,
      lastActiveTime: 0,
    },
    pomodoro: {
      visible: false,
      position: getRandomPosition(),
      size: { width: 380, height: 520 },
      zIndex: 1,
      lastActiveTime: 0,
    },
  });

  const [activeWindow, setActiveWindow] = useState(null);
  const [nextZIndex, setNextZIndex] = useState(1);

  const getActiveWindows = () => {
    return Object.keys(windowStates).filter((id) => windowStates[id].visible);
  };

  const bringToFront = (id) => {
    const currentTime = Date.now();
    setActiveWindow(id);
    setNextZIndex((prev) => prev + 1);

    setWindowStates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        zIndex: nextZIndex,
        lastActiveTime: currentTime,
      },
    }));

    // Передаем информацию об активных окнах в BottomPanel
    if (props.onActiveWindowsChange) {
      props.onActiveWindowsChange(getActiveWindows(), id);
    }
  };

  useImperativeHandle(ref, () => ({
    openWindow: (id) => {
      const currentTime = Date.now();
      setActiveWindow(id);
      setNextZIndex((prev) => prev + 1);

      setWindowStates((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          visible: true,
          position: prev[id]?.position || getRandomPosition(),
          size: prev[id]?.size || { width: 400, height: 300 },
          zIndex: nextZIndex,
          lastActiveTime: currentTime,
        },
      }));

      // Передаем информацию об активных окнах
      setTimeout(() => {
        if (props.onActiveWindowsChange) {
          const activeWindows = Object.keys({
            ...windowStates,
            [id]: { ...windowStates[id], visible: true },
          }).filter(
            (windowId) => windowStates[windowId]?.visible || windowId === id
          );
          props.onActiveWindowsChange(activeWindows, id);
        }
      }, 0);
    },
    getActiveWindows,
    getActiveWindow: () => activeWindow,
  }));

  const handleClose = (id) => {
    setWindowStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], visible: false },
    }));

    // Если закрываем активное окно, нужно найти новое активное
    if (activeWindow === id) {
      const visibleWindows = Object.keys(windowStates).filter(
        (windowId) => windowId !== id && windowStates[windowId].visible
      );

      if (visibleWindows.length > 0) {
        // Находим окно с самым высоким lastActiveTime
        const newActiveWindow = visibleWindows.reduce((latest, current) =>
          windowStates[current].lastActiveTime >
          windowStates[latest].lastActiveTime
            ? current
            : latest
        );
        setActiveWindow(newActiveWindow);
      } else {
        setActiveWindow(null);
      }
    }

    // Обновляем информацию об активных окнах
    setTimeout(() => {
      if (props.onActiveWindowsChange) {
        const activeWindows = Object.keys(windowStates).filter(
          (windowId) => windowId !== id && windowStates[windowId].visible
        );
        const newActiveWindow =
          activeWindow === id
            ? activeWindows.length > 0
              ? activeWindows[activeWindows.length - 1]
              : null
            : activeWindow;
        props.onActiveWindowsChange(activeWindows, newActiveWindow);
      }
    }, 0);
  };

  const updatePosition = (id, newPosition) => {
    setWindowStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], position: newPosition },
    }));
  };

  const updateSize = (id, newSize) => {
    setWindowStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], size: newSize },
    }));
  };

  return (
    <>
      <UserProfileWindow
        id="user"
        visible={windowStates.user.visible}
        onClose={handleClose}
        onMove={updatePosition}
        onResize={updateSize}
        onFocus={bringToFront}
        position={windowStates.user.position}
        size={windowStates.user.size}
        zIndex={windowStates.user.zIndex}
        isActive={activeWindow === "user"}
      />
      <MusicWindow
        id="music"
        visible={windowStates.music.visible}
        onClose={handleClose}
        onMove={updatePosition}
        onResize={updateSize}
        onFocus={bringToFront}
        position={windowStates.music.position}
        size={windowStates.music.size}
        zIndex={windowStates.music.zIndex}
        isActive={activeWindow === "music"}
      />
      <PomodoroWindow
        id="pomodoro"
        visible={windowStates.pomodoro.visible}
        onClose={handleClose}
        onMove={updatePosition}
        onResize={updateSize}
        onFocus={bringToFront}
        position={windowStates.pomodoro.position}
        size={windowStates.pomodoro.size}
        zIndex={windowStates.pomodoro.zIndex}
        isActive={activeWindow === "pomodoro"}
      />
    </>
  );
});

export default WindowManager;
