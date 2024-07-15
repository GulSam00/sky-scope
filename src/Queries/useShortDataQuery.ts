import { useQuery } from '@tanstack/react-query';

import { getWeatherShort } from '@src/API';
import { IParseObj, ICoord } from '@src/API/getWeatherShort';

const useShortDataQuery = (today: Date, location: ICoord) => {
  const { data, isLoading, error, status } = useQuery<IParseObj | undefined>({
    queryKey: ['short'],
    queryFn: () => getWeatherShort(today, location),
    retry: 3,
    retryDelay: 3000,
    enabled: location !== null,
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

  return { data: dataArr, date: dateArr, isLoading, status, error };
};

export default useShortDataQuery;
