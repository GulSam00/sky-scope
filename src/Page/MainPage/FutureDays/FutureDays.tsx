import { useState } from "react";

import RainLineGraph from "./RainLineGraph";
import TempertureGraph from "./TempertureGraph";

import { TempLoading } from "@src/Component";
import { useLongDataQuery } from "@src/Queries";

import { Button } from "react-bootstrap";
import { styled } from "styled-components";
import { format, addDays } from "date-fns";

const FutureDays = () => {
  const [tab, setTab] = useState<string>("temperture");
  const today = new Date();
  const { data, isLoading, error } = useLongDataQuery(today);

  const onClickTab = (k: string | null) => {
    if (k) setTab(k);
  };

  const TitleText = () => {
    const dateleft = format(addDays(today, 3), "yyyy/MM/dd");
    const dateright = format(addDays(today, 7), "yyyy/MM/dd");
    return dateleft + " ~ " + dateright;
  };
  return (
    <FutureDayContainer>
      <FurtureDayHeader>
        <text>{TitleText()}</text>
        <Button onClick={() => onClickTab("temperture")}>온도</Button>
        <Button onClick={() => onClickTab("rain")}>강수확률</Button>
      </FurtureDayHeader>
      {isLoading ? (
        <TempLoading />
      ) : (
        <>
          {tab === "temperture" && <TempertureGraph futureData={data} />}
          {tab === "rain" && <RainLineGraph futureData={data} />}
        </>
      )}
    </FutureDayContainer>
  );
};

export default FutureDays;

const FutureDayContainer = styled.div`
  display: flex;
  flex-direction: column;

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
    font-weight: bold;
  }
  button {
    min-width: 6rem;
    margin: 0.5rem;
  }
`;
