import axios, { AxiosInstance } from 'axios';
import { format, getMinutes, subHours } from 'date-fns';

const url: string = import.meta.env.VITE_API_SHORT_URL;
const serviceKey: string = import.meta.env.VITE_API_SERVICE_KEY;

const instance: AxiosInstance = axios.create({
  baseURL: url,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface IParseObj {
  [category: string]: string;
}

export interface ICoord {
  nx: number;
  ny: number;
}

interface IItem {
  baseDate: string;
  baseTime: string;
  category: string;
  obsrValue: string;
  nx: number;
  ny: number;
}

const params = {
  serviceKey: serviceKey,
  dataType: 'JSON',
  base_date: '',
  base_time: '',
  numOfRows: '1000',
  nx: 0,
  ny: 0,
};
// nx와 ny를 조절해서 지역을 변경할 수 있어야 함

const isVaildCategory = (category: string) => {
  const vaildCategory = ['T1H', 'PTY', 'RN1'];
  // T1H : 기온, REH : 습도,  PTY : 강수형태, RN1 : 1시간 강수량
  // PTY 종류 : 없음(0), 비(1), 비/눈(2), 눈(3), 빗방울(5), 빗방울눈날림(6), 눈날림(7)
  return vaildCategory.includes(category);
};

const getWeatherLive = async (base_date: Date, location: ICoord): Promise<IParseObj | undefined> => {
  const url = '/getUltraSrtNcst';
  const date = format(base_date, 'yyyyMMdd');
  // 10분 이전이면 1시간 전 데이터를 가져옴
  if (getMinutes(base_date) <= 10) base_date = subHours(base_date, 1);
  const hour = format(base_date, 'HH');

  params.base_date = date;
  params.base_time = hour + '00';
  params.nx = location.nx;
  params.ny = location.ny;

  const items: IParseObj = {};

  try {
    const response = await instance.get(url, { params });
    const dataArr = response.data.response.body.items.item;
    dataArr.forEach((item: IItem) => {
      const { category, obsrValue } = item;
      if (isVaildCategory(category)) items[category] = obsrValue;
    });

    return items;
  } catch (e) {
    let message;
    if (e instanceof Error) message = e.message;
    else message = '/getUltraSrtNcst error';
    console.error(message);
  }
};

export default getWeatherLive;
