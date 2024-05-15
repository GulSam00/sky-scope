import { useState, useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";

import { styled } from "styled-components";
import { IDateData } from "@src/API/getWeatherLong";

interface IProps {
  futureData: IDateData[];
}

interface tempertureDataTypes {
  x: string;
  y: number;
}

const TempertureLineGraph = ({ futureData }: IProps) => {
  const [minTempertureData, setMinTempertureData] = useState<
    tempertureDataTypes[]
  >([]);
  const [maxTempertureData, setMaxTempertureData] = useState<
    tempertureDataTypes[]
  >([]);

  const data = [
    {
      id: "최저 온도",
      data: minTempertureData,
    },
    { id: "최고 온도", data: maxTempertureData },
  ];

  const initRainProb = () => {
    const minArr: tempertureDataTypes[] = [];
    const maxArr: tempertureDataTypes[] = [];

    for (let i = 0; i < futureData.length; i++) {
      const date = futureData[i].date.slice(4);
      minArr.push({ x: date, y: Number(futureData[i]?.taMin) });
      maxArr.push({ x: date, y: Number(futureData[i]?.taMax) });
    }
    setMinTempertureData(minArr);
    setMaxTempertureData(maxArr);
  };

  useEffect(() => {
    initRainProb();
  }, []);

  return (
    <GraphContainer>
      <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          reverse: false,
        }}
        yFormat=">-.2f"
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "시간",
          legendOffset: 36,
          legendPosition: "middle",
          truncateTickAt: 0,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "온도(°C)",
          legendOffset: -40,
          legendPosition: "middle",
          truncateTickAt: 0,
        }}
      />
    </GraphContainer>
  );
};

export default TempertureLineGraph;

const GraphContainer = styled.div`
  height: 500px;
`;
