import React from 'react';
import Window from '../Window/Window';

const MusicWindow = ({ id, onClose }) => {
  return (
    <Window title="Музика" id={id} onClose={onClose}>
    </Window>
  );
};

export default MusicWindow;
