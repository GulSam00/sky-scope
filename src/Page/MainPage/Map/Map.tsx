import { useState, useRef, useEffect } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import useKakaoLoader from "@src/useKakaoLoader";
import { getKakaoLocal } from "@src/API";

import Form from "react-bootstrap/Form";

const KaKaoMap = () => {
  useKakaoLoader();

  const [info, setInfo]: any = useState();
  const [markers, setMarkers]: any = useState([]);
  const [map, setMap]: any = useState();
  const mapRef = useRef<kakao.maps.Map>(null);

  const [address, setAddress] = useState("");

  const handleInput = (e: any) => {
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

  const searchPlaces = (keyword: string) => {
    if (!map) return;
    const ps = new kakao.maps.services.Places();

    ps.keywordSearch(keyword, (data, status, _pagination) => {
      if (status === kakao.maps.services.Status.OK) {
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        const bounds = new kakao.maps.LatLngBounds();
        let markers = [];

        for (let i = 0; i < data.length; i++) {
          // @ts-ignore
          markers.push({
            position: {
              lat: data[i].y,
              lng: data[i].x,
            },
            content: data[i].place_name,
          });
          // @ts-ignore
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }
        setMarkers(markers);

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
        map.setBounds(bounds);
      }
    });
  };
  useEffect(() => {}, [map]);

  return (
    <>
      {/* boosttrap에서 input */}
      <Form>
        <Form.Control
          size="lg"
          type="text"
          placeholder="주소 입력"
          value={address}
          onChange={handleInput}
        />
      </Form>
      <button onClick={insertAddress}>확인</button>
      <Map
        center={{
          lat: 37.566826,
          lng: 126.9786567,
        }}
        style={{ width: "800px", height: "600px" }}
        level={3}
        ref={mapRef}
        onCreate={setMap}
      >
        {markers.map((marker: any) => (
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

      <button onClick={testAPI}>API 테스트</button>

      <button id="getInfoBtn" onClick={getInfo}>
        맵정보 가져오기
      </button>
    </>
  );
};

export default KaKaoMap;
