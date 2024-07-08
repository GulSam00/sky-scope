import { getKakaoLocal } from '@src/API';

import setLocalCoordInfo from './setLocalCoordInfo';
import _short_local from '@src/JSON/short_api_locals.json';

// 기상청 API에서 제공하는 지역 좌표 정보
// 기상청 API는 nx, ny를 인자로 받아 사용하지만 실제 지도와는 다른 임의의 값 사용
// kakao API로 얻은 지역 정보(도, 시)를 JSON 객체에서 찾아 nx, ny 값을 얻음
const short_local = _short_local as ICoordJson;

interface ICoordJson {
  [province: string]: {
    [city: string]: {
      x: number;
      y: number;
    };
  };
}

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
  const result = await getKakaoLocal.getKakaoSearchCoord(position.lng, position.lat);

  if (!result) return null;
  const province = transName(result.region_1depth_name);
  const city = result.region_2depth_name.replace(' ', '');
  const address = result.address_name;
  const code = result.code;

  const { x: nx, y: ny } = short_local[province][city];

  // 로컬 스토러지에 좌표 정보 저장
  // 만약 이미 로컬에 저장한 좌표, 지역이면 null 반환
  if (setLocalCoordInfo({ nx, ny, province, city })) {
    return { nx, ny, province, city, address, code };
  } else return null;
};

export default transLocaleToCoord;
