import axios from "axios";
const baseUrl = "http://api.openweathermap.org/data/2.5/";
const getCityWeather = (city) => {
  return axios
    .get(
      `${baseUrl}weather?q=${city}&APPID=${
        import.meta.env.VITE_WEATHERMAP_API_KEY
      }&units=metric`
    )
    .then((response) => response.data);
};

export default {
  getCityWeather,
};
