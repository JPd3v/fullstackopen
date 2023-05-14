import axios from "axios";
const baseUrl = "http://localhost:3001/";

const getAll = async () => {
  const request = await axios.get(`${baseUrl}anecdotes`);
  return request.data;
};

const newAnecdote = async (anecdote) => {
  const payload = {
    content: anecdote,
    votes: 0,
  };
  const request = await axios.post(`${baseUrl}anecdotes`, payload);

  return request.data;
};

const vote = async ({ content, votes, id }) => {
  const payload = {
    content,
    votes: votes + 1,
  };
  const request = await axios.put(`${baseUrl}anecdotes/${id}`, payload);

  return request.data;
};

const anecdoteService = { getAll, newAnecdote, vote };
export default anecdoteService;
