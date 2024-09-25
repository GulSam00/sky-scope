export type markerStatus = 'bookmark' | 'search' | 'pin';

// FooterPlaces에서 사용하는 타입
export interface LocateDataType {
  position: {
    lat: number;
    lng: number;
  };
  placeName: string;
  placeId: string; // kakao map placeId, 유일한 값
}

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
