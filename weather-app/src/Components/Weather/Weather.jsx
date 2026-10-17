// Import React hooks and component styles
import React, { useEffect, useState, useRef } from "react";
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

const Weather = () => {
  // Reference to the input field for city search
  const inputRef = useRef();

  // Mapping weather condition codes to icon images
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
  };

  // State to hold weather data after fetching
  const [weatherData, setWeatherData] = useState(false);

  // Function to fetch weather data from OpenWeatherMap API
const search = async (city) => {
  if (city === "") {
    alert("Please enter a city name.");
    return;
  }

  try {
    // Step 1: Get coordinates from Geocoding API
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (!geoData.length) {
      alert("City not found. Try a more precise name.");
      return;
    }

    const { lat, lon, name, country } = geoData[0];

    // Step 2: Use coordinates to fetch weather
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    const icon = allIcons[weatherData.weather[0].icon] || clear_icon;

    setWeatherData({
      humidity: weatherData.main.humidity,
      windSpeed: weatherData.wind.speed,
      temperature: Math.floor(weatherData.main.temp),
      location: `The city ${name} is found in: ${country}`,
      icon: icon,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    setWeatherData(false);
  }
};

  // Fetch default weather data for "Adis abeba" on initial load
  useEffect(() => {
    search("Adiss abeba");
  }, []);

  return (
      <div className="weather">
        <h1 className="weather-header">Weather Condition App</h1>
        {/* Search bar with input and clickable search icon */}
        <div className="search-bar">
          <input type="text" ref={inputRef} placeholder="Enter City Name.... " />
          <img
            src={SearchIcon}
            alt=""
            onClick={() => search(inputRef.current.value)}
          />
        </div>

        {/* Conditional rendering: only show weather info if data is available */}
        {weatherData ? (
          <>
            {/* Weather icon */}
            {weatherData && (
              <img src={weatherData.icon} alt="" className="weather-icon" />
            )}

            {/* Temperature and location */}
            <p className="temperature"> {weatherData.temperature} °C</p>
            <p className="location">{weatherData.location}</p>

            {/* Humidity and wind speed section */}
            <div className="weather-data">
              <div className="col">
                <img src={humidityIcons} alt="" />
                <div>
                  <p>{weatherData.humidity} %</p>
                  <span>Hummidity</span>
                </div>
              </div>
              <div className="col">
                <img src={windIcon} alt="" />
                <div>
                  <p>{weatherData.windSpeed} km/hr</p>
                  <span>Wind Speed</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <></> // Empty fallback if no data is available
        )}
      </div>
  );
};

export default Weather;
