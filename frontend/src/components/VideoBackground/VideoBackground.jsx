import React from 'react';
import './VideoBackground.css';

function VideoBackground() {
  return (
    <div className="video-container">
      <video className="background-video" autoPlay loop muted>
        <source src="/final3.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

export default VideoBackground;
