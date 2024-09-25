import { memo } from 'react';

import { LocateDataType } from '@src/Types/liveDataType';

import styled from 'styled-components';
import { CaretLeft, CaretRight } from 'react-bootstrap-icons';

interface Props {
  curPage: number;
  maxPage: number;
  places: LocateDataType[];
  handlePageMove: (page: number) => void;
  onHoverPlace: (position: { lat: number; lng: number }) => void;
  onHoverOutPlace: () => void;
  onClickFooterPlace: (place: LocateDataType) => void;
}
const SearchedPlaces = ({
  curPage,
  maxPage,
  places,
  handlePageMove,
  onClickFooterPlace,
  onHoverPlace,
  onHoverOutPlace,
}: Props) => {
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
    <PlacesContainer>
      {places.length > 0 && (
        <PlaceGroup>
          {curPage > 1 && <CaretLeft key='leftBtn' onClick={() => handleClickMovePage(-1)} />}

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
          {curPage < maxPage && <CaretRight key='rightBtn' onClick={() => handleClickMovePage(1)} />}
        </PlaceGroup>
      )}
    </PlacesContainer>
  );
};

export default memo(SearchedPlaces);

const PlacesContainer = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;

  margin: 0.5rem;
  bottom: 1rem;
  z-index: 1500;
`;

const PlaceGroup = styled.div`
  display: flex;

  justify-content: center;
  padding: 0 0.5rem;

  > * {
    width: 4rem;
    height: 5rem;
    padding: 0.25rem;

    border: 1px solid #dfe2e5;
    border-radius: 1rem;

    background-color: white;
    cursor: pointer;
    text-align: center;
  }

  *:active {
    background-color: #dfe2e5;
  }

  > div {
    width: 6rem;
    margin: 0 2px;

    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;

    overflow: hidden;
  }
`;
