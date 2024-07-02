import { useKakaoLoader as useKakaoLoaderOrigin } from 'react-kakao-maps-sdk';
// useKakaoLoader를 useKakaoLoaderOrigin이라는 별칭으로 불러옵니다.
// 이렇게 별칭을 사용하면 useKakaoLoader를 사용할 때 useKakaoLoaderOrigin을 사용하게 됩니다.

export default function useKakaoLoader() {
  // 내부에서 state를 반환한다.
  const [kakaoLoading, kakaoError] = useKakaoLoaderOrigin({
    appkey: import.meta.env.VITE_KAKAO_JS_KEY as string,
    libraries: ['clusterer', 'drawing', 'services'],
  });
  return { kakaoLoading, kakaoError };
}
