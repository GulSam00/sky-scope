import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { useLiveDataQuery } from '@src/Queries';
import { KakaoSearchType } from '@src/Queries/useLiveDataQuery';
import { loadingData, loadedData } from '@src/Store/loadingStateSlice';

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
  marker: KakaoSearchType;
  onFocusPlace: (marker: KakaoSearchType) => void;
  onClickPlace: (localeCode: string, isBookmarked: boolean) => void;
  onDeletePlace: (localeCode: string, isBookmarked: boolean) => void;
}
const PlaceWeather = ({ marker, onFocusPlace, onClickPlace, onDeletePlace }: Props) => {
  const { isLoading, data, error } = useLiveDataQuery(new Date(), marker);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    onClickPlace(marker.localeCode, marker.isBookmarked);
  };

  const handleClickDelete = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    onDeletePlace(marker.localeCode, marker.isBookmarked);
  };

  useEffect(() => {
    if (isLoading) {
      dispatch(loadingData());
    } else {
      dispatch(loadedData());
    }
    if (error) {
      alert(error);
      localStorage.removeItem('bookmarks');
      navigate('/error');
    }
  }, [isLoading]);

  return (
    <MarkerWeatherContainer>
      {data ? (
        <div onClick={() => onFocusPlace(marker)}>
          <div className='bookmark' onClick={e => handleClickBookmark(e)}>
            {marker.isBookmarked ? (
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
    </MarkerWeatherContainer>
  );
};

export default PlaceWeather;

const MarkerWeatherContainer = styled.div`
  position: relative;
  min-width: 250px;
  max-width: 250px;
  height: 120px;
  padding: 10px;
  border: 1px solid #0d6efd;
  border-radius: 5px;
  font-size: 18px;
  cursor: pointer;

  .bookmark {
    position: absolute;
    right: 40px;
    display: flex;
    align-items: start;
  }

  .delete {
    position: absolute;
    right: 10px;
    display: flex;
    align-items: start;
  }

  .location {
    font-size: 14px;
    font-weight: 400;
  }
  .place {
    font-size: 18px;
    font-weight: 600;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  font-size: 18px;
`;
