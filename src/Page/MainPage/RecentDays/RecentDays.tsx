import { useState, useEffect } from "react";

import RecentDay from "./RecentDay";
import { useShortDataQuery } from "@src/Queries";

import { styled } from "styled-components";

const RecentDays = () => {
  const today = new Date();

  const { data, date, isLoading, error } = useShortDataQuery(today);

  return (
    <RecentDayContainer>
      {data &&
        data.map((arrItem, index) => {
          return (
            <RecentDay
              recentData={arrItem}
              keyDate={date[index]}
              isLoading={isLoading}
            />
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
