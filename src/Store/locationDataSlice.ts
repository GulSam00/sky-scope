import { createSlice } from "@reduxjs/toolkit";

export const locationDataSlice = createSlice({
  name: "locationData",
  initialState: {
    province: "",
    city: "",
  },
  reducers: {
    setProvince: (state, action) => {
      state.province = action.payload;
    },
    setCity: (state, action) => {
      state.city = action.payload;
    },
    initLocation: (state) => {
      state.province = localStorage.getItem("province") as string;
      state.city = localStorage.getItem("city") as string;
    },
  },
});

export const { setProvince, setCity, initLocation } = locationDataSlice.actions;

export default locationDataSlice.reducer;
