import { useRef, useEffect } from 'react';
import { styled } from 'styled-components';
import { gsap } from 'gsap';

const SideModal = ({ children }: { children: React.ReactNode }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(modalRef.current, { opacity: 0, x: 100 }, { opacity: 1, x: 0, duration: 0.5 });
  }, []);

  return <SideModalContainer ref={modalRef}>{children}</SideModalContainer>;
};

export default SideModal;

const SideModalContainer = styled.div`
  position: absolute;
  top: 60px;

  width: 100px;
  height: 100px;
  background-color: white;
  border: 1px solid #dfe2e5;
  border-radius: 5px;
`;
