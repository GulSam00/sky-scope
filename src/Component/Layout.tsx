import { Outlet } from 'react-router-dom';

import Nav from 'react-bootstrap/Nav';
import { styled } from 'styled-components';

const Layout = () => {
  return (
    <NavContainer>
      <Nav variant='tabs'>
        <Nav.Item>
          <Nav.Link href='/'>temp</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href='/chart'>차트</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href='/map'>지도</Nav.Link>
        </Nav.Item>
      </Nav>
      <ContentContainer>
        <Outlet />
      </ContentContainer>
    </NavContainer>
  );
};

export default Layout;

const NavContainer = styled.div`
  position: relative;
  top: 0;
  z-index: 1000;
  width: 100%;
`;

const ContentContainer = styled.div``;
