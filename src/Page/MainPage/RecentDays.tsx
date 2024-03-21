import { useState, useEffect } from "react";
import { getWeatherShort } from "@src/API";
import RecentDay from "./RecentDay";
import { IDateData } from "@src/API/getWeatherShort";

import { format } from "date-fns";
import { styled } from "styled-components";

const RecentDays = () => {
  const [recentData, setRecentData] = useState<IDateData[]>([]);
  const today = new Date();

  const fetchData = async () => {
    const recentDataData = await getWeatherShort(format(today, "yyyyMMdd"));
    console.log("SHORT", recentDataData);
    if (recentDataData) {
      const temp = [];
      for (let i in recentDataData) {
        temp.push(recentDataData[i]);
      }
      setRecentData(temp);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <RecentDayContainer>
      {recentData &&
        recentData.map((data, index) => {
          return <RecentDay recentData={data} />;
        })}
    </RecentDayContainer>
  );
};

export default RecentDays;

const RecentDayContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  > div {
    margin: 10px;
    padding: 10px;
    border: 1px solid black;
  }
`;
