import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { useKakaoLoader } from '@src/Hook';

import { transLocaleToCoord } from '@src/Util';
import { useLiveDataQuery } from '@src/Queries';

import { Form, Button, ListGroup } from 'react-bootstrap';
import styled from 'styled-components';

interface MarkerType {
  position: {
    lat: number;
    lng: number;
  };
  content: string;
}

const MapPage = () => {
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [tempSelectedIndex, setTempSelectedIndex] = useState<number>(-1);

  const [selectedMarker, setSelectedMarker] = useState<MarkerType | null>(null);
  const [mapLevel, setMapLevel] = useState<number>(3);
  const mapRef = useRef<kakao.maps.Map>(null);
  const [searchWord, setSearchWord] = useState<string>('');
  const searchRef = useRef<string>('');

  const [curPage, setCurPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);

  const { kakaoLoading, kakaoError } = useKakaoLoader();
  const dispatch = useDispatch();

  const handleInput = (e: any) => {
    if (e.key === 'Enter') e.preventDefault();
    setSearchWord(e.target.value);
  };

  const insertAddress = () => {
    setCurPage(1);
    searchPlaces(searchWord, 1);
    searchRef.current = searchWord;
    setSearchWord('');
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
    const result = await transLocaleToCoord(position);

    if (result) {
      const { nx, ny, province, city } = result;
    }
  };

  const searchPlaces = (keyword: string, page: number) => {
    if (!map) return;
    const ps = new kakao.maps.services.Places();

    ps.keywordSearch(
      keyword,
      (data, status, pagination) => {
        if (status === kakao.maps.services.Status.OK) {
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
            bounds.extend(new kakao.maps.LatLng(Number(data[i].y), Number(data[i].x)));
          }
          setMarkers([...markers]);
          map.setBounds(bounds);
        } else {
          console.log('검색 결과가 없습니다.');
          setMarkers([]);
        }
      },
      { size: 15, page: page },
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

  useEffect(() => {}, []);
  return (
    <MapContainer>
      <FormContainer>
        <Form>
          <Form.Control
            size='lg'
            type='text'
            placeholder='주소 입력'
            value={searchWord}
            onChange={handleInput}
            onKeyDown={handleInput} // Handle key down event
          />
        </Form>
        <Button onClick={insertAddress}>확인</Button>
      </FormContainer>

      {markers.length > 0 && (
        <MarkersContainer>
          <ListGroup>
            {markers.map((marker: MarkerType, index: number) => (
              <ListGroup.Item
                className={tempSelectedIndex === index ? 'selected' : ''}
                key={index}
                onMouseOver={() => overMarkerPos(marker)}
                onMouseOut={handleHoverOut}
                onClick={() => handleClickMarker(index)}
              >
                {marker.content}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </MarkersContainer>
      )}

      <Map
        center={{
          lat: 37.566826,
          lng: 126.9786567,
        }}
        level={mapLevel}
        ref={mapRef}
        onCreate={setMap}
        id='kakao-map'
      >
        {markers.map((marker: MarkerType) => (
          <MapMarker position={marker.position} onClick={() => console.log('marker : ', marker)} />
        ))}
      </Map>
    </MapContainer>
  );
};

export default MapPage;

const MapContainer = styled.div`
  #kakao-map {
    display: flex;

    min-height: 100vh;
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

  button {
    min-width: 80px;
    min-height: 40px;
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
