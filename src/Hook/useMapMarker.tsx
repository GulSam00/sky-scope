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
  const [mapMarkers, setMapMarkers] = useState<KakaoMapMarkerType[]>([]);

  const focusMap = (position: { lat: number; lng: number }) => {
    if (!map) return;
    const kakaoPosition = new kakao.maps.LatLng(position.lat, position.lng);
    map.setLevel(2);
    map.panTo(kakaoPosition);
  };

  const onClickMarker = (marker: KakaoMapMarkerType) => {
    focusMap(marker.position);
    isSwapMarker(marker.placeId);
  };

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
            kakaoSearchMarkers.push({ placeName, placeId, position });
            parsedOnMapMarkers.push({ placeName, placeId, position, status, image });
            bounds.extend(new kakao.maps.LatLng(position.lat, position.lng));
          });

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

  const onFocusPlace = useCallback(
    (marker: KakaoSearchType) => {
      isSwapMarker(marker.placeId);
      focusMap(marker.position);
    },
    [currentPlaces, bookmarkPlaces, mapMarkers],
  );

  const changeOnMapMarkers = (dstOnMapMarkers: KakaoMapMarkerType[]) => {
    // console.log('changeOnMapMarkers');
    // console.log('prev MapMarkers', ...mapMarkers);
    const prevMarkers = mapMarkers.filter((item: KakaoMapMarkerType) => item.status !== 'pin');

    const filteredMarkers = dstOnMapMarkers.filter((dstMarker: KakaoMapMarkerType) => {
      const findIndex = prevMarkers.findIndex(marker => marker.placeId === dstMarker.placeId);
      // prevMarkers에 존재하지 않음. 불리언 값을 리턴해 배열에 추가
      return findIndex === -1;
    });
    // prevMarkers에 존재하지 않는 장소들을 추가
    // console.log('prevMarkers', ...prevMarkers);
    // console.log('prevMarkers.length', prevMarkers.length);
    // console.log('filteredMarkers', ...filteredMarkers);
    setMapMarkers([...filteredMarkers, ...prevMarkers]);
  };

  const changeOnMapMarker = (locateTypeDstOnMapMarker: LocateDataType, status: string) => {
    const changingStatus = status as markerStatus;

    // 삭제 할 때 로직
    if (changingStatus === ('delete' as typeof changingStatus)) {
      const dstOnMapMarker = { ...locateTypeDstOnMapMarker } as KakaoSearchType;
      const deleteIndex = mapMarkers.findIndex(item => item.placeId === dstOnMapMarker.placeId);
      const pinStatus = 'pin' as markerStatus;

      if (footerPlaces.find((place: LocateDataType) => place.placeId === dstOnMapMarker.placeId)) {
        // 삭제하려는 마커가 footerPlaces에 있으면 status를 pin으로 변경
        // 이미지 파일도 pin으로 변경
        const newMapMarkers = mapMarkers.map((marker, i) =>
          i === deleteIndex
            ? { ...marker, status: pinStatus, image: { src: '/icons/geo-pin.svg', size: { width: 36, height: 36 } } }
            : marker,
        );
        setMapMarkers(newMapMarkers);
      } else {
        const newMapMarkers = mapMarkers.filter((_, i) => i !== deleteIndex);
        setMapMarkers(newMapMarkers);
      }
      // 북마크, 조회할 때 로직
    } else {
      const dstOnMapMarker = { ...locateTypeDstOnMapMarker } as KakaoMapMarkerType;
      const imageSrc =
        changingStatus === ('bookmark' as typeof changingStatus) ? '/icons/star-fill.svg' : '/icons/search.svg';
      const changingImage = { src: imageSrc, size: { width: 36, height: 36 } };
      dstOnMapMarker.status = changingStatus;
      dstOnMapMarker.image = changingImage;

      const dupIndex = mapMarkers.findIndex(item => item.placeId === dstOnMapMarker.placeId);

      if (dupIndex !== -1) {
        const newMapMarkers: KakaoMapMarkerType[] = mapMarkers.map((marker, i) => {
          return i === dupIndex ? { ...marker, status: changingStatus, image: changingImage } : marker;
        });
        setMapMarkers(newMapMarkers);
      } else {
        setMapMarkers(prevMapMarkers => [dstOnMapMarker, ...prevMapMarkers]);
      }
    }
  };

  const isSwapMarker = (placeId: string) => {
    const currentIndex = currentPlaces.findIndex(item => item.placeId === placeId);
    const bookmarkIndex = bookmarkPlaces.findIndex(item => item.placeId === placeId);
    if (currentIndex !== -1) {
      const firstMarker = currentPlaces[currentIndex];
      const newCurrentPlaces = currentPlaces.filter((_, i) => i !== currentIndex);
      setCurrentPlaces([firstMarker, ...newCurrentPlaces]);
      return 1;
    }
    if (bookmarkIndex !== -1) {
      const firstMarker = bookmarkPlaces[bookmarkIndex];
      const newBookmarkPlaces = bookmarkPlaces.filter((_, i) => i !== bookmarkIndex);
      setBookmarkPlaces([firstMarker, ...newBookmarkPlaces]);
      return 2;
    }
    return 0;
  };

  const onTogglePlace = useCallback(
    (placeId: string, isBookmarked: boolean) => {
      if (isBookmarked === false) {
        // 북마크 추가
        const index = currentPlaces.findIndex(item => item.placeId === placeId);
        const firstMarker = { ...currentPlaces[index], isBookmarked: true }; // Immutably change the bookmark state
        const newCurrentPlaces = currentPlaces.filter((_, i) => i !== index);
        setCurrentPlaces(newCurrentPlaces);
        setBookmarkPlaces(prevBookmarkPlaces => [firstMarker, ...prevBookmarkPlaces]);

        const position = firstMarker.position;
        changeOnMapMarker(firstMarker, 'bookmark');
        focusMap(position);
        localStorage.setItem('bookmarks', JSON.stringify([firstMarker, ...bookmarkPlaces]));
      } else {
        // 북마크 해제
        const index = bookmarkPlaces.findIndex(item => item.placeId === placeId);
        const firstMarker = { ...bookmarkPlaces[index], isBookmarked: false }; // Immutably change the bookmark state
        const newBookmarkPlaces = bookmarkPlaces.filter((_, i) => i !== index);
        setBookmarkPlaces(newBookmarkPlaces);
        setCurrentPlaces(prevCurrentPlaces => [firstMarker, ...prevCurrentPlaces]);

        const position = firstMarker.position;
        changeOnMapMarker(firstMarker, 'search');
        focusMap(position);
        localStorage.setItem('bookmarks', JSON.stringify(newBookmarkPlaces));
      }
    },
    [currentPlaces, bookmarkPlaces, mapMarkers],
  );

  const onDeletePlace = useCallback(
    (placeId: string, isBookmarked: boolean) => {
      if (isBookmarked === true) {
        const index = bookmarkPlaces.findIndex(item => item.placeId === placeId);
        const deleteMarker = bookmarkPlaces[index];
        const newBookmarkPlaces = bookmarkPlaces.filter((_, i) => i !== index);
        setBookmarkPlaces(newBookmarkPlaces);
        changeOnMapMarker(deleteMarker, 'delete');
        localStorage.setItem('bookmarks', JSON.stringify(newBookmarkPlaces));
      } else {
        const index = currentPlaces.findIndex(item => item.placeId === placeId);
        const deleteMarker = currentPlaces[index];
        const newCurrentPlaces = currentPlaces.filter((_, i) => i !== index);
        setCurrentPlaces(newCurrentPlaces);
        changeOnMapMarker(deleteMarker, 'delete');
      }
    },
    [currentPlaces, bookmarkPlaces, mapMarkers],
  );

  const onClickFooterPlace = useCallback(
    async (clickedFooterPlace: LocateDataType) => {
      if (!map) return;
      const newPlace = { ...clickedFooterPlace } as KakaoSearchType;

      const result = await transLocaleToCoord(clickedFooterPlace.position);
      if (!result) {
        return;
      }

      const { nx, ny, province, city, localeCode } = result;

      if (currentPlaces.length || bookmarkPlaces.length) {
        // currentPlaces나 bookmarkPlaces에 이미 존재하면 순서를 바꾸고 종료
        // currentPlaces, mapMarkers에 추가하지 않는다.
        if (isSwapMarker(clickedFooterPlace.placeId) !== 0) return;
      }

      const apiLocalPosition = { lat: ny, lng: nx };
      Object.assign(newPlace, { province, city, localeCode, apiLocalPosition, isBookmarked: false });
      setCurrentPlaces(prevCurrentPlaces => [newPlace, ...prevCurrentPlaces]);
      changeOnMapMarker(clickedFooterPlace, 'search');
    },
    [currentPlaces, bookmarkPlaces, mapMarkers],
  );

  useEffect(() => {
    const localBookmarks = localStorage.getItem('bookmarks');
    if (localBookmarks) {
      const parsedBookmarks: KakaoSearchType[] = JSON.parse(localBookmarks);
      setBookmarkPlaces(parsedBookmarks);

      const parsedOnMapMarkers: KakaoMapMarkerType[] = parsedBookmarks.map((bookmark: KakaoSearchType) => {
        const image = { src: '/icons/star-fill.svg', size: { width: 36, height: 36 } };
        const { position, placeName, placeId } = bookmark;
        const status = 'bookmark';
        return { placeName, placeId, position, status, image };
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
    mapMarkers,
    onClickMarker,
    searchPlaces,
    onFocusPlace,
    onTogglePlace,
    onDeletePlace,
    onClickFooterPlace,
  };
};

export default useMapMarker;
