import React from 'react';
import Window from '../Window/Window';

function UserProfileWindow({ id, visible, onClose, onMove, position }) {
  if (!visible) return null;

  return (
    <Window id={id}
            title="Профіль"
            onClose={onClose}
            onMove={onMove}
            position={position}>
    </Window>
  );
}

export default UserProfileWindow;