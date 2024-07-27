import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import LocationHeader from './LocationHeader';
import MapModal from './MapModal';
import EmptyGraph from './EmptyGraph';
import RecentDay from './RecentDay';

import { RootState } from '@src/Store/store';
import { useShortDataQuery } from '@src/Queries';

import { ICoord } from '@src/API/getWeatherShort';
import { setCoord } from '@src/Store/shortDataSlice';
import { loadingData } from '@src/Store/loadingStateSlice';

import { addDays } from 'date-fns';
import { styled } from 'styled-components';

const RecentDays = () => {
  const today = new Date();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const isMapModal = useSelector((state: RootState) => state.kakaoModalSliceReducer.isOpen);
  const coord = useSelector((state: RootState) => state.shortDataSliceReducer.coord);

  const { data, date, error } = useShortDataQuery(today, coord);

  const handleChangeCoord = (coord: ICoord) => {
    dispatch(loadingData());
    dispatch(setCoord(coord));

    queryClient.invalidateQueries({ queryKey: ['short'] });
  };

  const initCoord = () => {
    const coord = JSON.parse(localStorage.getItem('coord') as string);
    handleChangeCoord(coord);
  };

  useEffect(() => {
    if (localStorage.getItem('coord')) {
      initCoord();
    }
    if (error) {
      alert(error);
      navigate('/error');
    }
  }, [error]);

  return (
    <RecentDayContainer>
      {isMapModal && <MapModal handleChangeCoord={handleChangeCoord} />}

      <LocationHeader handleChangeCoord={handleChangeCoord} />

      {data.length ? (
        data.map((arrItem, index) => {
          return (
            <RecentDay
              recentData={arrItem}
              keyDate={date[index]}
              baseDate={addDays(today, index)}
              key={'RecentDay' + index}
            />
          );
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
