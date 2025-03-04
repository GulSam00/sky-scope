import { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

import { LoadingState, Tutorial } from '@src/Component';
import { useKakaoLoader, useMapInfo, useAutoSearch, useGeolocation } from '@src/Hook';
import { KakaoMapMarkerType, LocateDataType } from '@src/Types/liveDataType';
import { transLocaleToCoord } from '@src/Util';

import { RootState } from '@src/Store/store';
import { handleResize } from '@src/Store/kakaoModalSlice';
import { loadingData, loadedData, errorAccured } from '@src/Store/requestStatusSlice';

import { Form, Button, ListGroup } from 'react-bootstrap';
import FooterPlaces from './FooterPlaces';
import SearchedPlaces from './SearchedPlaces';
import ToastLists from './ToastLists';
import MapLevelSlider from './MapLevelSlider';

import styled from 'styled-components';

const MapPage = () => {
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [curPage, setCurPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);

  const {
    searchPlaces,
    currentPlaces,
    bookmarkPlaces,
    isBlinkPlaces,
    mapMarkers,
    originPos,
    originLevel,
    onClickMarker,
    onSearchPlace,
    onFocusPlace,
    onTogglePlace,
    onDeletePlace,
    onClickFooterPlace,
    setIsBlinkPlaces,
    onChangeBounds,
    onChangeCenter,
    onChangeLevel,
  } = useMapInfo({ map });
  const { loaded, coordinates } = useGeolocation();

  const {
    isAutoSearch,
    searchWord,
    lastSearchWord,
    searchAutoList,
    focusIndex,
    setFocusIndex,
    handleChangeInput,
    onClickSearchButton,
  } = useAutoSearch();

  const { kakaoLoading, kakaoError } = useKakaoLoader();
  const { isResized } = useSelector((state: RootState) => state.kakaoModalSliceReducer);
  const { isPhone } = useSelector((state: RootState) => state.globalDataSliceReducer);

  const dispatch = useDispatch();

  const insertAddress = (target?: string) => {
    // searchWord가 변경되는 도중 호출하는 이슈

    const address = target || searchWord;
    if (!map || !searchWord) return;
    setCurPage(1);
    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(address, (data, status, pagination) => {
      if (status === kakao.maps.services.Status.OK) {
        onSearchPlace(address, 1, setMaxPage);
        onClickSearchButton(true);
      } else {
        dispatch(errorAccured('검색 결과가 없습니다.'));
        onClickSearchButton(false);
      }
    });
  };

  const handleChangeFocus = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      const index = (focusIndex + 1) % searchAutoList.length;
      setFocusIndex(index);
    } else if (e.key === 'ArrowUp') {
      const index = (focusIndex - 1 + searchAutoList.length) % searchAutoList.length;
      setFocusIndex(index);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      insertAddress(searchAutoList[focusIndex]);
      onClickSearchButton(true);
    }
  };

  const showCurrentPlace = async () => {
    if (!map || !loaded || !coordinates) {
      dispatch(errorAccured('현재 위치를 찾을 수 없습니다.'));
      return;
    }
    dispatch(loadingData());
    const curPos = coordinates;
    const result = await transLocaleToCoord(curPos);
    if (!result) {
      dispatch(errorAccured('현재 위치를 찾을 수 없습니다.'));
      dispatch(loadedData());
      return;
    }
    const { localeCode, depth3 } = result;
    await onClickFooterPlace({ position: curPos, placeName: depth3, placeId: localeCode.toString() });
    // onChangeCenter에서 변경되는 값 useEffect에서 감지하여 처리
    onChangeCenter(curPos.lat, curPos.lng);
    onChangeLevel(4);
    dispatch(loadedData());
    // PlaceWeather의 useEffect에서 dispatch를 처리해준다.
    // 이는 다른 loading으로 처리해야 할 state를 하나의 loading으로 같이 묶어서 처리하는 결과가 된다.
    // 의도하지 않았지만, 적절한 방식인지는 고민의 여지.
  };

  const showWholeMarker = () => {
    if (!map || !mapMarkers.length) return;

    const bounds = new kakao.maps.LatLngBounds();
    mapMarkers.forEach((marker: KakaoMapMarkerType) => {
      const position = new kakao.maps.LatLng(marker.position.lat, marker.position.lng);
      bounds.extend(position);
    });
    onChangeBounds(bounds);
  };

  const handlePageMove = useCallback(
    (weight: number) => {
      const page = curPage + weight;
      setCurPage(page);
      onSearchPlace(lastSearchWord, page, setMaxPage);
    },
    [curPage, maxPage, mapMarkers],
  );

  const handleBlinkPlace = useCallback(() => {
    setIsBlinkPlaces([false, false]);
  }, []);

  const handleClickFooterPlace = useCallback(
    (place: LocateDataType) => {
      if (!map) return;
      onClickFooterPlace(place);
      const position = place.position;
      onChangeCenter(position.lat, position.lng);
    },
    [map, searchPlaces, currentPlaces, bookmarkPlaces, originPos],
  );

  const onHoverPlace = useCallback(
    (position: { lat: number; lng: number }) => {
      if (!map) return;
      map.setCenter(new kakao.maps.LatLng(position.lat, position.lng));
    },
    [map, searchPlaces, originPos],
  );

  const onHoverOutPlace = useCallback(() => {
    if (!map || !originPos) return;
    map.setCenter(originPos);
  }, [map, searchPlaces, originPos]);

  const handleZoomChanged = (target: kakao.maps.Map) => {
    onChangeLevel(target.getLevel());
  };

  useEffect(() => {
    if (isResized) {
      if (!map) return;
      dispatch(handleResize());
      map.relayout();
    }
  }, [isResized]);

  useEffect(() => {
    if (!map) dispatch(loadingData());
    else {
      map.setMaxLevel(12);
      map.setMinLevel(1);
      dispatch(loadedData());
    }
  }, [map]);

  return (
    <MapContainer>
      <Tutorial />
      {kakaoLoading && <LoadingState />}

      <FormContainer className='step1'>
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
        <Button onClick={() => insertAddress()}>확인</Button>
      </FormContainer>

      {isAutoSearch && (
        <ListGroupContainer>
          <ListGroup>
            {searchAutoList.map((item: string, index: number) => (
              <ListGroup.Item
                className={`${focusIndex === index && 'focus'}`}
                key={'searchAutoList' + index}
                onClick={() => insertAddress(item)}
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
          // ref={mapRef}
          onCreate={setMap}
          onZoomChanged={handleZoomChanged}
          level={originLevel}
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

        <CurrentPosition onClick={() => showCurrentPlace()} className='step4'>
          <img src='/icons/crosshair.svg' alt='crosshair' />
        </CurrentPosition>

        <WholeMap onClick={() => showWholeMarker()} className='step5'>
          <img src='/icons/full.svg' alt='full' />
        </WholeMap>

        <ToastLists />
        <MapLevelSlider level={originLevel} onChangeLevel={onChangeLevel} />
      </KakaoMapContainer>

      <FixedContainer phone={isPhone.toString()}>
        <SearchedPlaces
          curPage={curPage}
          maxPage={maxPage}
          places={searchPlaces}
          handlePageMove={handlePageMove}
          onClickFooterPlace={handleClickFooterPlace}
          onHoverPlace={onHoverPlace}
          onHoverOutPlace={onHoverOutPlace}
        />

        <FooterPlaces
          currentPlaces={currentPlaces}
          bookmarkPlaces={bookmarkPlaces}
          isBlinkPlace={isBlinkPlaces}
          onBlinkPlace={handleBlinkPlace}
          onFocusPlace={onFocusPlace}
          onTogglePlace={onTogglePlace}
          onDeletePlace={onDeletePlace}
        />
      </FixedContainer>
    </MapContainer>
  );
};

export default MapPage;

interface Props {
  phone: string;
}

const MapContainer = styled.div`
  overflow: hidden;
  width: 100%;
`;

const FormContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem;

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
    height: 80vh;
  }

  @media (max-width: 640px) {
    #kakao-map {
      height: 60vh;
    }
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

const CurrentPosition = styled.div`
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

const WholeMap = styled.div`
  position: absolute;
  top: 6rem;
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

const FixedContainer = styled.div<Props>`
  display: flex;
  flex-direction: column;

  position: fixed;
  bottom: 0;

  @media (min-width: 640px) {
    width: ${props => (props.phone === 'true' ? '400px' : '100%')};
  }
  width: 100%;

  z-index: 1500;
`;
