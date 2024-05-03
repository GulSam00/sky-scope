import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { Map, MapMarker } from "react-kakao-maps-sdk";

import { transLocaleToCoord } from "@src/Util";
import useKakaoLoader from "@src/useKakaoLoader";
import { close } from "@src/Store/kakaoModalSlice";
import { setCity, setProvince } from "@src/Store/locationDataSlice";
import { ICoord } from "@src/API/getWeatherShort";

import { Form, Button } from "react-bootstrap";
import styled from "styled-components";

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

const KaKaoMap = ({ handleChangeCoord }: IProps) => {
  const dispatch = useDispatch();
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MarkerType | null>(null);
  const [mapLevel, setMapLevel] = useState<number>(3);
  const mapRef = useRef<kakao.maps.Map>(null);
  const [address, setAddress] = useState<string>("");

  useKakaoLoader();

  const handleInput = (e: any) => {
    if (e.key === "Enter") e.preventDefault();
    setAddress(e.target.value);
  };

  const insertAddress = () => {
    searchPlaces(address);
    setAddress("");
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
    console.log("마커의 정보 : ", marker);
    const result = await transLocaleToCoord(position);
    console.log("Result : ", result);
    if (result) {
      const { nx, ny, province, city } = result;
      dispatch(setProvince(province));
      dispatch(setCity(city));
      handleChangeCoord({ nx, ny });
      dispatch(close());
    }
  };

  const searchPlaces = (keyword: string) => {
    if (!map) return;
    const ps = new kakao.maps.services.Places();

    ps.keywordSearch(keyword, (data, status, _pagination) => {
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
    });
  };

  return (
    <MapModalContainer>
      <FormContainer>
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
        <Button onClick={insertAddress}>확인</Button>
      </FormContainer>

      <Map
        center={{
          lat: 37.566826,
          lng: 126.9786567,
        }}
        level={mapLevel}
        ref={mapRef}
        onCreate={setMap}
        id="kakao-map"
      >
        {markers.map((marker: MarkerType) => (
          <MapMarker position={marker.position} />
        ))}
      </Map>

      {markers.length > 0 && (
        <MarkersContainer>
          {markers.map((marker: MarkerType, index: number) => (
            <div
              key={index}
              onMouseOver={() => overMarkerPos(marker)}
              onClick={() => setSelectedMarker(marker)}
            >
              {marker.content}
            </div>
          ))}
        </MarkersContainer>
      )}
      {selectedMarker && (
        <ConfirmModal>
          <ConfirmModalContent>
            <div className="content">
              [{selectedMarker.content}] 가 위치한 지역의
              <br />
              날씨 정보를 검색합니다.
            </div>
            <div className="button">
              <Button onClick={() => onClickMarker(selectedMarker)}>
                확인
              </Button>
              <Button variant="light" onClick={() => setSelectedMarker(null)}>
                취소
              </Button>
            </div>
          </ConfirmModalContent>
        </ConfirmModal>
      )}
    </MapModalContainer>
  );
};

export default KaKaoMap;

const MapModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  white-space: pre-wrap;
  
  #kakao-map {
    display: flex;

    min-height: 50vh;
    width: 100%;
    padding: 20px;
`;

const FormContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 10px;

  form {
    flex-grow: 1;
    margin-right: 10px;
  }
`;

const MarkersContainer = styled.div`
  display: flex;
  flex-direction: column;

  div {
    cursor: pointer;
    padding: 5px;
    border: 1px solid black;
  }
`;

const ConfirmModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);

  z-index: 1100;
`;

const ConfirmModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  min-width: 40vw;
  min-height: 40vh;
  padding: 20px;

  border: 1px solid black;
  border-radius: 10px;
  background-color: white;

  .button {
    position: absolute;
    bottom: 10px;

    display: flex;
    width: 100%;

    justify-content: space-between;
    * {
      flex-grow: 1;
      margin: 10px;
    }
  }
`;
