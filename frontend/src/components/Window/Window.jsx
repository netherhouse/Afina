// components/Window/Window.jsx
import React, { useState, useEffect } from "react";
import "./Window.scss";

const Window = ({
  id,
  title,
  icon,
  onClose,
  onMove,
  onResize,
  onFocus,
  position: initialPosition,
  size: initialSize,
  zIndex = 1000, // Убедитесь, что есть значение по умолчанию
  isActive = false,
  children,
  minWidth = 320,
  minHeight = 240,
  maxWidth = 1200,
  maxHeight = 800,
  visible = true,
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize || { width: 400, height: 300 });
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    if (initialPosition) {
      setPosition(initialPosition);
    }
  }, [initialPosition]);

  useEffect(() => {
    if (initialSize) {
      setSize(initialSize);
    }
  }, [initialSize]);

  const handleWindowClick = () => {
    if (onFocus) {
      onFocus(id);
    }
  };

  const handleDragStart = (e) => {
    if (isResizing) return;
    e.preventDefault();

    // Bring window to front when starting to drag
    if (onFocus) {
      onFocus(id);
    }

    const offsetX = e.clientX - position.x;
    const offsetY = e.clientY - position.y;

    const handleMouseMove = (e) => {
      const newX = e.clientX - offsetX;
      const newY = e.clientY - offsetY;

      const maxX = window.innerWidth - size.width;
      const maxY = window.innerHeight - size.height;
      const clampedX = Math.max(0, Math.min(newX, maxX));
      const clampedY = Math.max(0, Math.min(newY, maxY));

      const newPos = { x: clampedX, y: clampedY };
      setPosition(newPos);
      onMove(id, newPos);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleResizeStart = (e, direction) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);

    // Bring window to front when starting to resize
    if (onFocus) {
      onFocus(id);
    }

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;
    const startPosX = position.x;
    const startPosY = position.y;

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startPosX;
      let newY = startPosY;

      switch (direction) {
        case "se":
          newWidth = Math.max(
            minWidth,
            Math.min(maxWidth, startWidth + deltaX)
          );
          newHeight = Math.max(
            minHeight,
            Math.min(maxHeight, startHeight + deltaY)
          );
          break;
        case "sw":
          newWidth = Math.max(
            minWidth,
            Math.min(maxWidth, startWidth - deltaX)
          );
          newHeight = Math.max(
            minHeight,
            Math.min(maxHeight, startHeight + deltaY)
          );
          if (newWidth !== startWidth - deltaX) {
            newX = startPosX;
          } else {
            newX = startPosX + deltaX;
          }
          break;
        case "ne":
          newWidth = Math.max(
            minWidth,
            Math.min(maxWidth, startWidth + deltaX)
          );
          newHeight = Math.max(
            minHeight,
            Math.min(maxHeight, startHeight - deltaY)
          );
          if (newHeight !== startHeight - deltaY) {
            newY = startPosY;
          } else {
            newY = startPosY + deltaY;
          }
          break;
        case "nw":
          newWidth = Math.max(
            minWidth,
            Math.min(maxWidth, startWidth - deltaX)
          );
          newHeight = Math.max(
            minHeight,
            Math.min(maxHeight, startHeight - deltaY)
          );
          if (newWidth !== startWidth - deltaX) {
            newX = startPosX;
          } else {
            newX = startPosX + deltaX;
          }
          if (newHeight !== startHeight - deltaY) {
            newY = startPosY;
          } else {
            newY = startPosY + deltaY;
          }
          break;
        case "e":
          newWidth = Math.max(
            minWidth,
            Math.min(maxWidth, startWidth + deltaX)
          );
          break;
        case "w":
          newWidth = Math.max(
            minWidth,
            Math.min(maxWidth, startWidth - deltaX)
          );
          if (newWidth !== startWidth - deltaX) {
            newX = startPosX;
          } else {
            newX = startPosX + deltaX;
          }
          break;
        case "s":
          newHeight = Math.max(
            minHeight,
            Math.min(maxHeight, startHeight + deltaY)
          );
          break;
        case "n":
          newHeight = Math.max(
            minHeight,
            Math.min(maxHeight, startHeight - deltaY)
          );
          if (newHeight !== startHeight - deltaY) {
            newY = startPosY;
          } else {
            newY = startPosY + deltaY;
          }
          break;
      }

      const maxX = window.innerWidth - newWidth;
      const maxY = window.innerHeight - newHeight;
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));

      const newSize = { width: newWidth, height: newHeight };
      const newPos = { x: newX, y: newY };

      setSize(newSize);
      setPosition(newPos);

      if (onResize) onResize(id, newSize);
      onMove(id, newPos);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  if (!visible) return null;

  // Логирование для отладки
  console.log(`Window ${id} - zIndex: ${zIndex}, isActive: ${isActive}`);

  return (
    <div
      className={`window ${isActive ? "window--active" : ""}`}
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        width: size.width,
        height: size.height,
        zIndex: zIndex, // Убедитесь, что z-index применяется
      }}
      onClick={handleWindowClick}
    >
      <div className="window-header" onMouseDown={handleDragStart}>
        <div className="window-title">
          {icon && <span className="window-icon">{icon}</span>}
          {title}
        </div>
        <div className="header-controls">
          <button className="close-button" onClick={() => onClose(id)}>
            ✕
          </button>
        </div>
      </div>
      <div className="window-content">{children}</div>

      <div className="resize-handles">
        <div
          className="resize-handle resize-handle-nw"
          onMouseDown={(e) => handleResizeStart(e, "nw")}
        />
        <div
          className="resize-handle resize-handle-n"
          onMouseDown={(e) => handleResizeStart(e, "n")}
        />
        <div
          className="resize-handle resize-handle-ne"
          onMouseDown={(e) => handleResizeStart(e, "ne")}
        />
        <div
          className="resize-handle resize-handle-e"
          onMouseDown={(e) => handleResizeStart(e, "e")}
        />
        <div
          className="resize-handle resize-handle-se"
          onMouseDown={(e) => handleResizeStart(e, "se")}
        />
        <div
          className="resize-handle resize-handle-s"
          onMouseDown={(e) => handleResizeStart(e, "s")}
        />
        <div
          className="resize-handle resize-handle-sw"
          onMouseDown={(e) => handleResizeStart(e, "sw")}
        />
        <div
          className="resize-handle resize-handle-w"
          onMouseDown={(e) => handleResizeStart(e, "w")}
        />
      </div>
    </div>
  );
};

export default Window;
