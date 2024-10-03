import axios, { AxiosInstance } from 'axios';

const url = import.meta.env.VITE_NAVER_URL;
const client_id = import.meta.env.VITE_NAVER_ID;
const client_secret = import.meta.env.VITE_NAVER_SECRET;

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

const getNaverInfo = async () => {
  try {
    const response = await instance.get('/v1/nid/me');
    const data = response.data.response;
    return data;
  } catch (e) {
    console.log('error : ', e);
    let message;
    if (e instanceof Error) message = e.message;
    else message = '/getUltraSrtNcst error';
    console.error(message);
  }
};

export default getNaverInfo;
