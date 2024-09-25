import { useState, memo, useEffect, useRef } from 'react';

import { KakaoSearchType } from '@src/Types/liveDataType';
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
      {places.length !== 0 ? (
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
      ) : (
        <div className='no-data'>검색 결과가 없습니다.</div>
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

  > div {
    display: flex;
    align-items: center;
    font-weight: 600;
  }

  .no-data {
    display: flex;
    height: 9.5rem;
    justify-content: center;
    align-items: center;
  }
`;

const Places = styled.div`
  display: flex;
  flex-wrap: wrap;

  height: 9.5rem;

  overflow-y: auto;

  scroll-snap-type: y mandatory;
`;
