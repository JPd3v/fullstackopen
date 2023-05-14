import { createSlice } from "@reduxjs/toolkit";
import anecdotesService from "../services/anecdotes";
import { setNotification } from "./notificationReducer";

const anecdotesSlice = createSlice({
  initialState: [],
  name: "anecdotes",
  reducers: {
    setAnecdotes(state, action) {
      return action.payload;
    },
    newAnecdote(state, action) {
      state.push(action.payload);
    },
    vote(state, action) {
      return state.map((anecdote) =>
        anecdote.id === action.payload
          ? { ...anecdote, votes: anecdote.votes + 1 }
          : anecdote
      );
    },
  },
});

export function initializeAnecdotes() {
  return async (dispatch) => {
    const anecdotes = await anecdotesService.getAll();

    dispatch(setAnecdotes(anecdotes));
  };
}

export function createAnecdote(content, seconds) {
  return async (dispatch) => {
    const savedAnecdote = await anecdotesService.newAnecdote(content);
    dispatch(newAnecdote(savedAnecdote));
    dispatch(setNotification(`${savedAnecdote.content} anecdote added`, seconds));
  };
}

export function voteAnecdote(anecdote, seconds) {
  return async (dispatch) => {
    const updatedAnecdote = await anecdotesService.vote(anecdote);
    dispatch(vote(updatedAnecdote.id));
    dispatch(setNotification(`you voted ${updatedAnecdote.content}`, seconds));
  };
}

export const { newAnecdote, vote, setAnecdotes } = anecdotesSlice.actions;
export default anecdotesSlice.reducer;
