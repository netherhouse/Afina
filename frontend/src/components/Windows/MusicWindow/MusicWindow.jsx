import React from "react";
import Window from "../../Window/Window";
import "./MusicWindow.scss";
import mixerIconPath from "../../../assets/buttons/mixer.svg";
import SoundMixer from "./SoundMixer";
import { FaTree, FaBuilding } from "react-icons/fa6";
import { GiMeditation } from "react-icons/gi";

const soundCategories = [
  {
    id: "nature",
    title: "Nature & Forest",
    icon: <FaTree />,
    sounds: [
      { id: "rain", label: "Rain", src: "/sounds/rain.mp3" },
      { id: "forest", label: "Forest", src: "/sounds/forest.mp3" },
      { id: "fire", label: "Fire", src: "/sounds/fire.mp3" },
      { id: "wind", label: "Wind", src: "/sounds/wind.mp3" },
    ],
  },
  {
    id: "city",
    title: "City & Household",
    icon: <FaBuilding />,
    sounds: [
      { id: "wind", label: "Wind", src: "/sounds/wind.mp3" },
      { id: "traffic", label: "Traffic", src: "/sounds/traffic.mp3" },
      { id: "cafe", label: "Cafe", src: "/sounds/cafe.mp3" },
      { id: "train", label: "Train", src: "/sounds/train.mp3" },
    ],
  },
  {
    id: "relax",
    title: "Relax & Meditation",
    icon: <GiMeditation />,
    sounds: [],
  },
];

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
      icon={
        <img
          src={mixerIconPath}
          alt="Mixer Icon"
          style={{ width: 14, height: 14 }}
        />
      }
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
      <div className="mixer-content">
        {soundCategories.map((category) => (
          <div key={category.id} className="mixer-section">
            <h3 className="section-title">
              <span className="section-icon">{category.icon}</span>
              <span className="section-label">{category.title}</span>
            </h3>
            <div className="sounds-list">
              {category.sounds.map((sound) => (
                <SoundMixer
                  key={sound.id}
                  label={sound.label}
                  src={sound.src}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Window>
  );
}

export default MusicWindow;
