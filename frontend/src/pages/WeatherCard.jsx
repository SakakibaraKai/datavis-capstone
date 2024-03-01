import React from 'react';
import { NavLink  } from 'react-router-dom';

const WeatherCard = ({weatherData}) => {
    return (
        <div className="weather-card">
            <li key={weatherData.dt_txt}>
                <h2>{weatherData.city}</h2>
                <p>Date: {weatherData.dt_txt}</p>
                <p>Max Temperature: {weatherData.main.temp_max}</p>
                <p>Min Temperature: {weatherData.main.temp_min}</p>
                <p>Probability of Precipitation: {weatherData.pop}</p>
                <p>Description: {weatherData.weather[0].description}</p>
                <p>Weather Icon: <img src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt="Weather Icon" /></p>
            </li>
        </div>
    )
}

export default WeatherCard;