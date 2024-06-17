import { createSlice } from '@reduxjs/toolkit';

export const kakaoModalSlice = createSlice({
  name: 'kakaoModal',
  initialState: {
    isOpen: false,
  },
  reducers: {
    open: state => {
      state.isOpen = true;
    },
    close: state => {
      state.isOpen = false;
    },
  },
});

export const { open, close } = kakaoModalSlice.actions;

export default kakaoModalSlice.reducer;
