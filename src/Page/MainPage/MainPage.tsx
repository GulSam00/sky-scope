import RecentDays from "./RecentDays";
import FutureDays from "./FutureDays";

import { styled } from "styled-components";

const MainPage = () => {
  return (
    <DayContainer>
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
