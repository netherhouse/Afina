// import React, { useState, useEffect } from "react";
import "./BottomPanel.scss";

import playIconPath from "../../assets/buttons/play.svg";
import playnextIconPath from "../../assets/buttons/play-next.svg";
import fullscreenIconPath from "../../assets/buttons/full-screen.svg";
import exitFullscreenIconPath from "../../assets/buttons/fullscreen-exit.svg";
import userIconPath from "../../assets/buttons/user.svg";
import clockIconPath from "../../assets/buttons/clock.svg";
import mixerIconPath from "../../assets/buttons/mixer.svg";
import tasksIconPath from "../../assets/buttons/tasks.svg";
import listsIconPath from "../../assets/buttons/lists.svg";
import pictureIconPath from "../../assets/buttons/picture.svg";
import financesIconPath from "../../assets/buttons/finances.svg";

import { UseFullscreen } from "./useFullscreen";
import ShowTime from "./showTime.jsx";
import ShowLocation from "./showLocation.jsx"

function BottomPanel({ openWindow, activeWindows = [], activeWindow = null }) {
  const { isFullscreen, toggleFullscreen } = UseFullscreen();

  return (
    <div className="bottom-panel">
      <div className="bottom-panel__icons">

        {/* Left side */}
        <div className="bottom-panel__icon-button">
          <img src={playIconPath} alt="Next Song" width={16} height={16} />
        </div>

        <div className="bottom-panel__icon-button">
          <img src={playnextIconPath} alt="Next Song" width={16} height={16} />
        </div>

        <div
          className={`bottom-panel__icon-button ${
            activeWindows?.includes("music") ? "active" : ""
          } ${activeWindow === "music" ? "focused" : ""}`}
          onClick={() => openWindow("music")}
        >
          <img src={mixerIconPath} alt="Mixer" width={16} height={16} />
        </div>
        <div className="bottom-panel__divider"></div>
        <div
          className={`bottom-panel__icon-button ${
            activeWindows?.includes("pomodoro") ? "active" : ""
          } ${activeWindow === "pomodoro" ? "focused" : ""}`}
          onClick={() => openWindow("pomodoro")}
        >
          <img src={clockIconPath} alt="Clock" width={16} height={16} />
        </div>

        <div className="bottom-panel__icon-button">
          <img src={tasksIconPath} alt="Tasks" width={18} height={18} />
        </div>

        <div className="bottom-panel__icon-button">
          <img src={listsIconPath} alt="Lists" width={24} height={24} />
        </div>

        <div className="bottom-panel__icon-button">
          <img src={pictureIconPath} alt="Gallery" width={14} height={14} />
        </div>

        <div className="bottom-panel__icon-button">
          <img src={financesIconPath} alt="Finances" width={16} height={16} />
        </div>
      </div>

      {/* Right side */}
      <div className="bottom-panel__icons">
        <ShowLocation />
        <ShowTime />
        <div className="bottom-panel__divider"></div>
        <div
          className={`bottom-panel__icon-button ${
            activeWindows?.includes("user") ? "active" : ""
          } ${activeWindow === "user" ? "focused" : ""}`}
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
