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
    console.log('changeOnMapMarkers');
    console.log('dstOnMapMarkers', dstOnMapMarkers);
    console.log('mapMarkers', mapMarkers);

    const prevMarkers = mapMarkers.filter((item: KakaoMapMarkerType) => item.status !== 'pin');

    const filteredMarkers = dstOnMapMarkers.filter((dstMarker: KakaoMapMarkerType) => {
      const findIndex = prevMarkers.findIndex(marker => marker.placeId === dstMarker.placeId);
      // prevMarkers에 존재하지 않음. return해서 추가
      if (findIndex === -1) {
        return dstMarker;
      }
    });

    console.log('prevMarkers', prevMarkers);
    console.log('filteredMarkers', filteredMarkers);

    // prevMarkers에 존재하지 않는 장소들을 추가
    setMapMarkers([...filteredMarkers, ...prevMarkers]);
  };

  const changeOnMapMarker = (locateTypeDstOnMapMarker: LocateDataType, status: string) => {
    const changingStatus = status as markerStatus;
    console.log('changeOnMapMarker');
    console.log('mapMarkers', mapMarkers);

    if (changingStatus === ('delete' as typeof changingStatus)) {
      const dstOnMapMarker = { ...locateTypeDstOnMapMarker } as KakaoSearchType;
      const deleteIndex = mapMarkers.findIndex(item => item.placeId === dstOnMapMarker.placeId);
      if (deleteIndex !== -1) {
        if (footerPlaces.find((place: LocateDataType) => place.placeId === dstOnMapMarker.placeId)) {
          const transPinMarker: KakaoMapMarkerType = mapMarkers.splice(deleteIndex, 1)[0];
          transPinMarker.status = 'pin';

          setMapMarkers([...mapMarkers, transPinMarker]);
        } else {
          mapMarkers.splice(deleteIndex, 1);
          setMapMarkers([...mapMarkers]);
        }
      }
    } else {
      const dstOnMapMarker = { ...locateTypeDstOnMapMarker } as KakaoMapMarkerType;

      const imageSrc =
        changingStatus === ('bookmark' as typeof changingStatus) ? '/icons/star-fill.svg' : '/icons/search.svg';
      const image = { src: imageSrc, size: { width: 36, height: 36 } };
      dstOnMapMarker.image = image;
      dstOnMapMarker.status = changingStatus;

      const dupIndex = mapMarkers.findIndex(item => item.placeId === dstOnMapMarker.placeId);
      if (dupIndex !== -1) {
        const newMapMarkers: KakaoMapMarkerType[] = mapMarkers.map((marker, i) => {
          return i === dupIndex ? { ...marker, status: changingStatus } : marker;
        });
        console.log('newMapMarkers', newMapMarkers);
        setMapMarkers([...newMapMarkers]);
      } else setMapMarkers([dstOnMapMarker, ...mapMarkers]);
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

  const onTogglePlace = useCallback(
    (placeId: string, isBookmarked: boolean) => {
      if (isBookmarked === false) {
        // 북마크 추가
        const index = currentPlaces.findIndex(item => item.placeId === placeId);
        const firstMarker = currentPlaces[index];
        firstMarker.isBookmarked = true;
        currentPlaces.splice(index, 1);
        setCurrentPlaces([...currentPlaces]);
        setBookmarkPlaces([firstMarker, ...bookmarkPlaces]);

        const position = firstMarker.position;
        changeOnMapMarker(firstMarker, 'bookmark');
        focusMap(position);
        localStorage.setItem('bookmarks', JSON.stringify([firstMarker, ...bookmarkPlaces]));
      } else {
        // 북마크 해제
        const index = bookmarkPlaces.findIndex(item => item.placeId === placeId);
        const firstMarker = bookmarkPlaces[index];
        firstMarker.isBookmarked = false;
        bookmarkPlaces.splice(index, 1);
        setBookmarkPlaces([...bookmarkPlaces]);
        setCurrentPlaces([firstMarker, ...currentPlaces]);

        const position = firstMarker.position;
        changeOnMapMarker(firstMarker, 'search');
        focusMap(position);
        localStorage.setItem('bookmarks', JSON.stringify([...bookmarkPlaces]));
      }
    },
    [currentPlaces, bookmarkPlaces, mapMarkers],
  );

  const onDeletePlace = useCallback(
    (placeId: string, isBookmarked: boolean) => {
      if (isBookmarked === true) {
        const index = bookmarkPlaces.findIndex(item => item.placeId === placeId);
        const deleteMarker = bookmarkPlaces[index];
        bookmarkPlaces.splice(index, 1);
        setBookmarkPlaces([...bookmarkPlaces]);
        changeOnMapMarker(deleteMarker, 'delete');
        localStorage.setItem('bookmarks', JSON.stringify([...bookmarkPlaces]));
      } else {
        const index = currentPlaces.findIndex(item => item.placeId === placeId);
        const deleteMarker = currentPlaces[index];
        currentPlaces.splice(index, 1);
        changeOnMapMarker(deleteMarker, 'delete');
        setCurrentPlaces([...currentPlaces]);
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

      if (currentPlaces.length) {
        // currentPlaces나 bookmarkPlaces에 이미 존재하면 순서를 바꾸고 종료
        // currentPlaces, mapMarkers에 추가하지 않는다.
        if (isSwapMarker(clickedFooterPlace.placeId) !== 0) return;
      }

      const apiLocalPosition = { lat: ny, lng: nx };
      Object.assign(newPlace, { province, city, localeCode, apiLocalPosition, isBookmarked: false });
      console.log('marker : ', clickedFooterPlace);
      console.log('newPlace : ', newPlace);
      setCurrentPlaces([newPlace, ...currentPlaces]);

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
