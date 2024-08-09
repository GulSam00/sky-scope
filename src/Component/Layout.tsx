import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { RootState } from '@src/Store/store';
import { LoadingState } from '@src/Component';

import { Github, Phone, PhoneFill } from 'react-bootstrap-icons';
import Nav from 'react-bootstrap/Nav';
import { styled } from 'styled-components';

const Layout = () => {
  const [isPhone, setIsPhone] = useState(false);

  const { isLoading } = useSelector((state: RootState) => state.loadingStateSliceReducer);
  const location = useLocation();

  const switchPhone = () => {
    if (!isPhone) {
      setIsPhone(true);
    } else {
      setIsPhone(false);
    }
  };

  return (
    <GlobalLayoutContainer isPhone={isPhone}>
      {isLoading && <LoadingState />}

      <NavContainer isPhone={isPhone}>
        <Nav variant='tabs'>
          <Nav.Item>
            <Nav.Link href='/' disabled={location.pathname === '/'}>
              실시간 날씨
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href='/chart' disabled={location.pathname === '/chart'}>
              예보 차트
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <IconContainer>
              <Github onClick={() => window.open('https://github.com/GulSam00/sky-scope')} />
            </IconContainer>
          </Nav.Item>
          <Nav.Item>
            <IconContainer>
              {!isPhone ? <Phone onClick={switchPhone} /> : <PhoneFill onClick={switchPhone} />}
            </IconContainer>
          </Nav.Item>
        </Nav>
      </NavContainer>

      <ContentContainer>
        <Outlet />
      </ContentContainer>
    </GlobalLayoutContainer>
  );
};

export default Layout;

interface Props {
  isPhone: boolean;
}

const GlobalLayoutContainer = styled.div<Props>`
  margin-left: auto;
  margin-right: auto;

  @media (min-width: 640px) {
    width: ${props => (props.isPhone ? '375px' : '100%')};
  }
  height: 100dvh;

  position: relative;
  margin-top: 4rem;
`;
const NavContainer = styled.div<Props>`
  position: fixed;
  z-index: 1000;
  top: 0;
  // 임의로 400px, 375px면 화면 넘어감(wrap)
  width: ${props => (props.isPhone ? '400px' : '100%')};
  margin: 0 auto;

  background-color: white;

  nav {
    display: flex;
    flex-wrap: nowrap;
  }
`;

const ContentContainer = styled.div``;

const IconContainer = styled.div`
  display: flex;
  align-items: center;

  padding: 0 10px;
  height: 100%;
  cursor: pointer;
`;
