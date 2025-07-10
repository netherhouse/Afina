import React, { useState, useEffect } from 'react';

export default function ShowTime() {
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return <div className="bottom-panel__time">{formattedTime}</div>;
}
