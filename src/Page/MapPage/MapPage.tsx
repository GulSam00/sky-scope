import { useState, useRef, useCallback } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

import { LoadingState } from '@src/Component';
import { useKakaoLoader, useMapMarker, useAutoSearch } from '@src/Hook';
import { KakaoMapMarkerType } from '@src/Queries/useLiveDataQuery';

import { Form, Button, ListGroup } from 'react-bootstrap';

import styled from 'styled-components';

import DynamicPlaces from './DynamicPlaces';
import FooterPlaces from './FooterPlaces';

const MapPage = () => {
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const {
    footerPlaces,
    currentPlaces,
    bookmarkPlaces,
    mapMarkers,
    onClickMarker,
    searchPlaces,
    onFocusPlace,
    onClickPlace,
    onDeletePlace,
    onClickFooterPlace,
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

  const showWholeMarker = () => {
    if (!map || !mapMarkers.length) return;

    const bounds = new kakao.maps.LatLngBounds();
    mapMarkers.forEach((marker: KakaoMapMarkerType) => {
      const position = new kakao.maps.LatLng(marker.position.lat, marker.position.lng);
      bounds.extend(position);
    });
    map.setBounds(bounds);
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

      <DynamicPlaces
        places={bookmarkPlaces}
        onFocusPlace={onFocusPlace}
        onClickPlace={onClickPlace}
        onDeletePlace={onDeletePlace}
        type='bookmark'
      />

      <DynamicPlaces
        places={currentPlaces}
        onFocusPlace={onFocusPlace}
        onClickPlace={onClickPlace}
        onDeletePlace={onDeletePlace}
        type='current'
      />

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
          {mapMarkers.map((marker: KakaoMapMarkerType, index: number) => (
            <MapMarker
              key={'onMapMarker' + index}
              position={marker.position}
              // 이미지가 겹쳐서 보이지 않는 이슈
              // 기본 마커 이미지는 사용하지 않을 것이기에 map에 마커가 존재하는 지를 확인해야 함
              image={marker.image}
              onClick={() => onClickMarker(marker)}
            >
              <MapMarkerContent>
                <div className='place'>{marker.placeName}</div>
              </MapMarkerContent>
            </MapMarker>
          ))}
        </Map>
        <WholeMap onClick={() => showWholeMarker()}>
          <img src='/icons/crosshair.svg' alt='crosshair' />
        </WholeMap>
      </KakaoMapContainer>

      <FooterPlaces
        map={map}
        places={footerPlaces}
        handlePageMove={handlePageMove}
        onClickFooterPlace={onClickFooterPlace}
      />
    </MapContainer>
  );
};

export default MapPage;

const MapContainer = styled.div`
  overflow: auto;
  border-radius: 16px;
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

const KakaoMapContainer = styled.div`
  position: relative;
  margin: 16px;
  #kakao-map {
    height: 70vh;
    width: 100%;
  }
`;

const MapMarkerContent = styled.div`
  display: flex;
  width: 150px;
  height: 36px;
  padding: 8px;

  align-items: center;

  .place {
    font-size: 16px;
    font-weight: 500;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const WholeMap = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1000;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: white;
  height: 70px;
  width: 70px;
  border-radius: 50%;
  border: 1px solid #0d6efd;

  cursor: pointer;
  img {
    width: 30px;
    height: 30px;
  }
`;
