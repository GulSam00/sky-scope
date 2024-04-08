import { useState, useEffect } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import Map from "./Map";
import RecentDay from "./RecentDay";
import { useShortDataQuery } from "@src/Queries";
import { ICoord } from "@src/API/getWeatherShort";
import { styled } from "styled-components";

const RecentDays = () => {
  const today = new Date();
  const queryClient = useQueryClient();
  // 서울 종로구 기준
  const [coord, setCoord] = useState<ICoord>({ nx: 60, ny: 127 });
  const { data, date, isLoading, status, error } = useShortDataQuery(
    today,
    coord
  );

  const handleChangeCoord = (coord: ICoord) => {
    setCoord(coord);

    queryClient.invalidateQueries({ queryKey: ["short"] });

    console.log("쿼리 다시 요청");
    console.log("data : ", data);
    // 쿼리 다시 요청
  };

  useEffect(() => {
    console.log("RecentDays Change!");
  }, [status]);
  return (
    <RecentDayContainer>
      <Map handleChangeCoord={handleChangeCoord} />
      {data &&
        data.map((arrItem, index) => {
          return (
            <RecentDay
              recentData={arrItem}
              keyDate={date[index]}
              status={status}
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
