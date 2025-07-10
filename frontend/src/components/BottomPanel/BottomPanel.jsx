// import React, { useState, useEffect } from "react";
import "./BottomPanel.scss";

import playIconPath from "../../assets/buttons/play.svg";
import playnextIconPath from "../../assets/buttons/play-next.svg";
import fullscreenIconPath from "../../assets/buttons/full-screen.svg";
import exitFullscreenIconPath from "../../assets/buttons/fullscreen-exit.svg";
import userIconPath from "../../assets/buttons/user.svg";
import clockIconPath from "../../assets/buttons/clock.svg";
import mixerIconPath from "../../assets/buttons/mixer.svg";

import { UseFullscreen } from "./useFullscreen";
import ShowTime from "./showTime.jsx";

function BottomPanel({ openWindow, activeWindows }) {
  const { isFullscreen, toggleFullscreen } = UseFullscreen();

  return (
    <div className="bottom-panel">
      <div className="bottom-panel__icons">
        <div className="bottom-panel__icon-button">
          <img src={playIconPath} alt="Next Song" width={18} height={18} />
        </div>
        <div className="bottom-panel__icon-button">
          <img src={playnextIconPath} alt="Next Song" width={18} height={18} />
        </div>

        <div
          className={`bottom-panel__icon-button ${
            activeWindows?.includes("music") ? "active" : ""
          }`}
          onClick={() => openWindow("music")}
        >
          <img src={mixerIconPath} alt="Play music" width={18} height={18} />
        </div>
        <div className="bottom-panel__divider"></div>
        <div
          className={`bottom-panel__icon-button ${
            activeWindows?.includes("pomodoro") ? "active" : ""
          }`}
          onClick={() => openWindow("pomodoro")}
        >
          <img src={clockIconPath} alt="Clock" width={16} height={16} />
        </div>
      </div>

      <div className="bottom-panel__icons">
        <ShowTime />
        <div className="bottom-panel__divider"></div>
        <div
          className={`bottom-panel__icon-button ${
            activeWindows?.includes("user") ? "active" : ""
          }`}
          onClick={() => openWindow("user")}
        >
          <img src={userIconPath} alt="Profile" width={18} height={18} />
        </div>
        <div className="bottom-panel__icon-button" onClick={toggleFullscreen}>
          <img
            src={isFullscreen ? exitFullscreenIconPath : fullscreenIconPath}
            alt={isFullscreen ? "Exit Full Screen" : "Full Screen"}
            width={18}
            height={18}
          />
        </div>
      </div>
    </div>
  );
}

export default BottomPanel;
