import { configureStore } from '@reduxjs/toolkit';
import kakaoModalSliceReducer from '@src/Store/kakaoModalSlice';
import shortDataSliceReducer from '@src/Store/shortDataSlice';
import locationDataSliceReducer from '@src/Store/locationDataSlice';
import RequestStatusSliceReducer from '@src/Store/RequestStatusSlice';
import globalDataSliceReducer from '@src/Store/globalDataSlice';

export const store = configureStore({
  reducer: {
    kakaoModalSliceReducer,
    shortDataSliceReducer,
    locationDataSliceReducer,
    RequestStatusSliceReducer,
    globalDataSliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
