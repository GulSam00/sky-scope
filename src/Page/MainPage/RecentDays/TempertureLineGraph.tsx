import { useState, useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";
import { styled } from "styled-components";
import { IDateData } from "@src/API/getWeatherShort";

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
      id: "temperture",
      data: tempertureData,
    },
  ];

  const initTempertureData = () => {
    const temp: tempertureDataTypes[] = [];
    for (let i = 0; i <= 2400; i += 100) {
      const time = String(i).padStart(4, "0");
      const value = recentData[time]?.TMP;
      const hour = time.slice(0, 2);
      const min = time.slice(2, 4);

      if (value) {
        temp.push({ x: hour + ":" + min, y: Number(value) });
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
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
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
  min-width: 1000px;
  height: 600px;
`;
