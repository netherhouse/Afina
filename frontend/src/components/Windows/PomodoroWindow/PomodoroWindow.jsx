import React from 'react';
import Window from '../../Window/Window';

function PomodoroWindow({ id, visible, onClose, onMove, position }) {
  if (!visible) return null;

  return (
    <Window id={id}
            title="Таймер"
            onClose={onClose}
            onMove={onMove}
            position={position}>
    </Window>
  );
}

export default PomodoroWindow;