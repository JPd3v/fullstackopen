import { createSlice } from "@reduxjs/toolkit";

const filterSlice = createSlice({
  initialState: "",
  name: "filter",
  reducers: {
    filter(state, action) {
      return action.payload;
    },
  },
});

export const { filter } = filterSlice.actions;
export default filterSlice.reducer;
