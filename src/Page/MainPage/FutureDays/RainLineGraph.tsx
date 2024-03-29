import { useState, useEffect } from "react";

import { IDateData } from "@src/API/getWeatherLong";

import { styled } from "styled-components";
import { ResponsiveLine } from "@nivo/line";

interface IProps {
  futureData: IDateData[];
}

interface rainDataTypes {
  x: string;
  y: number;
}

const RainLineGraph = ({ futureData }: IProps) => {
  const [rainProb, setRainProb] = useState<rainDataTypes[]>([]);
  const data = [
    {
      id: "강수 확률(%)",
      data: rainProb,
    },
  ];

  const initRainProb = () => {
    const tempArr: rainDataTypes[] = [];

    for (let i = 0; i < futureData.length; i++) {
      const date = futureData[i].date.slice(4);
      tempArr.push({ x: date + " AM", y: Number(futureData[i]?.rainAm) });
      tempArr.push({ x: date + " PM", y: Number(futureData[i]?.rainPm) });
    }

    setRainProb(tempArr);
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
          min: 0,
          max: 100,
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
          legend: "강수확률(%)",
          legendOffset: -40,
          legendPosition: "middle",
          truncateTickAt: 0,
        }}
        enableArea={true}
      />
    </GraphContainer>
  );
};

export default RainLineGraph;

const GraphContainer = styled.div`
  min-width: 1000px;
  height: 500px;
`;
