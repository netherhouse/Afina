import React, { useState } from "react";
import "./VideoBackground.scss";
import pictureIconPath from "../../assets/buttons/picture.svg";
import downIconPath from "../../assets/buttons/down.svg";

function VideoBackground() {
  const getRandomVideo = () => `/video${Math.floor(Math.random() * 15)}.mp4`;
  const [videoSrc, setVideoSrc] = useState(getRandomVideo());

  const [isFading, setIsFading] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleVideoChange = (newSrc) => {
    setIsFading(true);
    setTimeout(() => setVideoSrc(newSrc), 500);
    setTimeout(() => setIsFading(false), 1000);
    setIsPanelOpen(false);
  };

  return (
    <>
      <button className="menu-button" onClick={() => setIsPanelOpen(true)}>
        <img
          src={pictureIconPath}
          alt="Choose background"
          width={18}
          height={18}
        />
        <img src={downIconPath} alt="down" width={18} height={18} />
      </button>

      <div className={`side-panel ${isPanelOpen ? "open" : ""}`}>
        <div className="side-panel-header">
          <span></span>
          <button
            className="close-button"
            onClick={() => setIsPanelOpen(false)}
          >
            ✖
          </button>
        </div>
        <div className="video-list">
          {Array.from({ length: 14 }, (_, i) => {
            const num = i;
            const src = `/video${num}.mp4`;
            const previewSrc = `/video-preview/video${num}.jpg`;

            return (
              <div
                key={num}
                className="video-preview"
                onClick={() => handleVideoChange(src)}
                title={`Video ${num}`}
              >
                <div className="preview-thumb">
                  <img
                    src={previewSrc}
                    alt={`Preview ${num}`}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/video-preview/default.png";
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="video-container">
        <video key={videoSrc} className="background-video" autoPlay loop muted>
          <source src={videoSrc} type="video/mp4" />
        </video>
        <div className={`overlay ${isFading ? "fade-in" : "fade-out"}`}></div>
      </div>
    </>
  );
}

export default VideoBackground;
