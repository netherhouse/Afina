import React, { useState } from 'react';
import UserProfileWindow from '../Windows/UserProfileWindow';
import MusicWindow from '../Windows/MusicWindow.jsx';

function WindowManager() {
  const [openWindows, setOpenWindows] = useState([
    { id: 'user', component: 'UserProfileWindow' },
    { id: 'settings', component: 'SettingsWindow' },
  ]);

  const closeWindow = (id) => {
    setOpenWindows((windows) => windows.filter((w) => w.id !== id));
  };

  return (
    <>
      {openWindows.map(({ id, component }) => {
        if (component === 'UserProfileWindow') {
          return <UserProfileWindow key={id} id={id} onClose={closeWindow} />;
        }
        if (component === 'MusicWindow') {
          return <MusicWindow key={id} id={id} onClose={closeWindow} />;
        }
        return null;
      })}
    </>
  );
}

export default WindowManager;
