import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { getWeatherShort } from "@src/API";
import { IParseObj, ICoord } from "@src/API/getWeatherShort";

const useShortDataQuery = (today: Date, location: ICoord) => {
  // console.log("useShortDataQuery 호출");

  const { data, isLoading, error, status, refetch } = useQuery<
    IParseObj | undefined
  >({
    queryKey: ["short"],
    queryFn: () => getWeatherShort(today, location),
    enabled: false, // Disable automatic data fetching
  });

  // 왜 refetch를 사용할 때 성능이 더 좋을까?
  // 왜 refetch를 사용하지 않으면 로직이 작동되지 않을까?
  useEffect(() => {
    refetch();
  }, [today, location]);

  const dataArr = [];
  const dateArr = [];

  // data가 있으면 파싱해서 넘겨주기
  if (data) {
    for (let i in data) {
      dataArr.push(data[i]);
      dateArr.push(i);
    }
  }

  return { data: dataArr, date: dateArr, isLoading, status, error };
};

export default useShortDataQuery;
