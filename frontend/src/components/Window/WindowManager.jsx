import React, { forwardRef, useImperativeHandle, useState } from 'react';
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

const WindowManager = forwardRef((_, ref) => {
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
