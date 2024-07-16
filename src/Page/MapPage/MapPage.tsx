import { useState, useRef, useEffect } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

import { transLocaleToCoord } from '@src/Util';
import { useKakaoLoader } from '@src/Hook';
import { LoadingState } from '@src/Component';
import { KakaoMapMarkerType, MarkerType, OnMapMarkerType } from '@src/Queries/useLiveDataQuery';

import { Form, Button } from 'react-bootstrap';
import styled from 'styled-components';
import MarkersFooter from './MarkersFooter';
import MarkerWeather from './MarkerWeather';

const MapPage = () => {
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [pinMarkers, setPinMarkers] = useState<KakaoMapMarkerType[]>([]);
  const [currentMarkers, setCurrentMarkers] = useState<MarkerType[]>([]);
  const [bookmarkMakers, setBookmarkMakers] = useState<MarkerType[]>([]);
  const [onMapMarkers, setOnMapMarkers] = useState<OnMapMarkerType[]>([]);

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
    searchPlaces(searchWord, 1);
    searchRef.current = searchWord;
    setSearchWord('');
  };

  const focusMap = (position: { lat: number; lng: number }) => {
    if (!map) return;
    const kakaoPosition = new kakao.maps.LatLng(position.lat, position.lng);
    map.setLevel(2);
    map.panTo(kakaoPosition);
  };

  const changeOnMapMarkers = (dstOnMapMarkers: OnMapMarkerType[]) => {
    // 이전의 pin 마커를 제거, onMapMarkers 대신 사용
    const removePrevPinMarkers = onMapMarkers.filter((item: OnMapMarkerType) => item.status !== 'pin');

    const filteredMarkers = dstOnMapMarkers.filter((item: OnMapMarkerType) => {
      const findIndex = removePrevPinMarkers.findIndex(marker => marker.content === item.content);
      // onMapMarkers에 없을 경우 추가
      if (findIndex === -1) {
        return item;
      }
      // onMapMarkers에 이미 존재하는 장소이지만 status가 pin일 경우 변경
      // 리턴값이 없어야 하기에 따로 return을 하지 않음
      else if (removePrevPinMarkers[findIndex].status === 'pin') {
        removePrevPinMarkers[findIndex].status = item.status;
      }
    });
    // onMapMarkers에 존재하지 않는 장소들을 추가
    // else if 문에서 수정된 status를 반영
    setOnMapMarkers([...filteredMarkers, ...removePrevPinMarkers]);
  };

  const changeOnMapMarker = (dstOnMapMarker: OnMapMarkerType) => {
    const index = onMapMarkers.findIndex(item => item.content === dstOnMapMarker.content);
    if (index !== -1 && dstOnMapMarker.status !== 'pin') {
      onMapMarkers[index] = dstOnMapMarker;
      setOnMapMarkers([...onMapMarkers]);
      console.log('changeOnMapMarker : ', dstOnMapMarker);
    } else {
      setOnMapMarkers([dstOnMapMarker, ...onMapMarkers]);
    }
  };

  const isSwapMarker = (code: string) => {
    const currentIndex = currentMarkers.findIndex(item => item.code === code);
    const bookmarkIndex = bookmarkMakers.findIndex(item => item.code === code);
    if (currentIndex !== -1) {
      const firstMarker = currentMarkers[currentIndex];
      currentMarkers.splice(currentIndex, 1);
      setCurrentMarkers([firstMarker, ...currentMarkers]);
      return 1;
    }
    if (bookmarkIndex !== -1) {
      const firstMarker = bookmarkMakers[bookmarkIndex];
      bookmarkMakers.splice(bookmarkIndex, 1);
      setBookmarkMakers([firstMarker, ...bookmarkMakers]);
      return 2;
    }
    return 0;
  };

  const onFocusMarker = (marker: MarkerType) => {
    if (!map) return;
    isSwapMarker(marker.code);
    focusMap(marker.originalPosition);
  };

  const onClickMarkerFooter = async (marker: KakaoMapMarkerType) => {
    if (!map) return;

    const newMarker = {} as MarkerType;
    newMarker.originalPosition = marker.position;
    newMarker.content = marker.content;
    const result = await transLocaleToCoord(marker.position);
    if (!result) {
      return;
    }

    const { nx, ny, province, city, code } = result;
    if (currentMarkers) {
      if (isSwapMarker(code) !== 0) return;
    }

    const prasedPosition = { lat: ny, lng: nx };
    Object.assign(newMarker, { province, city, code, position: prasedPosition, isBookmarked: false });
    setCurrentMarkers([newMarker, ...currentMarkers]);

    const image = { src: '/icons/search.svg', size: { width: 24, height: 24 } };
    changeOnMapMarker({ image, position: marker.position, content: marker.content, status: 'search' });
  };

  const onClickBookmark = (code: string, isBookmarked: boolean) => {
    if (isBookmarked === false) {
      // 북마크 추가
      const index = currentMarkers.findIndex(item => item.code === code);
      const firstMarker = currentMarkers[index];
      firstMarker.isBookmarked = true;
      currentMarkers.splice(index, 1);
      setCurrentMarkers([...currentMarkers]);
      setBookmarkMakers([firstMarker, ...bookmarkMakers]);
      const image = { src: '/icons/star-fill.svg', size: { width: 24, height: 24 } };
      const position = firstMarker.originalPosition;
      const content = firstMarker.content;
      const status = 'bookmark';
      changeOnMapMarker({ image, position, content, status });
      focusMap(position);
      localStorage.setItem('bookmarks', JSON.stringify([firstMarker, ...bookmarkMakers]));
    } else {
      // 북마크 해제
      const index = bookmarkMakers.findIndex(item => item.code === code);
      const firstMarker = bookmarkMakers[index];
      firstMarker.isBookmarked = false;
      bookmarkMakers.splice(index, 1);
      setBookmarkMakers([...bookmarkMakers]);
      setCurrentMarkers([firstMarker, ...currentMarkers]);

      const image = { src: '/icons/search.svg', size: { width: 24, height: 24 } };
      const position = firstMarker.originalPosition;
      const content = firstMarker.content;
      const status = 'search';
      changeOnMapMarker({ image, position, content, status });
      focusMap(position);
      localStorage.setItem('bookmarks', JSON.stringify([...bookmarkMakers]));
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
          // LatLngBounds 객체에 좌표를 추가
          // 좌표들이 모두 보이게 지도의 중심좌표와 레벨을 재설정 할 수 있다
          const bounds = new kakao.maps.LatLngBounds();
          const kakaoSearchMarkers: KakaoMapMarkerType[] = [];
          const parsedOnMapMarkers: OnMapMarkerType[] = [];
          for (let i = 0; i < data.length; i++) {
            const position = { lat: Number(data[i].y), lng: Number(data[i].x) };
            const image = { src: '/icons/geo-pin.svg', size: { width: 24, height: 24 } };
            const content = data[i].place_name;
            const status = 'pin';
            kakaoSearchMarkers.push({
              position,
              content,
            });
            parsedOnMapMarkers.push({ image, position, content, status });
            const kakaoPosition = new kakao.maps.LatLng(position.lat, position.lng);
            bounds.extend(kakaoPosition);
          }
          changeOnMapMarkers(parsedOnMapMarkers);
          setPinMarkers([...kakaoSearchMarkers]);
          map.setBounds(bounds);
        } else {
          alert('검색 결과가 없습니다.');
          // setPinMarkers([]);
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

  useEffect(() => {
    const localBookmarks = localStorage.getItem('bookmarks');
    if (localBookmarks) {
      const parsedBookmarks: MarkerType[] = JSON.parse(localBookmarks);
      setBookmarkMakers(parsedBookmarks);

      const parsedOnMapMarkers: OnMapMarkerType[] = parsedBookmarks.map((bookmark: MarkerType) => {
        const image = { src: '/icons/star-fill.svg', size: { width: 24, height: 24 } };
        const position = bookmark.originalPosition;
        const content = bookmark.content;
        const status = 'bookmark';
        return { image, position, content, status };
      });
      changeOnMapMarkers(parsedOnMapMarkers);

      if (map) {
        const bounds = new kakao.maps.LatLngBounds();
        onMapMarkers.forEach((marker: OnMapMarkerType) => {
          const position = new kakao.maps.LatLng(marker.position.lat, marker.position.lng);
          bounds.extend(position);
        });
        map.setBounds(bounds);
      }
    }
  }, []);

  return (
    <MapContainer>
      {kakaoLoading && <LoadingState />}
      <MarkerContiner>
        <div>
          <img src='/icons/star-fill.svg' alt='북마크' width={24} />
          북마크
        </div>
        {bookmarkMakers.length !== 0 && (
          <Markers>
            {bookmarkMakers.map((marker: MarkerType, index: number) => (
              <MarkerWeather
                key={'marker' + index}
                marker={marker}
                onClickBookmark={onClickBookmark}
                onFocusMarker={onFocusMarker}
              />
            ))}
          </Markers>
        )}
      </MarkerContiner>

      <MarkerContiner>
        <div>
          <img src='/icons/search.svg' alt='검색' width={24} />
          조회
        </div>
        {currentMarkers.length !== 0 && (
          <Markers>
            {currentMarkers.map((marker: MarkerType, index: number) => (
              <MarkerWeather
                key={'marker' + index}
                marker={marker}
                onClickBookmark={onClickBookmark}
                onFocusMarker={onFocusMarker}
              />
            ))}
          </Markers>
        )}
      </MarkerContiner>

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

const MarkerContiner = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 200px;
  margin: 16px;
  padding: 16px;
  border: 1px solid #0d6efd;
  border-radius: 16px;

  > div {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 24px;
    font-weight: 600;
  }
`;

const Markers = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;
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
