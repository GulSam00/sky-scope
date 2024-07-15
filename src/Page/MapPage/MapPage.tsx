import { useState, useRef, useEffect } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

import { transLocaleToCoord } from '@src/Util';
import { useKakaoLoader } from '@src/Hook';
import { LoadingState } from '@src/Component';
import { MarkerType } from '@src/Queries/useLiveDataQuery';

import { Form, Button } from 'react-bootstrap';
import styled from 'styled-components';
import MarkersFooter from './MarkersFooter';
import MarkerWeather from './MarkerWeather';

const MapPage = () => {
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [currentMarkers, setCurrentMarkers] = useState<MarkerType[]>([]);
  const [bookmarkMakers, setBookmarkMakers] = useState<MarkerType[]>([]);

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

    const swapedMarker = isSwapMarker(marker.code);
    const image = swapedMarker === 1 ? '/icons/search.svg' : '/icons/star-fill.svg';
    const originalPosition = marker.originalPosition;
    const position = new kakao.maps.LatLng(originalPosition.lat, originalPosition.lng);
    new kakao.maps.Marker({
      position: position,
      map: map,
      image: new kakao.maps.MarkerImage(image, new kakao.maps.Size(24, 24)),
    });
    map.setLevel(2);
    map.panTo(position);
  };

  const onClickMarkerFooter = async (marker: MarkerType) => {
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
      localStorage.setItem('bookmarks', JSON.stringify([firstMarker, ...bookmarkMakers]));
    } else {
      // 북마크 해제
      const index = bookmarkMakers.findIndex(item => item.code === code);
      const firstMarker = bookmarkMakers[index];
      firstMarker.isBookmarked = false;
      bookmarkMakers.splice(index, 1);
      setBookmarkMakers([...bookmarkMakers]);
      setCurrentMarkers([firstMarker, ...currentMarkers]);
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
          const markers: MarkerType[] = [];
          for (let i = 0; i < data.length; i++) {
            markers.push({
              position: {
                lat: Number(data[i].y),
                lng: Number(data[i].x),
              },
              content: data[i].place_name,
            });
            const kakaoPosition = new kakao.maps.LatLng(Number(data[i].y), Number(data[i].x));
            new kakao.maps.Marker({
              position: kakaoPosition,
              map: map,
              image: new kakao.maps.MarkerImage('/icons/compass.svg', new kakao.maps.Size(24, 24)),
            });
            bounds.extend(kakaoPosition);
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

  useEffect(() => {
    const localBookmarks = localStorage.getItem('bookmarks');
    if (localBookmarks) {
      const parsedBookmarks: MarkerType[] = JSON.parse(localBookmarks);
      setBookmarkMakers(parsedBookmarks);
      if (map) {
        const bounds = new kakao.maps.LatLngBounds();

        parsedBookmarks.forEach((marker: MarkerType) => {
          const originalPosition = marker.originalPosition;
          const position = new kakao.maps.LatLng(originalPosition.lat, originalPosition.lng);
          new kakao.maps.Marker({
            position: position,
            map: map,
            image: new kakao.maps.MarkerImage('/icons/star-fill.svg', new kakao.maps.Size(24, 24)),
          });
          bounds.extend(position);
        });
        map.setBounds(bounds);
      }
    }
  }, [map]);

  return (
    <MapContainer>
      {kakaoLoading && <LoadingState />}
      <MarkerContiner>
        북마크
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
        조회
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
          {markers.map((marker: MarkerType, index: number) => (
            <MapMarker
              key={'marker' + index}
              position={marker.position}
              //
              image={{ src: '/icons/compass.svg', size: { width: 24, height: 24 } }}
            />
          ))}
        </Map>
      </KakaoMapContainer>
      <MarkersFooter
        map={map}
        markers={markers}
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
