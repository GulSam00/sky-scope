import { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { LoadingState, Toast } from '@src/Component';
import { Github, Phone, PhoneFill } from 'react-bootstrap-icons';

import { getNaverInfo, getKakaoInfo } from '@src/API';
import { RootState } from '@src/Store/store';
import { setResize } from '@src/Store/kakaoModalSlice';
import { onLogin, onLogout } from '@src/Store/globalDataSlice';
import { phoneModeSwitch } from '@src/Store/globalDataSlice';

import { styled } from 'styled-components';
import { gsap } from 'gsap';

const Layout = () => {
  const [isUserModal, setIsUserModal] = useState(false);

  const { isLoading, errorMessage } = useSelector((state: RootState) => state.requestStatusSliceReducer);
  const { isPhone, isLogin, nickname } = useSelector((state: RootState) => state.globalDataSliceReducer);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const modalRef = useRef<HTMLDivElement>(null);

  const switchPhone = () => {
    if (!isPhone) {
      dispatch(phoneModeSwitch());
    } else {
      dispatch(phoneModeSwitch());
    }
    dispatch(setResize());
  };

  const handleToggleUserModal = () => {
    if (isUserModal) {
      gsap.to(modalRef.current, { opacity: 0, x: 100, duration: 0.5, onComplete: () => setIsUserModal(false) });
    } else {
      setIsUserModal(true);
    }
  };

  const handleUserInOut = () => {
    if (isLogin) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('oauthType');
      dispatch(onLogout());
      // 새로 고침, refresh
      location.reload();
    } else {
      navigate('/login');
    }
  };

  const handleGetInfo = async (type: string) => {
    switch (type) {
      case 'naver': {
        const info = await getNaverInfo();
        if (info) {
          const { id, nickname } = info;
          dispatch(onLogin({ id, nickname, type: 'naver' }));
        }
        break;
      }
      case 'kakao': {
        const info = await getKakaoInfo();
        if (info) {
          const { id, nickname } = info;
          dispatch(onLogin({ id, nickname, type: 'kakao' }));
        }
        break;
      }
    }
  };

  useEffect(() => {
    const oauthType = localStorage.getItem('oauthType');
    if (oauthType) {
      handleGetInfo(oauthType);
    }
  }, []);

  useEffect(() => {
    gsap.fromTo(modalRef.current, { opacity: 0, x: 100 }, { opacity: 1, x: -50, duration: 0.5 });
  }, [modalRef, isUserModal]);

  return (
    <GlobalLayoutContainer phone={isPhone.toString()}>
      {isLoading && <LoadingState />}
      {errorMessage && <Toast content={errorMessage} />}

      <NavContainer phone={isPhone.toString()}>
        <Title onClick={() => navigate('/')}>
          <img src='/scope.png' alt='logo' />
          <div>Skyscope</div>
        </Title>

        <IconContainer>
          <div>
            <Github onClick={() => window.open('https://github.com/GulSam00/sky-scope')} />
          </div>
          <div>{!isPhone ? <Phone onClick={switchPhone} /> : <PhoneFill onClick={switchPhone} />}</div>
          <div onClick={handleToggleUserModal}>
            <img src='/icons/user.svg' alt='' width={24} />
            {isUserModal && (
              <div className='info' ref={modalRef}>
                <div>
                  안녕하세요, <br /> {isLogin ? nickname : 'Guest'}님!
                </div>
                <div className='button' onClick={handleUserInOut}>
                  {isLogin ? '로그아웃' : '로그인'}
                </div>
              </div>
            )}
          </div>
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
  padding: 0 1rem;
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
  gap: 1rem;
  > div {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    height: 100%;
    cursor: pointer;
  }

  .info {
    position: absolute;
    top: 60px;

    width: 150px;
    height: 100px;
    background-color: white;
    border: 1px solid #dfe2e5;
    border-radius: 5px;

    text-align: center;
    font-size: 1rem;

    display: flex;
    flex-direction: column;
    justify-content: center;

    .button {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f7f7f7;
      height: 4rem;
      cursor: pointer;
    }
  }
`;
