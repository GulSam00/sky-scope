import { memo } from 'react';

import { LocateDataType } from '@src/Queries/useLiveDataQuery';

import styled from 'styled-components';
import { CaretLeft, CaretRight } from 'react-bootstrap-icons';

interface Props {
  places: LocateDataType[];
  handlePageMove: (page: number) => void;
  onHoverPlace: (position: { lat: number; lng: number }) => void;
  onHoverOutPlace: () => void;
  onClickFooterPlace: (place: LocateDataType) => void;
}
const FooterPlaces = ({ places, handlePageMove, onClickFooterPlace, onHoverPlace, onHoverOutPlace }: Props) => {
  const overMarkerPos = (place: LocateDataType) => {
    const position = place.position;
    onHoverPlace(position);
  };

  const handleHoverOut = () => {
    onHoverOutPlace();
  };

  const handleClickMarker = (index: number) => {
    onClickFooterPlace(places[index]);
  };

  const handleClickMovePage = (page: number) => {
    handlePageMove(page);
  };

  return (
    <MarkersContainer>
      {places.length > 0 && (
        <MarkerGroup>
          <CaretLeft key='leftBtn' onClick={() => handleClickMovePage(-1)} />
          {places.map((place: LocateDataType, index: number) => (
            <div
              key={'place' + index}
              onMouseOver={() => overMarkerPos(place)}
              onMouseOut={handleHoverOut}
              onClick={() => handleClickMarker(index)}
            >
              {place.placeName}
            </div>
          ))}
          <CaretRight key='rightBtn' onClick={() => handleClickMovePage(1)} />
        </MarkerGroup>
      )}
    </MarkersContainer>
  );
};

export default memo(FooterPlaces);

const MarkersContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;

  margin: 0 auto;
  bottom: 1rem;
  z-index: 1500;
`;

const MarkerGroup = styled.div`
  display: flex;

  justify-content: center;
  padding: 0 0.5rem;

  > * {
    width: 4rem;
    height: 5rem;
    padding: 0.5rem;

    border: 1px solid;
    border-radius: 1rem;

    background-color: white;
    cursor: pointer;
    text-align: center;
  }

  > div {
    width: 6rem;
    margin: 0 4px;

    font-size: 1.2rem;
    display: flex;
    justify-content: center;
    align-items: center;

    overflow: hidden;
  }
`;
