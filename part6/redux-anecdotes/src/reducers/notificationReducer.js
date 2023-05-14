import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  initialState: "",
  name: "notification",
  reducers: {
    addNotification(state, action) {
      return action.payload;
    },
    clearNotification(state, action) {
      return "";
    },
  },
});

export function setNotification(text, seconds = 5) {
  return (dispatch) => {
    dispatch(addNotification(text));
    setTimeout(() => {
      dispatch(clearNotification());
    }, seconds * 1000);
  };
}

export const { addNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
