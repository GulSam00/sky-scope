import { useEffect, useState } from "react";
import { ICoord } from "@src/API/getWeatherShort";

import { useDispatch } from "react-redux";
import { open } from "@src/Store/kakaoModalSlice";

import { Form, Button } from "react-bootstrap";
import styled from "styled-components";

import _short_local from "@src/JSON/short_api_locals.json";
const short_local = _short_local as ICoordJson;

interface ICoordJson {
  [depth1: string]: {
    [depth2: string]: {
      x: number;
      y: number;
    };
  };
}

interface IProps {
  handleChangeCoord: (coord: ICoord) => void;
}

const LocationHeader = ({ handleChangeCoord }: IProps) => {
  const [province, setProvince] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const dispatch = useDispatch();

  const onChangeProvince = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setProvince(value);
    setCity("");
  };

  const onChangeCity = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    if (value === "") return;

    setCity(value);
    const { x, y } = short_local[province][value];
    localStorage.setItem("coord", JSON.stringify({ nx: x, ny: y }));
    localStorage.setItem("province", province);
    localStorage.setItem("city", value);
    handleChangeCoord({ nx: x, ny: y });
  };

  useEffect(() => {
    setProvince(localStorage.getItem("province") as string);
    setCity(localStorage.getItem("city") as string);
  }, []);

  return (
    <LocationHeaderContainer>
      <LocationHeaderSelector>
        <Form.Select onChange={onChangeProvince} value={province}>
          <option value="">선택</option>

          {Object.keys(short_local).map((key) => {
            return <option value={key}>{key}</option>;
          })}
        </Form.Select>
        <Form.Select onChange={onChangeCity} value={city}>
          <option value="">선택</option>
          {province &&
            Object.keys(short_local[province]).map((key) => {
              return <option value={key}>{key}</option>;
            })}
        </Form.Select>
        <text>의 날씨는?</text>
      </LocationHeaderSelector>

      <Button onClick={() => dispatch(open())}>지도에서 선택하기</Button>
    </LocationHeaderContainer>
  );
};

export default LocationHeader;

const LocationHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #e9ecef;
  border-radius: 1rem;
`;

const LocationHeaderSelector = styled.div`
  display: flex;
  align-items: center;

  * {
    margin: 5px;
    min-width: 100px;
    max-width: 200px;
  }
`;
