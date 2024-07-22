import { useState, useRef, useCallback } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

import { LoadingState } from '@src/Component';
import { useKakaoLoader, useMapMarker } from '@src/Hook';
import { OnMapMarkerType } from '@src/Queries/useLiveDataQuery';

import { Form, Button } from 'react-bootstrap';
import styled from 'styled-components';

import BookmarkMarkers from './BookmarkMarkers';
import MarkersFooter from './MarkersFooter';
import CurrentMarkers from './CurrentMarkers';

const MapPage = () => {
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const {
    pinMarkers,
    currentMarkers,
    bookmarkMakers,
    onMapMarkers,
    onFocusMarker,
    onClickMarkerFooter,
    onClickBookmark,
    searchPlaces,
  } = useMapMarker({ map });

  const mapRef = useRef<kakao.maps.Map>(null);
  const [searchWord, setSearchWord] = useState<string>('');
  const searchRef = useRef<string>('');

  const [curPage, setCurPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);

  const { kakaoLoading, kakaoError } = useKakaoLoader();

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
    searchPlaces(searchWord, 1, setMaxPage);
    searchRef.current = searchWord;
    setSearchWord('');
  };

  const handlePageMove = useCallback(
    (weight: number) => {
      if (!map) return;

      const page = curPage + weight;
      if (page < 1 || page > maxPage) return;

      setCurPage(page);
      searchPlaces(searchRef.current, page, setMaxPage);
    },
    [map, curPage, maxPage],
  );

  return (
    <MapContainer>
      {kakaoLoading && <LoadingState />}

      <BookmarkMarkers
        bookmarkMakers={bookmarkMakers}
        onClickBookmark={onClickBookmark}
        onFocusMarker={onFocusMarker}
      />

      <CurrentMarkers currentMarkers={currentMarkers} onClickBookmark={onClickBookmark} onFocusMarker={onFocusMarker} />

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
          ref={mapRef}
          onCreate={setMap}
          id='kakao-map'
        >
          {onMapMarkers.map((marker: OnMapMarkerType, index: number) => (
            <MapMarker
              key={'onMapMarker' + index}
              position={marker.position}
              // 이미지가 겹쳐서 보이지 않는 이슈
              // 기본 마커 이미지는 사용하지 않을 것이기에 map에 마커가 존재하는 지를 확인해야 함
              image={marker.image}
            />
          ))}
        </Map>
      </KakaoMapContainer>
      <MarkersFooter
        map={map}
        markers={pinMarkers}
        handlePageMove={handlePageMove}
        onClickMarkerFooter={onClickMarkerFooter}
      />
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
