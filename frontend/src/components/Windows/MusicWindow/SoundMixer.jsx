import React, {useEffect, useRef, useState} from "react";
import {Slider} from "@mui/material";
import playIconPath from "../../../assets/buttons/play.svg";
import stopIconPath from "../../../assets/buttons/stop.svg";

function SoundMixer({label, src}) {
    const [volume, setVolume] = useState(0.5);
    const [playing, setPlaying] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        const audio = new Audio(src);
        audio.loop = true;
        audio.volume = volume;
        audioRef.current = audio;

        return () => {
            audio.pause();
            audioRef.current = null;
        };
    }, [src]);

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

    return (
        <div className="sound-row">
            <div className="sound-label">{label}:</div>
            <Slider
                className="volume-slider"
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

                      '& .MuiSlider-thumb.Mui-active + .MuiSlider-track': {
                        backgroundColor: '#444444',
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
                          backgroundColor: '#444444',
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
                    style={{width: "24px", height: "24px"}}
                />
            </button>
        </div>
    );
}

export default SoundMixer;
