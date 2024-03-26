import { useState, useEffect } from "react";
import { getWeatherLong } from "@src/API";

import { format } from "date-fns";
import { styled } from "styled-components";

const FurtureDays = () => {
  const [futureData, setFutureData] = useState([]);
  const [futureDates, setFutureDates] = useState<string[]>([]);
  const today = new Date();

  const fetchData = async () => {
    const response = await getWeatherLong(format(today, "yyyyMMdd"));
    console.log("long", response);
    // if (response) {
    //     const dataArr = [];
    //     const dateArr = [];
    //     for (let i in response) {
    //         dataArr.push(response[i]);
    //         dateArr.push(i);
    //     }
    //     setFutureData(futureData);
    //     setFutureDates(futureDates);
  };
  useEffect(() => {
    fetchData();
  }, []);

  return <FutureDayContainer>test</FutureDayContainer>;
};

export default FurtureDays;

const FutureDayContainer = styled.div`
  display: flex;
`;
