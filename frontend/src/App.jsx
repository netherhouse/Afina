import React, { useState } from 'react';
import VideoBackground from './components/VideoBackground/VideoBackground.jsx';
import BottomPanel from './components/BottomPanel/BottomPanel.jsx';
import Window from './components/Window/Window.jsx';
import './App.css';

function App() {
  const [openWindows, setOpenWindows] = useState([]);

  const openWindow = (windowId) => {
    if (!openWindows.includes(windowId)) {
      setOpenWindows([...openWindows, windowId]);
    }
  };

  const closeWindow = (windowId) => {
    setOpenWindows(openWindows.filter(id => id !== windowId));
  };

  return (
    <div className="App">
      <VideoBackground />
      <BottomPanel openWindow={openWindow} />
      {openWindows.includes('window-1') && (
        <Window id="window-1" title="Вікно" onClose={closeWindow}>
          <p>Контент</p>
        </Window>
      )}
    </div>
  );
}

export default App;
