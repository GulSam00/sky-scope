import { styled } from 'styled-components';

import { getNaverInfo, getKakaoInfo } from '@src/API';
const naver_api_url = import.meta.env.VITE_NAVER_OAUTH_URL;
const naver_client_id = import.meta.env.VITE_NAVER_ID;
const naver_redirect_uri = import.meta.env.VITE_NAVER_REDIRECT;

const kakao_api_url = import.meta.env.VITE_KAKAO_OAUTH_URL;
const kakao_client_id = import.meta.env.VITE_KAKAO_REST_KEY;
const kakao_redirect_uri = import.meta.env.VITE_KAKAO_REDIRECT;

const LoginPage = () => {
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

  const onClickTestNaver = async () => {
    const result = await getNaverInfo();
    console.log('onClickTestNaver : ', result);
  };

  const onClickTestKakao = async () => {
    const result = await getKakaoInfo();
    console.log('onClickTestKakao : ', result);
  };

  return (
    <LoginPageContainer>
      <h1>Login Page</h1>

      <img onClick={onClickNaver} src='/login_naver/btnW_완성형.png' alt='naver_login' />

      <button onClick={onClickTestNaver}>test naver Info</button>

      <div onClick={onClickKakao}>카카오 로그인</div>
      <button onClick={onClickTestKakao}>test kakao Info</button>
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
  img {
    cursor: pointer;
    width: 200px;
  
}  
    }
`;
