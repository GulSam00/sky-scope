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
      <Slider
        reverse
        vertical
        keyboard
        dots
        min={1}
        max={14}
        step={1}
        value={level}
        defaultValue={2}
        onChange={onChangeLevel}
      />
    </SliderContainer>
  );
};

export default MapLevelSlider;

const SliderContainer = styled.div`
  position: absolute;
  // 우측 중앙에 위치
  top: 50%;
  left: 100%;
  transform: translate(-50%, -50%);
  width: 100px;

  height: 50dvh;
  z-index: 1000;
  cursor: pointer;

  .rc-slider-rail {
    background-color: #abe2fb;
  }
  .rc-slider-track {
    background-color: #e9ecef;
  }
`;
