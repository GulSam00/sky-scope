import { useState, useEffect } from "react";
import { IDateData } from "@src/API/getWeatherShort";
import TempertureLineGraph from "./TempertureLineGraph";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import { styled } from "styled-components";

interface IProps {
  recentData: IDateData;
}

const RecentDay = ({ recentData }: IProps) => {
  const [key, setKey] = useState<string>("temperture");

  const onClickTab = (k: string | null) => {
    console.log(k);
    if (k) setKey(k);
  };

  return (
    <RecentDayContainer>
      <Tabs defaultActiveKey="temperture" activeKey={key} onSelect={onClickTab}>
        <Tab eventKey="temperture" title="temperture">
          <TempertureLineGraph recentData={recentData} />
        </Tab>
        <Tab eventKey="rain" title="rain">
          <div>rain</div>
        </Tab>
      </Tabs>
    </RecentDayContainer>
  );
};

export default RecentDay;

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
