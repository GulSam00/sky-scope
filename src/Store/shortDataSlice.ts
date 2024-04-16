import { createSlice } from "@reduxjs/toolkit";
import { useQueryClient } from "@tanstack/react-query";

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
      state.isLoading = true;
      console.log("loadingData");
    },
    loadedData: (state) => {
      state.isLoading = false;
      console.log("loadedData");
    },
    setCoord: (state, action) => {
      state.coord = action.payload;
    },
  },
});

export const { loadingData, loadedData, setCoord } = shortDataSlice.actions;

export default shortDataSlice.reducer;
