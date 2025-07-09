import React, { useEffect, useRef, useState } from "react";
import Window from "../../Window/Window";
import "./MusicWindow.scss";
import { Slider } from "@mui/material";
import playIconPath from "../../../assets/buttons/play.svg";
import stopIconPath from "../../../assets/buttons/stop.svg";
import mixerIconPath from "../../../assets/buttons/mixer.svg";


function MusicWindow({
  id,
  visible,
  onClose,
  onMove,
  onResize,
  position,
  size,
}) {
  const [volume, setVolume] = useState(0.5);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio("/sounds/rain.mp3");
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

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
        <div className="sound-row">
          <div className="sound-label">Rain:</div>
          <Slider
              className={"volume-slider"}
              value={volume}
              onChange={(_, val) => setVolume(val)}
              min={0}
              max={1}
              step={0.01}
              sx={{
                color: "#525252",
                '& .MuiSlider-rail': {
                  backgroundColor: '#232323',
                },
                '& .MuiSlider-track': {
                  backgroundColor: '#525252',
                },
                '& .MuiSlider-thumb': {
                  backgroundColor: '#525252',
                  boxShadow: 'none',
                  border: 'none',

                  '&:hover': {
                    backgroundColor: '#949494',
                    boxShadow: 'none',
                  },
                  '&:active': {
                    backgroundColor: '#525252',
                    boxShadow: 'none',
                  },
                  '&:focus': {
                    outline: 'none',
                    boxShadow: 'none',
                  },
                  '&:focus-visible': {
                    outline: 'none',
                    boxShadow: 'none',
                  },
                },
              }}
            />

            <button className="icon-button" onClick={togglePlay}>
              <img
                src={playing ? stopIconPath : playIconPath}
                alt={playing ? "Stop" : "Play"}
                style={{ width: "24px", height: "24px" }}
              />
            </button>

        </div>
      </div>
    </Window>
  );
}

export default MusicWindow;
