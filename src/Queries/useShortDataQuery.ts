import { useQuery } from "@tanstack/react-query";
import { getWeatherShort } from "@src/API";
import { IParseObj } from "@src/API/getWeatherShort";

const useShortDataQuery = (today: Date) => {
  const { data, isLoading, error } = useQuery<IParseObj | undefined>({
    queryKey: ["short"],
    queryFn: () => getWeatherShort(today),
  });
  const dataArr = [];
  const dateArr = [];

  // data가 있으면 파싱해서 넘겨주기
  if (data) {
    for (let i in data) {
      dataArr.push(data[i]);
      dateArr.push(i);
    }
  }
  return { data: dataArr, date: dateArr, isLoading, error };
};

export default useShortDataQuery;
