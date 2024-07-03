import { useState, useRef, useEffect } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

import { transLocaleToCoord } from '@src/Util';
import { useLiveDataQuery } from '@src/Queries';
import { useKakaoLoader } from '@src/Hook';
import { LoadingState } from '@src/Component';

import { Form, Button } from 'react-bootstrap';
import styled from 'styled-components';
import MarkersFooter from './MarkersFooter';

export interface MarkerType {
  position: {
    lat: number;
    lng: number;
  };
  content: string;
}

const MapPage = () => {
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MarkerType | null>(null);

  const mapRef = useRef<kakao.maps.Map>(null);
  const [searchWord, setSearchWord] = useState<string>('');
  const searchRef = useRef<string>('');

  const [curPage, setCurPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);
  const { kakaoLoading, kakaoError } = useKakaoLoader();
  const result = useLiveDataQuery(new Date(), selectedMarker);

  const handleInput = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!e.target.value) return;
      insertAddress();
      return;
    }
    setSearchWord(e.target.value);
  };

  const insertAddress = () => {
    setCurPage(1);
    searchPlaces(searchWord, 1);
    searchRef.current = searchWord;
    setSearchWord('');
  };

  const onClickMarker = async (marker: MarkerType) => {
    if (!map) return;
    const position = marker.position;
    const result = await transLocaleToCoord(position);

    if (!result) {
      return;
    }
    const { nx, ny, province, city, code } = result;
    const prasedPosition = { lat: ny, lng: nx };
    const content = code;
    console.log('result : ', result);
    setSelectedMarker({ position: prasedPosition, content });
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
          alert('검색 결과가 없습니다.');
          // setMarkers([]);
        }
      },
      { size: 5, page: page },
    );
  };

  const handlePageMove = (weight: number) => {
    const page = curPage + weight;
    if (page < 1 || page > maxPage) return;
    setCurPage(page);
    searchPlaces(searchRef.current, page);
  };

  return (
    <MapContainer>
      {kakaoLoading && <LoadingState />}
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

      <KakaoMapContainer>
        <Map
          center={{
            lat: 37.566826,
            lng: 126.9786567,
          }}
          // level={mapLevel}
          ref={mapRef}
          onCreate={setMap}
          id='kakao-map'
        >
          {markers.map((marker: MarkerType, index: number) => (
            <MapMarker
              key={'marker' + index}
              position={marker.position}
              onClick={() => console.log('marker : ', marker)}
            />
          ))}
        </Map>
      </KakaoMapContainer>

      <MarkersFooter map={map} markers={markers} handlePageMove={handlePageMove} onClickMarker={onClickMarker} />
    </MapContainer>
  );
};

export default MapPage;

const MapContainer = styled.div`
  overflow: auto;
  border-radius: 16px;
`;

const KakaoMapContainer = styled.div`
  margin: 16px;
  #kakao-map {
    height: 70vh;
    width: 100%;
  }
`;

const FormContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 16px;

  form {
    flex-grow: 1;
    margin-right: 10px;
  }

  button {
    min-width: 80px;
    min-height: 40px;
  }
`;
