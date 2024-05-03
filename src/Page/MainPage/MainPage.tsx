import { useEffect } from "react";
import { useSelector } from "react-redux";

import RecentDays from "./RecentDays";
import FutureDays from "./FutureDays";
import LoadingState from "./LoadingState";
import { RootState } from "@src/Store/store";

import { styled } from "styled-components";

const MainPage = () => {
  const { isLoading } = useSelector(
    (state: RootState) => state.shortDataSliceReducer
  );
  const { isOpen } = useSelector(
    (state: RootState) => state.kakaoModalSliceReducer
  );

  useEffect(() => {
    if (isLoading || isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isLoading, isOpen]);

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
