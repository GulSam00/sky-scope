import { getNcst } from 'ultra-exact-ncst';

const url: string = import.meta.env.VITE_API_SHORT_URL;
const serviceKey: string = import.meta.env.VITE_API_SERVICE_KEY;

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

const isVaildCategory = (category: string) => {
  const vaildCategory = ['T1H', 'REH', 'PTY', 'RN1'];
  // T1H : 기온, REH : 습도,  PTY : 강수형태, RN1 : 1시간 강수량
  // PTY 종류 : 없음(0), 비(1), 비/눈(2), 눈(3), 빗방울(5), 빗방울눈날림(6), 눈날림(7)
  return vaildCategory.includes(category);
};

const getWeatherLive = async (base_date: Date, location: ICoord): Promise<IParseObj | undefined> => {
  const items: IParseObj = {};

  try {
    const response = await getNcst({ x: location.nx, y: location.ny, ncstKey: serviceKey });
    if (!response) return undefined;
    response.forEach((item: IItem) => {
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
