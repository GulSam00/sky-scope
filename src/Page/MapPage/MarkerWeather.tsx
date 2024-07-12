import { useLiveDataQuery } from '@src/Queries';
import { MarkerType } from '@src/Queries/useLiveDataQuery';

import { LoadingState } from '@src/Component';
import { styled } from 'styled-components';

import {
  Star,
  StarFill,
  ThermometerHigh,
  BrightnessHigh,
  CloudRain,
  CloudRainFill,
  CloudSleet,
  CloudSleetFill,
  CloudSnow,
  CloudSnowFill,
} from 'react-bootstrap-icons';

interface Props {
  marker: MarkerType;
  onClickBookmark: (code: string, isBookmarked: boolean) => void;
}
const MarkerWeather = ({ marker, onClickBookmark }: Props) => {
  const result = useLiveDataQuery(new Date(), marker);

  const transformSkyCode = (skyCode: string) => {
    switch (Number(skyCode)) {
      case 1:
        return <CloudRainFill />;
      case 2:
        return <CloudSleetFill />;
      case 3:
        return <CloudSnowFill />;
      case 5:
        return <CloudRain />;
      case 6:
        return <CloudSleet />;
      case 7:
        return <CloudSnow />;
      default:
        return <BrightnessHigh />;
    }
  };

  const handleClickBookmark = () => {
    onClickBookmark(marker.code, marker.isBookmarked);
  };

  return (
    <MarkerWeatherContainer>
      {!result.isLoading && result.data ? (
        <div>
          <div className='bookmark' onClick={handleClickBookmark}>
            {marker.isBookmarked ? <StarFill /> : <Star />}
          </div>
          <div className='location'>
            {result.data.province} {result.data.city}
          </div>
          <div className='place'>{result.data.content}</div>
          <div className='content'>
            <div>
              <ThermometerHigh />
              <div>{result.data.T1H}°C</div>
            </div>
          </div>

          <div className='content'>
            <div>
              <div>{transformSkyCode(result.data.SKY1)}</div>
              <div>{result.data.RN1}mm</div>
            </div>
          </div>
        </div>
      ) : (
        <LoadingState />
      )}
    </MarkerWeatherContainer>
  );
};

export default MarkerWeather;

const MarkerWeatherContainer = styled.div`
  position: relative;
  min-width: 200px;
  height: 120px;
  padding: 10px;
  border: 1px solid #0d6efd;
  border-radius: 5px;
  font-size: 18px;
  white-space: nowrap;

  .bookmark {
    position: absolute;
    right: 10px;
    display: flex;
    align-items: start;
    cursor: pointer;
  }

  .location {
    font-size: 14px;
    font-weight: 400;
  }
  .place {
    font-size: 18px;
    font-weight: 600;
  }

  .content {
    display: flex;
    flex-direction: column;

    > div {
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
  }
`;
