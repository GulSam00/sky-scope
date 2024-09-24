import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { removeToast } from '@src/Store/toastWeatherSlice';
import { styled } from 'styled-components';
import { gsap } from 'gsap';

interface Props {
  content: string;
  index: number; // Toast가 몇 번째로 추가된 것인지 구분
}

const Toast = ({ content, index }: Props) => {
  const dispatch = useDispatch();
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!toastRef.current) return;

    const ref = toastRef.current;

    // gsap.timeline을 사용하여 애니메이션을 순차적으로 처리
    const animation = gsap.timeline();

    animation
      .fromTo(
        ref,
        { y: 50 + index * 100, opacity: 0 }, // Toast의 y 위치를 index에 따라 다르게 적용
        {
          y: 0,
          opacity: 1, // 보이기
          duration: 0.5, // 슬라이드 업 지속 시간
          ease: 'power3.out',
        },
      )
      .to(ref, {
        opacity: 0, // 페이드 아웃
        duration: 0.5, // 페이드 아웃 지속 시간
        ease: 'power3.inOut',
        delay: 1, // 페이드 아웃 전 대기 시간
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
      <div>{content}</div>
    </ToastContainer>
  );
};

export default Toast;

const ToastContainer = styled.div`
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;

    width: 140px;
    height: 100px;
    border-radius: 2rem;
    margin: 0 0.5rem;

    background-color: white;
    border: 1px solid #dfe2e5;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  }
`;
