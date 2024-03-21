import { useState, useEffect } from "react";
import { getWeatherShort, getWeatherLong } from "@src/API";
import { IParseObj, IDateData } from "@src/API/getWeatherShort";
import CusLineGraph from "./CusLineGraph";

import Card from "react-bootstrap/Card";
import { format } from "date-fns";
import { styled } from "styled-components";

const MainPage = () => {
  const [short, setShort] = useState<IDateData[]>([]);
  const today = new Date();

  const tenDays = Array.from({ length: 10 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);

    return format(date, "yyyy/MM/dd");
  });

  useEffect(() => {
    const fetchData = async () => {
      const shortData = await getWeatherShort(format(today, "yyyyMMdd"));
      const longData = await getWeatherLong(format(today, "yyyyMMdd"));
      console.log("SHORT", shortData);
      if (shortData) {
        for (let i in shortData) {
          console.log(i);
          console.log(shortData[i]);
          short.push(shortData[i]);
        }
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this effect runs only once on component mount

  return (
    <DayContainer>
      <DayRecent>
        {short &&
          short.map((date, index) => {
            return <CusLineGraph key={index} temp={date} />;
          })}
      </DayRecent>

      {tenDays.map((date, index) => (
        <Card key={index} style={{ width: "6rem" }}>
          <Card.Body>
            <Card.Title>{date}</Card.Title>
            <Card.Text>dsds</Card.Text>
          </Card.Body>
        </Card>
      ))}
    </DayContainer>
  );
};

export default MainPage;

const DayContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const DayRecent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  > div {
    margin: 10px;
    padding: 10px;
    border: 1px solid black;
  }
`;
