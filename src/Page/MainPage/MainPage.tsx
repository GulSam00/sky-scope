import { useSelector } from "react-redux";

import RecentDays from "./RecentDays";
import FutureDays from "./FutureDays";
import LoadingState from "./LoadingState";

import { RootState } from "@src/Store/store";

import { styled } from "styled-components";

const MainPage = () => {
  const isLoading = useSelector(
    (state: RootState) => state.shortDataSliceReducer.isLoading
  );

  // 메인 페이지에서 스피너?

  return (
    <DayContainer>
      {isLoading && <LoadingState />}
      <RecentDays />
      <FutureDays />
    </DayContainer>
  );
};

export default MainPage;

const DayContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
