import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from '@src/Store/store';
import { addToast } from '@src/Store/toastWeatherSlice';
import { errorAccured } from '@src/Store/requestStatusSlice';
import { askLogin } from '@src/Store/globalDataSlice';
import { LocateDataType, KakaoSearchType, KakaoMapMarkerType, markerStatus } from '@src/Types/liveDataType';
import { transLocaleToCoord } from '@src/Util';

import { doc, getDoc, setDoc, updateDoc } from '@firebase/firestore/lite';

import db from '@src/firebase';

interface Props {
  map: kakao.maps.Map | null;
}

const useMapInfo = ({ map }: Props) => {
  const [searchPlaces, setSearchPlaces] = useState<LocateDataType[]>([]);
  const [currentPlaces, setCurrentPlaces] = useState<KakaoSearchType[]>([]);
  const [bookmarkPlaces, setBookmarkPlaces] = useState<KakaoSearchType[]>([]);
  const [mapMarkers, setMapMarkers] = useState<KakaoMapMarkerType[]>([]);
  const [isBlinkPlaces, setIsBlinkPlaces] = useState<boolean[]>([true, true]); // bookmark : 0, current : 1
  const [originPos, setOriginPos] = useState<kakao.maps.LatLng | null>(null);
  const [originLevel, setOriginLevel] = useState<number>(4);

  const [viewportWidth, setViewportWidth] = useState<number>(window.innerWidth);

  const { isPhone, isLogin, id } = useSelector((state: RootState) => state.globalDataSliceReducer);
  const dispatch = useDispatch();

  const focusMap = (position: { lat: number; lng: number }) => {
    if (!map) return;
    const kakaoPosition = new kakao.maps.LatLng(position.lat, position.lng);
    map.setCenter(kakaoPosition);
  };

  const onClickMarker = (marker: KakaoMapMarkerType) => {
    focusMap(marker.position);
    onClickFooterPlace(marker);
  };

  const onSearchPlace = (keyword: string, page: number, setMaxPage: React.Dispatch<React.SetStateAction<number>>) => {
    if (!map) return;

    const ps = new kakao.maps.services.Places();

    const contentWidth = 128;

    const curViewportWidth = isPhone ? 400 : viewportWidth;

    const contentBerPage = Math.max(Math.min(Math.floor(curViewportWidth / contentWidth) - 1, 5), 1);
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
            const image = getNewImage('pin');
            const placeName = place.place_name;
            const status = 'pin';
            const placeId = place.id;
            kakaoSearchMarkers.push({ placeName, placeId, position });
            parsedOnMapMarkers.push({ placeName, placeId, position, status, image });
            bounds.extend(new kakao.maps.LatLng(position.lat, position.lng));
          });
          changeOnMapMarkers(parsedOnMapMarkers);
          setSearchPlaces([...kakaoSearchMarkers]);
          onChangeBounds(bounds);
        } else {
          dispatch(errorAccured('검색 결과가 없습니다.'));
        }
      },
      { size: contentBerPage, page: page },
    );
  };

  const onFocusPlace = useCallback(
    (place: KakaoSearchType) => {
      isSwapPlace(place.placeId);
      focusMap(place.position);
      dispatch(addToast(place));
    },
    [currentPlaces, bookmarkPlaces, mapMarkers],
  );

  const changeOnMapMarkers = (dstOnMapMarkers: KakaoMapMarkerType[]) => {
    const prevMarkers = mapMarkers.filter((item: KakaoMapMarkerType) => item.status !== 'pin');
    const filteredMarkers = dstOnMapMarkers.filter((dstMarker: KakaoMapMarkerType) => {
      const findIndex = prevMarkers.findIndex(marker => marker.placeId === dstMarker.placeId);
      // prevMarkers에 존재하지 않음. 불리언 값을 리턴해 배열에 추가
      return findIndex === -1;
    });
    // prevMarkers에 존재하지 않는 장소들을 추가
    setMapMarkers([...filteredMarkers, ...prevMarkers]);
  };

  const changeOnMapMarker = (locateTypeDstOnMapMarker: LocateDataType, status: string) => {
    if (!map) return;
    const changingStatus = status as markerStatus;
    // 삭제 할 때 로직
    if (changingStatus === ('delete' as typeof changingStatus)) {
      const dstOnMapMarker = { ...locateTypeDstOnMapMarker } as KakaoSearchType;
      const deleteIndex = mapMarkers.findIndex(item => item.placeId === dstOnMapMarker.placeId);
      const pinStatus = 'pin' as markerStatus;

      if (searchPlaces.find((place: LocateDataType) => place.placeId === dstOnMapMarker.placeId)) {
        // 삭제하려는 마커가 footerPlaces에 있으면 status를 pin으로 변경
        // 이미지 파일도 pin으로 변경
        const newMapMarkers = mapMarkers.map((marker, i) =>
          i === deleteIndex
            ? {
                ...marker,
                status: pinStatus,
                image: getNewImage(pinStatus),
              }
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

      const changingImage = getNewImage(changingStatus);
      dstOnMapMarker.status = changingStatus;
      dstOnMapMarker.image = changingImage;

      const dupIndex = mapMarkers.findIndex(item => item.placeId === dstOnMapMarker.placeId);
      if (dupIndex !== -1) {
        const newMapMarkers: KakaoMapMarkerType[] = mapMarkers.map((marker, i) => {
          return i === dupIndex ? { ...marker, status: changingStatus, image: changingImage } : marker;
        });
        setMapMarkers(newMapMarkers);
      } else {
        // showCurrentPlace - onClickFooterPlace - changeOnMapMarker 호출 시
        //  setMapMarkers에서 오류 발생. center 장애 발생
        setMapMarkers(prevMapMarkers => [dstOnMapMarker, ...prevMapMarkers]);
      }
    }
  };

  const isSwapPlace = (placeId: string) => {
    const currentIndex = currentPlaces.findIndex(item => item.placeId === placeId);
    const bookmarkIndex = bookmarkPlaces.findIndex(item => item.placeId === placeId);
    if (currentIndex !== -1) {
      const firstMarker = currentPlaces[currentIndex];
      const newCurrentPlaces = currentPlaces.filter((_, i) => i !== currentIndex);
      setCurrentPlaces([firstMarker, ...newCurrentPlaces]);
      setIsBlinkPlaces([false, true]);
      return 1;
    }
    if (bookmarkIndex !== -1) {
      const firstMarker = bookmarkPlaces[bookmarkIndex];
      const newBookmarkPlaces = bookmarkPlaces.filter((_, i) => i !== bookmarkIndex);
      setBookmarkPlaces([firstMarker, ...newBookmarkPlaces]);
      setIsBlinkPlaces([true, false]);
      return 2;
    }
    return 0;
  };

  const onTogglePlace = useCallback(
    (placeId: string, isBookmarked: boolean) => {
      if (isBookmarked === false) {
        const index = currentPlaces.findIndex(item => item.placeId === placeId);
        const firstMarker = { ...currentPlaces[index], isBookmarked: true }; // Immutably change the bookmark state
        const newCurrentPlaces = currentPlaces.filter((_, i) => i !== index);
        const newBookmarkPlaces = [firstMarker, ...bookmarkPlaces];
        setCurrentPlaces(newCurrentPlaces);
        setBookmarkPlaces(newBookmarkPlaces);

        const position = firstMarker.position;
        changeOnMapMarker(firstMarker, 'bookmark');
        focusMap(position);

        if (isLogin) postFirestoreData(newBookmarkPlaces);
        else {
          dispatch(askLogin());
          localStorage.setItem('bookmarks', JSON.stringify([firstMarker, ...bookmarkPlaces]));
        }
      } else {
        // 북마크 해제
        const index = bookmarkPlaces.findIndex(item => item.placeId === placeId);
        const firstMarker = { ...bookmarkPlaces[index], isBookmarked: false }; // Immutably change the bookmark state
        const newBookmarkPlaces = bookmarkPlaces.filter((_, i) => i !== index);
        const newCurrentPlaces = [firstMarker, ...currentPlaces];
        setBookmarkPlaces(newBookmarkPlaces);
        setCurrentPlaces(newCurrentPlaces);

        const position = firstMarker.position;
        changeOnMapMarker(firstMarker, 'search');
        focusMap(position);

        if (isLogin) postFirestoreData(newBookmarkPlaces);
        else localStorage.setItem('bookmarks', JSON.stringify(newBookmarkPlaces));
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

        if (isLogin) postFirestoreData(newBookmarkPlaces);
        else localStorage.setItem('bookmarks', JSON.stringify(newBookmarkPlaces));
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
        dispatch(errorAccured('해당 위치의 정보를 찾을 수 없습니다.'));
        return;
      }

      const { nx, ny, province, city, localeCode } = result;
      const apiLocalPosition = { lat: ny, lng: nx };
      Object.assign(newPlace, { province, city, localeCode, apiLocalPosition, isBookmarked: false });
      dispatch(addToast(newPlace));

      if (currentPlaces.length || bookmarkPlaces.length) {
        // currentPlaces나 bookmarkPlaces에 이미 존재하면 순서를 바꾸고 종료
        // currentPlaces, mapMarkers에 추가하지 않는다.
        if (isSwapPlace(clickedFooterPlace.placeId) !== 0) return;
      }
      setCurrentPlaces(prevCurrentPlaces => [newPlace, ...prevCurrentPlaces]);
      // 해당 changeOnMapMarker 함수에서 setCenter 장애 발생
      changeOnMapMarker(clickedFooterPlace, 'search');
    },
    [map, currentPlaces, bookmarkPlaces, mapMarkers],
  );

  const getNewImage = (status: markerStatus) => {
    const newImage = { src: '', size: { width: 36, height: 36 } };
    switch (status) {
      case 'bookmark':
        newImage.src = '/icons/star-fill.svg';
        break;
      case 'search':
        newImage.src = '/icons/search.svg';
        break;
      case 'pin':
        newImage.src = '/icons/geo-pin.svg';
        break;
    }
    return newImage;
  };

  const handleResize = () => {
    setViewportWidth(window.innerWidth);
  };

  const postFirestoreData = async (newBookmarkPlaces: KakaoSearchType[]) => {
    const data = JSON.stringify(newBookmarkPlaces);
    const docRef = doc(db, 'mapData', id + '');
    await setDoc(
      docRef,
      {
        bookmarks: data,
      },
      { merge: true },
    );
  };

  const initBookmarkData = async () => {
    let parsedBookmarks;
    // firebase
    if (isLogin) {
      const docRef = doc(db, 'mapData', id + '');
      const docSnap = await getDoc(docRef);
      const result = docSnap.data();
      if (result) parsedBookmarks = JSON.parse(result.bookmarks);
    } else {
      const result = localStorage.getItem('bookmarks');
      if (result) parsedBookmarks = JSON.parse(result);
    }
    if (!parsedBookmarks) return;
    setBookmarkPlaces(parsedBookmarks);
    const parsedOnMapMarkers: KakaoMapMarkerType[] = parsedBookmarks.map((bookmark: KakaoSearchType) => {
      const image = getNewImage('bookmark');
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
      onChangeBounds(bounds);
    }
  };

  const onChangeBounds = (bounds: kakao.maps.LatLngBounds) => {
    if (!map || !bounds) return;
    map.setBounds(bounds);
    setOriginLevel(map.getLevel());
    setOriginPos(map.getCenter());
  };

  const onChangeCenter = (lat: number, lng: number) => {
    if (!map) {
      return;
    }
    const latlng = new kakao.maps.LatLng(lat, lng);
    setOriginPos(latlng);
  };

  const onChangeLevel = (level: number | number[]) => {
    if (!map) return;
    if (typeof level === 'number') {
      level = level >= 12 ? 12 : level;
      map.setLevel(level);
      setOriginLevel(level);
    }
  };

  useEffect(() => {
    if (originPos && map) {
      map.setCenter(originPos);
    }
  }, [originPos, map]);

  useEffect(() => {
    initBookmarkData();
  }, [map]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      // cleanup
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return {
    searchPlaces,
    currentPlaces,
    bookmarkPlaces,
    mapMarkers,
    isBlinkPlaces,
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
  };
};

export default useMapInfo;
