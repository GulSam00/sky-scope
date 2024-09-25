import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import LocationHeader from './LocationHeader';
import MapModal from './MapModal';
import EmptyGraph from './EmptyGraph';
import RecentDay from './RecentDay';

import { ICoord } from '@src/API/getWeatherShort';
import { useShortDataQuery } from '@src/Queries';

import { RootState } from '@src/Store/store';
import { setCoord } from '@src/Store/shortDataSlice';
import { loadingData } from '@src/Store/requestStatusSlice';
import { errorAccured } from '@src/Store/requestStatusSlice';

import { addDays } from 'date-fns';
import { styled } from 'styled-components';

const RecentDays = () => {
  const today = new Date();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const { isOpenModal } = useSelector((state: RootState) => state.kakaoModalSliceReducer);
  const { coord } = useSelector((state: RootState) => state.shortDataSliceReducer);

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
      dispatch(errorAccured(error.message));
      navigate('/error');
    }
  }, [error]);

  return (
    <RecentDayContainer>
      {isOpenModal && <MapModal handleChangeCoord={handleChangeCoord} />}

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
