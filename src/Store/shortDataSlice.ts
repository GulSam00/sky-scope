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
    setCoord: (state, action) => {
      state.coord = action.payload;
    },
  },
});

export const { setCoord } = shortDataSlice.actions;

export default shortDataSlice.reducer;
