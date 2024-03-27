import { useState } from "react";

import { IDateData } from "@src/API/getWeatherLong";

import { Button } from "react-bootstrap";
import { styled } from "styled-components";

interface IProps {
  furtureData: IDateData;
  keyDate: string;
}

const FurtureDay = ({ furtureData, keyDate }: IProps) => {
  const [tab, setTab] = useState<string>("temperture");

  const onClickTab = (k: string | null) => {
    if (k) setTab(k);
  };

  console.log(furtureData, keyDate);
  return (
    <FurtureDayContainer>
      <FurtureDayHeader>
        <Button onClick={() => onClickTab("temperture")}>온도</Button>
        <Button onClick={() => onClickTab("weather")}>날씨</Button>
      </FurtureDayHeader>
    </FurtureDayContainer>
  );
};

export default FurtureDay;

const FurtureDayContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;

  margin: 10px;
  padding: 10px;
  min-width: 200px;
`;

const FurtureDayHeader = styled.div``;

const FurtureDayContent = styled.div``;
