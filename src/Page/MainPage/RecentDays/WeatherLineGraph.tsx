import { useState, useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";
import { styled } from "styled-components";
import { IDateData } from "@src/API/getWeatherShort";

interface IProps {
  recentData: IDateData;
}

interface rainDataTypes {
  x: string;
  y: string;
}

const WeatherLineGraph = ({ recentData }: IProps) => {
  const [weatherData, setWeatherData] = useState<rainDataTypes[]>([]);
  const data = [
    {
      id: "날씨",
      data: weatherData,
    },
  ];

  const transValue = (value: string) => {
    if (value === "1") return "맑음";
    if (value === "3") return "구름많음";
    if (value === "4") return "흐림";
    return "알 수 없음";
  };
  const initWeatherData = () => {
    // 맑음, 구름많음, 흐림 3가지 문자열
    const temp: rainDataTypes[] = [];
    for (let i = 0; i <= 2400; i += 100) {
      const time = String(i).padStart(4, "0");
      const value = recentData[time]?.SKY;
      const hour = time.slice(0, 2);
      const min = time.slice(2, 4);

      if (value) {
        temp.push({ x: hour + ":" + min, y: transValue(value) });
      }
    }
    setWeatherData(temp);
  };

  useEffect(() => {
    initWeatherData();
  }, []);

  return (
    <GraphContainer>
      <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "point",
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
          legend: "날씨",
          legendOffset: -40,
          legendPosition: "middle",
          truncateTickAt: 0,
        }}
      />
    </GraphContainer>
  );
};

export default WeatherLineGraph;

const GraphContainer = styled.div`
  min-width: 1000px;
  height: 500px;
`;
