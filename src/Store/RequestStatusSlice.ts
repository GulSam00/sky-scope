import { createSlice } from '@reduxjs/toolkit';

export const requestStatusSlice = createSlice({
  name: 'requestStatus',
  initialState: {
    isLoading: false,
    errorMessage: '',
  },
  reducers: {
    loadingData: state => {
      state.isLoading = true;
    },
    loadedData: state => {
      state.isLoading = false;
    },
    errorAccured: (state, action) => {
      state.errorMessage = action.payload;
    },
    handledError: state => {
      state.errorMessage = '';
    },
  },
});

export const { loadingData, loadedData, errorAccured, handledError } = requestStatusSlice.actions;

export default requestStatusSlice.reducer;
