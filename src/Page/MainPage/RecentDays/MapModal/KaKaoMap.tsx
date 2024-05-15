import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { Map, MapMarker } from "react-kakao-maps-sdk";

import useKakaoLoader from "@src/useKakaoLoader";
import SearchResultPagination from "./SearchResultPagination";
import { transLocaleToCoord } from "@src/Util";
import { ICoord } from "@src/API/getWeatherShort";
import { close } from "@src/Store/kakaoModalSlice";
import { setCity, setProvince } from "@src/Store/locationDataSlice";

import { Form, Button, ListGroup } from "react-bootstrap";
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
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [tempSelectedIndex, setTempSelectedIndex] = useState<number>(-1);

  const [selectedMarker, setSelectedMarker] = useState<MarkerType | null>(null);
  const [mapLevel, setMapLevel] = useState<number>(3);
  const mapRef = useRef<kakao.maps.Map>(null);
  const [searchWord, setSearchWord] = useState<string>("");
  const searchRef = useRef<string>("");

  const [curPage, setCurPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);

  const dispatch = useDispatch();
  useKakaoLoader();

  const handleInput = (e: any) => {
    if (e.key === "Enter") e.preventDefault();
    setSearchWord(e.target.value);
  };

  const insertAddress = () => {
    setCurPage(1);
    searchPlaces(searchWord, 1);
    searchRef.current = searchWord;
    setSearchWord("");
  };

  const overMarkerPos = (marker: MarkerType) => {
    if (!map) return;

    // 마우스로 hover된 마커의 위치를 기준으로 지도 범위를 재설정
    const position = marker.position;
    map.setLevel(2);
    setMapLevel(map.getLevel());

    map.panTo(new kakao.maps.LatLng(position.lat, position.lng));
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

  const searchPlaces = (keyword: string, page: number) => {
    if (!map) return;
    const ps = new kakao.maps.services.Places();

    ps.keywordSearch(
      keyword,
      (data, status, pagination) => {
        if (status === kakao.maps.services.Status.OK) {
          data.map((place: any) => {
            console.log(place.place_name);
          });
          console.log("current pagination : ", pagination.current);
          setMaxPage(pagination.last);
          // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
          // LatLngBounds 객체에 좌표를 추가합니다
          const bounds = new kakao.maps.LatLngBounds();
          const markers: MarkerType[] = [];
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
        } else {
          console.log("검색 결과가 없습니다.");
          setMarkers([]);
        }
      },
      { size: 5, page: page }
    );
  };

  const handleHoverOut = () => {
    if (!map) return;
    overMarkerPos(markers[tempSelectedIndex]);
  };

  const handleClickMarker = (index: number) => {
    if (tempSelectedIndex === index) {
      setSelectedMarker(markers[index]);
    } else {
      setTempSelectedIndex(index);
    }
  };

  const handlePageMove = (page: number) => {
    if (page < 1 || page > maxPage) return;
    setCurPage(page);
    searchPlaces(searchRef.current, page);
    setTempSelectedIndex(-1);
  };

  const handleClickModalCancel = () => {
    setSelectedMarker(null);
    setTempSelectedIndex(-1);
  };

  return (
    <MapModalContainer>
      <FormContainer>
        <Form>
          <Form.Control
            size="lg"
            type="text"
            placeholder="주소 입력"
            value={searchWord}
            onChange={handleInput}
            onKeyDown={handleInput} // Handle key down event
          />
        </Form>
        <Button onClick={insertAddress}>확인</Button>
        <img src="/x-circle.svg" alt="" onClick={() => dispatch(close())} />
        {/* <Button id="close" onClick={() => dispatch(close())}>
          닫기
        </Button> */}
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
          <ListGroup>
            {markers.map((marker: MarkerType, index: number) => (
              <ListGroup.Item
                className={tempSelectedIndex === index ? "selected" : ""}
                key={index}
                onMouseOver={() => overMarkerPos(marker)}
                onMouseOut={handleHoverOut}
                onClick={() => handleClickMarker(index)}
              >
                {marker.content}
              </ListGroup.Item>
            ))}
          </ListGroup>
          <SearchResultPagination
            curPage={curPage}
            maxPage={maxPage}
            handlePageMove={handlePageMove}
          />
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
              <Button variant="light" onClick={handleClickModalCancel}>
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

  padding: 30px;
  #kakao-map {
    display: flex;

    min-height: 40vh;
    width: 100%;
  }
`;

const FormContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding-bottom: 30px;

  form {
    flex-grow: 1;
    margin-right: 10px;
  }

  img {
    cursor: pointer;
    width: 50px;
    height: 50px;
    margin-left: 10px;
    filter: invert(35%) sepia(87%) saturate(5172%) hue-rotate(212deg)
      brightness(105%) contrast(98%);
  }
`;

const MarkersContainer = styled.div`
  display: flex;
  flex-direction: column;
  * {
    cursor: pointer;
    border-radius: 0;
  }
  .selected {
    // blue selected highlight
    background-color: #0d6efd;
    color: white;
    border: 1px solid white;
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
