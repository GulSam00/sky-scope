import { createSlice } from '@reduxjs/toolkit';

export const globalDataSlice = createSlice({
  name: 'globalData',
  initialState: {
    isPhone: localStorage.getItem('isPhone') === 'true',
    isLogin: false,
    loginType: '',
    id: '',
  },
  reducers: {
    phoneModeSwitch: state => {
      state.isPhone = !state.isPhone;
      localStorage.setItem('isPhone', state.isPhone ? 'true' : 'false');
    },
    onLogin: (state, action) => {
      state.isLogin = true;
      const { id, type } = action.payload;
      state.id = id;
      state.loginType = type;
    },
    onLogout: state => {
      state.isLogin = false;
      state.id = '';
      state.loginType = '';
    },
  },
});

export const { phoneModeSwitch, onLogin, onLogout } = globalDataSlice.actions;

export default globalDataSlice.reducer;
