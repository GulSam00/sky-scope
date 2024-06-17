import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';

import LocationHeader from './LocationHeader';
import MapModal from './MapModal';
import EmptyGraph from './EmptyGraph';
import RecentDay from './RecentDay';

import { RootState } from '@src/Store/store';
import { useShortDataQuery } from '@src/Queries';

import { ICoord } from '@src/API/getWeatherShort';
import { loadingData, setCoord } from '@src/Store/shortDataSlice';

import { addDays } from 'date-fns';
import { styled } from 'styled-components';

const RecentDays = () => {
  const today = new Date();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const isMapModal = useSelector((state: RootState) => state.kakaoModalSliceReducer.isOpen);
  const coord = useSelector((state: RootState) => state.shortDataSliceReducer.coord);

  const { data, date } = useShortDataQuery(today, coord);

  const handleChangeCoord = (coord: ICoord) => {
    dispatch(loadingData());
    dispatch(setCoord(coord));

    console.log('handleChangeCoord invalidateQueries');
    queryClient.invalidateQueries({ queryKey: ['short'] });
  };

  const initCoord = () => {
    console.log('UseEffect invalidateQueries');
    const coord = JSON.parse(localStorage.getItem('coord') as string);
    handleChangeCoord(coord);
  };

  useEffect(() => {
    if (localStorage.getItem('coord')) {
      initCoord();
    }
  }, []);

  return (
    <RecentDayContainer>
      {isMapModal && <MapModal handleChangeCoord={handleChangeCoord} />}

      <LocationHeader handleChangeCoord={handleChangeCoord} />

      {data.length ? (
        data.map((arrItem, index) => {
          return <RecentDay recentData={arrItem} keyDate={date[index]} baseDate={addDays(today, index)} />;
        })
      ) : (
        <>
          <EmptyGraph />
          <EmptyGraph />
          <EmptyGraph />
        </>
      )}
    </RecentDayContainer>
  );
};

export default RecentDays;

const RecentDayContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;
