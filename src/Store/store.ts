import { configureStore } from "@reduxjs/toolkit";
import kakaoModalSliceReducer from "@src/Store/kakaoModalSlice";

export const store = configureStore({
  reducer: { kakaoModalSliceReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
