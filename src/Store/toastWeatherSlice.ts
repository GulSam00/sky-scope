import { createSlice } from '@reduxjs/toolkit';
import { KakaoSearchType } from '@src/Types/liveDataType';

export const toastWeatherSlice = createSlice({
  name: 'toastWeather',
  initialState: [] as KakaoSearchType[],
  reducers: {
    addToast: (state, action) => {
      if (state.map(toast => toast.localeCode).includes(action.payload.localeCode)) return;
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
