import { useQuery } from '@tanstack/react-query';

import { getWeatherLive } from '@src/API';
import { IParseObj, ICoord } from '@src/API/getWeatherLive';

interface markerType {
  position: {
    lat: number;
    lng: number;
  };
  content: string;
}

const useLiveDataQuery = (today: Date, marker: markerType | null) => {
  const { data, isLoading, error, status } = useQuery<IParseObj | undefined>({
    queryKey: ['live', marker ? marker.content : 'no-marker'],
    queryFn: () => {
      const location: ICoord = {
        nx: marker ? marker.position.lng : 0,
        ny: marker ? marker.position.lat : 0,
      };
      return getWeatherLive(today, location);
    },
    retry: 3,
    retryDelay: 3000,
    enabled: marker !== null,
  });

  return { data, isLoading, status, error };
};

export default useLiveDataQuery;
