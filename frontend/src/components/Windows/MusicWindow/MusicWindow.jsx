import React from "react";
import Window from "../../Window/Window";
import "./MusicWindow.scss";
import mixerIconPath from "../../../assets/buttons/mixer.svg";
import SoundMixer from "./SoundMixer";

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
      title="Mixer"
      icon={<img src={mixerIconPath} alt="Mixer Icon" style={{ width: 14, height: 14 }} />}
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
        <h3 className="music-player-content__header3">Nature Sounds</h3>
        <SoundMixer label="Rain" src="/sounds/rain.mp3" />
        <SoundMixer label="Forest" src="/sounds/forest.mp3" />
        <SoundMixer label="Fire" src="/sounds/fire.mp3" />
      </div>
    </Window>
  );
}

export default MusicWindow;
