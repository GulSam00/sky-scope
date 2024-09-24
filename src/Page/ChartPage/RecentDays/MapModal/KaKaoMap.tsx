import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

import { useKakaoLoader } from '@src/Hook';

import { ICoord } from '@src/API/getWeatherShort';
import { LocateDataType } from '@src/Queries/useLiveDataQuery';

import { errorAccured } from '@src/Store/requestStatusSlice';
import { close } from '@src/Store/kakaoModalSlice';
import { setCity, setProvince } from '@src/Store/locationDataSlice';

import { transLocaleToCoord } from '@src/Util';

import SearchResultPagination from './SearchResultPagination';
import { Form, Button, ListGroup } from 'react-bootstrap';
import styled from 'styled-components';

interface Props {
  handleChangeCoord: (coord: ICoord) => void;
}

const KaKaoMap = ({ handleChangeCoord }: Props) => {
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [places, setPlaces] = useState<LocateDataType[]>([]);
  const [tempSelectedIndex, setTempSelectedIndex] = useState<number>(-1);

  const [selectedMarker, setSelectedMarker] = useState<LocateDataType | null>(null);
  const [mapLevel, setMapLevel] = useState<number>(3);
  const mapRef = useRef<kakao.maps.Map>(null);
  const [searchWord, setSearchWord] = useState<string>('');
  const searchRef = useRef<string>('');

  const [curPage, setCurPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);

  const dispatch = useDispatch();
  useKakaoLoader();

  const handleInput = (e: any) => {
    if (e.key === 'Enter') e.preventDefault();
    setSearchWord(e.target.value);
  };

  const insertAddress = () => {
    setCurPage(1);
    onSearchPlace(searchWord, 1);
    searchRef.current = searchWord;
    setSearchWord('');
  };

  const overMarkerPos = (marker: LocateDataType) => {
    if (!map) return;
    // 마우스로 hover된 마커의 위치를 기준으로 지도 범위를 재설정
    const position = marker.position;
    map.setLevel(2);
    setMapLevel(map.getLevel());
    map.setCenter(new kakao.maps.LatLng(position.lat, position.lng));
  };

  const onClickMarker = async (marker: LocateDataType) => {
    if (!map) return;
    const position = marker.position;
    const result = await transLocaleToCoord(position);
    if (result) {
      const { nx, ny, province, city } = result;
      dispatch(setProvince(province));
      dispatch(setCity(city));
      handleChangeCoord({ nx, ny });
      dispatch(close());
    }
  };

  const onSearchPlace = (keyword: string, page: number) => {
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
          const places: LocateDataType[] = [];
          for (let i = 0; i < data.length; i++) {
            places.push({
              placeName: data[i].place_name,
              placeId: data[i].id,
              position: {
                lat: Number(data[i].y),
                lng: Number(data[i].x),
              },
            });
            bounds.extend(new kakao.maps.LatLng(Number(data[i].y), Number(data[i].x)));
          }
          setPlaces([...places]);
          map.setBounds(bounds);
        } else {
          dispatch(errorAccured('검색 결과가 없습니다.'));
          setPlaces([]);
        }
      },
      { size: 5, page: page },
    );
  };

  const handleHoverOut = () => {
    if (!map) return;
    if (tempSelectedIndex === -1) return;
    overMarkerPos(places[tempSelectedIndex]);
  };

  const handleClickMarker = (index: number) => {
    if (tempSelectedIndex === index) {
      setSelectedMarker(places[index]);
    } else {
      setTempSelectedIndex(index);
    }
  };

  const handlePageMove = (page: number) => {
    if (page < 1 || page > maxPage) return;
    setCurPage(page);
    onSearchPlace(searchRef.current, page);
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
            size='lg'
            type='text'
            placeholder='주소 입력'
            value={searchWord}
            onChange={handleInput}
            onKeyDown={handleInput} // Handle key down event
          />
        </Form>
        <Button onClick={insertAddress}>확인</Button>
        <CloseButton src='/icons/x-circle.svg' onClick={() => dispatch(close())} />
      </FormContainer>

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
        {places.map((marker: LocateDataType, index: number) => (
          <MapMarker position={marker.position} key={index} />
        ))}
      </Map>

      {places.length > 0 && (
        <MarkersContainer>
          <ListGroup>
            {places.map((marker: LocateDataType, index: number) => (
              <ListGroup.Item
                className={tempSelectedIndex === index ? 'selected' : ''}
                key={index}
                onMouseOver={() => overMarkerPos(marker)}
                onMouseOut={handleHoverOut}
                onClick={() => handleClickMarker(index)}
              >
                {marker.placeName}
              </ListGroup.Item>
            ))}
          </ListGroup>
          <SearchResultPagination curPage={curPage} maxPage={maxPage} handlePageMove={handlePageMove} />
        </MarkersContainer>
      )}

      {selectedMarker && (
        <ConfirmModal>
          <ConfirmModalContent>
            <div className='content'>
              [{selectedMarker.placeName}] 가 위치한 지역의
              <br />
              날씨 정보를 검색합니다.
            </div>
            <div className='button'>
              <Button onClick={() => onClickMarker(selectedMarker)}>확인</Button>
              <Button variant='light' onClick={handleClickModalCancel}>
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
  padding: 1rem;
  border-radius: 1rem;

  #kakao-map {
    display: flex;

    min-height: 40vh;
    width: 100%;
  }
`;

const CloseButton = styled.img`
  cursor: pointer;
  width: 50px;
  height: 50px;
  margin-left: 10px;
  filter: invert(35%) sepia(87%) saturate(5172%) hue-rotate(212deg) brightness(105%) contrast(98%);
`;

const FormContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;

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
  .list-group-item {
    font-size: 1rem;
  }
`;

const ConfirmModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);

  z-index: 2000;
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

  width: 80dvw;
  height: 50dvh;
  padding: 20px;

  border: 1px solid #dfe2e5;
  border-radius: 10px;
  background-color: white;

  .content {
    font-size: 1.5rem;
  }

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
