import { getKakaoLocal } from 'ultra-exact-ncst';

const serviceKey = import.meta.env.VITE_KAKAO_REST_KEY;

interface ICoord {
  lat: number;
  lng: number;
}

const transName = (name: string) => {
  if (name === '강원특별자치도') return '강원도';
  if (name === '전북특별자치도') return '전라북도';

  return name;
};

const transLocaleToCoord = async (position: ICoord) => {
  // 카카오 API를 통해 좌표를 카카오 지도의 주소로 변환
  // x : 경도(lng), y : 위도(lat)
  const result = await getKakaoLocal({ x: position.lng, y: position.lat, kakaoKey: serviceKey });
  if (!result) return null;
  const province = transName(result.depth1);
  const city = result.depth2 || province;
  const { x: nx, y: ny, code: localeCode, depth3 } = result;

  return { nx, ny, province, city, localeCode, depth3 };
};

export default transLocaleToCoord;
