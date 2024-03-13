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
  SKY: number; // 하늘상태
  POP: number; // 강수확률
  PCP: number; // 강수량
  TMP: number; // 기온
  TMN: number; // 최저기온
  TMX: number; // 최고기온
}
interface IParseArr {
  date: string;
  // timeData는 시간별 데이터를 담는 객체
  // key는 시간, value는 ITimeData
  timeData: { [time: string]: ITimeData };
}

const params = {
  serviceKey: serviceKey,
  dataType: "JSON",
  base_date: "20240313",
  base_time: "0500",
  numOfRows: "1000",
  nx: 93,
  ny: 89,
};

const isVaildCategory = (category: string) => {
  const vaildCategory = ["SKY", "POP", "PCP", "TMP", "TMN", "TMX"];
  return vaildCategory.includes(category);
};

const testAPI = async (): Promise<void> => {
  //   const url1 = "/getUltraSrtNcst";
  //   const url2 = "/getUltraSrtFcst";
  const url = "/getVilageFcst";

  try {
    const response = await instance.get(url, { params });
    // console.log(response);
    const dataArr = response.data.response.body.items.item;
    const parseArr: IParseArr[] = [];
    let arrIndex = -1;
    for (let i = 0; i < 100; i++) {
      const curData = dataArr[i];
      if (curData.baseDate !== parseArr[arrIndex]?.date) {
        parseArr.push({
          date: dataArr[i].baseDate,
          timeData: {},
        });
        arrIndex++;
      }
      if (isVaildCategory(curData.category)) {
        parseArr[arrIndex].timeData[curData.baseTime] = {
          [curData.category]: curData.fcstValue,
        };
      }
    }
  } catch (e) {
    let message;
    if (e instanceof Error) message = e.message;
    else message = String(e);
    console.error(message);
  }
};

export default testAPI;
