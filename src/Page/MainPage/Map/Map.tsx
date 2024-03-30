import { useState, useRef, useEffect } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import useKakaoLoader from "@src/useKakaoLoader";
import { getKakaoLocal } from "@src/API";

import Form from "react-bootstrap/Form";

interface MarkerType {
  position: {
    lat: number;
    lng: number;
  };
  content: string;
}

const KaKaoMap = () => {
  useKakaoLoader();

  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [info, setInfo]: any = useState();
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [mapLevel, setMapLevel] = useState<number>(3);
  const mapRef = useRef<kakao.maps.Map>(null);

  const [address, setAddress] = useState<string>("");

  const handleInput = (e: any) => {
    if (e.key === "Enter") e.preventDefault();
    setAddress(e.target.value);
  };

  const insertAddress = () => {
    searchPlaces(address);
    setAddress("");
  };

  const testAPI = () => {
    // getKakaoLocal.getKakaoSearchAddress("왕곡");
    getKakaoLocal.getKakaoSearchCoord(126.98164166666668, 37.57037777777778);
  };

  const getInfo = () => {
    const map = mapRef.current;
    if (!map) return;

    const center = map.getCenter();

    console.log("map info ", center);
  };
  const moveMarkerPos = (marker: MarkerType) => async () => {
    if (!map) return;

    const position = marker.position;
    map.setLevel(2);
    setMapLevel(map.getLevel());

    map.panTo(new kakao.maps.LatLng(position.lat, position.lng));
    const result = await getKakaoLocal.getKakaoSearchCoord(
      position.lng,
      position.lat
    );

    // region_2depth_name 를 기준으로 검색
    // 스페이스 바 사이의 공백 제거 필요

    // 맵 레벨 제어
    // const map = mapRef.current;
    // if (!map) return;
  };

  const searchPlaces = (keyword: string) => {
    if (!map) return;
    const ps = new kakao.maps.services.Places();

    ps.keywordSearch(
      keyword,
      (data, status, _pagination) => {
        if (status === kakao.maps.services.Status.OK) {
          // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
          // LatLngBounds 객체에 좌표를 추가합니다
          const bounds = new kakao.maps.LatLngBounds();
          const markers: MarkerType[] = [];
          console.log("data ", data);
          for (let i = 0; i < data.length; i++) {
            // @ts-ignore
            markers.push({
              position: {
                lat: Number(data[i].y),
                lng: Number(data[i].x),
              },
              content: data[i].place_name,
            });
            // @ts-ignore
            bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
          }
          setMarkers([...markers]);

          // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
          map.setBounds(bounds);
          console.log("마커 : ", markers);
        } else {
          console.log("검색 결과가 없습니다.");
        }
      },
      { page: 5 }
    );
  };

  return (
    <>
      <Form>
        <Form.Control
          size="lg"
          type="text"
          placeholder="주소 입력"
          value={address}
          onChange={handleInput}
          onKeyDown={handleInput} // Handle key down event
        />
      </Form>
      <button onClick={insertAddress}>확인</button>
      <Map
        center={{
          lat: 37.566826,
          lng: 126.9786567,
        }}
        style={{ width: "800px", height: "600px" }}
        level={mapLevel}
        ref={mapRef}
        onCreate={setMap}
      >
        {markers.map((marker: MarkerType) => (
          <MapMarker
            key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
            position={marker.position}
            onClick={() => setInfo(marker)}
          >
            {info && info.content === marker.content && (
              <div style={{ color: "#000" }}>{marker.content}</div>
            )}
          </MapMarker>
        ))}
      </Map>

      {markers.length > 0 && (
        <ul>
          {markers.map((marker: MarkerType, index: number) => (
            <li key={index} onClick={moveMarkerPos(marker)}>
              {marker.content}
            </li>
          ))}
        </ul>
      )}

      <button onClick={testAPI}>API 테스트</button>

      <button id="getInfoBtn" onClick={getInfo}>
        맵정보 가져오기
      </button>
    </>
  );
};

export default KaKaoMap;
