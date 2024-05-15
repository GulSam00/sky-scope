import { useState, useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";

import { IDateData } from "@src/API/getWeatherShort";

import { styled } from "styled-components";

interface IProps {
  recentData: IDateData;
  callbackLoadedData: () => void;
}

interface tempertureDataTypes {
  x: string;
  y: number;
}
// 탭을 만들어서 전환??

const TempertureLineGraph = ({ recentData, callbackLoadedData }: IProps) => {
  const [tempertureData, setTempertureData] = useState<tempertureDataTypes[]>(
    []
  );

  const data = [
    {
      id: "온도",
      data: tempertureData,
    },
  ];

  const theme = {
    axis: {
      legend: {
        text: {
          fontSize: 20,
        },
      },
      ticks: {
        text: {
          fontSize: 18,
        },
      },
    },
  };

  const initTempertureData = () => {
    console.log("initTempertureData");
    const temp: tempertureDataTypes[] = [];
    for (let i = 0; i <= 2400; i += 100) {
      const time = String(i).padStart(4, "0");
      const value = recentData[time]?.TMP;
      const hour = time.slice(0, 2);

      if (value) {
        temp.push({ x: hour, y: Number(value) });
      }
    }
    setTempertureData(temp);
    callbackLoadedData();
  };

  useEffect(() => {
    initTempertureData();
  }, [recentData]);

  return (
    <GraphContainer>
      <ResponsiveLine
        data={data}
        theme={theme}
        margin={{ top: 50, right: 110, bottom: 60, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: true,
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
          legend: "시간(시)",
          legendOffset: 46,
          legendPosition: "middle",
          truncateTickAt: 0,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "온도(°C)",
          legendOffset: -50,
          legendPosition: "middle",
          truncateTickAt: 0,
        }}
        isInteractive={true}
        useMesh={true}
        enableSlices="x"
      />
    </GraphContainer>
  );
};

export default TempertureLineGraph;

const GraphContainer = styled.div`
  height: 600px;
  min-width: 1000px;
`;
