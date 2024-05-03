import { configureStore } from "@reduxjs/toolkit";
import kakaoModalSliceReducer from "@src/Store/kakaoModalSlice";
import shortDataSliceReducer from "@src/Store/shortDataSlice";
import locationDataSlice from "@src/Store/locationDataSlice";

export const store = configureStore({
  reducer: { kakaoModalSliceReducer, shortDataSliceReducer, locationDataSlice },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
