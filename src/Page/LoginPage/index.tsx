import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from '@src/Store/store';
import { errorAccured } from '@src/Store/requestStatusSlice';

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

  const onClickNaver = () => {
    const url =
      naver_api_url +
      `/authorize?response_type=code&client_id=${naver_client_id}&redirect_uri=${naver_redirect_uri}&state=1234`;
    console.log(url);
    window.location.href = url;
  };

  const onClickKakao = () => {
    const url =
      kakao_api_url + `/authorize?response_type=code&client_id=${kakao_client_id}&redirect_uri=${kakao_redirect_uri}`;
    console.log(url);
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
      <h1>소셜 로그인</h1>
      <div>
        <img onClick={onClickNaver} src='/login_img/naver_login.png' alt='naver_login' />
        <img onClick={onClickKakao} src='/login_img/kakao_login.png' alt='kakao_login' />
      </div>
    </LoginPageContainer>
  );
};

export default LoginPage;

const LoginPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f7f7f7;

  h1 {
    font-size: 2rem;
    margin: 1rem;
  }
  div {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    img {
      cursor: pointer;
      width: 200px;
    }
  }
`;
