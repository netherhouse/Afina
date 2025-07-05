// components/Window/Window.jsx
import React, { useState, useEffect } from 'react';
import './Window.css';

const Window = ({ id, title, onClose, onMove, position: initialPosition, children }) => {
  const [position, setPosition] = useState(initialPosition);

  useEffect(() => {
    if (initialPosition) {
      setPosition(initialPosition);
    }
  }, [initialPosition]);

  const handleDragStart = (e) => {
    e.preventDefault();
    const offsetX = e.clientX - position.x;
    const offsetY = e.clientY - position.y;

    const handleMouseMove = (e) => {
      const newX = e.clientX - offsetX;
      const newY = e.clientY - offsetY;

      const maxX = window.innerWidth - 300;
      const maxY = window.innerHeight - 200;
      const clampedX = Math.max(0, Math.min(newX, maxX));
      const clampedY = Math.max(0, Math.min(newY, maxY));

      const newPos = { x: clampedX, y: clampedY };
      setPosition(newPos);
      onMove(id, newPos); // сохранить позицию в WindowManager
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      className="window"
      style={{
        position: 'absolute',
        top: position.y,
        left: position.x,
        width: 300,
        height: 200,
      }}
    >
      <div className="window-header" onMouseDown={handleDragStart}>
        <span>{title}</span>
        <button className="close-button" onClick={() => onClose(id)}>×</button>
      </div>
      <div className="window-content">{children}</div>
    </div>
  );
};

export default Window;
