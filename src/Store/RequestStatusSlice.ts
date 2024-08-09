import { createSlice } from '@reduxjs/toolkit';

export const RequestStatusSlice = createSlice({
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

export const { loadingData, loadedData, errorAccured, handledError } = RequestStatusSlice.actions;

export default RequestStatusSlice.reducer;
