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

  const onClickMarker = async (marker: MarkerType) => {
    if (!map) return;

    const newMarker = {} as MarkerType;
    newMarker.position = marker.position;
    newMarker.content = marker.content;
    const result = await transLocaleToCoord(marker.position);

    if (!result) {
      return;
    }
    const { nx, ny, province, city, code } = result;
    if (currentMarkers) {
      const index = currentMarkers.findIndex(item => item.code === code);
      if (index !== -1) {
        const firstMarker = currentMarkers[index];
        currentMarkers.splice(index, 1);
        setCurrentMarkers([firstMarker, ...currentMarkers]);
        return;
      }
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
    } else {
      // 북마크 해제
      const index = bookmarkMakers.findIndex(item => item.code === code);
      const firstMarker = bookmarkMakers[index];
      firstMarker.isBookmarked = false;
      bookmarkMakers.splice(index, 1);
      setBookmarkMakers([...bookmarkMakers]);
      setCurrentMarkers([firstMarker, ...currentMarkers]);
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

  // useEffect(() => {
  //   const localBookmarks = localStorage.getItem('bookmarks');
  //   if (localBookmarks) {
  //     setBookmarkMakers(JSON.parse(localBookmarks));
  //   }
  // }, []);

  return (
    <MapContainer>
      {kakaoLoading && <LoadingState />}
      <div>북마크</div>
      {bookmarkMakers.length !== 0 && (
        <MarkerContiner>
          {bookmarkMakers.map((marker: MarkerType, index: number) => (
            <MarkerWeather key={'marker' + index} marker={marker} onClickBookmark={onClickBookmark} />
          ))}
        </MarkerContiner>
      )}
      <div>조회</div>

      {currentMarkers.length !== 0 && (
        <MarkerContiner>
          {currentMarkers.map((marker: MarkerType, index: number) => (
            <MarkerWeather key={'marker' + index} marker={marker} onClickBookmark={onClickBookmark} />
          ))}
        </MarkerContiner>
      )}
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

const MarkerContiner = styled.div`
  display: flex;
  margin: 16px;
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
