import './App.css'
import humidityIcon from './assets/humidity.png'
import windIcon from './assets/wind.png'
import searchIcon from './assets/search.png'

import clearIconDay from './assets/01d.png'
import clearIconNight from './assets/01n.png'
import cloudIconDay from './assets/02d.png'
import cloudIconNight from './assets/02n.png'
import scaterrIconDay from './assets/03d.png'
import scaterrIconNight from './assets/03n.png'
import brokenIconDay from './assets/04d.png'
import brokenIconNight from './assets/04n.png'
import showerrainIconDay from './assets/09d.png'
import showerrainIconNight from './assets/09n.png'
import rainIconDay from './assets/10d.png'
import rainIconNight from './assets/10n.png'
import thunderIconDay from './assets/11d.png'
import thunderIconNight from './assets/11n.png'
import snowIconDay from './assets/13d.png'
import snowIconNight from './assets/13n.png'
import mistIconDay from './assets/50d.png'
import mistIconNight from './assets/50n.png'

import { useEffect, useState } from 'react';

const WeatherDetails = ({ icon, temp, city, country, lat, lon, humidity, wind }) => {
  return (
    <>
      <div className='image'>
        <img src={icon} alt="Weather Icon" />
      </div>
      <div className="temp">{temp} °C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div>
          <span>Latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span>Longitude</span>
          <span>{lon}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidityIcon} alt="Humidity" className='icon' />
          <div className="data">
            <div className="humidity-percent">{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={windIcon} alt="Wind" className='icon' />
          <div className="data">
            <div className="wind-percent">{wind} km/h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  );
};

function App() {
  const API_KEY = "b4867d008ed143e78f78a6c8d9c86d09";
  const [text, setText] = useState("Coimbatore");
  const [icon, setIcon] = useState(clearIconDay);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("Coimbatore");
  const [country, setCountry] = useState("IN");
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  const [error, setError] = useState(null);
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const weatherIconMap = {
    "01d": clearIconDay,
    "01n": clearIconNight,
    "02d": cloudIconDay,
    "02n": cloudIconNight,
    "03d": scaterrIconDay,
    "03n": scaterrIconNight,
    "04d": brokenIconDay,
    "04n": brokenIconNight,
    "09d": showerrainIconDay,
    "09n": showerrainIconNight,
    "10d": rainIconDay,
    "10n": rainIconNight,
    "11d": thunderIconDay,
    "11n": thunderIconNight,
    "13d": snowIconDay,
    "13n": snowIconNight,
    "50d": mistIconDay,
    "50n": mistIconNight,
  };

  const search = async (queryText) => {
    const query = queryText?.trim() || text.trim();
    if (!query) {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setError(null);
    setCityNotFound(false);

    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${API_KEY}&units=metric`);
      const data = await res.json();

      if (data.cod === "404") {
        setCityNotFound(true);
        return;
      }

      if (data.cod !== 200) {
        setError(data.message || "Something went wrong.");
        return;
      }

      setTemp(Math.floor(data.main.temp));
      setHumidity(data.main.humidity);
      setWind(Math.round(data.wind.speed));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(Math.round(data.coord.lat * 100) / 100);
      setLon(Math.round(data.coord.lon * 100) / 100);

      const iconCode = data.weather[0].icon;
      setIcon(weatherIconMap[iconCode] || clearIconDay);
    } catch (err) {
      setError("Failed to fetch weather data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") search();
  };

  useEffect(() => {
    search("Coimbatore");
  }, []);

  return (
    <div className="container">
      <div className="input-container">
        <input
          type="text"
          className="cityInput"
          placeholder="Enter city name..."
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setError(null);
            setCityNotFound(false);
          }}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <div className="search-icon" onClick={() => search()}>
          <img src={searchIcon} alt="Search" />
        </div>
      </div>

      {loading && <div className="loading">Loading...</div>}
      {!loading && cityNotFound && <div className="city-Not-found">City Not Found</div>}
      {!loading && error && <div className="error">{error}</div>}
      {!loading && !error && !cityNotFound && (
        <WeatherDetails
          icon={icon}
          temp={temp}
          city={city}
          country={country}
          lat={lat}
          lon={lon}
          humidity={humidity}
          wind={wind}
        />
      )}

      <p className="footer">
        Designed by Lalitha
      </p>
    </div>
  );
}

export default App;
