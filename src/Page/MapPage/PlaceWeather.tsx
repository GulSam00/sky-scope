import { useEffect, useRef, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { LoadingSpinner } from '@src/Component';
import { useLiveDataQuery } from '@src/Queries';
import { KakaoSearchType } from '@src/Types/liveDataType';
import { RootState } from '@src/Store/store';
import { loadingData, loadedData, errorAccured } from '@src/Store/requestStatusSlice';
import { blinkComponent } from '@src/Util';

import { styled } from 'styled-components';

import {
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
  place: KakaoSearchType;
  onFocusPlace: (place: KakaoSearchType) => void;
  onTogglePlace: (placeId: string, isBookmarked: boolean) => void;
  onDeletePlace: (placeId: string, isBookmarked: boolean) => void;
  isFirstPlace: boolean;
  isBlinkPlace: boolean;
  onBlinkPlace: () => void;
  isIgnored: boolean;
  setIsIgnored: (value: boolean) => void; // 삭제 이벤트 플래그 설정 함수
}

const PlaceWeather = ({
  place,
  onFocusPlace,
  onTogglePlace,
  onDeletePlace,
  isFirstPlace,
  isBlinkPlace,
  onBlinkPlace,
  isIgnored,
  setIsIgnored,
}: Props) => {
  const { isLoading, data, error } = useLiveDataQuery(new Date(), place);

  const { isPhone } = useSelector((state: RootState) => state.globalDataSliceReducer);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const firstPlaceRef = useRef<HTMLDivElement>(null);

  const BlinkPlace = () => {
    if (!firstPlaceRef) return;
    blinkComponent({ targetRef: firstPlaceRef });

    onBlinkPlace();
  };

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

  const handleClickBookmark = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    onTogglePlace(place.placeId, place.isBookmarked);
    setIsIgnored(true);
  };

  const handleClickPlace = (place: KakaoSearchType) => {
    BlinkPlace();
    onFocusPlace(place);
  };

  const handleClickDelete = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    onDeletePlace(place.placeId, place.isBookmarked);
    setIsIgnored(true);
  };

  useEffect(() => {
    if (isLoading) {
      dispatch(loadingData());
    } else {
      dispatch(loadedData());
      if (isFirstPlace && !isIgnored) {
        BlinkPlace();
      }
    }
    if (error) {
      dispatch(errorAccured(error.message));
      localStorage.removeItem('bookmarks');
      navigate('/error');
    }
  }, [isLoading, isFirstPlace, isBlinkPlace]);

  return (
    <PlaceWeatherContainer ref={firstPlaceRef} phone={isPhone.toString()}>
      {data ? (
        <div onClick={() => handleClickPlace(place)}>
          <div className='bookmark' onClick={e => handleClickBookmark(e)}>
            {place.isBookmarked ? (
              <img src='/icons/star-fill.svg' alt='star' width={24} />
            ) : (
              <img src='/icons/star.svg' alt='star' width={24} />
            )}
          </div>
          <div className='delete' onClick={e => handleClickDelete(e)}>
            <img src='/icons/x-lg.svg' alt='delete' width={24} />
          </div>

          <div className='location'>
            {data.province} {data.city}
          </div>
          <div className='place'>{data.content}</div>

          <div className='content'>
            <div>
              <ThermometerHigh />
              <div>{data.T1H}°C</div>
            </div>
          </div>

          <div className='content'>
            <div>
              <img width='16' src='icons/humidity.svg' alt='humidity' />
              <div>{data.REH}%</div>
            </div>
          </div>

          <div className='content'>
            <div>
              <div>{transformSkyCode(data.PTY)}</div>
              <div>{data.RN1}mm</div>
            </div>
          </div>
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </PlaceWeatherContainer>
  );
};

export default memo(PlaceWeather);

interface StyleProps {
  phone: string;
}

const PlaceWeatherContainer = styled.div<StyleProps>`
  position: relative;

  @media (min-width: 640px) {
    width: ${props => (props.phone === 'true' ? '99%' : '32%')};
  }
  width: 99%;
  margin: 0.5%;
  min-height: 9rem;
  padding: 10px;
  border: 1px solid #dfe2e5;
  border-radius: 5px;
  cursor: pointer;
  scroll-snap-align: center;

  font-size: 1rem;
  font-weight: 400;

  .bookmark {
    position: absolute;
    bottom: 10px;
    right: 40px;
    display: flex;
    align-items: start;
  }

  .delete {
    position: absolute;
    bottom: 10px;
    right: 10px;
    display: flex;
    align-items: start;
  }

  .location {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .place {
    font-size: 1.2rem;
    font-weight: 600;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .content {
    display: flex;

    font-weight: 600;

    > div {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 0.5rem;
    }
  }
`;
