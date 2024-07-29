import React from 'react';
import { KakaoSearchType } from '@src/Queries/useLiveDataQuery';
import MarkerWeather from './MarkerWeather';
import styled from 'styled-components';

interface Props {
  currentPlaces: KakaoSearchType[];
  onClickBookmark: (localeCode: string, isBookmarked: boolean) => void;
  onFocusMarker: (marker: KakaoSearchType) => void;
}

const CurrentPlaces = ({ currentPlaces, onClickBookmark, onFocusMarker }: Props) => {
  return (
    <MarkerContiner>
      <div>
        <img src='/icons/search.svg' alt='검색' width={24} />
        조회
      </div>
      {currentPlaces.length !== 0 && (
        <Markers>
          {currentPlaces.map((marker: KakaoSearchType) => (
            <MarkerWeather
              key={'bookmark' + marker.localeCode + marker.placeName}
              marker={marker}
              onClickBookmark={onClickBookmark}
              onFocusMarker={onFocusMarker}
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
