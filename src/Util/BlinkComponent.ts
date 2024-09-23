import { gsap } from 'gsap';

interface Props {
  targetRef: React.RefObject<HTMLDivElement>;
}

const BlinkComponent = ({ targetRef }: Props) => {
  const ref = targetRef.current;

  gsap.to(ref, {
    backgroundColor: '#0d6efd',
    duration: 0.25,
    onComplete: () => {
      gsap.to(ref, { backgroundColor: '#ffffff', duration: 0.25 });
    },
  });
};

export default BlinkComponent;
