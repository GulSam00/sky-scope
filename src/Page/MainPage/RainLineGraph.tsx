import { useState, useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";
import { styled } from "styled-components";
import { IDateData } from "@src/API/getWeatherShort";

interface IProps {
  recentData: IDateData;
}

interface rainDataTypes {
  x: string;
  y: number;
}

const RainLineGraph = ({ recentData }: IProps) => {
  const [rainProb, setRainProb] = useState<rainDataTypes[]>([]);
  const [rainAmount, setRainAmount] = useState<rainDataTypes[]>([]);
  const data = [
    {
      id: "강수확률(%)",
      data: rainProb,
    },
    { id: "강수량(mm)", data: rainAmount },
  ];

  const initRainProb = () => {
    const temp: rainDataTypes[] = [];

    for (let i = 0; i <= 2400; i += 100) {
      const time = String(i).padStart(4, "0");
      const value = recentData[time]?.POP;
      const hour = time.slice(0, 2);
      const min = time.slice(2, 4);

      if (value) {
        temp.push({ x: hour + ":" + min, y: Number(value) });
      }
    }
    setRainProb(temp);
  };

  const initRainAmount = () => {
    const temp: rainDataTypes[] = [];

    for (let i = 0; i <= 2400; i += 100) {
      const time = String(i).padStart(4, "0");
      let value = recentData[time]?.PCP;
      const hour = time.slice(0, 2);
      const min = time.slice(2, 4);

      if (value) {
        if (value === "강수없음") value = "0";
        else value = value.slice(0, value.indexOf("m"));
        temp.push({ x: hour + ":" + min, y: Number(value) });
      }
    }
    setRainAmount(temp);
  };
  useEffect(() => {
    initRainProb();
    initRainAmount();
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
        isInteractive={true}
        useMesh={true}
        enableSlices="x"
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            justify: true,
            translateX: 90,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: "left-to-right",
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
          },
        ]}
      />
    </GraphContainer>
  );
};

export default RainLineGraph;

const GraphContainer = styled.div`
  min-width: 1000px;
  height: 500px;
  margin: 0 auto;
`;
