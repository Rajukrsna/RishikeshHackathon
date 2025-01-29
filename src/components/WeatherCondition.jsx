import React, { useState, useEffect } from 'react';
import './WeatherCondition.css';    
const WeatherCondition = () => {
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        // Fetch weather data from the backend
        fetch('http://localhost:5000/api/weather')
            .then((res) => res.json())
            .then((data) => setWeather(data))
            .catch((error) => console.error('Error fetching weather:', error));
    }, []);

    return (
        <div className="weather-card">
            {weather ? (
                <div className="weather-card-content">
                    <h4 className="weather-title">Weather</h4>
                    <p className="temperature">{weather.temperature}°C</p>
                    <p className="condition">{weather.condition}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default WeatherCondition;
