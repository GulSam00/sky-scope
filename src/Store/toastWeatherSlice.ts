import { createSlice } from '@reduxjs/toolkit';
import { IParseObj } from '@src/API/getWeatherLive';

export const toastWeatherSlice = createSlice({
  name: 'toastWeather',
  initialState: [] as IParseObj[],
  reducers: {
    addToast: (state, action) => {
      if (state.map(toast => toast.placeId).includes(action.payload.placeId)) return;
      state.push(action.payload);
    },
    removeToast: state => {
      state.shift();
    },
    handledError: state => {
      state.pop(); // 마지막 Toast 제거
    },
  },
});

export const { addToast, removeToast, handledError } = toastWeatherSlice.actions;

export default toastWeatherSlice.reducer;
