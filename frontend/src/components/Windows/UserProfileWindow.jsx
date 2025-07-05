import React from 'react';
import Window from '../Window/Window';

const UserProfileWindow = ({ id, onClose }) => {
  return (
    <Window title="Профіль" id={id} onClose={onClose}>
    </Window>
  );
};

export default UserProfileWindow;
