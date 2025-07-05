import React from 'react';
import Window from '../../Window/Window';

function MusicWindow({ id, visible, onClose, onMove, position }) {
  if (!visible) return null;

  return (
    <Window id={id}
            title="Музика"
            onClose={onClose}
            onMove={onMove}
            position={position}>
    </Window>
  );
}

export default MusicWindow;