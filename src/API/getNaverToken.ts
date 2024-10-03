import axios, { AxiosInstance } from 'axios';

const url = import.meta.env.VITE_NAVER_TOKEN_URL;
const client_id = import.meta.env.VITE_NAVER_ID;
const client_secret = import.meta.env.VITE_NAVER_SECRET;

const instance: AxiosInstance = axios.create({
  baseURL: url,
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json',
  },
});
const getNaverToken = async (url: string) => {
  try {
    const response = await instance.get(url);
    const data = response.data;
    return data;
  } catch (e) {
    let message;
    if (e instanceof Error) message = e.message;
    else message = '/getUltraSrtNcst error';
    console.error(message);
  }
};

export default getNaverToken;
