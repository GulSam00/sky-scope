// import Spinner from 'react-bootstrap/Spinner';

import RecentDays from "./RecentDays";
import FutureDays from "./FutureDays";

import { styled } from "styled-components";

const MainPage = () => {
  // 메인 페이지에서 스피너?

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
