import React, { useRef } from 'react';
import VideoBackground from './components/VideoBackground/VideoBackground';
import BottomPanel from './components/BottomPanel/BottomPanel';
import WindowManager from './components/Window/WindowManager';
import './App.css';

function App() {
  const windowManagerRef = useRef(null);

  return (
    <div className="App">
      <VideoBackground />
      <BottomPanel openWindow={(id) => windowManagerRef.current?.openWindow(id)} />
      <WindowManager ref={windowManagerRef} />
    </div>
  );
}

export default App;
