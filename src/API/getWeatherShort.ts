import axios, { AxiosInstance } from "axios";
import { format } from "date-fns";

const url: string = import.meta.env.VITE_API_SHORT_URL;
const serviceKey: string = import.meta.env.VITE_API_SERVICE_KEY;

const instance: AxiosInstance = axios.create({
  baseURL: url,
  //   timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// type ITimeData = Record<VaildCategory, string >; // Modify the value to allow array or single value
export interface ITimeData {
  [category: string]: string;
}

export interface IDateData {
  [fcstTime: string]: ITimeData;
}

export interface IParseObj {
  [fcstDate: string]: IDateData;
}

export interface ICoord {
  nx: number;
  ny: number;
}

interface IItem {
  baseDate: string;
  baseTime: string;
  category: string;
  fcstDate: string;
  fcstTime: string;
  fcstValue: string;
  nx: number;
  ny: number;
}

const params = {
  serviceKey: serviceKey,
  dataType: "JSON",
  base_date: "",
  base_time: "0500",
  numOfRows: "1000",
  nx: 0,
  ny: 0,
};
// nx와 ny를 조절해서 지역을 변경할 수 있어야 함

const isVaildCategory = (category: string) => {
  const vaildCategory = ["SKY", "POP", "PCP", "TMP", "TMN", "TMX"];
  return vaildCategory.includes(category);
};

const getWeatherShort = async (
  base_date: Date,
  location: ICoord
): Promise<IParseObj | undefined> => {
  const url = "/getVilageFcst";
  const date = format(base_date, "yyyyMMdd");
  params.base_date = date;
  params.nx = location.nx;
  params.ny = location.ny;
  try {
    const response = await instance.get(url, { params });
    const dataArr = response.data.response.body.items.item;
    const parseArr: IParseObj = {};
    let count = 0;

    dataArr.forEach((item: IItem) => {
      const { fcstDate, fcstTime } = item;
      if (!parseArr[fcstDate]) {
        // 오늘부터 최대 3일치만 가져옴
        if (count > 2) return;
        parseArr[fcstDate] = {};
        count++;
      }

      if (!parseArr[fcstDate][fcstTime]) {
        parseArr[fcstDate][fcstTime] = {};
      }

      const { category, fcstValue } = item;
      if (isVaildCategory(category))
        parseArr[fcstDate][fcstTime][category] = fcstValue;
    });
    return parseArr;
  } catch (e) {
    let message;
    if (e instanceof Error) message = e.message;
    else message = String(e);
    console.error(message);
  }
};

export default getWeatherShort;
