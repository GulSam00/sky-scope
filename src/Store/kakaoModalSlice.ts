import { createSlice } from "@reduxjs/toolkit";

export const kakaoModalSlice = createSlice({
  name: "kakaoModal",
  initialState: {
    isOpen: false,
  },
  reducers: {
    open: (state) => {
      state.isOpen = true;
    },
    close: (state) => {
      state.isOpen = false;
    },
    toggle: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { open, close, toggle } = kakaoModalSlice.actions;

export default kakaoModalSlice.reducer;
