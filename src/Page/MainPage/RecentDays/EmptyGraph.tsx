import styled from "styled-components";

const EmptyGraph = () => {
  return <EmptyGraphContainer>데이터가 없습니다.</EmptyGraphContainer>;
};

export default EmptyGraph;

const EmptyGraphContainer = styled.div`
  min-width: 1000px;
  height: 700px;

  margin: 10rem;
  padding: 10rem;
  border: 1rem solid black;
  border-radius: 1rem;
`;
