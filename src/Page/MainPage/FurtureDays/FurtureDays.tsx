import { useState, useEffect } from "react";

import FurtureDay from "./FurtureDay";
import { getWeatherLong } from "@src/API";
import { IDateData } from "@src/API/getWeatherLong";

import { styled } from "styled-components";

const FurtureDays = () => {
  const [futureData, setFutureData] = useState<IDateData[]>([]);
  const [keyDates, setKeyDates] = useState<string[]>([]);
  const today = new Date();

  const fetchData = async () => {
    const response = await getWeatherLong(today);
    console.log("long", response);

    if (response) {
      console.log(response);

      const dataArr = [];
      const dateArr = [];
      for (let i in response) {
        dataArr.push(response[i]);
        dateArr.push(i);
      }
      setFutureData(dataArr);
      setKeyDates(dateArr);
      console.log("futureData", futureData);
      console.log("keyDates", keyDates);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <FutureDayContainer>
      {futureData &&
        futureData.map((data, index) => {
          return <FurtureDay furtureData={data} keyDate={keyDates[index]} />;
        })}
    </FutureDayContainer>
  );
};

export default FurtureDays;

const FutureDayContainer = styled.div`
  display: flex;
`;
