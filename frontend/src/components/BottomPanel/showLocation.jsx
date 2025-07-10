import React, { useEffect, useState } from 'react';

const ShowLocation = () => {
  const [city, setCity] = useState(null);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;

        try {
          const res1 = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          if (!res1.ok) throw new Error(`Location HTTP ${res1.status}`);
          const json1 = await res1.json();
          const cityName = json1.city || json1.locality || json1.principalSubdivision || 'Unknown';
          setCity(cityName);
        } catch {
          setError('Failed to fetch city.');
          return;
        }

        try {
          const res2 = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
          );
          if (!res2.ok) throw new Error(`Weather HTTP ${res2.status}`);
          const json2 = await res2.json();
          setWeather(json2.current_weather); // { temperature, weathercode, ... }
        } catch {
          setError('Failed to fetch weather.');
        }
      },
      (err) => setError('Geolocation error: ' + err.message),
      { timeout: 5000 }
    );
  }, []);

  if (error) return <div>{error}</div>;
  if (!city) return <div></div>;

  return (
    <div className="bottom-panel__location">
      {city} {weather && (
        <span className="bottom-panel__weather">
          {Math.round(weather.temperature)}°C
        </span>
      )}
    </div>
  );
};

export default ShowLocation;
