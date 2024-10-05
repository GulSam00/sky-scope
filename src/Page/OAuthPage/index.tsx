import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { getNaverToken, getKakaoToken } from '@src/API';

const OAuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const code = new URLSearchParams(location.search).get('code');
  // naver인지, kakao인지 구분해야함
  const pathSegments = location.pathname.split('/'); // 경로를 '/'로 나눠 배열로 저장
  console.log('code : ', code);
  console.log('pathSegments : ', pathSegments);

  const getToken = async () => {
    const type = pathSegments.pop();
    switch (type) {
      case 'naver': {
        const result = await getNaverToken('authorization_code', `code=${code}&state=1234`);
        if (!result) return;
        const { access_token, refresh_token } = result;
        localStorage.setItem('accessToken', access_token);
        localStorage.setItem('refreshToken', refresh_token);
        localStorage.setItem('oauthType', 'naver');
        // navigate('/');
        break;
      }
      case 'kakao': {
        const result = await getKakaoToken('authorization_code', `code=${code}`);
        if (!result) return;
        const { access_token, refresh_token } = result;
        localStorage.setItem('accessToken', access_token);
        localStorage.setItem('refreshToken', refresh_token);
        localStorage.setItem('oauthType', 'kakao');
        // navigate('/');
        break;
      }
      default:
        console.log('error!');
    }
  };

  useEffect(() => {
    getToken();
  }, []);
  return (
    <div>
      <h1>OAuth Page</h1>
    </div>
  );
};

export default OAuthPage;
