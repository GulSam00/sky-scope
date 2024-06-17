import { createSlice } from '@reduxjs/toolkit';

export const shortDataSlice = createSlice({
  name: 'shortData',
  initialState: {
    isLoading: true,
    coord: {
      nx: 60,
      ny: 127,
    },
  },
  reducers: {
    loadingData: state => {
      state.isLoading = true;
    },
    loadedData: state => {
      state.isLoading = false;
    },

    setCoord: (state, action) => {
      state.coord = action.payload;
    },
  },
});

export const { loadingData, loadedData, setCoord } = shortDataSlice.actions;

export default shortDataSlice.reducer;
