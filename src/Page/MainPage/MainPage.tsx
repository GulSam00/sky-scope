import RecentDays from "./RecentDays";
import FurtureDays from "./FurtureDays";

import Card from "react-bootstrap/Card";
import { format } from "date-fns";
import { styled } from "styled-components";

const MainPage = () => {
  const today = new Date();

  const tenDays = Array.from({ length: 10 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);

    return format(date, "yyyy/MM/dd");
  });

  return (
    <DayContainer>
      <RecentDays />
      <FurtureDays />
      {/* {tenDays.map((date, index) => (
        <Card key={index} style={{ width: "6rem" }}>
          <Card.Body>
            <Card.Title>{date}</Card.Title>
            <Card.Text>dsds</Card.Text>
          </Card.Body>
        </Card>
      ))} */}
    </DayContainer>
  );
};

export default MainPage;

const DayContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
