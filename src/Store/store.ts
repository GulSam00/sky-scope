import { configureStore } from "@reduxjs/toolkit";
import kakaoModalSliceReducer from "@src/Store/kakaoModalSlice";
import shortDataSliceReducer from "@src/Store/shortDataSlice";

export const store = configureStore({
  reducer: { kakaoModalSliceReducer, shortDataSliceReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
