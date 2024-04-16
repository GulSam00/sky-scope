import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import useKakaoLoader from "@src/useKakaoLoader";

import { close } from "@src/Store/kakaoModalSlice";
import { getKakaoLocal } from "@src/API";
import { ICoord } from "@src/API/getWeatherShort";
import _short_local from "@src/JSON/short_api_locals.json";

import Form from "react-bootstrap/Form";
import styled from "styled-components";

const short_local = _short_local as ICoordJson;

interface ICoordJson {
  [depth1: string]: {
    [depth2: string]: {
      x: number;
      y: number;
    };
  };
}

interface MarkerType {
  position: {
    lat: number;
    lng: number;
  };
  content: string;
}

interface IProps {
  handleChangeCoord: (coord: ICoord) => void;
}

const transName = (name: string) => {
  if (name === "강원특별자치도") return "강원도";

  return name;
};

const KaKaoMap = ({ handleChangeCoord }: IProps) => {
  const dispatch = useDispatch();

  useKakaoLoader();

  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [info, setInfo]: any = useState();
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [mapLevel, setMapLevel] = useState<number>(3);
  const mapRef = useRef<kakao.maps.Map>(null);
  const [address, setAddress] = useState<string>("");
  const [tempText, setTempText] = useState<string>("");

  const handleInput = (e: any) => {
    if (e.key === "Enter") e.preventDefault();
    setAddress(e.target.value);
  };

  const insertAddress = () => {
    searchPlaces(address);
    setAddress("");
  };

  const getInfo = () => {
    const map = mapRef.current;
    if (!map) return;

    const center = map.getCenter();

    console.log("map info ", center);
  };

  const overMarkerPos = (marker: MarkerType) => {
    if (!map) return;

    // 맵 레벨 제어
    const position = marker.position;
    map.setLevel(2);
    setMapLevel(map.getLevel());

    map.panTo(new kakao.maps.LatLng(position.lat, position.lng));

    // region_2depth_name 를 기준으로 검색
    // 스페이스 바 사이의 공백 제거 필요
  };

  const onClickMarker = async (marker: MarkerType) => {
    if (!map) return;
    const position = marker.position;

    const result = await getKakaoLocal.getKakaoSearchCoord(
      position.lng,
      position.lat
    );

    console.log("결과", result);

    if (result) {
      setTempText(result.address_name);
      const depth1 = transName(result.region_1depth_name);
      const depth2 = result.region_2depth_name.replace(" ", "");
      const coord = short_local[depth1][depth2];
      handleChangeCoord({ nx: coord.x, ny: coord.y });
      dispatch(close());
    }
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
        <h2>현재 선택한 마커의 정보 : {tempText}</h2>
        {markers.map((marker: MarkerType) => (
          <MapMarker position={marker.position} onClick={() => setInfo(marker)}>
            {info && info.content === marker.content && (
              <div>{marker.content}</div>
            )}
          </MapMarker>
        ))}
      </Map>

      {markers.length > 0 && (
        <MarkersContainer>
          {markers.map((marker: MarkerType, index: number) => (
            <div
              key={index}
              onMouseOver={() => overMarkerPos(marker)}
              onClick={() => onClickMarker(marker)}
            >
              {marker.content}
            </div>
          ))}
        </MarkersContainer>
      )}

      <button id="getInfoBtn" onClick={getInfo}>
        맵정보 가져오기
      </button>
    </>
  );
};

export default KaKaoMap;

const MarkersContainer = styled.div`
  display: flex;
  flex-direction: column;

  div {
    cursor: pointer;
    padding: 5px;
    border: 1px solid black;
  }
`;
