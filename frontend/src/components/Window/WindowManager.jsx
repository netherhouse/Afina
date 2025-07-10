import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import UserProfileWindow from "../Windows/UserProfileWindow/UserProfileWindow.jsx";
import MusicWindow from "../Windows/MusicWindow/MusicWindow.jsx";
import PomodoroWindow from "../Windows/PomodoroWindow/PomodoroWindow.jsx";

const getRandomPosition = () => {
  const padding = 50;
  const width = 450;
  const height = 600;
  const x = Math.random() * (window.innerWidth - width - padding);
  const y = Math.random() * (window.innerHeight - height - padding);
  return { x, y };
};

const STANDARD_WINDOW_SIZE = { width: 450, height: 600 };
const BASE_Z_INDEX = 1000;

const WindowManager = forwardRef((props, ref) => {
  const [windowStates, setWindowStates] = useState({
    user: {
      visible: false,
      position: getRandomPosition(),
      size: STANDARD_WINDOW_SIZE,
      zIndex: BASE_Z_INDEX,
      lastActiveTime: 0,
    },
    music: {
      visible: false,
      position: getRandomPosition(),
      size: STANDARD_WINDOW_SIZE,
      zIndex: BASE_Z_INDEX,
      lastActiveTime: 0,
    },
    pomodoro: {
      visible: false,
      position: getRandomPosition(),
      size: STANDARD_WINDOW_SIZE,
      zIndex: BASE_Z_INDEX,
      lastActiveTime: 0,
    },
  });

  const [activeWindow, setActiveWindow] = useState(null);

  const getActiveWindows = () => {
    return Object.keys(windowStates).filter((id) => windowStates[id].visible);
  };

  const bringToFront = (id) => {
    const currentTime = Date.now();
    setActiveWindow(id);

    setWindowStates((prev) => {
      const newStates = { ...prev };

      // Находим максимальный z-index среди видимых окон
      const maxZIndex = Math.max(
        ...Object.values(newStates)
          .filter((state) => state.visible)
          .map((state) => state.zIndex),
        BASE_Z_INDEX
      );

      // Устанавливаем активному окну максимальный z-index + 1
      newStates[id] = {
        ...newStates[id],
        zIndex: maxZIndex + 1,
        lastActiveTime: currentTime,
      };

      return newStates;
    });

    // Передаем информацию об активных окнах
    if (props.onActiveWindowsChange) {
      props.onActiveWindowsChange(getActiveWindows(), id);
    }
  };

  useImperativeHandle(ref, () => ({
    openWindow: (id) => {
      const currentTime = Date.now();
      setActiveWindow(id);

      setWindowStates((prev) => {
        const newStates = { ...prev };

        // Находим максимальный z-index
        const maxZIndex = Math.max(
          ...Object.values(newStates)
            .filter((state) => state.visible)
            .map((state) => state.zIndex),
          BASE_Z_INDEX
        );

        newStates[id] = {
          ...newStates[id],
          visible: true,
          position: prev[id]?.position || getRandomPosition(),
          size: STANDARD_WINDOW_SIZE,
          zIndex: maxZIndex + 1,
          lastActiveTime: currentTime,
        };

        return newStates;
      });

      // Передаем информацию об активных окнах
      setTimeout(() => {
        if (props.onActiveWindowsChange) {
          const activeWindows = getActiveWindows();
          props.onActiveWindowsChange([...activeWindows, id], id);
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

    // Если закрываем активное окно, находим новое активное
    if (activeWindow === id) {
      const remainingWindows = Object.keys(windowStates)
        .filter((windowId) => windowId !== id && windowStates[windowId].visible)
        .sort(
          (a, b) =>
            windowStates[b].lastActiveTime - windowStates[a].lastActiveTime
        );

      const newActiveWindow =
        remainingWindows.length > 0 ? remainingWindows[0] : null;
      setActiveWindow(newActiveWindow);
    }

    // Обновляем информацию об активных окнах
    setTimeout(() => {
      if (props.onActiveWindowsChange) {
        const activeWindows = Object.keys(windowStates).filter(
          (windowId) => windowId !== id && windowStates[windowId].visible
        );
        const newActiveWindow =
          activeWindows.length > 0
            ? activeWindows.sort(
                (a, b) =>
                  windowStates[b].lastActiveTime -
                  windowStates[a].lastActiveTime
              )[0]
            : null;
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

  // Логирование для отладки
  useEffect(() => {
    console.log("Window states updated:", windowStates);
    console.log("Active window:", activeWindow);
  }, [windowStates, activeWindow]);

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
        minWidth={450}
        minHeight={600}
        maxWidth={450}
        maxHeight={600}
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
        minWidth={450}
        minHeight={600}
        maxWidth={450}
        maxHeight={600}
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
        minWidth={450}
        minHeight={600}
        maxWidth={450}
        maxHeight={600}
      />
    </>
  );
});

export default WindowManager;
