import { ResponsiveLine } from "@nivo/line";
import { styled } from "styled-components";

const CusLineGraph = ({ temp }: any) => {
  console.log("temp : ", temp);
  const data = [
    {
      id: "Series 1",
      data: [
        { x: 0, y: 4 },
        { x: 1, y: 7 },
        { x: 2, y: 1 },
        { x: 3, y: 2 },
        { x: 4, y: 3 },
      ],
    },
  ];
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
        yFormat=" >-.2f"
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
      />
    </GraphContainer>
  );
};

export default CusLineGraph;

const GraphContainer = styled.div`
  width: 800px;
  height: 500px;
  margin: 0 auto;
`;
