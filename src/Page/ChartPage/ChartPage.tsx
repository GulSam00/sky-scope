import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import RecentDays from './RecentDays';
import { RootState } from '@src/Store/store';
import { styled } from 'styled-components';

const ChartPage = () => {
  const { isOpenModal } = useSelector((state: RootState) => state.kakaoModalSliceReducer);

  useEffect(() => {
    if (isOpenModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpenModal]);

  return (
    <DayContainer>
      <RecentDays />
    </DayContainer>
  );
};

export default ChartPage;

const DayContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  margin-top: 3rem;
`;
