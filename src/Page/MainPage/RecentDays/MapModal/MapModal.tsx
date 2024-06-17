import KaKaoMap from './KaKaoMap';

import { ICoord } from '@src/API/getWeatherShort';

import styled from 'styled-components';

interface IProps {
  handleChangeCoord: (coord: ICoord) => void;
}

const MapModal = ({ handleChangeCoord }: IProps) => {
  return (
    <MapModalContainer>
      <MapModalBody>
        <KaKaoMap handleChangeCoord={handleChangeCoord} />
      </MapModalBody>
    </MapModalContainer>
  );
};

export default MapModal;

const MapModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1000;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const MapModalBody = styled.div`
  display: flex;
  flex-direction: column;

  width: 95%;
  height: 95%;
  background-color: white;
  overflow: auto;
`;
