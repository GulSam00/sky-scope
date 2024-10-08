import axios, { AxiosInstance } from 'axios';

import getNaverToken from './getNaverToken';

const url = import.meta.env.VITE_NAVER_URL;

const instance: AxiosInstance = axios.create({
  baseURL: url,
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(config => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

export interface getInfoReturn {
  id: string;
  nickname: string;
}

const getNaverInfo = async (): Promise<getInfoReturn | null> => {
  try {
    const response = await instance.get('/nid/me');
    const data = response.data.response;
    return data;
  } catch (e: any) {
    console.log('error : ', e);
    let message;
    if (e.response.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      const result = await getNaverToken('refresh_token', `refresh_token=${refreshToken}`);
      if (!result) return null; // result가 없으면 null 반환;
      localStorage.setItem('accessToken', result.access_token);
      localStorage.setItem('refreshToken', result.refresh_token);
      const response = await instance.get('/nid/me');
      const data = response.data.response;
      return data;
    }
    if (e instanceof Error) message = e.message;
    else message = '/getNaverInfo error';
    console.error(message);
    return null;
  }
};

export default getNaverInfo;
