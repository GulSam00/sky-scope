import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from '@src/Store/store';
import { setResize } from '@src/Store/kakaoModalSlice';
import { phoneModeSwitch } from '@src/Store/globalDataSlice';

import { LoadingState, Toast } from '@src/Component';
import { Github, Phone, PhoneFill } from 'react-bootstrap-icons';

import { Nav } from 'react-bootstrap';

import { styled } from 'styled-components';
import { useEffect } from 'react';

const Layout = () => {
  const { isLoading, errorMessage } = useSelector((state: RootState) => state.requestStatusSliceReducer);
  const { isPhone } = useSelector((state: RootState) => state.globalDataSliceReducer);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const switchPhone = () => {
    if (!isPhone) {
      dispatch(phoneModeSwitch());
    } else {
      dispatch(phoneModeSwitch());
    }
    dispatch(setResize());
  };

  return (
    <GlobalLayoutContainer phone={isPhone.toString()}>
      {isLoading && <LoadingState />}
      {errorMessage && <Toast content={errorMessage} />}

      <NavContainer phone={isPhone.toString()}>
        {/* <Nav>
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
        </Nav> */}
        <Title onClick={() => navigate('/')}>
          <img src='/scope.png' alt='logo' />
          <div>Skyscope</div>
        </Title>

        <IconContainer>
          <div>
            <Github onClick={() => window.open('https://github.com/GulSam00/sky-scope')} />
          </div>
          <div>{!isPhone ? <Phone onClick={switchPhone} /> : <PhoneFill onClick={switchPhone} />}</div>
        </IconContainer>
      </NavContainer>

      <ContentContainer>
        <Outlet />
      </ContentContainer>
    </GlobalLayoutContainer>
  );
};

export default Layout;

interface Props {
  phone: string;
}

const GlobalLayoutContainer = styled.div<Props>`
  margin-left: auto;
  margin-right: auto;

  @media (min-width: 640px) {
    width: ${props => (props.phone === 'true' ? '400px' : '100%')};
  }
  height: 100dvh;

  position: relative;
  overflow: hidden;
`;

const NavContainer = styled.div<Props>`
  display: flex;
  justify-content: space-between;

  position: sticky;
  z-index: 1000;
  top: 0;

  // 임의로 400px, 375px면 화면 넘어감(wrap)
  @media (min-width: 640px) {
    width: ${props => (props.phone === 'true' ? '400px' : '100%')};
  }
  width: 100%;
  height: 3rem;

  margin: 0 auto;
  border-bottom: 1px solid #dfe2e5;
  background-color: white;
`;

const ContentContainer = styled.div`
  width: 100%;
`;

const Title = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;

  img {
    width: 2rem;
    height: 2rem;
  }
`;

const IconContainer = styled.div`
  display: flex;

  div {
    display: flex;
    align-items: center;

    padding: 0 10px;
    height: 100%;
    cursor: pointer;
  }
`;
