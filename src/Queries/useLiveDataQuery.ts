import { useQuery } from '@tanstack/react-query';

import { getWeatherLive } from '@src/API';
import { IParseObj, ICoord } from '@src/API/getWeatherLive';

export interface LocateData {
  position: {
    lat: number;
    lng: number;
  };
  content: string;
  placeId: string;
}

export type markerStatus = 'bookmark' | 'search' | 'pin';

export interface KakaoMapMarkerType extends LocateData {
  image: {
    src: string;
    size: {
      width: number;
      height: number;
    };
  };
  status: markerStatus;
}

export interface KakaoSearchType extends LocateData {
  originalPosition: {
    lat: number;
    lng: number;
  };
  province: string;
  city: string;
  isBookmarked: boolean;
  localeCode: string;
}

const useLiveDataQuery = (today: Date, marker: KakaoSearchType) => {
  const { data, isLoading, error, status } = useQuery<IParseObj | undefined>({
    queryKey: ['live', marker.localeCode, marker.content],
    queryFn: async () => {
      const location: ICoord = {
        nx: marker ? marker.position.lng : 0,
        ny: marker ? marker.position.lat : 0,
      };
      // endpoint : getUltraSrtNcst
      const result = await getWeatherLive(today, location);
      if (!result) {
        throw new Error('getWeatherLive error');
      }
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
    retry: 2,
    retryDelay: 3000,
    enabled: marker !== null,
    staleTime: 1000 * 60, // 1분
  });

  return { data, isLoading, status, error };
};

export default useLiveDataQuery;
