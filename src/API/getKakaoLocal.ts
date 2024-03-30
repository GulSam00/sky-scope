import axios, { AxiosInstance } from "axios";
import { ca } from "date-fns/locale";

const url = import.meta.env.VITE_KAKAO_REST_URL;
const serviceKey = import.meta.env.VITE_KAKAO_REST_KEY;

// short API 요구 params
// nx: 93,
// ny: 89,

const instance: AxiosInstance = axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/json",
    Authorization: `KakaoAK ${serviceKey}`,
  },
});

const getKakaoLocal = {
  getKakaoSearchAddress: async (address: string) => {
    const params = {
      query: address,
    };
    const url = "/search/address";
    try {
      const result = await instance.get(url, { params });
      console.log(...result.data.documents);
    } catch (error) {
      console.log(error);
    }
  },
  // 좌표
  getKakaoSearchCoord: async (x: number, y: number) => {
    const params = {
      x: x,
      y: y,
    };
    const url = "/geo/coord2regioncode";
    try {
      const result = await instance.get(url, { params });
      console.log(...result.data.documents);
    } catch (error) {
      console.log(error);
    }
  },
};

export default getKakaoLocal;
