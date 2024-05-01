import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { ICoord } from "@src/API/getWeatherShort";
import { useGeolocation, locationType } from "@src/Hook/useGeolocation";
import { open } from "@src/Store/kakaoModalSlice";
import { transCoord, setLocalCoordInfo } from "@src/Util";

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
  const location: locationType = useGeolocation();

  const onChangeProvince = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectProvince = e.target.value;
    setProvince(selectProvince);
    setCity("");
  };

  const onChangeCity = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectCity = e.target.value;

    if (selectCity === "") return;

    setCity(selectCity);
    const { x: nx, y: ny } = short_local[province][selectCity];
    if (setLocalCoordInfo({ nx, ny, province, city: selectCity })) {
      localStorage.setItem("Geolng", "");
      localStorage.setItem("Geolat", "");
      handleChangeCoord({ nx, ny });
    }
  };

  const currentLocation = async () => {
    if (location.loaded && location.coordinates) {
      let { lng, lat } = location.coordinates;
      const prevLng = Number(localStorage.getItem("Geolng"));
      const prevLat = Number(localStorage.getItem("Geolat"));
      lng = Number(lng.toFixed(7));
      lat = Number(lat.toFixed(7));

      if (prevLng === lng && prevLat === lat) {
        alert("이미 현재 위치 정보입니다.");
        return;
      }
      localStorage.setItem("Geolng", lng.toString());
      localStorage.setItem("Geolat", lat.toString());

      const result = await transCoord({ lng, lat });
      console.log("RESULT", result);
      if (result) {
        const { nx, ny, province, city } = result;
        setProvince(province);
        setCity(city);
        handleChangeCoord({ nx, ny });
      }
    } else {
      alert("현재 위치 정보를 가져올 수 없습니다.");
    }
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

      <Button onClick={() => currentLocation()}>현재 위치로 설정</Button>
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

  select {
    padding: 5px;
    min-width: 300px;
    min-height: 40px;
    font-size: 1.5rem;
  }
`;
