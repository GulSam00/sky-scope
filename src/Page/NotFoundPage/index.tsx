import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { loadedData } from '@src/Store/requestStatusSlice';
import { styled } from 'styled-components';

const NotFoundPage = () => {
  const dispatch = useDispatch();

  dispatch(loadedData());

  return (
    <NotFoundPageContainer>
      <div className='error-message'>
        <div>
          <h2>404 Not Found</h2>
        </div>
        <div>존재하지 않는 페이지입니다.</div>
      </div>
    </NotFoundPageContainer>
  );
};

export default NotFoundPage;

const NotFoundPageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  height: 100dvh;

  background: linear-gradient(to bottom, #78c1ff, #fff);
  display: flex;

  justify-content: center;
  align-items: center;

  .error-message {
    position: relative;
    display: flex;
    flex-direction: column;

    align-items: center;
    justify-content: center;

    font-family: Arial, sans-serif;
    text-align: center;
    color: #333;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
`;
