import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Lottie from 'react-lottie';

import { RootState } from '@src/Store/store';
import { errorAccured } from '@src/Store/requestStatusSlice';

import scopeAnimation from '@src/Assets/lottie/scope.json';
import nightAnimation from '@src/Assets/lottie/night_sky.json';
import { styled } from 'styled-components';

const naver_api_url = import.meta.env.VITE_NAVER_OAUTH_URL;
const naver_client_id = import.meta.env.VITE_NAVER_ID;
const naver_redirect_uri = import.meta.env.VITE_NAVER_REDIRECT;

const kakao_api_url = import.meta.env.VITE_KAKAO_OAUTH_URL;
const kakao_client_id = import.meta.env.VITE_KAKAO_REST_KEY;
const kakao_redirect_uri = import.meta.env.VITE_KAKAO_REDIRECT;

const LoginPage = () => {
  const { isLogin } = useSelector((state: RootState) => state.globalDataSliceReducer);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const scopeOptions = {
    loop: false,
    animationData: scopeAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const nightOptions = {
    animationData: nightAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const onClickNaver = () => {
    const url =
      naver_api_url +
      `/authorize?response_type=code&client_id=${naver_client_id}&redirect_uri=${naver_redirect_uri}&state=1234`;
    window.location.href = url;
  };

  const onClickKakao = () => {
    const url =
      kakao_api_url + `/authorize?response_type=code&client_id=${kakao_client_id}&redirect_uri=${kakao_redirect_uri}`;
    window.location.href = url;
  };

  useEffect(() => {
    if (isLogin) {
      navigate('/');
      dispatch(errorAccured('이미 로그인 되어있습니다.'));
    }
  }, [isLogin]);

  return (
    <LoginPageContainer>
      <LoginPageContent>
        <div className='header'>찾아낸 지역들을 저장하세요</div>

        <Lottie options={scopeOptions} height={200} width={200} />

        <div className='buttons'>
          <img onClick={onClickNaver} src='/login_img/naver_login.png' alt='naver_login' />
          <img onClick={onClickKakao} src='/login_img/kakao_login.png' alt='kakao_login' />
        </div>
      </LoginPageContent>

      <BackGroundAnimation>
        <Lottie options={nightOptions} />
      </BackGroundAnimation>
    </LoginPageContainer>
  );
};

export default LoginPage;

const LoginPageContainer = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100vh;
  background-color: #f7f7f7;
`;

const LoginPageContent = styled.div`
  .header {
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
  }

  .buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;

    img {
      cursor: pointer;
      width: 200px;
    }
  }

  z-index: 100;
`;

const BackGroundAnimation = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
`;
