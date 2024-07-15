import { createSlice } from '@reduxjs/toolkit';

export const loadingStateSlice = createSlice({
  name: 'loadingState',
  initialState: {
    isLoading: false,
  },
  reducers: {
    loadingData: state => {
      state.isLoading = true;
    },
    loadedData: state => {
      state.isLoading = false;
    },
  },
});

export const { loadingData, loadedData } = loadingStateSlice.actions;

export default loadingStateSlice.reducer;
