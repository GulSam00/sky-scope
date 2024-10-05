import axios, { AxiosInstance } from 'axios';

const url = import.meta.env.VITE_NAVER_OAUTH_URL;
const naver_id = import.meta.env.VITE_NAVER_ID;
const naver_sercret = import.meta.env.VITE_NAVER_SECRET;

const instance: AxiosInstance = axios.create({
  baseURL: url,
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json',
  },
});
const getNaverToken = async (type: string, requirement: string) => {
  try {
    const url = `/token?grant_type=${type}&client_id=${naver_id}&client_secret=${naver_sercret}&${requirement}`;
    const response = await instance.get(url);
    const data = response.data;
    return data;
  } catch (e) {
    let message;
    if (e instanceof Error) message = e.message;
    else message = '/getNaverToken error';
    console.error(message);
  }
};

export default getNaverToken;
