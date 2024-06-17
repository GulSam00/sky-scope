import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getWeatherLive } from '@src/API';
import { IParseObj, ICoord } from '@src/API/getWeatherLive';

const useLiveDataQuery = (today: Date, location: ICoord, mark: string) => {
  const { data, isLoading, error, status, refetch } = useQuery<IParseObj | undefined>({
    queryKey: ['live', mark],
    queryFn: () => getWeatherLive(today, location),
    enabled: false, // Disable automatic data fetching
    retry: 3,
    retryDelay: 3000,
  });

  useEffect(() => {
    refetch();
  }, [today, location]);

  return { data, isLoading, status, error };
};

export default useLiveDataQuery;
