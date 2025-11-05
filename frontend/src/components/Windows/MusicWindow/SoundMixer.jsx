import React, { useEffect, useRef, useState, useCallback } from "react";
import { BsPlayCircleFill, BsStopCircleFill } from "react-icons/bs";

function SoundMixer({ label, src }) {
  const [volume, setVolume] = useState(0.5);
  const [playing, setPlaying] = useState(false);
  const [inputValue, setInputValue] = useState("50");
  const [isDragging, setIsDragging] = useState(false);
  const [dragPercent, setDragPercent] = useState(null);
  const audioRef = useRef(null);
  const sliderRef = useRef(null);

  // Number of dots for the slider (reduced for cleaner look)
  const VISUAL_DOTS = 20;

  // Initialize audio only once when component mounts
  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
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

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
  };

  const handleInputBlur = () => {
    let numValue = parseInt(inputValue, 10);
    if (isNaN(numValue)) {
      numValue = 50;
    }
    numValue = Math.max(0, Math.min(100, numValue));
    setInputValue(numValue.toString());
    setVolume(numValue / 100);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      handleInputBlur();
    }
  };

  useEffect(() => {
    const percent = Math.round(volume * 100);
    setInputValue(percent.toString());
  }, [volume]);

  const visualDots = [];
  for (let i = 0; i < VISUAL_DOTS; i++) {
    const leftPercent = (i / (VISUAL_DOTS - 1)) * 100;
    visualDots.push(leftPercent);
  }

  const getSliderPosition = useCallback(() => {
    if (isDragging && dragPercent !== null) {
      return dragPercent;
    }
    return volume * 100;
  }, [isDragging, dragPercent, volume]);

  const getProgressPercent = useCallback(() => {
    const basePercent = getSliderPosition();

    if (!sliderRef.current) {
      return basePercent;
    }

    if (!isDragging) {
      if (volume === 0) return 0;
      if (volume === 1) return 100;
    } else if (isDragging && dragPercent !== null) {
      if (dragPercent <= 0.5) return 0;
      if (dragPercent >= 99.5) return 100;
    }

    const containerPadding = 12;
    const containerWidth = sliderRef.current.getBoundingClientRect().width;
    const trackWidth = containerWidth - containerPadding * 2;
    const handleCenterPx = (basePercent / 100) * trackWidth;
    const fillToCenterPx = containerPadding + handleCenterPx;
    const fillPercent = (fillToCenterPx / containerWidth) * 100;

    return Math.max(0, Math.min(100, fillPercent));
  }, [getSliderPosition, isDragging, dragPercent, volume]);

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
    setDragPercent(volume * 100);
  }, [volume]);

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging || !sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const percentage = Math.max(
        0,
        Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)
      );

      setDragPercent(percentage);

      const newVolume = percentage / 100;
      setVolume(newVolume);
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragPercent(null);
  }, []);

  const handleDotClick = (index) => {
    const newVolume = index / (VISUAL_DOTS - 1);
    setVolume(newVolume);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    const progress = getProgressPercent();
    const handlePos = getSliderPosition();
    el.style.setProperty("--progress", `${progress}%`);
    el.style.setProperty("--handle-position", `${handlePos}%`);
  }, [volume, isDragging, dragPercent, getProgressPercent, getSliderPosition]);

  return (
    <div className="sound-row">
      <div className="sound-label">{label}:</div>

      <div className="volume-slider-container" ref={sliderRef}>
        <div className="slider-track">
          {/* Track dots */}
          {visualDots.map((leftPercent, index) => {
            const dotValue = index / (VISUAL_DOTS - 1);
            const isActiveDot = Math.abs(dotValue - volume) < 0.01;
            const isCompleted = volume > dotValue;

            return (
              <div
                key={index}
                className={`slider-dot ${
                  isActiveDot ? "active" : isCompleted ? "completed" : ""
                }`}
                style={{ left: `${leftPercent}%` }}
                onClick={() => handleDotClick(index)}
              />
            );
          })}

          {/* Slider handle */}
          <div
            className="slider-handle"
            style={{ left: `${getSliderPosition()}%` }}
            onMouseDown={handleMouseDown}
          />
        </div>
      </div>

      <input
        type="text"
        className="volume-input"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyDown={handleInputKeyDown}
        maxLength={3}
      />

      <button
        className={`play-button ${playing ? "playing" : ""}`}
        onClick={togglePlay}
      >
        {playing ? "⏹" : "▶"}
      </button>
    </div>
  );
}

export default SoundMixer;
