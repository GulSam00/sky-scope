import { Spinner } from "react-bootstrap";

import styled from "styled-components";

const LoadingState = () => {
  return (
    <EmptyGraphContainer>
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading</span>
      </Spinner>
      <h1>로딩중입니다...</h1>
    </EmptyGraphContainer>
  );
};

export default LoadingState;

const EmptyGraphContainer = styled.div`
  // 반투명하게 전체 화면을 덮는 스피너
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 2000;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  border-radius: 1rem;

  * {
    margin: 1rem;
    width: 8rem;
    height: 8rem;
  }
  h1 {
    width: 35rem;
    font-size: 3rem;
    text-align: center;
  }
`;
