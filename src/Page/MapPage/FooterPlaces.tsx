import React, { useState, useEffect } from 'react';

import { LocateDataType } from '@src/Queries/useLiveDataQuery';

import styled from 'styled-components';
import { CaretLeft, CaretRight } from 'react-bootstrap-icons';

interface Props {
  map: kakao.maps.Map | null;
  places: LocateDataType[];
  handlePageMove: (page: number) => void;
  onClickFooterPlace: (marker: LocateDataType) => void;
}
const FooterPlaces = ({ map, places, handlePageMove, onClickFooterPlace }: Props) => {
  const [tempSelectedIndex, setTempSelectedIndex] = useState<number>(-1);

  const overMarkerPos = (marker: LocateDataType) => {
    if (!map || !marker) return;
    const position = marker.position;
    map.setLevel(2);
    map.panTo(new kakao.maps.LatLng(position.lat, position.lng));
  };

  const handleHoverOut = () => {
    if (!map) return;
    overMarkerPos(places[tempSelectedIndex]);
  };

  const handleClickMarker = (index: number) => {
    onClickFooterPlace(places[index]);
    setTempSelectedIndex(index);
  };

  const handleClickMovePage = (page: number) => {
    handlePageMove(page);
    setTempSelectedIndex(-1);
  };

  useEffect(() => {
    setTempSelectedIndex(-1);
  }, [places]);

  return (
    <MarkersContainer>
      {places.length > 0 && (
        <MarkerGroup>
          <CaretLeft key='leftBtn' onClick={() => handleClickMovePage(-1)} />
          {places.map((marker: LocateDataType, index: number) => (
            <div
              className={tempSelectedIndex === index ? 'selected' : ''}
              key={'marker' + index}
              onMouseOver={() => overMarkerPos(marker)}
              onMouseOut={handleHoverOut}
              onClick={() => handleClickMarker(index)}
            >
              {marker.placeName}
            </div>
          ))}
          <CaretRight key='rightBtn' onClick={() => handleClickMovePage(1)} />
        </MarkerGroup>
      )}
    </MarkersContainer>
  );
};

export default React.memo(FooterPlaces);

const MarkersContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  position: fixed;
  bottom: 1rem;
  z-index: 1500;
`;

const MarkerGroup = styled.div`
  display: flex;
  justify-content: center;

  .selected {
    background-color: #0d6efd;
    color: white;
    border: 1px solid white;
  }

  > * {
    width: 64px;
    height: 128px;
    padding: 8px;

    border: 1px solid;
    border-radius: 1rem;

    background-color: white;
    cursor: pointer;
    text-align: center;
  }

  > div {
    width: 128px;
    margin: 0 4px;

    font-size: 1.2rem;
    display: flex;
    justify-content: center;
    align-items: center;

    overflow: hidden;
  }
`;
