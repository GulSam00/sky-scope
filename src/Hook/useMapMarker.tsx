import { useState, useEffect, useCallback } from 'react';
import { transLocaleToCoord } from '@src/Util';

import { KakaoMapMarkerType, MarkerType, OnMapMarkerType } from '@src/Queries/useLiveDataQuery';

interface Props {
  map: kakao.maps.Map | null;
}
const useMapMarker = ({ map }: Props) => {
  const [pinMarkers, setPinMarkers] = useState<KakaoMapMarkerType[]>([]);
  const [currentMarkers, setCurrentMarkers] = useState<MarkerType[]>([]);
  const [bookmarkMakers, setBookmarkMakers] = useState<MarkerType[]>([]);
  const [onMapMarkers, setOnMapMarkers] = useState<OnMapMarkerType[]>([]);

  const focusMap = (position: { lat: number; lng: number }) => {
    if (!map) return;
    const kakaoPosition = new kakao.maps.LatLng(position.lat, position.lng);
    map.setLevel(2);
    map.panTo(kakaoPosition);
  };

  const onFocusMarker = useCallback(
    (marker: MarkerType) => {
      isSwapMarker(marker.content);
      focusMap(marker.originalPosition);
    },
    [currentMarkers, bookmarkMakers],
  );

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
    } else {
      setOnMapMarkers([dstOnMapMarker, ...onMapMarkers]);
    }
  };

  const isSwapMarker = (content: string) => {
    const currentIndex = currentMarkers.findIndex(item => item.content === content);
    const bookmarkIndex = bookmarkMakers.findIndex(item => item.content === content);
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

  const onClickMarkerFooter = useCallback(
    async (marker: KakaoMapMarkerType) => {
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
        if (isSwapMarker(marker.content) !== 0) return;
      }

      const prasedPosition = { lat: ny, lng: nx };
      Object.assign(newMarker, { province, city, code, position: prasedPosition, isBookmarked: false });
      setCurrentMarkers([newMarker, ...currentMarkers]);

      const image = { src: '/icons/search.svg', size: { width: 36, height: 36 } };
      changeOnMapMarker({ image, position: marker.position, content: marker.content, status: 'search' });
    },
    [currentMarkers, bookmarkMakers, map],
  );

  const onClickBookmark = useCallback(
    (code: string, isBookmarked: boolean) => {
      if (isBookmarked === false) {
        // 북마크 추가
        const index = currentMarkers.findIndex(item => item.code === code);
        const firstMarker = currentMarkers[index];
        firstMarker.isBookmarked = true;
        currentMarkers.splice(index, 1);
        setCurrentMarkers([...currentMarkers]);
        setBookmarkMakers([firstMarker, ...bookmarkMakers]);
        const image = { src: '/icons/star-fill.svg', size: { width: 36, height: 36 } };
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

        const image = { src: '/icons/search.svg', size: { width: 36, height: 36 } };
        const position = firstMarker.originalPosition;
        const content = firstMarker.content;
        const status = 'search';
        changeOnMapMarker({ image, position, content, status });
        focusMap(position);
        localStorage.setItem('bookmarks', JSON.stringify([...bookmarkMakers]));
      }
    },
    [currentMarkers, bookmarkMakers],
  );

  const searchPlaces = (keyword: string, page: number, setMaxPage: React.Dispatch<React.SetStateAction<number>>) => {
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
            const image = { src: '/icons/geo-pin.svg', size: { width: 36, height: 36 } };
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
        }
      },
      { size: 5, page: page },
    );
  };

  useEffect(() => {
    const localBookmarks = localStorage.getItem('bookmarks');
    if (localBookmarks) {
      const parsedBookmarks: MarkerType[] = JSON.parse(localBookmarks);
      setBookmarkMakers(parsedBookmarks);

      const parsedOnMapMarkers: OnMapMarkerType[] = parsedBookmarks.map((bookmark: MarkerType) => {
        const image = { src: '/icons/star-fill.svg', size: { width: 36, height: 36 } };
        const position = bookmark.originalPosition;
        const content = bookmark.content;
        const status = 'bookmark';
        return { image, position, content, status };
      });
      changeOnMapMarkers(parsedOnMapMarkers);

      // parsedOnMapMarkers의 length가 있을 때만 bound 설정
      if (map && parsedOnMapMarkers.length) {
        const bounds = new kakao.maps.LatLngBounds();
        parsedOnMapMarkers.forEach((marker: OnMapMarkerType) => {
          const position = new kakao.maps.LatLng(marker.position.lat, marker.position.lng);
          bounds.extend(position);
        });
        map.setBounds(bounds);
      }
    }
  }, [map]);

  return {
    pinMarkers,
    currentMarkers,
    bookmarkMakers,
    onMapMarkers,
    onFocusMarker,
    onClickMarkerFooter,
    onClickBookmark,
    searchPlaces,
  };
};

export default useMapMarker;
