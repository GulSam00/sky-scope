import { useState, useRef, memo, useEffect } from 'react';

import { blinkComponent } from '@src/Util';
import { KakaoSearchType } from '@src/Types/liveDataType';
import DynamicPlaces from './DynamicPlaces';
import styled from 'styled-components';

import { gsap } from 'gsap';

interface Props {
  currentPlaces: KakaoSearchType[];
  bookmarkPlaces: KakaoSearchType[];
  isBlinkPlace: boolean[];
  onBlinkPlace: () => void;
  onFocusPlace: (place: KakaoSearchType) => void;
  onTogglePlace: (placeId: string, isBookmarked: boolean) => void;
  onDeletePlace: (placeId: string, isBookmarked: boolean) => void;
}

const FooterPlaces = ({
  currentPlaces,
  bookmarkPlaces,
  isBlinkPlace,
  onBlinkPlace,
  onFocusPlace,
  onTogglePlace,
  onDeletePlace,
}: Props) => {
  const [footerState, setFooterState] = useState<number>(0);
  const prevCurrentPlaces = useRef<number>(0);
  const prevBookmarkPlaces = useRef<number>(0);
  const bookmarkRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef<HTMLDivElement>(null);

  const onClickFooter = (state: number) => {
    if (footerState === state) {
      setFooterState(0);
    } else {
      setFooterState(state);
      if (!bookmarkRef.current || !currentRef.current) return;
      state === 1 ? blinkComponent({ targetRef: bookmarkRef }) : blinkComponent({ targetRef: currentRef });
    }
  };

  useEffect(() => {
    if (prevBookmarkPlaces.current > bookmarkPlaces.length) {
      prevBookmarkPlaces.current = bookmarkPlaces.length;
      return;
    }
    prevBookmarkPlaces.current = bookmarkPlaces.length;
    if (!bookmarkPlaces.length) return;
    if (footerState) setFooterState(1);
    blinkComponent({ targetRef: bookmarkRef });
  }, [bookmarkPlaces]);

  useEffect(() => {
    if (prevCurrentPlaces.current > currentPlaces.length) {
      prevCurrentPlaces.current = currentPlaces.length;
      return;
    }
    prevCurrentPlaces.current = currentPlaces.length;
    if (!currentPlaces.length) return;
    // if (footerState) setFooterState(2);
    setFooterState(2);
    blinkComponent({ targetRef: currentRef });
  }, [currentPlaces]);

  useEffect(() => {
    switch (footerState) {
      case 0:
        gsap.to(currentRef.current, { width: '50%', duration: 0.5 });
        gsap.to(bookmarkRef.current, { width: '50%', duration: 0.5 });
        break;
      case 1:
        gsap.to(bookmarkRef.current, { width: '75%', duration: 0.5 });
        gsap.to(currentRef.current, { width: '25%', duration: 0.5 });
        break;
      case 2:
        gsap.to(currentRef.current, { width: '75%', duration: 0.5 });
        gsap.to(bookmarkRef.current, { width: '25%', duration: 0.5 });
        break;
    }
  }, [footerState]);

  return (
    <FooterPlacesContainer>
      <FooterLists>
        <div ref={bookmarkRef} onClick={() => onClickFooter(1)}>
          <img src='/icons/star-fill.svg' alt='북마크' width={36} />
        </div>
        <div ref={currentRef} onClick={() => onClickFooter(2)}>
          <img src='/icons/search.svg' alt='검색' width={36} />
        </div>
      </FooterLists>

      {footerState !== 0 && (
        <DynamicPlaces
          type={footerState === 1 ? 'bookmark' : 'current'}
          places={footerState === 1 ? bookmarkPlaces : currentPlaces}
          isBlinkPlace={isBlinkPlace[footerState - 1]}
          onBlinkPlace={onBlinkPlace}
          onFocusPlace={onFocusPlace}
          onTogglePlace={onTogglePlace}
          onDeletePlace={onDeletePlace}
        />
      )}
    </FooterPlacesContainer>
  );
};

export default memo(FooterPlaces);

const FooterPlacesContainer = styled.div`
  display: flex;
  flex-direction: column;

  background-color: white;
`;

const FooterLists = styled.div`
  display: flex;
  width: 100%;
  height: 10vh;
  height: 10dvh;
  align-items: center;

  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    cursor: pointer;
    border: 1px solid #dfe2e5;
  }
`;
