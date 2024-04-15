import { useState } from "react";
import { ICoord } from "@src/API/getWeatherShort";

import { Form } from "react-bootstrap";

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
  toggleModal: () => void;
}

const LocationHeader = ({ toggleModal, handleChangeCoord }: IProps) => {
  const [province, setProvince] = useState<string>("");
  const [city, setCity] = useState<string>("");

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
    handleChangeCoord({ nx: x, ny: y });
  };

  return (
    <LocationHeaderContainer>
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
      <button onClick={toggleModal}>모달 클릭</button>
    </LocationHeaderContainer>
  );
};

export default LocationHeader;

const LocationHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #e9ecef;
`;
