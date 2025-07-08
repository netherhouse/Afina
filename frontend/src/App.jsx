import React, { useRef, useState } from 'react';
import VideoBackground from './components/VideoBackground/VideoBackground';
import BottomPanel from './components/BottomPanel/BottomPanel';
import WindowManager from './components/Window/WindowManager';
import './App.css';

function App() {
  const windowManagerRef = useRef(null);
  const [windowStates, setWindowStates] = useState({});

  const handleWindowStateChange = (newStates) => {
    setWindowStates(newStates);
  };

  const openWindow = (id) => {
    windowManagerRef.current?.openWindow(id);
  };

  const activeWindows = Object.entries(windowStates)
    .filter(([_, state]) => state.visible)
    .map(([id]) => id);

  return (
    <div className="App">
      <VideoBackground />
      <BottomPanel openWindow={openWindow} activeWindows={activeWindows} />
      <WindowManager ref={windowManagerRef} onWindowStateChange={handleWindowStateChange} />
    </div>
  );
}

export default App;
