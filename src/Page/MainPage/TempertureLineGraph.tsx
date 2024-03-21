import { useState, useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";
import { styled } from "styled-components";
import { IDateData } from "@src/API/getWeatherShort";

interface IProps {
  recentData: IDateData;
}

interface tempertureDataTypes {
  x: string;
  y: number;
}
// 탭을 만들어서 전환??

const CusLineGraph = ({ recentData }: IProps) => {
  const [tempertureData, setTempertureData] = useState<tempertureDataTypes[]>(
    []
  );

  const data = [
    {
      id: "temperture",
      data: tempertureData,
    },
  ];

  useEffect(() => {
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
        // legends={[
        //   {
        //     anchor: "bottom-right",
        //     direction: "column",
        //     justify: false,
        //     translateX: 100,
        //     translateY: 0,
        //     itemsSpacing: 0,
        //     itemDirection: "left-to-right",
        //     itemWidth: 80,
        //     itemHeight: 20,
        //     itemOpacity: 0.75,
        //     symbolSize: 12,
        //     symbolShape: "circle",
        //     symbolBorderColor: "rgba(0, 0, 0, .5)",
        //   },
        // ]}
      />
    </GraphContainer>
  );
};

export default CusLineGraph;

const GraphContainer = styled.div`
  min-width: 1000px;
  height: 500px;
  margin: 0 auto;
`;
