import { useState } from 'react';

import { MarkerType } from './MapPage';

import styled from 'styled-components';
import { CaretLeft, CaretRight } from 'react-bootstrap-icons';

interface Props {
  map: kakao.maps.Map | null;
  markers: MarkerType[];
  handlePageMove: (page: number) => void;
  onClickMarker: (marker: MarkerType) => void;
}
const MarkersFooter = ({ map, markers, handlePageMove, onClickMarker }: Props) => {
  const [tempSelectedIndex, setTempSelectedIndex] = useState<number>(-1);

  const overMarkerPos = (marker: MarkerType) => {
    if (!map) return;
    const position = marker?.position;
    map.setLevel(2);

    map.panTo(new kakao.maps.LatLng(position.lat, position.lng));
  };

  const handleHoverOut = () => {
    if (!map) return;
    overMarkerPos(markers[tempSelectedIndex]);
  };

  const handleClickMarker = (index: number) => {
    if (tempSelectedIndex === index) {
      onClickMarker(markers[index]);
    } else {
      setTempSelectedIndex(index);
    }
  };

  const handleClickMovePage = (page: number) => {
    handlePageMove(page);
    setTempSelectedIndex(-1);
  };

  return (
    <MarkersContainer>
      {markers.length > 0 && (
        <MarkerGroup>
          <CaretLeft key='leftBtn' onClick={() => handleClickMovePage(-1)} />
          {markers.map((marker: MarkerType, index: number) => (
            <div
              className={tempSelectedIndex === index ? 'selected' : ''}
              key={'marker' + index}
              onMouseOver={() => overMarkerPos(marker)}
              onMouseOut={handleHoverOut}
              onClick={() => handleClickMarker(index)}
            >
              {marker.content}
            </div>
          ))}
          <CaretRight key='rightBtn' onClick={() => handleClickMovePage(1)} />
        </MarkerGroup>
      )}
    </MarkersContainer>
  );
};

export default MarkersFooter;

const MarkersContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  position: fixed;
  bottom: 16px;
  z-index: 1;

  background-color: blue;
`;

const MarkerGroup = styled.div`
  display: flex;
  background-color: white;
  justify-content: center;

  .selected {
    background-color: #0d6efd;
    color: white;
    border: 1px solid white;
  }

  > * {
    cursor: pointer;
    border-radius: 16px;
    width: 64px;
    height: 64px;
    text-align: center;
  }

  > div {
    width: 128px;
    margin: 0 4px;
    border: 1px solid;

    font-size: 14px;
    font-height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
