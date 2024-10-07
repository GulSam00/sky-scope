import axios, { AxiosInstance } from 'axios';

import getKakaoToken from './getKakaoToken';

const url = import.meta.env.VITE_KAKAO_URL;

const instance: AxiosInstance = axios.create({
  baseURL: url,
  timeout: 3000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    charset: 'utf-8',
  },
});

instance.interceptors.request.use(config => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

const getKakaoInfo = async () => {
  try {
    const response = await instance.get('/user/me');
    const data = response.data;
    return data;
  } catch (e: any) {
    console.log('error : ', e);
    let message;
    if (e.response.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      const result = await getKakaoToken('refresh_token', `refresh_token=${refreshToken}`);
      if (!result) return null; // result가 없으면 null 반환;
      localStorage.setItem('accessToken', result.access_token);
      localStorage.setItem('refreshToken', result.refresh_token);
      const response = await instance.get('/user/me');
      const data = response.data.response;
      return data;
    }
    if (e instanceof Error) message = e.message;
    else message = '/getNaverInfo error';
    console.error(message);
  }
};

export default getKakaoInfo;
