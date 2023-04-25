import { useEffect, useState } from "react";
import weatherService from "../services/weather";

export default function CapitalWeather({ city }) {
  const [cityWeather, setCityWeather] = useState(null);
  useEffect(() => {
    weatherService
      .getCityWeather(city)
      .then((response) => setCityWeather(response));
  }, [city]);
  return cityWeather ? (
    <div>
      <h2>Weather in {city}</h2>
      <p>temperature {cityWeather.main.temp}</p>
      <p>wind {cityWeather.wind.speed}</p>
      <img
        src={`https://openweathermap.org/img/wn/${cityWeather.weather[0].icon}@2x.png`}
      />
    </div>
  ) : null;
}
