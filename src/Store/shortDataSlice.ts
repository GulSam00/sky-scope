import { createSlice } from "@reduxjs/toolkit";

export const shortDataSlice = createSlice({
  name: "shortData",
  initialState: {
    isLoading: false,
    coord: {
      nx: 60,
      ny: 127,
    },
  },
  reducers: {
    loadingData: (state) => {
      console.log("loadingData 호출");
      state.isLoading = true;
    },
    loadedData: (state) => {
      state.isLoading = false;
    },
    toggleLoadingState: (state) => {
      state.isLoading = !state.isLoading;
    },
    setCoord: (state, action) => {
      state.coord = action.payload;
    },
  },
});

export const { loadingData, loadedData, toggleLoadingState, setCoord } =
  shortDataSlice.actions;

export default shortDataSlice.reducer;
