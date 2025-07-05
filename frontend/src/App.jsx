import React, { useState } from 'react';
import './App.css';
import VideoBackground from './components/VideoBackground/VideoBackground.jsx';
import BottomPanel from './components/BottomPanel/BottomPanel.jsx';
import UserProfileWindow from "./components/Windows/UserProfileWindow.jsx";
import MusicWindow from "./components/Windows/MusicWindow.jsx";

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

      {openWindows.includes('user-profile-window') && (
        <UserProfileWindow id="user-profile-window" onClose={closeWindow} />
      )}

      {openWindows.includes('music-window') && (
        <MusicWindow id="music-window" onClose={closeWindow} />
      )}

    </div>
  );
}

export default App;
