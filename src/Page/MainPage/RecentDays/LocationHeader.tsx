import { ICoord } from "@src/API/getWeatherShort";

import { Dropdown, DropdownButton } from "react-bootstrap";

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

const TempItem = ["1", "2", "3"];

const LocationHeader = ({ toggleModal, handleChangeCoord }: IProps) => {
  return (
    <LocationHeaderContainer>
      <DropdownButton title={TempItem[0]}>
        {TempItem.map((item, index) => {
          return <Dropdown.Item key={index}>{item}</Dropdown.Item>;
        })}
      </DropdownButton>
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
