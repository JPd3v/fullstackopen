import axios from 'axios';

const baseUrl = 'http://localhost:3001/api/users';

const getAll = async () => {
  const config = { headers: { Authorization: 'token' } };

  const request = axios.get(baseUrl, config);
  const response = await request;
  return response.data;
};

export default { getAll };
