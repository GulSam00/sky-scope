import { useState, useRef, memo } from 'react';

import { BlinkComponent } from '@src/Util';
import { KakaoSearchType } from '@src/Queries/useLiveDataQuery';
import DynamicPlaces from './DynamicPlaces';
import styled from 'styled-components';

interface IProps {
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
}: IProps) => {
  const [footerState, setFooterState] = useState<number>(0);
  const bookmarkRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef<HTMLDivElement>(null);

  const onClickFooter = (state: number) => {
    if (footerState === state) setFooterState(0);
    else {
      setFooterState(state);
      if (!bookmarkRef.current || !currentRef.current) return;
      state === 1 ? BlinkComponent({ targetRef: bookmarkRef }) : BlinkComponent({ targetRef: currentRef });
    }
  };

  return (
    <FooterPlacesContainer>
      <FooterButtons>
        <div ref={bookmarkRef} onClick={() => onClickFooter(1)}>
          <img src='/icons/star-fill.svg' alt='북마크' width={24} />
          북마크
        </div>
        <div ref={currentRef} onClick={() => onClickFooter(2)}>
          <img src='/icons/search.svg' alt='검색' width={24} />
          조회
        </div>
      </FooterButtons>

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

const FooterButtons = styled.div`
  display: flex;
  width: 100%;
  height: 3rem;
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
