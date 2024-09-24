import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useGeolocation } from '@src/Hook';
import { locationType } from '@src/Hook/useGeolocation';
import { ICoord } from '@src/API/getWeatherShort';

import { RootState } from '@src/Store/store';
import { open } from '@src/Store/kakaoModalSlice';
import { errorAccured } from '@src/Store/RequestStatusSlice';
import { setCity, setProvince, initLocation } from '@src/Store/locationDataSlice';

import { transLocaleToCoord, setLocalCoordInfo } from '@src/Util';

import { Form, Button } from 'react-bootstrap';
import styled from 'styled-components';

import _short_local from '@src/Assets/short_api_locals.json';

const short_local = _short_local as ICoordJson;

interface ICoordJson {
  [depth1: string]: {
    [depth2: string]: {
      x: number;
      y: number;
    };
  };
}

interface Props {
  handleChangeCoord: (coord: ICoord) => void;
}

const LocationHeader = ({ handleChangeCoord }: Props) => {
  const dispatch = useDispatch();
  const location: locationType = useGeolocation();
  const { province, city } = useSelector((state: RootState) => state.locationDataSliceReducer);

  const onChangeProvince = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectProvince = e.target.value;
    dispatch(setProvince(selectProvince));
    dispatch(setCity(''));
  };

  const onChangeCity = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectCity = e.target.value;
    if (selectCity === '') return;

    const { x: nx, y: ny } = short_local[province][selectCity];
    if (setLocalCoordInfo({ nx, ny, province, city: selectCity })) {
      localStorage.setItem('Geolng', '');
      localStorage.setItem('Geolat', '');
      handleChangeCoord({ nx, ny });
      dispatch(setCity(selectCity));
      localStorage.setItem('province', province);
      localStorage.setItem('city', selectCity);
    }
  };

  const currentLocation = async () => {
    if (location.loaded && location.coordinates) {
      let { lng, lat } = location.coordinates;
      const prevLng = Number(localStorage.getItem('Geolng'));
      const prevLat = Number(localStorage.getItem('Geolat'));
      lng = Number(lng.toFixed(7));
      lat = Number(lat.toFixed(7));

      if (prevLng === lng && prevLat === lat) {
        dispatch(errorAccured('이미 현재 위치 정보입니다.'));
        return;
      }
      localStorage.setItem('Geolng', lng.toString());
      localStorage.setItem('Geolat', lat.toString());

      const result = await transLocaleToCoord({ lng, lat });
      if (result) {
        const { nx, ny, province, city } = result;
        dispatch(setProvince(province));
        dispatch(setCity(city));
        handleChangeCoord({ nx, ny });
      }
    } else {
      alert('현재 위치 정보를 가져올 수 없습니다.');
      dispatch(errorAccured('현재 위치 정보를 가져올 수 없습니다.'));
    }
  };

  useEffect(() => {
    dispatch(initLocation());
  }, []);

  return (
    <LocationHeaderContainer>
      <LocationHeaderSelector>
        <Form.Select onChange={onChangeProvince} value={province}>
          <option value=''>선택</option>

          {Object.keys(short_local).map(key => {
            return (
              <option value={key} key={key}>
                {key}
              </option>
            );
          })}
        </Form.Select>
        <Form.Select onChange={onChangeCity} value={city}>
          <option value=''>선택</option>
          {province &&
            Object.keys(short_local[province]).map(key => {
              return (
                <option value={key} key={key}>
                  {key}
                </option>
              );
            })}
        </Form.Select>
        <div>의 날씨는?</div>
      </LocationHeaderSelector>
      <LocationHeaderButtons>
        <Button onClick={() => currentLocation()}>현재 위치로 설정</Button>
        <Button onClick={() => dispatch(open())}>지도에서 선택하기</Button>
      </LocationHeaderButtons>
    </LocationHeaderContainer>
  );
};

export default LocationHeader;

const LocationHeaderContainer = styled.div`
  display: flex;

  justify-content: space-between;
  flex-wrap: wrap;

  width: 100%;
  padding: 10px;
  border-bottom: 1px solid #e9ecef;
  border-radius: 1rem;
`;

const LocationHeaderSelector = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  > * {
    margin: 5px;
    min-width: 150px;
    max-width: 200px;
    min-height: 40px;
  }

  select {
    padding: 5px;
    min-width: 200px;
    font-size: 1.5rem;
  }
`;

const LocationHeaderButtons = styled.div`
  display: flex;
  flex-wrap: wrap;

  button {
    margin: 5px;
    flex-grow: 1;
  }
`;
