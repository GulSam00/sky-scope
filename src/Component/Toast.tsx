import { useEffect, useRef, memo } from 'react';
import { useDispatch } from 'react-redux';

import { handledError } from '@src/Store/RequestStatusSlice';
import { styled } from 'styled-components';
import { gsap } from 'gsap';

interface Props {
  content: string;
}

const Toast = ({ content }: Props) => {
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
        { y: 0, opacity: 0 }, // 시작 위치 및 숨김 상태
        {
          y: -200,
          opacity: 1, // 보이기
          duration: 1, // 슬라이드 업 지속 시간
          ease: 'power3.out',
        },
      )
      .to(ref, {
        opacity: 0, // 페이드 아웃
        duration: 1, // 페이드 아웃 지속 시간
        ease: 'power3.inOut',
        delay: 2, // 페이드 아웃 전 대기 시간
        onComplete: () => {
          dispatch(handledError());
          animation.kill(); // 애니메이션 정리
        },
      });

    return () => {
      animation.kill(); // 컴포넌트 언마운트 시 애니메이션 정리
    };
  }, [content]);

  return (
    <ToastContainer ref={toastRef}>
      <div>{content}</div>
    </ToastContainer>
  );
};

export default memo(Toast);

const ToastContainer = styled.div`
  position: fixed;
  width: 100dvw;

  left: 0;
  bottom: 0;

  z-index: 10000;

  div {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;

    width: 18rem;
    height: 8rem;
    border-radius: 2rem;
    margin: 0 auto;
    padding: 1rem;

    background-color: white;
    border: 1px solid #dfe2e5;
    shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
`;
