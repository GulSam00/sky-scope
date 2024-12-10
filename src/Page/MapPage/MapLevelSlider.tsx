import Slider from 'rc-slider';

import styled from 'styled-components';
import 'rc-slider/assets/index.css';

interface Props {
  level: number;
  onChangeLevel: (level: number | number[]) => void;
}

const MapLevelSlider = ({ level, onChangeLevel }: Props) => {
  return (
    <SliderContainer>
      <div className='button top' onClick={() => onChangeLevel(level - 1)}>
        +
      </div>
      <Slider reverse vertical keyboard dots min={1} max={14} step={1} value={level} onChange={onChangeLevel} />
      <div className='button bottom' onClick={() => onChangeLevel(level + 1)}>
        -
      </div>
    </SliderContainer>
  );
};

export default MapLevelSlider;

const SliderContainer = styled.div`
  position: absolute;
  // 우측 중앙에 위치
  top: 5%;
  left: 95%;
  width: 50px;

  height: 50dvh;
  z-index: 500;
  cursor: pointer;
  background-color: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  color: #abe2fb;
  gap: 16px;

  .button {
    width: 100%;
    text-align: center;
    font-size: 24px;
    font-weight: bold;
  }

  .top {
    border-bottom: 1px solid #abe2fb;
  }

  .bottom {
    border-top: 1px solid #abe2fb;
  }

  .rc-slider-rail {
    background-color: #abe2fb;
  }
  .rc-slider-track {
    background-color: #e9ecef;
  }
`;
