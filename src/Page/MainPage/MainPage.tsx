import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import RecentDays from './RecentDays';
import { LoadingState } from '@src/Component';
import { RootState } from '@src/Store/store';

import { styled } from 'styled-components';

const MainPage = () => {
  const { isLoading } = useSelector((state: RootState) => state.shortDataSliceReducer);
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
      {isLoading && <LoadingState />}

      <RecentDays />
    </DayContainer>
  );
};

export default MainPage;

const DayContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
