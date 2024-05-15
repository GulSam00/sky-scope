import { Spinner } from "react-bootstrap";

import styled from "styled-components";

const EmptyGraph = () => {
  return (
    <EmptyGraphContainer>
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading</span>
      </Spinner>
      <h1>데이터를 불러오는 중...</h1>
    </EmptyGraphContainer>
  );
};

export default EmptyGraph;

const EmptyGraphContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  height: 700px;

  margin: 10px;
  padding: 10px;
  border: 1px solid black;
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
