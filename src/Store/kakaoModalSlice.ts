import { createSlice } from '@reduxjs/toolkit';

export const kakaoModalSlice = createSlice({
  name: 'kakaoModal',
  initialState: {
    isOpenModal: false,
    isResized: false,
  },
  reducers: {
    open: state => {
      state.isOpenModal = true;
    },
    close: state => {
      state.isOpenModal = false;
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
