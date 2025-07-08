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

const WindowManager = forwardRef((_, ref) => {
  const [windowStates, setWindowStates] = useState({
    user: {
      visible: false,
      position: getRandomPosition(),
      size: { width: 400, height: 500 },
    },
    music: {
      visible: false,
      position: getRandomPosition(),
      size: { width: 350, height: 450 },
    },
    pomodoro: {
      visible: false,
      position: getRandomPosition(),
      size: { width: 380, height: 520 },
    },
    // other windows here
  });

  useImperativeHandle(ref, () => ({
    openWindow: (id) => {
      setWindowStates((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          visible: true,
          position: prev[id]?.position || getRandomPosition(),
          size: prev[id]?.size || { width: 400, height: 300 },
        },
      }));
    },
  }));

  const handleClose = (id) => {
    setWindowStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], visible: false },
    }));
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
        position={windowStates.user.position}
        size={windowStates.user.size}
      />
      <MusicWindow
        id="music"
        visible={windowStates.music.visible}
        onClose={handleClose}
        onMove={updatePosition}
        onResize={updateSize}
        position={windowStates.music.position}
        size={windowStates.music.size}
      />
      <PomodoroWindow
        id="pomodoro"
        visible={windowStates.pomodoro.visible}
        onClose={handleClose}
        onMove={updatePosition}
        onResize={updateSize}
        position={windowStates.pomodoro.position}
        size={windowStates.pomodoro.size}
      />
    </>
  );
});

export default WindowManager;
