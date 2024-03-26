import { useState, useEffect } from "react";
import { getWeatherShort } from "@src/API";
import RecentDay from "./RecentDay";
import { IDateData } from "@src/API/getWeatherShort";

import { styled } from "styled-components";

const RecentDays = () => {
  const [recentData, setRecentData] = useState<IDateData[]>([]);
  const [recentDates, setRecentDates] = useState<string[]>([]); // ["20210801", "20210802", "20210803"
  const today = new Date();

  const fetchData = async () => {
    const response = await getWeatherShort(today);
    console.log("SHORT", response);
    if (response) {
      const dataArr = [];
      const dateArr = [];
      for (let i in response) {
        dataArr.push(response[i]);
        dateArr.push(i);
      }
      setRecentData(dataArr);
      setRecentDates(dateArr);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <RecentDayContainer>
      {recentData &&
        recentData.map((data, index) => {
          return (
            <RecentDay recentData={data} recentDate={recentDates[index]} />
          );
        })}
    </RecentDayContainer>
  );
};

export default RecentDays;

const RecentDayContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-width: 1200px;
  > div {
    margin: 10px;
    padding: 10px;
    border: 1px solid black;
  }
`;
