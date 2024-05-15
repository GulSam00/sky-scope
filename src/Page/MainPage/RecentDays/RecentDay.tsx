import { useState } from "react";
import { useDispatch } from "react-redux";

import TempertureLineGraph from "./TempertureLineGraph";
import RainLineGraph from "./RainLineGraph";

import { getDayOfWeek } from "@src/Util";
import { loadedData } from "@src/Store/shortDataSlice";
import { IDateData } from "@src/API/getWeatherShort";

import { Button } from "react-bootstrap";
import { styled } from "styled-components";

interface IProps {
  recentData: IDateData;
  keyDate: string;
  baseDate: Date;
}
const RecentDay = ({ recentData, keyDate, baseDate }: IProps) => {
  const dispatch = useDispatch();
  const [tab, setTab] = useState<string>("temperture");

  const onClickTab = (k: string | null) => {
    if (k) setTab(k);
  };

  const transDate = (date: string) => {
    const year = date.slice(0, 4);
    const month = date.slice(4, 6);
    const day = date.slice(6, 8);
    const dayOfWeek = getDayOfWeek(baseDate);
    return `${year}/${month}/${day} (${dayOfWeek})`;
  };

  const callbackLoadedData = () => {
    dispatch(loadedData());
  };

  return (
    <RecentDayContainer>
      <RecentDayHeader>
        <text>{transDate(keyDate)}</text>

        {/* 버튼으로 말고 토글로 온도/강수 확률 두개만? */}
        <Button onClick={() => onClickTab("temperture")}>온도</Button>
        <Button onClick={() => onClickTab("rain")}>강수 확률</Button>
      </RecentDayHeader>

      {/* 이 컴포넌트에서 삼항 연산자로 Loading 중일 때 렌더링을 하지 않게 되면
 TempertureLineGraph, WeatherLineGraph 컴포넌트 내부에서 dispatch로 loadedData를 실행할 수 없어 
 isLoading이 영원히 걸리게 된다.*/}
      {/* 삼항 연산자가 아닌 메인 페이지 단에서 로딩창을 덧씌어주는 것으로
 렌더링 자체는 되면서 차트가 바뀌기 전 상호작용이 불가능한 것을 막아주는 것을 구현 */}
      {tab === "temperture" && (
        <TempertureLineGraph
          recentData={recentData}
          callbackLoadedData={callbackLoadedData}
        />
      )}

      {tab === "rain" && (
        <RainLineGraph
          recentData={recentData}
          callbackLoadedData={callbackLoadedData}
        />
      )}
    </RecentDayContainer>
  );
};

export default RecentDay;

const RecentDayContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  margin: 10px;
  padding: 10px;
  border: 1px solid black;
  border-radius: 1rem;
`;

const RecentDayHeader = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem;
  text {
    margin-right: 1rem;
    font-size: 3rem;
    font-weight: bold;
  }
  button {
    min-width: 8.5rem;
    min-height: 4rem;
    margin: 1rem;

    text-align: center;
  }
`;
