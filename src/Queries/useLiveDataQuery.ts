import { useQuery } from '@tanstack/react-query';

import { getWeatherLive } from '@src/API';
import { IParseObj, ICoord } from '@src/API/getWeatherLive';

// FooterPlaces에서 사용하는 타입
export interface LocateDataType {
  position: {
    lat: number;
    lng: number;
  };
  placeName: string;
  placeId: string; // kakao map placeId, 유일한 값
}

export type markerStatus = 'bookmark' | 'search' | 'pin';

// Marker에서 사용하는 타입
export interface KakaoMapMarkerType extends LocateDataType {
  image: {
    src: string;
    size: {
      width: number;
      height: number;
    };
  };
  status: markerStatus;
}

// Place에서 사용하는 타입
export interface KakaoSearchType extends LocateDataType {
  apiLocalPosition: {
    lat: number;
    lng: number;
  };
  province: string;
  city: string;
  isBookmarked: boolean;
  localeCode: string; // 카카오 지도의 지역 코드, 같은 지역일 경우 중복될 수 있음
  // 쿼리 키로 사용해서 같은 지역일 경우 중복 요청을 막고 캐시를 사용
}

const useLiveDataQuery = (today: Date, marker: KakaoSearchType) => {
  const { data, isLoading, error, status } = useQuery<IParseObj | undefined>({
    queryKey: ['live', marker.localeCode, marker.placeName],
    queryFn: async () => {
      // 퀴리키가 없을 떄, 새로 요청할 때 호출
      const location: ICoord = {
        nx: marker.apiLocalPosition ? marker.apiLocalPosition.lng : 0,
        ny: marker.apiLocalPosition ? marker.apiLocalPosition.lat : 0,
      };
      // endpoint : getUltraSrtNcst
      const result = await getWeatherLive(today, location);
      if (!result) {
        throw new Error('실시간 날씨 정보를 가져오지 못했습니다.');
      }
      return result;
    },
    select: data => {
      // 캐시된 데이터를 사용할 때 호출
      if (data && marker) {
        data.province = marker.province;
        data.city = marker.city;
        data.content = marker.placeName;
      }
      return data;
    },
    retry: 5,
    retryDelay: 1000,
    enabled: marker !== null,
    staleTime: 1000 * 60, // 1분
  });

  return { data, isLoading, status, error };
};

export default useLiveDataQuery;
