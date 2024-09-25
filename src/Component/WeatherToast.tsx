import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { KakaoSearchType } from '@src/Types/liveDataType';
import { useLiveDataQuery } from '@src/Queries';
import { removeToast } from '@src/Store/toastWeatherSlice';
import { LoadingSpinner } from '@src/Component';

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

import { styled } from 'styled-components';
import { gsap } from 'gsap';

interface Props {
  content: KakaoSearchType;
  index: number; // Toast가 몇 번째로 추가된 것인지 구분
}

const WeatherToast = ({ content, index }: Props) => {
  const dispatch = useDispatch();
  const toastRef = useRef<HTMLDivElement>(null);

  const { isLoading, data, error } = useLiveDataQuery(new Date(), content);

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

  useEffect(() => {
    if (!toastRef.current) return;

    const ref = toastRef.current;

    // gsap.timeline을 사용하여 애니메이션을 순차적으로 처리
    const animation = gsap.timeline();

    animation
      .fromTo(
        ref,
        { y: 50 + index * 90, opacity: 0 }, // Toast의 y 위치를 index에 따라 다르게 적용
        {
          y: 0,
          opacity: 1, // 보이기
          duration: 0.25, // 슬라이드 업 지속 시간
          ease: 'power3.out',
        },
      )
      .to(ref, {
        opacity: 0, // 페이드 아웃
        duration: 0.25, // 페이드 아웃 지속 시간
        ease: 'power3.inOut',
        delay: 3, // 페이드 아웃 전 대기 시간
        onComplete: () => {
          dispatch(removeToast());
          animation.kill(); // 애니메이션 정리
        },
      });

    return () => {
      animation.kill(); // 컴포넌트 언마운트 시 애니메이션 정리
    };
  }, [content, index]);

  return (
    <ToastContainer ref={toastRef}>
      {data ? (
        <ToastContent>
          <div className='content'>{data.content}</div>
          <div className='content'>
            <ThermometerHigh />
            <div>{data.T1H}°C</div>
          </div>

          <div className='content'>
            <img width='12' src='icons/humidity.svg' alt='humidity' />
            <div>{data.REH}%</div>
          </div>

          <div className='content'>
            <div>{transformSkyCode(data.PTY)}</div>
            <div>{data.RN1}mm</div>
          </div>
        </ToastContent>
      ) : (
        <ToastContent>
          <LoadingSpinner />
        </ToastContent>
      )}
    </ToastContainer>
  );
};

export default WeatherToast;

const ToastContainer = styled.div`
  > div {
    display: flex;

    justify-content: center;
    align-items: center;

    width: 110px;
    height: 90px;
    border-radius: 2rem;
    margin: 0 0.5rem;

    background-color: white;
    border: 1px solid #dfe2e5;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  }
`;

const ToastContent = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;

  font-size: 0.75rem;
  .content {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    width: 80px;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
