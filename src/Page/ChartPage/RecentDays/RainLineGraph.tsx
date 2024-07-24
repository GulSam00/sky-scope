import { useState, useEffect } from 'react';
import { ResponsiveLine } from '@nivo/line';

import { styled } from 'styled-components';
import { IDateData } from '@src/API/getWeatherShort';

interface IProps {
  recentData: IDateData;
  callbackLoadedData: () => void;
}

interface rainDataTypes {
  x: string;
  y: number;
}

const RainLineGraph = ({ recentData, callbackLoadedData }: IProps) => {
  const [rainProb, setRainProb] = useState<rainDataTypes[]>([]);
  const [rainAmount, setRainAmount] = useState<rainDataTypes[]>([]);
  const data = [
    {
      id: '강수확률(%)',
      data: rainProb,
    },
    { id: '강수량(mm)', data: rainAmount },
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
    legends: {
      text: {
        fontSize: 20,
      },
    },
  };

  const initRainProb = () => {
    const temp: rainDataTypes[] = [];

    for (let i = 0; i <= 2400; i += 100) {
      const time = String(i).padStart(4, '0');
      const value = recentData[time]?.POP;
      const hour = time.slice(0, 2);

      if (value) {
        temp.push({ x: hour, y: Number(value) });
      }
    }
    setRainProb(temp);
  };

  const initRainAmount = () => {
    const temp: rainDataTypes[] = [];

    for (let i = 0; i <= 2400; i += 100) {
      const time = String(i).padStart(4, '0');
      let value = recentData[time]?.PCP;
      const hour = time.slice(0, 2);

      if (value) {
        if (value === '강수없음') value = '0';
        else value = value.slice(0, value.indexOf('m'));
        temp.push({ x: hour, y: Number(value) });
      }
    }
    setRainAmount(temp);
  };

  useEffect(() => {
    initRainProb();
    initRainAmount();
    callbackLoadedData();
  }, [recentData]);

  return (
    <GraphContainer>
      <ResponsiveLine
        data={data}
        theme={theme}
        margin={{ top: 50, right: 180, bottom: 60, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{
          type: 'linear',
          min: 0,
          max: 100,
          reverse: false,
        }}
        yFormat='>-.2f'
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: '시간(시)',
          legendOffset: 46,
          legendPosition: 'middle',
          truncateTickAt: 0,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: '강수확률(%)',
          legendOffset: -50,
          legendPosition: 'middle',
          truncateTickAt: 0,
        }}
        isInteractive={true}
        useMesh={true}
        enableSlices='x'
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'column',
            justify: true,
            translateX: 160,
            translateY: 0,
            itemsSpacing: 10,
            itemWidth: 130,
            itemHeight: 40,
            itemOpacity: 0.9,
            symbolSize: 16,
            symbolShape: 'circle',
            symbolBorderColor: 'rgba(0, 0, 0, .5)',
          },
        ]}
        enableArea={true}
      />
    </GraphContainer>
  );
};

export default RainLineGraph;

const GraphContainer = styled.div`
  height: 600px;
  min-width: 1000px;
`;
