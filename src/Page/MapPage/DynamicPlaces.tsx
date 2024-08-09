import { useState, memo, useEffect } from 'react';

import { KakaoSearchType } from '@src/Queries/useLiveDataQuery';
import PlaceWeather from './PlaceWeather';
import styled from 'styled-components';

interface Props {
  type: string;
  places: KakaoSearchType[];
  isBlinkPlace: boolean;
  onBlinkPlace: () => void;
  onFocusPlace: (place: KakaoSearchType) => void;
  onTogglePlace: (placeId: string, isBookmarked: boolean) => void;
  onDeletePlace: (placeId: string, isBookmarked: boolean) => void;
}

const DynamicPlaces = ({
  type,
  places,
  isBlinkPlace,
  onBlinkPlace,
  onFocusPlace,
  onTogglePlace,
  onDeletePlace,
}: Props) => {
  const [isIgnored, setIsIgnored] = useState(false); // 삭제 플래그 상태

  const PlaceHeader = (type: string) => {
    if (type === 'bookmark') {
      return (
        <div>
          <img src='/icons/star-fill.svg' alt='북마크' width={24} />
          북마크
        </div>
      );
    }
    if (type === 'current') {
      return (
        <div>
          <img src='/icons/search.svg' alt='검색' width={24} />
          조회
        </div>
      );
    }
  };

  useEffect(() => {
    if (isIgnored) {
      setIsIgnored(false);
    }
  }, [places]);

  return (
    <MarkerContiner>
      {PlaceHeader(type)}

      {places.length !== 0 && (
        <Markers>
          {places.map((place: KakaoSearchType, i: number) => (
            <PlaceWeather
              key={type + place.placeId + place.placeName}
              place={place}
              onTogglePlace={onTogglePlace}
              onFocusPlace={onFocusPlace}
              onDeletePlace={onDeletePlace}
              isFirstPlace={i === 0}
              isBlinkPlace={isBlinkPlace}
              onBlinkPlace={onBlinkPlace}
              isIgnored={isIgnored}
              setIsIgnored={setIsIgnored}
            />
          ))}
        </Markers>
      )}
    </MarkerContiner>
  );
};

export default memo(DynamicPlaces);

const MarkerContiner = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 200px;
  margin: 1rem;
  padding: 1rem;
  border: 1px solid #0d6efd;
  border-radius: 1rem;
  gap: 8px;

  > div {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
  }
`;

const Markers = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
`;
