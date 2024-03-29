import { useQuery } from "@tanstack/react-query";
import { getWeatherLong } from "@src/API";
import { IParseObj } from "@src/API/getWeatherLong";

const useLongDataQuery = (today: Date) => {
  const { data, isLoading, error } = useQuery<IParseObj | undefined>({
    queryKey: ["long"],
    queryFn: () => getWeatherLong(today),
  });
  const dataArr = [];

  // data가 있으면 파싱해서 넘겨주기
  if (data) {
    let index = 0;
    for (let i in data) {
      dataArr.push(data[i]);
      dataArr[index].date = i;
      index++;
    }
  }
  return { data: dataArr, isLoading, error };
};

export default useLongDataQuery;
