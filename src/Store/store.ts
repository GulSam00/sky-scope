import { configureStore } from '@reduxjs/toolkit';
import kakaoModalSliceReducer from '@src/Store/kakaoModalSlice';
import shortDataSliceReducer from '@src/Store/shortDataSlice';
import locationDataSliceReducer from '@src/Store/locationDataSlice';
import requestStatusSliceReducer from '@src/Store/RequestStatusSlice';
import globalDataSliceReducer from '@src/Store/globalDataSlice';
import toastWeatherSliceReducer from '@src/Store/toastWeatherSlice';

export const store = configureStore({
  reducer: {
    kakaoModalSliceReducer,
    shortDataSliceReducer,
    locationDataSliceReducer,
    requestStatusSliceReducer,
    globalDataSliceReducer,
    toastWeatherSliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
