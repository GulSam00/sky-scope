import axios, { AxiosInstance } from "axios";
import { format } from "date-fns";
const url: string = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0";

const instance: AxiosInstance = axios.create({
  baseURL: url,
  //   timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

const serviceKey: string =
  "2Z194UJg1zEaizlFzp0Yz5nwql6oKpNl2wkM3Eow8FjthKY2IJ/zAt3nzTx4kmdx6lzXthcxntmaYAkLbLAIxg==";

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
  nx: 93,
  ny: 89,
};
// nx와 ny를 조절해서 지역을 변경할 수 있어야 함

const isVaildCategory = (category: string) => {
  const vaildCategory = ["SKY", "POP", "PCP", "TMP", "TMN", "TMX"];
  return vaildCategory.includes(category);
};

const getWeatherShort = async (
  base_date: Date
): Promise<IParseObj | undefined> => {
  const url = "/getVilageFcst";
  const date = format(base_date, "yyyyMMdd");
  params.base_date = date;
  try {
    const response = await instance.get(url, { params });
    // console.log(response);
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
