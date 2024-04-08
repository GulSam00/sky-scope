import axios, { AxiosInstance } from "axios";

const url = import.meta.env.VITE_KAKAO_REST_URL;
const serviceKey = import.meta.env.VITE_KAKAO_REST_KEY;

// short API 요구 params
// nx: 93,
// ny: 89,

interface ICoord {
  address_name: string;
  code: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
  region_4depth_name: string;
  region_type: string;
  x: number;
  y: number;
}

const instance: AxiosInstance = axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/json",
    Authorization: `KakaoAK ${serviceKey}`,
  },
});

const getKakaoLocal = {
  // getKakaoSearchAddress: async (address: string) => {
  //   const params = {
  //     query: address,
  //   };
  //   const url = "/search/address";
  //   try {
  //     const result = await instance.get(url, { params });
  //     console.log(result.data.documents);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },
  // 좌표
  getKakaoSearchCoord: async (
    x: number,
    y: number
  ): Promise<ICoord | undefined> => {
    const params = {
      x: x,
      y: y,
    };
    const url = "/geo/coord2regioncode";
    try {
      const result = await instance.get(url, { params });
      // 행정동 법정동 2개의 데이터 존재
      const documents = result.data.documents as ICoord[];
      return documents[0];
    } catch (e) {
      let message;
      if (e instanceof Error) message = e.message;
      else message = String(e);
      console.error(message);
      return undefined;
    }
  },
};

export default getKakaoLocal;
