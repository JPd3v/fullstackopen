import axios from "axios";
const baseUrl = "https://restcountries.com";
const getAll = () => {
  return axios.get(`${baseUrl}/v3.1/all`).then((response) => response.data);
};

export default {
  getAll,
};
