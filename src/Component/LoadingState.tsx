import { Spinner } from 'react-bootstrap';

import styled from 'styled-components';

const LoadingState = () => {
  return (
    <EmptyGraphContainer>
      <LoadingConetent>
        <Spinner animation='border' role='status'>
          <span className='visually-hidden'>Loading</span>
        </Spinner>
        <div className='text'>로딩중입니다...</div>
      </LoadingConetent>
    </EmptyGraphContainer>
  );
};

export default LoadingState;

const EmptyGraphContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  background-color: rgba(0, 0, 0, 0.4);
  z-index: 10000;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LoadingConetent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  * {
    width: 8rem;
    height: 8rem;
  }

  .text {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 20rem;
    font-size: 2.5rem;
    font-weight: 700;
  }
`;
