import { useQuery } from '@tanstack/react-query';

import { getWeatherShort } from '@src/API';
import { IParseObj, ICoord } from '@src/API/getWeatherShort';

const useShortDataQuery = (today: Date, location: ICoord) => {
  const { data, isLoading, error, status } = useQuery<IParseObj | undefined>({
    queryKey: ['short'],
    queryFn: async () => {
      // endpoint : getVilageFcst
      const result = await getWeatherShort(today, location);
      if (!result) {
        throw new Error('단기 예보 정보를 가져오지 못했습니다.');
      }
      return result;
    },
    retry: 3,
    retryDelay: 1000,
    enabled: location !== null,
    staleTime: 1000 * 60, // 1분
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
