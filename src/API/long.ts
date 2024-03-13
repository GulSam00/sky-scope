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

// const getErrorMessage = (error: unknown) => {
//   if (error instanceof Error) return error.message;
//   return String(error);
// };

const longAPI = async (): Promise<void> => {
  const url1 = "/getMidFcst";
  const url2 = "/getMidLandFcst";
  const url3 = "/getMidTa";
  const url4 = "/getMidSeaFcst";

  // getMidLandFcst

  const params = {
    serviceKey: serviceKey,
    dataType: "JSON",
    tmFc: "202403130600",
    regId: "11B00000",
  };

  try {
    const response = await instance.get(url2, { params });
    // console.log(response);
    const data = await response.data.response.body.items.item[0];
    console.log(data);
  } catch (e) {
    let message;
    if (e instanceof Error) message = e.message;
    else message = String(e);
    console.error(message);
  }
};

export default longAPI;
