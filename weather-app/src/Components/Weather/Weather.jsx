// Import React hooks and component styles
import React, { useEffect, useState, useRef, useCallback } from "react";
import "../Weather/Weather.css";

// Import image assets
import SearchIcon from "../../images/search-icon.png";
import clear_icon from "../../images/sunny-icon.png";
import CloudyIcon from "../../images/cloudy-icon.png";
import drizzleIcon from "../../images/drizzle-icon.png";
import rainIcon from "../../images/rainy-icon.png";
import humidityIcons from "../../images/humidity.png";
import snowIcon from "../../images/snow-icon.png";
import windIcon from "../../images/wind-icon.png";

// Import API key from local config file
import { API_KEY } from "../../Apikey.js";


const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": CloudyIcon,
    "02n": CloudyIcon,
    "03d": CloudyIcon,
    "03n": CloudyIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon,
  }

const Weather = () => {
  // Reference to the input field
  const inputRef = useRef(null);

  // Mapping weather condition codes to icons
;

  // Store weather data
  const [weatherData, setWeatherData] = useState(false);

  // Fetch weather data for a city
  const search = useCallback(async (city) => {
    const cityName = city.trim();

    if (!cityName) {
      alert("Please enter a city name.");
      return;
    }

    try {
      // Step 1: Get city coordinates
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
        cityName
      )}&limit=1&appid=${API_KEY}`;

      const geoResponse = await fetch(geoUrl);

      if (!geoResponse.ok) {
        throw new Error("Unable to find city coordinates.");
      }

      const geoData = await geoResponse.json();

      if (!geoData.length) {
        alert("City not found. Try a more precise name.");
        return;
      }

      const { lat, lon, name, country } = geoData[0];

      // Step 2: Fetch weather using coordinates
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

      const weatherResponse = await fetch(weatherUrl);

      if (!weatherResponse.ok) {
        throw new Error("Unable to fetch weather data.");
      }

      const data = await weatherResponse.json();

      const icon =
        allIcons[data.weather?.[0]?.icon] || clear_icon;

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: `The city ${name} is found in: ${country}`,
        icon,
      });
    } catch (error) {
      console.error("Error fetching weather data:", error);
      alert(
        "Unable to retrieve weather data. Check your internet connection and API key, then try again."
      );
    }
  }, []);

  // Fetch default weather on initial load
  useEffect(() => {
    search("Addis Ababa");
  }, [search]);

  // Search when the user presses Enter
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      search(inputRef.current?.value || "");
    }
  };

  return (
    <div className="weather">
      <h1 className="weather-header">Weather Condition App</h1>

      {/* City search */}
      <div className="search-bar">
        <input
          type="text"
          ref={inputRef}
          placeholder="Enter City Name..."
          onKeyDown={handleKeyDown}
        />

        <img
          src={SearchIcon}
          alt="Search weather"
          role="button"
          tabIndex={0}
          onClick={() => search(inputRef.current?.value || "")}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              search(inputRef.current?.value || "");
            }
          }}
        />
      </div>

      {/* Display weather data */}
      {weatherData && (
        <>
          <img
            src={weatherData.icon}
            alt="Current weather"
            className="weather-icon"
          />

          <p className="temperature">{weatherData.temperature} °C</p>
          <p className="location">{weatherData.location}</p>

          <div className="weather-data">
            <div className="col">
              <img src={humidityIcons} alt="Humidity" />
              <div>
                <p>{weatherData.humidity} %</p>
                <span>Humidity</span>
              </div>
            </div>

            <div className="col">
              <img src={windIcon} alt="Wind speed" />
              <div>
                <p>{weatherData.windSpeed} km/hr</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;
