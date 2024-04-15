import { useEffect, useState } from "react";

import TempertureLineGraph from "./TempertureLineGraph";
import RainLineGraph from "./RainLineGraph";
import WeatherLineGraph from "./WeatherLineGraph";
import EmptyGraph from "./EmptyGraph";

import { IDateData } from "@src/API/getWeatherShort";

import { Button } from "react-bootstrap";
import { styled } from "styled-components";

interface IProps {
  recentData: IDateData;
  keyDate: string;
  isLoading: boolean;
  status: string;
}
const RecentDay = ({ recentData, keyDate, isLoading, status }: IProps) => {
  const [tab, setTab] = useState<string>("temperture");

  const onClickTab = (k: string | null) => {
    if (k) setTab(k);
  };

  const transDate = (date: string) => {
    const year = date.slice(0, 4);
    const month = date.slice(4, 6);
    const day = date.slice(6, 8);
    return `${year}/${month}/${day}`;
  };

  // useEffect(() => {}, [recentData]);
  // useEffect 없이도 자동 갱신

  return (
    <RecentDayContainer>
      <RecentDayHeader>
        <text>{transDate(keyDate)}</text>

        <Button onClick={() => onClickTab("temperture")}>온도</Button>
        <Button onClick={() => onClickTab("rain")}>강수 확률</Button>
        <Button onClick={() => onClickTab("weather")}>날씨</Button>
      </RecentDayHeader>

      {isLoading ? (
        <EmptyGraph />
      ) : (
        <>
          {tab === "temperture" && (
            <TempertureLineGraph recentData={recentData} />
          )}
          {tab === "weather" && <WeatherLineGraph recentData={recentData} />}
          {tab === "rain" && <RainLineGraph recentData={recentData} />}
        </>
      )}
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
`;

const RecentDayHeader = styled.div`
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
