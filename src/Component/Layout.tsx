import { Outlet } from 'react-router-dom';

import Nav from 'react-bootstrap/Nav';
import { styled } from 'styled-components';

const Layout = () => {
  return (
    <LayoutContainer>
      <NavContainer>
        <Nav variant='tabs'>
          <Nav.Item>
            <Nav.Link href='/'>temp</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href='/short'>단기 예보</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href='/live'>실시간 날씨</Nav.Link>
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
  z-index: 1000;
  width: 100%;
  top: 0;
  background-color: white;
`;

const ContentContainer = styled.div``;
