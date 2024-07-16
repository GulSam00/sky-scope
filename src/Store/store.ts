import { configureStore } from '@reduxjs/toolkit';
import kakaoModalSliceReducer from '@src/Store/kakaoModalSlice';
import shortDataSliceReducer from '@src/Store/shortDataSlice';
import locationDataSliceReducer from '@src/Store/locationDataSlice';
import loadingStateSliceReducer from '@src/Store/loadingStateSlice';

export const store = configureStore({
  reducer: {
    kakaoModalSliceReducer,
    shortDataSliceReducer,
    locationDataSliceReducer,
    loadingStateSliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
