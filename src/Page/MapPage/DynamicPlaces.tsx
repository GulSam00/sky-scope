import React from 'react';
import { KakaoSearchType } from '@src/Queries/useLiveDataQuery';
import PlaceWeather from './PlaceWeather';
import styled from 'styled-components';

interface Props {
  places: KakaoSearchType[];
  onFocusPlace: (marker: KakaoSearchType) => void;
  onTogglePlace: (placeId: string, isBookmarked: boolean) => void;
  onDeletePlace: (placeId: string, isBookmarked: boolean) => void;
  type: string;
}

const DynamicPlaces = ({ places, onFocusPlace, onTogglePlace, onDeletePlace, type }: Props) => {
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

  return (
    <MarkerContiner>
      {PlaceHeader(type)}

      {places.length !== 0 && (
        <Markers>
          {places.map((marker: KakaoSearchType) => (
            <PlaceWeather
              key={type + marker.placeId + marker.placeName}
              marker={marker}
              onTogglePlace={onTogglePlace}
              onFocusPlace={onFocusPlace}
              onDeletePlace={onDeletePlace}
            />
          ))}
        </Markers>
      )}
    </MarkerContiner>
  );
};

export default React.memo(DynamicPlaces);

const MarkerContiner = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 200px;
  margin: 1rem;
  padding: 1rem;
  border: 1px solid #0d6efd;
  border-radius: 1rem;

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
