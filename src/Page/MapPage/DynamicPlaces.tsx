import { useState, memo, useEffect, useRef } from 'react';

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
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const handleBlinkPlace = () => {
    onBlinkPlace();
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
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
        <Places ref={scrollRef}>
          {places.map((place: KakaoSearchType, i: number) => (
            <PlaceWeather
              key={type + place.placeId + place.placeName}
              place={place}
              onTogglePlace={onTogglePlace}
              onFocusPlace={onFocusPlace}
              onDeletePlace={onDeletePlace}
              isFirstPlace={i === 0}
              isBlinkPlace={isBlinkPlace}
              onBlinkPlace={handleBlinkPlace}
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
  min-width: 50%;
  max-width: 50%;

  > div {
    display: flex;
    align-items: center;
    font-weight: 600;
  }
`;

const Places = styled.div`
  display: flex;
  flex-wrap: wrap;

  height: 9.5rem;

  overflow-y: auto;

  scroll-snap-type: y mandatory;
`;
