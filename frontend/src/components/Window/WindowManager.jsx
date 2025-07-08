import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import UserProfileWindow from '../Windows/UserProfileWindow/UserProfileWindow.jsx';
import MusicWindow from "../Windows/MusicWindow/MusicWindow.jsx";
import PomodoroWindow from "../Windows/PomodoroWindow/PomodoroWindow.jsx";

const getRandomPosition = () => {
  const padding = 50;
  const width = 300;
  const height = 200;
  const x = Math.random() * (window.innerWidth - width - padding);
  const y = Math.random() * (window.innerHeight - height - padding);
  return { x, y };
};

const WindowManager = forwardRef(({ onWindowStateChange }, ref) => {
  const [windowStates, setWindowStates] = useState({
    user: {
      visible: false,
      position: getRandomPosition(),
    },
    music: {
      visible: false,
      position: getRandomPosition(),
    },
    pomodoro: {
      visible: false,
      position: getRandomPosition(),
    },
  });

  useImperativeHandle(ref, () => ({
    openWindow: (id) => {
      setWindowStates((prev) => {
        const newState = {
          ...prev,
          [id]: {
            ...prev[id],
            visible: true,
            position: prev[id]?.position || getRandomPosition(),
          },
        };
        onWindowStateChange && onWindowStateChange(newState);
        return newState;
      });
    },
  }));

  const handleClose = (id) => {
    setWindowStates((prev) => {
      const newState = {
        ...prev,
        [id]: { ...prev[id], visible: false },
      };
      onWindowStateChange && onWindowStateChange(newState);
      return newState;
    });
  };

  const updatePosition = (id, newPosition) => {
    setWindowStates((prev) => {
      const newState = {
        ...prev,
        [id]: { ...prev[id], position: newPosition },
      };
      onWindowStateChange && onWindowStateChange(newState);
      return newState;
    });
  };

  return (
    <>
      <UserProfileWindow
        id="user"
        visible={windowStates.user.visible}
        onClose={handleClose}
        onMove={updatePosition}
        position={windowStates.user.position}
      />
      <MusicWindow
        id="music"
        visible={windowStates.music.visible}
        onClose={handleClose}
        onMove={updatePosition}
        position={windowStates.music.position}
      />
      <PomodoroWindow
        id="pomodoro"
        visible={windowStates.pomodoro.visible}
        onClose={handleClose}
        onMove={updatePosition}
        position={windowStates.pomodoro.position}
      />
    </>
  );
});

export default WindowManager;
