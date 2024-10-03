import { styled } from 'styled-components';

import { getNaverInfo } from '@src/API';
const api_url = import.meta.env.VITE_NAVER_TOKEN_URL;
const client_id = import.meta.env.VITE_NAVER_ID;
const redirect_uri = import.meta.env.VITE_NAVER_REDIRECT;

const LoginPage = () => {
  const onClickNaver = async () => {
    const url =
      api_url + `/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&state=1234`;
    console.log(url);
    window.location.href = url;
  };

  const onClickTestNaver = async () => {
    const result = await getNaverInfo();
    console.log('onClickTestNaver : ', result);
  };

  return (
    <LoginPageContainer>
      <h1>Login Page</h1>

      <img onClick={onClickNaver} src='/login_naver/btnW_완성형.png' alt='naver_login' />

      <button onClick={onClickTestNaver}>test naver Info</button>
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
