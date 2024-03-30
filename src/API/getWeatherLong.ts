import axios, { AxiosInstance } from "axios";
import { format, addDays } from "date-fns";

const url: string = import.meta.env.VITE_API_LONG_URL;
const serviceKey: string = import.meta.env.VITE_API_SERVICE_KEY;

const instance: AxiosInstance = axios.create({
  baseURL: url,
  // timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface IDateData {
  [category: string]: string;
}

export interface IParseObj {
  [fcstTime: string]: IDateData;
}

const params = {
  serviceKey: serviceKey,
  dataType: "JSON",
  tmFc: "",
  regId: "",
};

const getWeatherLong = async (
  base_date: Date
): Promise<IParseObj | undefined> => {
  const urlRain = "/getMidLandFcst";
  const urlTem = "/getMidTa";
  const date = format(base_date, "yyyyMMdd");

  // getMidLandFcst
  params.tmFc = date + "0600";
  try {
    const parseArr: IParseObj = {};
    params.regId = "11B10101"; // 서울
    const responseTem = await instance.get(urlTem, { params });
    const dataTem = responseTem.data.response.body.items.item[0];
    for (let i in dataTem) {
      if (i.length === 6) {
        const category = i.slice(0, 5);
        const dateIndex = Number(i.slice(5));
        if (dateIndex > 7) continue; // 7일까지만 가져오기?
        const dstDate = addDays(base_date, dateIndex);
        const dstDateStr = format(dstDate, "yyyyMMdd");
        if (!parseArr[dstDateStr]) parseArr[dstDateStr] = {};
        parseArr[dstDateStr][category] = dataTem[i];
      }
    }

    params.regId = "11B00000"; // 서울 경기 인천
    const responseRain = await instance.get(urlRain, { params });
    const dataRain = responseRain.data.response.body.items.item[0];

    for (let i in dataRain) {
      if (i.length === 7) {
        // rnSt3Am, rnSt10 두 가지 경우를 고려, 8이상부터는 안받음
        const category = "rain" + i.slice(5);
        const dateIndex = Number(i[4]);

        const dstDate = addDays(base_date, dateIndex);
        const dstDateStr = format(dstDate, "yyyyMMdd");
        parseArr[dstDateStr][category] = dataRain[i];
      }
    }

    return parseArr;
  } catch (e) {
    let message;
    if (e instanceof Error) message = e.message;
    else message = String(e);
    console.error(message);
  }
};

export default getWeatherLong;
