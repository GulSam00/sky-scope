import React from 'react';
import { MarkerType } from '@src/Queries/useLiveDataQuery';
import MarkerWeather from './MarkerWeather';
import styled from 'styled-components';

interface Props {
  bookmarkMakers: MarkerType[];
  onClickBookmark: (localeCode: string, isBookmarked: boolean) => void;
  onFocusMarker: (marker: MarkerType) => void;
}

const BookmarkMakers = ({ bookmarkMakers, onClickBookmark, onFocusMarker }: Props) => {
  return (
    <MarkerContiner>
      <div>
        <img src='/icons/star-fill.svg' alt='북마크' width={24} />
        북마크
      </div>
      {bookmarkMakers.length !== 0 && (
        <Markers>
          {bookmarkMakers.map((marker: MarkerType) => (
            <MarkerWeather
              key={'bookmark' + marker.localeCode + marker.content}
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

export default React.memo(BookmarkMakers);

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
