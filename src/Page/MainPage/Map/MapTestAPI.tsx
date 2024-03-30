import { useState, useRef } from "react";
import { Map } from "react-kakao-maps-sdk";
import useKakaoLoader from "@src/useKakaoLoader";
import { getKakaoLocal } from "@src/API";

const KaKaoMap = () => {
  useKakaoLoader();

  const mapRef = useRef<kakao.maps.Map>(null);
  const [state, setState] = useState({
    // 지도의 초기 위치
    center: { lat: 33.450701, lng: 126.570667 },
    isPanto: false,
  });
  const testAPI = () => {
    // getKakaoLocal.getKakaoSearchAddress("왕곡");
    getKakaoLocal.getKakaoSearchCoord(126.98164166666668, 37.57037777777778);
  };
  const getInfo = () => {
    const map = mapRef.current;
    if (!map) return;

    const center = map.getCenter();

    // 지도의 현재 레벨을 얻어옵니다
    const level = map.getLevel();

    // 지도타입을 얻어옵니다
    const mapTypeId = map.getMapTypeId();

    // 지도의 현재 영역을 얻어옵니다
    const bounds = map.getBounds();

    // 영역의 남서쪽 좌표를 얻어옵니다
    const swLatLng = bounds.getSouthWest();

    // 영역의 북동쪽 좌표를 얻어옵니다
    const neLatLng = bounds.getNorthEast();

    // 영역정보를 문자열로 얻어옵니다. ((남,서), (북,동)) 형식입니다
    // const boundsStr = bounds.toString()
    console.log("map info ", center);
  };

  return (
    <>
      <Map
        center={state.center}
        isPanto={state.isPanto}
        style={{ width: "800px", height: "600px" }}
        level={3}
        ref={mapRef}
      />
      <button onClick={testAPI}>API 테스트</button>
      <button
        onClick={() =>
          setState({
            center: { lat: 33.452613, lng: 126.570888 },
            isPanto: false,
          })
        }
      >
        지도 중심좌표 이동시키기
      </button>
      <button
        onClick={() =>
          setState({
            center: { lat: 33.45058, lng: 126.574942 },
            isPanto: true,
          })
        }
      >
        지도 중심좌표 부드럽게 이동시키기
      </button>
      <button id="getInfoBtn" onClick={getInfo}>
        맵정보 가져오기
      </button>
    </>
  );
};

export default KaKaoMap;
