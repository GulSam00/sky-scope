import { memo } from 'react';
import { useSelector } from 'react-redux';

import { WeatherToast } from '@src/Component';
import { RootState } from '@src/Store/store';

import styled from 'styled-components';

const ToastLists = () => {
  const toastList = useSelector((state: RootState) => state.toastWeatherSliceReducer);

  console.log('toastList', toastList);
  return (
    <ToastContainer>
      {toastList.map((toast, index) => (
        // key값은 고유한 값으로 설정해야 함
        // index로 설정 시 목표했던 대로 동작하지 않을 수 있음
        <WeatherToast key={toast.placeId} content={index + 'content'} index={index} />
      ))}
    </ToastContainer>
  );
};

export default memo(ToastLists);

const ToastContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  gap: 0.5rem;
`;
