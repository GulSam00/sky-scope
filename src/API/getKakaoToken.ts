import axios, { AxiosInstance } from 'axios';

const url = import.meta.env.VITE_KAKAO_OAUTH_URL;
const kakao_id = import.meta.env.VITE_KAKAO_REST_KEY;
const redirect_uri = import.meta.env.VITE_KAKAO_REDIRECT;
const instance: AxiosInstance = axios.create({
  baseURL: url,
  timeout: 3000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    charset: 'utf-8',
  },
});

const getKakaoToken = async (type: string, requirement: string) => {
  try {
    const url = `/token?grant_type=${type}&client_id=${kakao_id}&redirect_uri=${redirect_uri}&${requirement}`;
    const response = await instance.get(url);
    const data = response.data;
    return data;
  } catch (e) {
    let message;
    if (e instanceof Error) message = e.message;
    else message = '/getKakaoToken error';
    console.error(message);
  }
};

export default getKakaoToken;
