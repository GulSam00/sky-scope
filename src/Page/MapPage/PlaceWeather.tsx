import { useEffect, useRef, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { gsap } from 'gsap';

import { useLiveDataQuery } from '@src/Queries';
import { KakaoSearchType } from '@src/Queries/useLiveDataQuery';
import { loadingData, loadedData, errorAccured } from '@src/Store/RequestStatusSlice';

import { Spinner } from 'react-bootstrap';
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
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const firstPlaceRef = useRef<HTMLDivElement>(null);

  const BlinkPlace = () => {
    const ref = firstPlaceRef.current;

    gsap.to(ref, {
      backgroundColor: '#0d6efd',
      duration: 0.25,
      onComplete: () => {
        gsap.to(ref, { backgroundColor: '#ffffff', duration: 0.25 });
      },
    });
    onBlinkPlace();
    ref?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
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
    <PlaceWeatherContainer ref={firstPlaceRef}>
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
        <SpinnerContainer>
          <Spinner animation='border' role='status'>
            <span className='visually-hidden'>Loading</span>
          </Spinner>
        </SpinnerContainer>
      )}
    </PlaceWeatherContainer>
  );
};

export default memo(PlaceWeather);

const PlaceWeatherContainer = styled.div`
  position: relative;

  @media (min-width: 640px) {
    min-width: 49%;
    max-width: 49%;
  }

  min-width: 99%;
  max-width: 99%;
  margin: 0.5%;

  min-height: 9rem;
  padding: 10px;
  border: 1px solid;
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

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  min-height: 9rem;
  max-height: 9rem;
  min-width: 99%;
  max-width: 99%;
`;
