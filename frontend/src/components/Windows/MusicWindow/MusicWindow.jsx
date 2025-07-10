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
        <section className="music-player-content__section">
          <h3 className="music-player-content__header">Nature & Forest</h3>
          <SoundMixer label="Rain" src="/sounds/rain.mp3" />
          <SoundMixer label="Forest" src="/sounds/forest.mp3" />
          <SoundMixer label="Fire" src="/sounds/fire.mp3" />
        </section>
        <section className="music-player-content__section">
          <h3 className="music-player-content__header">City & Household</h3>
        </section>
        <section className="music-player-content__section">
          <h3 className="music-player-content__header">Relax & Meditation</h3>
        </section>
      </div>
    </Window>
  );
}

export default MusicWindow;
