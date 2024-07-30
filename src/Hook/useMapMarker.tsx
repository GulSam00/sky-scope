import { useState, useEffect, useCallback } from 'react';
import { transLocaleToCoord } from '@src/Util';

import { LocateDataType, KakaoSearchType, KakaoMapMarkerType, markerStatus } from '@src/Queries/useLiveDataQuery';

interface Props {
  map: kakao.maps.Map | null;
}

const useMapMarker = ({ map }: Props) => {
  const [footerPlaces, setFooterPlaces] = useState<LocateDataType[]>([]);
  const [currentPlaces, setCurrentPlaces] = useState<KakaoSearchType[]>([]);
  const [bookmarkPlaces, setBookmarkPlaces] = useState<KakaoSearchType[]>([]);
  const [onMapMarkers, setOnMapMarkers] = useState<KakaoMapMarkerType[]>([]);

  const focusMap = (position: { lat: number; lng: number }) => {
    if (!map) return;
    const kakaoPosition = new kakao.maps.LatLng(position.lat, position.lng);
    map.setLevel(2);
    map.panTo(kakaoPosition);
  };

  const onFocusPlace = useCallback(
    (marker: KakaoSearchType) => {
      isSwapMarker(marker.placeId);
      focusMap(marker.position);
    },
    [currentPlaces, bookmarkPlaces],
  );

  const changeOnMapMarkers = (dstOnMapMarkers: KakaoMapMarkerType[]) => {
    // console.log('dstOnMapMarkers', dstOnMapMarkers);
    // 이전의 pin 마커를 제거, onMapMarkers 대신 사용
    const removePrevPinMarkers = onMapMarkers.filter((item: KakaoMapMarkerType) => item.status !== 'pin');

    const filteredMarkers = dstOnMapMarkers.filter((item: KakaoMapMarkerType) => {
      const findIndex = removePrevPinMarkers.findIndex(marker => marker.placeId === item.placeId);
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

  const changeOnMapMarker = (dstOnMapMarker: LocateDataType, status: string) => {
    const newOnMapMarker = { ...dstOnMapMarker } as KakaoMapMarkerType;

    const imageSrc = status === 'bookmark' ? '/icons/star-fill.svg' : '/icons/search.svg';
    const image = { src: imageSrc, size: { width: 36, height: 36 } };
    newOnMapMarker.status = status as markerStatus;
    newOnMapMarker.image = image;

    const index = onMapMarkers.findIndex(item => item.placeId === newOnMapMarker.placeId);
    if (index !== -1 && newOnMapMarker.status !== 'pin') {
      onMapMarkers[index] = newOnMapMarker;
      setOnMapMarkers([...onMapMarkers]);
    } else {
      setOnMapMarkers([newOnMapMarker, ...onMapMarkers]);
    }
  };

  const isSwapMarker = (placeId: string) => {
    const currentIndex = currentPlaces.findIndex(item => item.placeId === placeId);
    const bookmarkIndex = bookmarkPlaces.findIndex(item => item.placeId === placeId);
    if (currentIndex !== -1) {
      const firstMarker = currentPlaces[currentIndex];
      currentPlaces.splice(currentIndex, 1);
      setCurrentPlaces([firstMarker, ...currentPlaces]);
      return 1;
    }
    if (bookmarkIndex !== -1) {
      const firstMarker = bookmarkPlaces[bookmarkIndex];
      bookmarkPlaces.splice(bookmarkIndex, 1);
      setBookmarkPlaces([firstMarker, ...bookmarkPlaces]);
      return 2;
    }
    return 0;
  };

  const onClickFooterPlace = useCallback(
    async (marker: LocateDataType) => {
      if (!map) return;
      const newMarker = { ...marker } as KakaoSearchType;

      const result = await transLocaleToCoord(marker.position);
      if (!result) {
        return;
      }

      const { nx, ny, province, city, localeCode } = result;
      if (currentPlaces) {
        if (isSwapMarker(marker.placeId) !== 0) return;
      }

      const apiLocalPosition = { lat: ny, lng: nx };
      Object.assign(newMarker, { province, city, localeCode, apiLocalPosition, isBookmarked: false });
      setCurrentPlaces([newMarker, ...currentPlaces]);

      // console.log('LocateDataType');
      changeOnMapMarker(marker, 'search');
    },
    [currentPlaces, bookmarkPlaces, onMapMarkers],
  );

  const onClickPlace = useCallback(
    (localeCode: string, isBookmarked: boolean) => {
      if (isBookmarked === false) {
        // 북마크 추가
        const index = currentPlaces.findIndex(item => item.localeCode === localeCode);
        const firstMarker = currentPlaces[index];
        firstMarker.isBookmarked = true;
        currentPlaces.splice(index, 1);
        setCurrentPlaces([...currentPlaces]);
        setBookmarkPlaces([firstMarker, ...bookmarkPlaces]);

        const position = firstMarker.position;
        // console.log('KakaoSearchType');
        changeOnMapMarker(firstMarker, 'bookmark');
        focusMap(position);
        localStorage.setItem('bookmarks', JSON.stringify([firstMarker, ...bookmarkPlaces]));
      } else {
        // 북마크 해제
        const index = bookmarkPlaces.findIndex(item => item.localeCode === localeCode);
        const firstMarker = bookmarkPlaces[index];
        firstMarker.isBookmarked = false;
        bookmarkPlaces.splice(index, 1);
        setBookmarkPlaces([...bookmarkPlaces]);
        setCurrentPlaces([firstMarker, ...currentPlaces]);

        const position = firstMarker.position;
        // console.log('KakaoSearchType');
        changeOnMapMarker(firstMarker, 'search');
        focusMap(position);
        localStorage.setItem('bookmarks', JSON.stringify([...bookmarkPlaces]));
      }
    },
    [currentPlaces, bookmarkPlaces],
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
          const kakaoSearchMarkers: LocateDataType[] = [];
          const parsedOnMapMarkers: KakaoMapMarkerType[] = [];

          data.forEach(place => {
            const position = { lat: Number(place.y), lng: Number(place.x) };
            const image = { src: '/icons/geo-pin.svg', size: { width: 36, height: 36 } };
            const placeName = place.place_name;
            const status = 'pin';
            const placeId = place.id;
            kakaoSearchMarkers.push({ position, placeName, placeId });
            parsedOnMapMarkers.push({ image, position, placeName, status, placeId });
            bounds.extend(new kakao.maps.LatLng(position.lat, position.lng));
          });
          // console.log('kakaoSearchMarkers : ', kakaoSearchMarkers);
          // console.log('parsedOnMapMarkers : ', parsedOnMapMarkers);
          changeOnMapMarkers(parsedOnMapMarkers);
          setFooterPlaces([...kakaoSearchMarkers]);
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
      const parsedBookmarks: KakaoSearchType[] = JSON.parse(localBookmarks);
      setBookmarkPlaces(parsedBookmarks);

      const parsedOnMapMarkers: KakaoMapMarkerType[] = parsedBookmarks.map((bookmark: KakaoSearchType) => {
        const image = { src: '/icons/star-fill.svg', size: { width: 36, height: 36 } };
        const { position, placeName, placeId } = bookmark;
        const status = 'bookmark';
        return { image, position, placeName, status, placeId };
      });
      changeOnMapMarkers(parsedOnMapMarkers);

      // parsedOnMapMarkers의 length가 있을 때만 bound 설정
      if (map && parsedOnMapMarkers.length) {
        const bounds = new kakao.maps.LatLngBounds();
        parsedOnMapMarkers.forEach((marker: KakaoMapMarkerType) => {
          const position = new kakao.maps.LatLng(marker.position.lat, marker.position.lng);
          bounds.extend(position);
        });
        map.setBounds(bounds);
      }
    }
  }, [map]);

  return {
    footerPlaces,
    currentPlaces,
    bookmarkPlaces,
    onMapMarkers,
    onFocusPlace,
    onClickFooterPlace,
    onClickPlace,
    searchPlaces,
  };
};

export default useMapMarker;
