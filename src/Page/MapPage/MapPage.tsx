import { useState, useRef, useCallback } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

import { LoadingState } from '@src/Component';
import { useKakaoLoader, useMapMarker, useAutoSearch } from '@src/Hook';
import { KakaoMapMarkerType } from '@src/Queries/useLiveDataQuery';

import { Form, Button, ListGroup } from 'react-bootstrap';
import styled from 'styled-components';

import BookmarkPlaces from './BookmarkPlaces';
import CurrentPlaces from './CurrentPlaces';
import PlacesFooter from './PlacesFooter';

const MapPage = () => {
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const {
    footerPlaces,
    currentPlaces,
    bookmarkPlaces,
    onMapMarkers,
    onFocusMarker,
    onClickMarkerFooter,
    onClickBookmark,
    searchPlaces,
  } = useMapMarker({ map });

  const {
    isAutoSearch,
    searchWord,
    lastSearchWord,
    searchAutoList,
    focusIndex,
    handleChangeInput,
    handleChangeFocus,
    onClickSearchButton,
    onClickAutoGroup,
  } = useAutoSearch();

  const mapRef = useRef<kakao.maps.Map>(null);

  const [curPage, setCurPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);

  const { kakaoLoading, kakaoError } = useKakaoLoader();

  const insertAddress = () => {
    // searchWord가 변경되는 도중 호출하는 이슈
    if (!map || !searchWord) return;
    setCurPage(1);
    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(searchWord, (data, status, pagination) => {
      if (status === kakao.maps.services.Status.OK) {
        searchPlaces(searchWord, 1, setMaxPage);
        onClickSearchButton(true);
      } else {
        alert('검색 결과가 없습니다.');
        onClickSearchButton(false);
      }
    });
  };

  const handlePageMove = useCallback(
    (weight: number) => {
      if (!map) return;

      const page = curPage + weight;
      if (page < 1 || page > maxPage) return;

      setCurPage(page);
      searchPlaces(lastSearchWord, page, setMaxPage);
    },
    [map, curPage, maxPage],
  );

  return (
    <MapContainer>
      {kakaoLoading && <LoadingState />}

      <BookmarkPlaces bookmarkPlaces={bookmarkPlaces} onClickBookmark={onClickBookmark} onFocusMarker={onFocusMarker} />

      <CurrentPlaces currentPlaces={currentPlaces} onClickBookmark={onClickBookmark} onFocusMarker={onFocusMarker} />

      <FormContainer>
        <Form>
          <Form.Control
            size='lg'
            type='text'
            placeholder='날씨를 알고 싶은 장소는?'
            value={searchWord}
            onChange={handleChangeInput}
            onKeyDown={handleChangeFocus}
          />
        </Form>
        <Button onClick={insertAddress}>확인</Button>
      </FormContainer>

      {isAutoSearch && (
        <ListGroupContainer>
          <ListGroup>
            {searchAutoList.map((item: string, index: number) => (
              <ListGroup.Item
                className={`${focusIndex === index && 'focus'}`}
                key={'searchAutoList' + index}
                onClick={() => onClickAutoGroup(item)}
              >
                {item}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </ListGroupContainer>
      )}
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
          {onMapMarkers.map((marker: KakaoMapMarkerType, index: number) => (
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
      <PlacesFooter
        map={map}
        places={footerPlaces}
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

const ListGroupContainer = styled.div`
  position: absolute;
  z-index: 1000;
  padding: 0 16px;
  width: 100%;
  cursor: pointer;

  .focus {
    background-color: #0d6efd;
    color: white;
  }
`;
