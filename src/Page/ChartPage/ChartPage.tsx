import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import RecentDays from './RecentDays';
import { RootState } from '@src/Store/store';
import { styled } from 'styled-components';

const ChartPage = () => {
  const { isOpen } = useSelector((state: RootState) => state.kakaoModalSliceReducer);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

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

  margin-top: 2rem;
`;
