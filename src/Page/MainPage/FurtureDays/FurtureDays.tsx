import { useState, useEffect } from "react";

import RainLineGraph from "./RainLineGraph";
import TempertureGraph from "./TempertureGraph";

import { getWeatherLong } from "@src/API";
import { IDateData } from "@src/API/getWeatherLong";

import { Button } from "react-bootstrap";
import { styled } from "styled-components";
import { format, addDays } from "date-fns";

const FurtureDays = () => {
  const [futureData, setFutureData] = useState<IDateData[]>([]);
  const [tab, setTab] = useState<string>("temperture");

  const today = new Date();

  const onClickTab = (k: string | null) => {
    if (k) setTab(k);
  };

  const fetchData = async () => {
    const response = await getWeatherLong(today);
    console.log("long", response);

    if (response) {
      const dataArr = [];
      let index = -1;
      for (let i in response) {
        dataArr.push(response[i]);
        index++;
        dataArr[index].date = i;
      }
      setFutureData(dataArr);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <FutureDayContainer>
      <FurtureDayHeader>
        <text>
          {format(addDays(today, 3), "yyyy/MM/dd")} ~{" "}
          {format(addDays(today, 7), "yyyy/MM/dd")}
        </text>
        <Button onClick={() => onClickTab("temperture")}>온도</Button>
        <Button onClick={() => onClickTab("rain")}>강수확률</Button>
      </FurtureDayHeader>

      {tab === "temperture" && <TempertureGraph futureData={futureData} />}

      {tab === "rain" && <RainLineGraph futureData={futureData} />}
    </FutureDayContainer>
  );
};

export default FurtureDays;

const FutureDayContainer = styled.div`
  display: flex;
  flex-direction: column;

  flex-grow: 1;
  min-width: 1200px;
  margin: 10px;
  padding: 10px;
  border: 1px solid black;
  border-radius: 1rem;
`;

const FurtureDayHeader = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem;

  text {
    margin-right: 1rem;
    font-size: 1.5rem;
    font-weight: bold;
  }
  button {
    min-width: 6rem;
    margin: 0.5rem;
  }
`;
