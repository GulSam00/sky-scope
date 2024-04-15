import { Spinner } from "react-bootstrap";

import styled from "styled-components";

const EmptyGraph = () => {
  return (
    <EmptyGraphContainer>
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      <h1>데이터가 없습니다.</h1>
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
  min-width: 1000px;

  border: 1rem solid black;
  border-radius: 1rem;

  * {
    margin: 1rem;
    width: 8rem;
    height: 8rem;
  }
  h1 {
    width: 30rem;

    font-size: 3rem;
    text-align: center;
  }
`;
