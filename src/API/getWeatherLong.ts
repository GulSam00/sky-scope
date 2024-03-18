import axios, { AxiosInstance } from "axios";

const url: string = "http://apis.data.go.kr/1360000/MidFcstInfoService";

const instance: AxiosInstance = axios.create({
  baseURL: url,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

const serviceKey: string =
  "2Z194UJg1zEaizlFzp0Yz5nwql6oKpNl2wkM3Eow8FjthKY2IJ%2FzAt3nzTx4kmdx6lzXthcxntmaYAkLbLAIxg%3D%3D";

const params = {
  serviceKey: serviceKey,
  dataType: "JSON",
  tmFc: "",
  regId: "11B00000",
};

const getWeatherLong = async (base_date: string): Promise<void> => {
  const urlRain = "/getMidLandFcst";
  const urlTem = "/getMidTa";

  // getMidLandFcst

  params.tmFc = base_date + "0600";

  try {
    const responseRain = await instance.get(urlRain, { params });
    // console.log(responseRain);
    const data = await responseRain.data.response.body.items.item[0];
    console.log("rain : ", data);

    const responseTem = await instance.get(urlTem, { params });
    // console.log(responseTem);
    const dataTem = await responseTem.data.response.body.items.item[0];
    console.log("tem : ", dataTem);
  } catch (e) {
    let message;
    if (e instanceof Error) message = e.message;
    else message = String(e);
    console.error(message);
  }
};

export default getWeatherLong;
