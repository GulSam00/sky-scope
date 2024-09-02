import { createSlice } from '@reduxjs/toolkit';

export const globalDataSlice = createSlice({
  name: 'globalData',
  initialState: {
    isPhone: localStorage.getItem('isPhone') === 'true',
  },
  reducers: {
    phoneModeSwitch: state => {
      state.isPhone = !state.isPhone;
      localStorage.setItem('isPhone', state.isPhone ? 'true' : 'false');
    },
  },
});

export const { phoneModeSwitch } = globalDataSlice.actions;

export default globalDataSlice.reducer;
