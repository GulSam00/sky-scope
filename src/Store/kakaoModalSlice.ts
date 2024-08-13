import { createSlice } from '@reduxjs/toolkit';

export const kakaoModalSlice = createSlice({
  name: 'kakaoModal',
  initialState: {
    isOpen: false,
    isResized: false,
  },
  reducers: {
    open: state => {
      state.isOpen = true;
    },
    close: state => {
      state.isOpen = false;
    },
    setResize: state => {
      state.isResized = true;
    },
    handleResize: state => {
      state.isResized = false;
    },
  },
});

export const { open, close, setResize, handleResize } = kakaoModalSlice.actions;

export default kakaoModalSlice.reducer;
