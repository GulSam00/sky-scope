import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

import { loadingData, loadedData } from "@src/Store/shortDataSlice";

import { getWeatherShort } from "@src/API";

import { IParseObj, ICoord } from "@src/API/getWeatherShort";

const useShortDataQuery = (today: Date, location: ICoord) => {
  console.log("쿼리 호출");
  const dispatch = useDispatch();

  dispatch(loadingData());

  const { data, isLoading, error, status } = useQuery<IParseObj | undefined>({
    queryKey: ["short"],
    queryFn: () => getWeatherShort(today, location),
  });

  const dataArr = [];
  const dateArr = [];

  // data가 있으면 파싱해서 넘겨주기
  if (data) {
    for (let i in data) {
      dataArr.push(data[i]);
      dateArr.push(i);
    }
    dispatch(loadedData());
  }

  return { data: dataArr, date: dateArr, isLoading, status, error };
};

export default useShortDataQuery;
