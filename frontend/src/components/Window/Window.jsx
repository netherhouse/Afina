import React, { useState, useEffect } from 'react';
import './Window.css';

const Window = ({ title, onClose, id, children }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const centerX = (window.innerWidth - 300) / 2;
    const centerY = (window.innerHeight - 200) / 2;
    setPosition({ x: centerX, y: centerY });
  }, []);

  const handleDragStart = (e) => {
    e.preventDefault();
    const offsetX = e.clientX - position.x;
    const offsetY = e.clientY - position.y;

    const handleDragMove = (e) => {
      let newX = e.clientX - offsetX;
      let newY = e.clientY - offsetY;

      const maxX = window.innerWidth - 300;
      const maxY = window.innerHeight - 200;
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));

      setPosition({ x: newX, y: newY });
    };

    const handleDragEnd = () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
    };

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
  };

  const closeWindow = () => {
    setIsOpen(false);
    onClose(id);
  };

  if (!isOpen) return null;

  return (
    <div
      className="window"
      style={{ top: position.y, left: position.x, position: 'absolute', width: 300, height: 200 }}
      onMouseDown={handleDragStart}
    >
      <div className="window-header">
        <span>{title}</span>
        <button className="close-button" onClick={closeWindow}>
          ×
        </button>
      </div>
      <div className="window-content">{children}</div>
    </div>
  );
};

export default Window;
