import { Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { RootState } from '@src/Store/store';
import { LoadingState } from '@src/Component';

import { Github } from 'react-bootstrap-icons';
import Nav from 'react-bootstrap/Nav';
import { styled } from 'styled-components';

const Layout = () => {
  const { isLoading } = useSelector((state: RootState) => state.loadingStateSliceReducer);

  const location = useLocation();

  return (
    <LayoutContainer>
      {isLoading && <LoadingState />}

      <NavContainer>
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
            <GithubContainer>
              <Github onClick={() => window.open('https://github.com/GulSam00/sky-scope')} />
            </GithubContainer>
          </Nav.Item>
        </Nav>
      </NavContainer>

      <ContentContainer>
        <Outlet />
      </ContentContainer>
    </LayoutContainer>
  );
};

export default Layout;

const LayoutContainer = styled.div`
  position: relative;
  width: 100%;
  margin-top: 64px;
`;
const NavContainer = styled.div`
  position: fixed;
  margin-left: 40px;
  z-index: 1000;
  width: 100%;
  top: 0;
  background-color: white;
`;

const ContentContainer = styled.div``;

const GithubContainer = styled.div`
  display: flex;
  align-items: center;

  padding: 0 10px;
  height: 100%;
  cursor: pointer;
`;
