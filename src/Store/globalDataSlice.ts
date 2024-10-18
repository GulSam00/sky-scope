import { createSlice } from '@reduxjs/toolkit';

export const globalDataSlice = createSlice({
  name: 'globalData',
  initialState: {
    isPhone: localStorage.getItem('isPhone') === 'true',
    isLogin: false,
    isAskLogin: false,
    loginType: '',
    id: '',
    nickname: '',
  },
  reducers: {
    phoneModeSwitch: state => {
      state.isPhone = !state.isPhone;
      localStorage.setItem('isPhone', state.isPhone ? 'true' : 'false');
    },
    onLogin: (state, action) => {
      state.isLogin = true;
      const { id, nickname, type } = action.payload;
      state.id = id;
      state.nickname = nickname;
      state.loginType = type;
    },
    onLogout: state => {
      state.isLogin = false;
      state.id = '';
      state.nickname = '';
      state.loginType = '';
    },
    askLogin: state => {
      state.isAskLogin = true;
    },
    resetAskLogin: state => {
      state.isAskLogin = false;
    },
  },
});

export const { phoneModeSwitch, onLogin, onLogout, askLogin, resetAskLogin } = globalDataSlice.actions;

export default globalDataSlice.reducer;
