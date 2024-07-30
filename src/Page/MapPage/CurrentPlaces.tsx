import React from 'react';
import { KakaoSearchType } from '@src/Queries/useLiveDataQuery';
import PlaceWeather from './PlaceWeather';
import styled from 'styled-components';

interface Props {
  currentPlaces: KakaoSearchType[];
  onClickPlace: (localeCode: string, isBookmarked: boolean) => void;
  onFocusPlace: (marker: KakaoSearchType) => void;
}

const CurrentPlaces = ({ currentPlaces, onClickPlace, onFocusPlace }: Props) => {
  return (
    <MarkerContiner>
      <div>
        <img src='/icons/search.svg' alt='검색' width={24} />
        조회
      </div>
      {currentPlaces.length !== 0 && (
        <Markers>
          {currentPlaces.map((marker: KakaoSearchType) => (
            <PlaceWeather
              key={'bookmark' + marker.localeCode + marker.placeName}
              marker={marker}
              onClickPlace={onClickPlace}
              onFocusPlace={onFocusPlace}
            />
          ))}
        </Markers>
      )}
    </MarkerContiner>
  );
};

export default React.memo(CurrentPlaces);

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
