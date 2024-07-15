import { useQuery } from '@tanstack/react-query';

import { getWeatherLive } from '@src/API';
import { IParseObj, ICoord } from '@src/API/getWeatherLive';

export interface MarkerType {
  position: {
    lat: number;
    lng: number;
  };
  code: string;
  province: string;
  city: string;
  content: string;
  isBookmarked: boolean;
}

const useLiveDataQuery = (today: Date, marker: MarkerType | null) => {
  const { data, isLoading, error, status } = useQuery<IParseObj | undefined>({
    queryKey: ['live', marker ? marker.code : 'no-marker'],
    queryFn: () => {
      const location: ICoord = {
        nx: marker ? marker.position.lng : 0,
        ny: marker ? marker.position.lat : 0,
      };
      // endpoint : getUltraSrtNcst
      const result = getWeatherLive(today, location);
      return result;
    },
    select: data => {
      if (data && marker) {
        data.province = marker.province;
        data.city = marker.city;
        data.content = marker.content;
      }
      return data;
    },

    retry: 3,
    retryDelay: 3000,
    enabled: marker !== null,
  });

  return { data, isLoading, status, error };
};

export default useLiveDataQuery;
