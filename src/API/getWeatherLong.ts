import axios, { AxiosInstance } from "axios";
import { format } from "date-fns";
import { IParseObj } from "./getWeatherShort";

const url: string = "http://apis.data.go.kr/1360000/MidFcstInfoService";

const instance: AxiosInstance = axios.create({
  baseURL: url,
  // timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

const serviceKey: string =
  "2Z194UJg1zEaizlFzp0Yz5nwql6oKpNl2wkM3Eow8FjthKY2IJ%2FzAt3nzTx4kmdx6lzXthcxntmaYAkLbLAIxg%3D%3D";

export interface ITimeData {
  [category: string]: string;
}

export interface IDateData {
  [fcstTime: string]: ITimeData;
}

const params = {
  serviceKey: serviceKey,
  dataType: "JSON",
  tmFc: "",
  regId: "11B10101",
};

const getWeatherLong = async (base_date: Date): Promise<any | undefined> => {
  const urlRain = "/getMidLandFcst";
  const urlTem = "/getMidTa";
  const date = format(base_date, "yyyyMMdd");

  // getMidLandFcst

  params.tmFc = date + "0600";

  try {
    const parseArr: IParseObj = {};
    params.regId = "11B00000"; // 서울 경기 인천
    const responseRain = await instance.get(urlRain, { params });
    const dataRain = responseRain.data.response.body.items.item[0];
    console.log("asdasd");

    console.log("dataRain", dataRain);
    for (let i in dataRain) {
      if (i.length === 6) {
        const category = i.slice(0, 5);
        const dateIndex = Number(i.slice(5));
        if (dateIndex > 7) continue; // 7일까지만 가져오기?
        const dstDate = base_date.setDate(base_date.getDate() + dateIndex);
        const dstDateStr = format(dstDate, "yyyyMMdd");
        if (!parseArr[dstDateStr]) parseArr[dstDateStr] = {};
        parseArr[dstDateStr][category] = dataRain[i];
      }
    }
    params.regId = "11B10101"; // 서울
    const responseTem = await instance.get(urlTem, { params });
    const dataTem = responseTem.data.response.body.items.item[0];
    for (let i in dataTem) {
      if (i.includes("rnSt")) {
        // rnSt3Am, rnSt10 두 가지 경우를 고려, 8이상부터는 안받음
        const category = i.slice(0, 4);
        const dateIndex = Number(i.slice(4));
      } else {
      }
    }
    return { dataRain, dataTem };
  } catch (e) {
    let message;
    if (e instanceof Error) message = e.message;
    else message = String(e);
    console.error(message);
  }
};

export default getWeatherLong;
