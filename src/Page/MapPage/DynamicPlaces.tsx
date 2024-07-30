import React from 'react';
import { KakaoSearchType } from '@src/Queries/useLiveDataQuery';
import PlaceWeather from './PlaceWeather';
import styled from 'styled-components';

interface Props {
  places: KakaoSearchType[];
  onFocusPlace: (marker: KakaoSearchType) => void;
  onClickPlace: (localeCode: string, isBookmarked: boolean) => void;
  onDeletePlace: (localeCode: string, isBookmarked: boolean) => void;
  type: string;
  children: React.ReactNode;
}

const DynamicPlaces = ({ places, onFocusPlace, onClickPlace, onDeletePlace, type, children }: Props) => {
  return (
    <MarkerContiner>
      {children}

      {places.length !== 0 && (
        <Markers>
          {places.map((marker: KakaoSearchType) => (
            <PlaceWeather
              key={type + marker.localeCode + marker.placeName}
              marker={marker}
              onClickPlace={onClickPlace}
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
  margin: 16px;
  padding: 16px;
  border: 1px solid #0d6efd;
  border-radius: 16px;

  > div {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 24px;
    font-weight: 600;
  }
`;

const Markers = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;
`;
