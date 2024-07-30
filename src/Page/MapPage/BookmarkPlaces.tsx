import React from 'react';
import { KakaoSearchType } from '@src/Queries/useLiveDataQuery';
import PlaceWeather from './PlaceWeather';
import styled from 'styled-components';

interface Props {
  bookmarkPlaces: KakaoSearchType[];
  onFocusPlace: (marker: KakaoSearchType) => void;
  onClickPlace: (localeCode: string, isBookmarked: boolean) => void;
  onDeletePlace: (localeCode: string, isBookmarked: boolean) => void;
}

const BookmarkPlaces = ({ bookmarkPlaces, onFocusPlace, onClickPlace, onDeletePlace }: Props) => {
  return (
    <MarkerContiner>
      <div>
        <img src='/icons/star-fill.svg' alt='북마크' width={24} />
        북마크
      </div>
      {bookmarkPlaces.length !== 0 && (
        <Markers>
          {bookmarkPlaces.map((marker: KakaoSearchType) => (
            <PlaceWeather
              key={'bookmark' + marker.localeCode + marker.placeName}
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

export default React.memo(BookmarkPlaces);

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
