import { getKakaoLocal } from "@src/API";

import setLocalCoordInfo from "./setLocalCoordInfo";
import _short_local from "@src/JSON/short_api_locals.json";

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
  if (name === "강원특별자치도") return "강원도";
  if (name === "전북특별자치도") return "전라북도";

  return name;
};

const transCoord = async (position: ICoord) => {
  const result = await getKakaoLocal.getKakaoSearchCoord(
    position.lng,
    position.lat
  );

  if (!result) return null;

  const province = transName(result.region_1depth_name);
  const city = result.region_2depth_name.replace(" ", "");
  const address = result.address_name;

  const { x: nx, y: ny } = short_local[province][city];

  if (setLocalCoordInfo({ nx, ny, province, city })) {
    return { nx, ny, province, city, address };
  } else return null;
};

export default transCoord;
