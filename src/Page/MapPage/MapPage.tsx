import { useState, useRef, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

import { LoadingState } from '@src/Component';
import { useKakaoLoader, useMapInfo, useAutoSearch } from '@src/Hook';
import { KakaoMapMarkerType, LocateDataType } from '@src/Queries/useLiveDataQuery';

import { errorAccured } from '@src/Store/RequestStatusSlice';

import { Form, Button, ListGroup } from 'react-bootstrap';
import DynamicPlaces from './DynamicPlaces';
import FooterPlaces from './FooterPlaces';

import styled from 'styled-components';
import { set } from 'date-fns';

const MapPage = () => {
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [curPage, setCurPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);
  const [originPos, setOriginPos] = useState<kakao.maps.LatLng | null>(null);
  const [originLevel, setOriginLevel] = useState<number>(0);

  const {
    footerPlaces,
    currentPlaces,
    bookmarkPlaces,
    isBlinkPlaces,
    mapMarkers,
    onClickMarker,
    searchPlaces,
    onFocusPlace,
    onTogglePlace,
    onDeletePlace,
    onClickFooterPlace,
    setIsBlinkPlaces,
  } = useMapInfo({ map });

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

  const { kakaoLoading, kakaoError } = useKakaoLoader();

  const mapRef = useRef<kakao.maps.Map>(null);
  const dispatch = useDispatch();

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
        dispatch(errorAccured('검색 결과가 없습니다.'));
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
    setOriginPos(map.getCenter());
    setOriginLevel(map.getLevel());
  };

  const handlePageMove = useCallback(
    (weight: number) => {
      if (!map) return;

      const page = curPage + weight;
      if (page < 1 || page > maxPage) return;

      setCurPage(page);
      searchPlaces(lastSearchWord, page, setMaxPage);
    },
    [map, curPage, maxPage, mapMarkers],
  );

  const handleBlinkPlace = useCallback(() => {
    setIsBlinkPlaces([false, false]);
  }, []);

  const handleClickFooterPlace = useCallback(
    (place: LocateDataType) => {
      onClickFooterPlace(place);
      if (!map) return;
      const position = place.position;

      map.panTo(new kakao.maps.LatLng(position.lat, position.lng));
      map.setLevel(2);
      setOriginPos(map.getCenter());
      setOriginLevel(map.getLevel());
    },
    [map, footerPlaces, originPos],
  );

  const onHoverPlace = useCallback(
    (position: { lat: number; lng: number }) => {
      if (!map) return;
      map.setLevel(2);
      map.panTo(new kakao.maps.LatLng(position.lat, position.lng));
    },
    [map, footerPlaces, originPos],
  );

  const onHoverOutPlace = useCallback(() => {
    if (!map || !originPos) return;
    map.setLevel(originLevel);
    map.panTo(originPos);
  }, [map, footerPlaces, originPos]);

  useEffect(() => {
    if (!map) return;
    const center = map.getCenter();
    setOriginPos(center);
    setOriginLevel(map.getLevel());
  }, [footerPlaces]);

  return (
    <MapContainer>
      {kakaoLoading && <LoadingState />}

      <DynamicPlaces
        type='bookmark'
        places={bookmarkPlaces}
        isBlinkPlace={isBlinkPlaces[0]}
        onBlinkPlace={handleBlinkPlace}
        onFocusPlace={onFocusPlace}
        onTogglePlace={onTogglePlace}
        onDeletePlace={onDeletePlace}
      />

      <DynamicPlaces
        type='current'
        places={currentPlaces}
        isBlinkPlace={isBlinkPlaces[1]}
        onBlinkPlace={handleBlinkPlace}
        onFocusPlace={onFocusPlace}
        onTogglePlace={onTogglePlace}
        onDeletePlace={onDeletePlace}
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
        places={footerPlaces}
        handlePageMove={handlePageMove}
        onClickFooterPlace={handleClickFooterPlace}
        onHoverPlace={onHoverPlace}
        onHoverOutPlace={onHoverOutPlace}
      />
    </MapContainer>
  );
};

export default MapPage;

const MapContainer = styled.div`
  overflow: auto;
  border-radius: 1rem;
`;

const FormContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 1rem;

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
  z-index: 2000;
  padding: 0 1rem;
  width: 100%;
  cursor: pointer;

  .focus {
    background-color: #0d6efd;
    color: white;
  }
`;

const KakaoMapContainer = styled.div`
  position: relative;
  margin: 1rem;
  #kakao-map {
    height: 70vh;
    width: 100%;
  }
`;

const MapMarkerContent = styled.div`
  display: flex;
  width: 150px;
  height: 36px;
  padding: 0.5rem;

  align-items: center;

  .place {
    font-size: 1rem;
    font-weight: 500;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const WholeMap = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 1000;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: white;
  height: 4rem;
  width: 4rem;
  border-radius: 50%;
  border: 1px solid #0d6efd;

  cursor: pointer;
  img {
    width: 2rem;
    height: 2rem;
  }
`;
