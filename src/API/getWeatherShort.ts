import axios, { AxiosInstance } from "axios";

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

interface ITimeData {
  [category: string]: string | number; // Modify the value to allow array or single value
}

interface IParseArr {
  [fcstDate: string]: {
    // Group by fcstDate
    [fcstTime: string]: ITimeData;
  };
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
  base_date: "20240318",
  base_time: "0500",
  numOfRows: "1000",
  nx: 93,
  ny: 89,
};

const isVaildCategory = (category: string) => {
  const vaildCategory = ["SKY", "POP", "PCP", "TMP", "TMN", "TMX"];
  // TMN, TMX를 내가 그냥 파싱할까?
  return vaildCategory.includes(category);
};

const getWeatherShort = async (base_date: string): Promise<void> => {
  const url = "/getVilageFcst";
  params.base_date = base_date;
  try {
    const response = await instance.get(url, { params });
    // console.log(response);
    const dataArr = response.data.response.body.items.item;
    const parseArr: IParseArr = {};

    dataArr.forEach((item: IItem) => {
      const { fcstDate, fcstTime } = item;
      // Initialize the object if not already exists
      if (!parseArr[fcstDate]) {
        parseArr[fcstDate] = {};
      }
      // Initialize the array for the fcstTime if not already exists
      if (!parseArr[fcstDate][fcstTime]) {
        parseArr[fcstDate][fcstTime] = {};
      }
      // Extract relevant category and value from item and add to the array
      const { category, fcstValue } = item;

      if (isVaildCategory(category))
        parseArr[fcstDate][fcstTime][category] = fcstValue;
    });
    console.log(parseArr);
  } catch (e) {
    let message;
    if (e instanceof Error) message = e.message;
    else message = String(e);
    console.error(message);
  }
};

export default getWeatherShort;
