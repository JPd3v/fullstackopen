import axios from 'axios';
const baseUrl = 'http://localhost:3001/api/blogs';

let token;

function setToken(userToken) {
  token = `Bearer ${userToken}`;
}

const getAll = async () => {
  const config = { headers: { Authorization: token } };

  const request = axios.get(baseUrl, config);
  const response = await request;
  return response.data;
};

const newBlog = async (title, author, url) => {
  const config = { headers: { Authorization: token } };

  const data = { title, url, author };
  const request = axios.post(baseUrl, data, config);
  const response = await request;
  return response.data;
};

const likeBlog = async (likes, id) => {
  const config = { headers: { Authorization: token } };

  const data = { likes: likes + 1 };
  const request = axios.put(`${baseUrl}/${id}`, data, config);
  const response = await request;
  return response.data;
};

const deleteBLog = async (id) => {
  const config = { headers: { Authorization: token } };

  const request = axios.delete(`${baseUrl}/${id}`, config);
  const response = await request;
  return response.data;
};

const getAllComments = async (id) => {
  const config = { headers: { Authorization: token } };

  const request = axios.get(`${baseUrl}/${id}/comments`, config);
  const response = await request;
  return response.data;
};

const newComment = async (text, id) => {
  const config = { headers: { Authorization: token } };

  const data = { text };
  const request = axios.post(`${baseUrl}/${id}/comments`, data, config);
  const response = await request;
  return response.data;
};

export default {
  getAll,
  setToken,
  newBlog,
  likeBlog,
  deleteBLog,
  token,
  newComment,
  getAllComments,
};
