import { useState, useEffect } from 'react';
import Joyride, { ACTIONS, EVENTS, CallBackProps } from 'react-joyride';

const Tutorial = () => {
  const [run, setRun] = useState(false);

  const steps = [
    {
      target: '.step1',
      content: '날씨를 알고 싶은 장소를 입력해보세요.',
      disableBeacon: true,
    },
    {
      target: '.step2',
      content: '검색한 지역은 이곳에서 확인할 수 있습니다.',
    },
    {
      target: '.step3',
      content: '검색할 지역을 북마크해서 저장해보세요.',
    },
    {
      target: '.step4',
      content: '현재 위치를 확인할 수도 있습니다.',
    },
    {
      target: '.step5',
      content: '조회한 모든 장소를 한 눈에 볼 수도 있어요.',
    },

    {
      target: '.step6',
      content: '로그인해서 저장한 지역을 어디서든 확인해보세요.',
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, index, lifecycle, type } = data;

    if (type === EVENTS.TOUR_END) {
      localStorage.setItem('visitSkyscope', 'true');
      setRun(false);
    }
  };

  useEffect(() => {
    const isVisited = localStorage.getItem('visitSkyscope');
    if (!isVisited) setRun(true);
  }, []);

  return (
    <Joyride
      steps={steps}
      run={run}
      callback={handleJoyrideCallback}
      disableCloseOnEsc
      disableOverlayClose
      disableScrolling
      spotlightPadding={10}
      continuous
      showSkipButton
      showProgress
      styles={{
        options: {
          zIndex: 10000,
        },
      }}
    />
  );
};

export default Tutorial;
