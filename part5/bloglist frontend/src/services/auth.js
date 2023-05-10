import axios from "axios";
const baseUrl = "http://localhost:3001/api/";

const logIn = async (username, password) => {
  const payload = {
    username,
    password,
  };

  const request = axios.post(`${baseUrl}login`, payload);
  const response = await request;
  return response.data;
};

export { logIn };
