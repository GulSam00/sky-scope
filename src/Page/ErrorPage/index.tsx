import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { loadedData } from '@src/Store/requestStatusSlice';
import { styled } from 'styled-components';

const ErrorPage = () => {
  const dispatch = useDispatch();

  dispatch(loadedData());

  return (
    <ErrorPageContainer>
      <div className='error-message'>
        <div>
          <h2>500 Internal Server Error</h2>
        </div>
        <div>죄송합니다, 서버에 문제가 발생했습니다.</div>
      </div>
    </ErrorPageContainer>
  );
};

export default ErrorPage;

const ErrorPageContainer = styled.div`
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
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
`;
