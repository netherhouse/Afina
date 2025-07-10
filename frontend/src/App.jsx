import React, { useRef, useState } from "react";
import VideoBackground from "./components/VideoBackground/VideoBackground";
import BottomPanel from "./components/BottomPanel/BottomPanel";
import WindowManager from "./components/Window/WindowManager";
import "./App.scss";

function App() {
  const windowManagerRef = useRef(null);
  const [activeWindows, setActiveWindows] = useState([]);
  const [activeWindow, setActiveWindow] = useState(null);

  const handleActiveWindowsChange = (windows, focusedWindow) => {
    setActiveWindows(windows);
    setActiveWindow(focusedWindow);
  };

  return (
    <div className="App">
      <VideoBackground />
      <BottomPanel
        openWindow={(id) => windowManagerRef.current?.openWindow(id)}
        activeWindows={activeWindows}
        activeWindow={activeWindow}
      />
      <WindowManager
        ref={windowManagerRef}
        onActiveWindowsChange={handleActiveWindowsChange}
      />
    </div>
  );
}

export default App;
