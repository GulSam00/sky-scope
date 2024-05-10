import { Pagination } from "react-bootstrap";
import styled from "styled-components";
interface IProps {
  curPage: number;
  maxPage: number;
  handlePageMove: (page: number) => void;
}
const SearchResultPagination = ({
  curPage,
  maxPage,
  handlePageMove,
}: IProps) => {
  return (
    <PaginationContainer>
      <Pagination size="lg">
        <Pagination.Prev onClick={() => handlePageMove(curPage - 1)} />
        {/* 5개 단위로 보여줌 */}
        {Array.from({ length: 5 }, (_, index) => {
          const unitPageIndex = Math.floor((curPage - 1) / 5);
          const startPage = unitPageIndex * 5 + 1;

          return (
            <Pagination.Item
              key={index}
              active={curPage === startPage + index}
              onClick={() => handlePageMove(startPage + index)}
              disabled={startPage + index > maxPage}
            >
              {startPage + index}
            </Pagination.Item>
          );
        })}

        <Pagination.Next onClick={() => handlePageMove(curPage + 1)} />
      </Pagination>
    </PaginationContainer>
  );
};

export default SearchResultPagination;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  margin-top: 15px;
`;
