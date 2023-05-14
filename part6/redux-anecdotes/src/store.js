import filter from "./reducers/filterReducer";
import anecdotes from "./reducers/anecdoteReducer";
import notification from "./reducers/notificationReducer";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: { anecdotes, filter, notification },
});

export default store;
