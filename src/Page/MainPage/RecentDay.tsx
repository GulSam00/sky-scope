import { useState } from "react";

import TempertureLineGraph from "./TempertureLineGraph";
import RainLineGraph from "./RainLineGraph";
import WeatherLineGraph from "./WeatherLineGraph";

import { IDateData } from "@src/API/getWeatherShort";

import { Button } from "react-bootstrap";
import { styled } from "styled-components";

interface IProps {
  recentData: IDateData;
  recentDate: string;
}
const RecentDay = ({ recentData, recentDate }: IProps) => {
  const [tab, setTab] = useState<string>("weather");

  const onClickTab = (k: string | null) => {
    console.log(k);
    if (k) setTab(k);
  };

  return (
    <RecentDayContainer>
      <div>
        <text>{recentDate}</text>
        <Button onClick={() => onClickTab("weather")}>날씨</Button>

        <Button onClick={() => onClickTab("temperture")}>온도</Button>
        <Button onClick={() => onClickTab("rain")}>강수량</Button>
      </div>
      {tab === "weather" && <WeatherLineGraph recentData={recentData} />}
      {tab === "temperture" && <TempertureLineGraph recentData={recentData} />}
      {tab === "rain" && <RainLineGraph recentData={recentData} />}
    </RecentDayContainer>
  );
};

export default RecentDay;

const RecentDayContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin: 10rem;
  padding: 10rem;
  border: 1rem solid black;
  border-radius: 1rem;

  button {
    margin: 0.5rem;
  }
`;
