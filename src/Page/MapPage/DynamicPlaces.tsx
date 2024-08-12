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
    <DynamicPlacesContainer type={type}>
      {PlaceHeader(type)}

      {places.length !== 0 && (
        <Places>
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
        </Places>
      )}
    </DynamicPlacesContainer>
  );
};

export default memo(DynamicPlaces);

interface StyleProps {
  type: string;
}

const DynamicPlacesContainer = styled.div<StyleProps>`
  display: flex;
  flex-direction: column;
  min-height: 10rem;

  // margin: 0.5rem;
  // padding: 0.5rem;
  // border: 1px solid;
  // border-radius: 1rem;

  // z-index: 3000;
  min-width: 50%;

  > div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
  }
`;

const Places = styled.div`
  display: flex;
  flex-wrap: wrap;

  max-height: 10rem;

  overflow-x: hidden;
  overflow-y: auto;
`;
