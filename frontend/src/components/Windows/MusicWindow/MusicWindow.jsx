import React from "react";
import Window from "../../Window/Window";
import "./MusicWindow.scss";

function MusicWindow({
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
      title="Музичний плеєр"
      icon="🎵"
      onClose={onClose}
      onMove={onMove}
      onResize={onResize}
      position={position}
      size={size}
      minWidth={320}
      minHeight={450}
      maxWidth={500}
      maxHeight={650}
    >
      <div className="music-player-content">
        {/* Пустое окно - контент будет добавлен позже */}
      </div>
    </Window>
  );
}

export default MusicWindow;
