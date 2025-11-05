import React from "react";
import Window from "../../Window/Window";
import "./UserProfileWindow.scss";

function UserProfileWindow({
  id,
  visible,
  onClose,
  onMove,
  onResize,
  position,
  size,
}) {
  if (!visible) return null;

  return (
    <Window
      id={id}
      title="Мій профіль"
      onClose={onClose}
      onMove={onMove}
      onResize={onResize}
      position={position}
      size={size}
      minWidth={320}
      minHeight={480}
      maxWidth={320}
      maxHeight={480}
      isResizable={false}
    >
      <div className="user-profile-content">
        {/* Пустое окно - контент будет добавлен позже */}
      </div>
    </Window>
  );
}

export default UserProfileWindow;
