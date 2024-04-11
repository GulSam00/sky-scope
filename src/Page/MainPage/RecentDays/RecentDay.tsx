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
  const [isInit, setIsInit] = useState<boolean>(false);

  const onClickTab = (k: string | null) => {
    if (k) setTab(k);
  };

  const transDate = (date: string) => {
    const year = date.slice(0, 4);
    const month = date.slice(4, 6);
    const day = date.slice(6, 8);
    return `${year}/${month}/${day}`;
  };

  useEffect(() => {
    console.log("data Change!");
  }, [recentData]);

  return (
    <RecentDayContainer>
      <RecentDayHeader>
        <text>{transDate(keyDate)}</text>

        <Button onClick={() => onClickTab("temperture")}>온도</Button>
        <Button onClick={() => onClickTab("weather")}>날씨</Button>
        <Button onClick={() => onClickTab("rain")}>강수확률</Button>
      </RecentDayHeader>
      {/* status가 변경되지 않아서 WeatherLineGraph의 init이 진행되지 않음 */}
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
